import type {
	DocumentNode,
	FieldNode,
	FragmentDefinitionNode,
	OperationDefinitionNode,
	SelectionSetNode,
	ValueNode
} from 'graphql';
import { schema } from '../rumbleClient/schema';

/**
 * Shapes every answer the local demo conference hands to graphcache so that it's always
 * *complete* for the operation's own selection set — derived from the GraphQL schema, not
 * from hand-written canned data.
 *
 * Two failure modes this guards against, both of which used to break demo pages outright:
 * - A query with no canned answer at all (any newly added feature's query, e.g. `requests`
 *   or mission control's stats) — previously answered with an offline error, which SSR turns
 *   into an HTTP 500 and the browser into a permanently empty page. It now gets an
 *   empty-but-valid answer instead (lists -> [], nullable fields -> null, ...).
 * - A canned answer that's missing a field the page's selection asks for (e.g. a page starts
 *   selecting `Committee.votingSessions`, which the hardcoded seed object never had).
 *   Schema-aware graphcache treats a missing non-null field as a cache miss and nulls out
 *   the whole parent — so one forgotten field in the seed blanks the entire page. Missing
 *   fields are now filled in the same way.
 */

type IntrospectionTypeRef = { kind: string; name?: string; ofType?: IntrospectionTypeRef | null };
type IntrospectionField = { name: string; type: IntrospectionTypeRef };

/** Looks up the full seed entity for `typename:id`, if there is one — used to fill in a
 * field a nested (partial) copy of that entity lacks from the entity's own data rather than
 * a synthetic zero value. Otherwise e.g. `Committee.conference` (a stub without `title`)
 * would write `title: ''` over the real conference's title in the normalized cache. */
export type LocalDemoEntityLookup = (
	typename: string,
	id: string
) => Record<string, unknown> | undefined;

const fieldsByType = new Map<string, Map<string, IntrospectionField>>();
const enumValuesByType = new Map<string, string[]>();
for (const type of schema.__schema.types) {
	if (type.kind === 'OBJECT' && 'fields' in type && type.fields) {
		fieldsByType.set(
			type.name,
			new Map((type.fields as unknown as IntrospectionField[]).map((field) => [field.name, field]))
		);
	} else if (type.kind === 'ENUM' && 'enumValues' in type && type.enumValues) {
		enumValuesByType.set(
			type.name,
			type.enumValues.map((value) => value.name)
		);
	}
}

const QUERY_TYPE_NAME = schema.__schema.queryType.name;

/** Every root Query field name in the schema — exported for the regression test. */
export const LOCAL_DEMO_QUERY_FIELD_NAMES = [...(fieldsByType.get(QUERY_TYPE_NAME)?.keys() ?? [])];

export function getLocalDemoField(typename: string, fieldName: string) {
	return fieldsByType.get(typename)?.get(fieldName);
}

/** Zero value for a non-null scalar/enum — a nullable one just gets `null` instead. */
function zeroScalar(typeName: string | undefined): unknown {
	switch (typeName) {
		case 'Int':
		case 'Float':
		case 'BigInt':
			return 0;
		case 'Boolean':
			return false;
		case 'DateTime':
		case 'Date':
			return new Date(0);
		case 'JSON':
			return {};
		default:
			return enumValuesByType.get(typeName ?? '')?.[0] ?? '';
	}
}

type WalkContext = {
	variables: Record<string, unknown>;
	fragments: Map<string, FragmentDefinitionNode>;
	lookup?: LocalDemoEntityLookup;
};

function resolveArgumentValue(node: ValueNode, ctx: WalkContext): unknown {
	if (node.kind === 'Variable') return ctx.variables[node.name.value];
	if (node.kind === 'StringValue' || node.kind === 'EnumValue') return node.value;
	if (node.kind === 'IntValue' || node.kind === 'FloatValue') return Number(node.value);
	return undefined;
}

/** Flattens fragments so every directly-selected field of `typename` is listed once per
 * response key (there are no interfaces/unions in this schema, so a type condition either
 * matches the concrete type or doesn't). */
function collectFields(
	selectionSet: SelectionSetNode,
	typename: string,
	ctx: WalkContext,
	into: FieldNode[] = []
): FieldNode[] {
	for (const selection of selectionSet.selections) {
		if (selection.kind === 'Field') {
			into.push(selection);
		} else if (selection.kind === 'InlineFragment') {
			const condition = selection.typeCondition?.name.value;
			if (!condition || condition === typename)
				collectFields(selection.selectionSet, typename, ctx, into);
		} else {
			const fragment = ctx.fragments.get(selection.name.value);
			if (fragment && fragment.typeCondition.name.value === typename)
				collectFields(fragment.selectionSet, typename, ctx, into);
		}
	}
	return into;
}

/** The field's own `id` argument (e.g. `agendaItem(id: ...)`), if it has one */
function idArgumentOf(field: FieldNode, ctx: WalkContext): unknown {
	const idArgument = field.arguments?.find((arg) => arg.name.value === 'id');
	return idArgument ? resolveArgumentValue(idArgument.value, ctx) : undefined;
}

/** A value for a non-null field nobody gave us data for */
function completeMissing(type: IntrospectionTypeRef, field: FieldNode, ctx: WalkContext) {
	if (type.kind === 'LIST') return [];
	if (type.kind !== 'OBJECT') return zeroScalar(type.name);
	// The smallest object that still satisfies the selection. Its id comes from the field's
	// own `id` argument when there is one, so it at least normalizes to the entity asked for.
	const id = idArgumentOf(field, ctx);
	return completeObject(type.name!, field.selectionSet, id !== undefined ? { id } : {}, ctx);
}

function completeValue(
	typeRef: IntrospectionTypeRef,
	field: FieldNode,
	value: unknown,
	ctx: WalkContext
): unknown {
	const nonNull = typeRef.kind === 'NON_NULL';
	const type = nonNull ? typeRef.ofType! : typeRef;

	if (value === undefined || value === null)
		return nonNull ? completeMissing(type, field, ctx) : null;
	if (type.kind === 'LIST') {
		return Array.isArray(value)
			? value.map((item) => completeValue(type.ofType!, field, item, ctx))
			: [];
	}
	if (type.kind === 'OBJECT' && field.selectionSet && typeof value === 'object') {
		return completeObject(type.name!, field.selectionSet, value as Record<string, unknown>, ctx);
	}
	return value;
}

type FieldSource = {
	typename: string;
	source: Record<string, unknown>;
	/** The full seed entity behind `source`, see LocalDemoEntityLookup */
	backing: Record<string, unknown> | undefined;
};

function completeField(
	field: FieldNode,
	{ typename, source, backing }: FieldSource,
	ctx: WalkContext
) {
	const name = field.name.value;
	const key = field.alias?.value ?? name;
	if (name === '__typename') return typename;
	const own = key in source ? source[key] : source[name];
	const raw = own === undefined ? backing?.[name] : own;
	const definition = getLocalDemoField(typename, name);
	if (!definition) return raw ?? null;
	const value = raw === undefined && name === 'id' ? `local-demo-${typename.toLowerCase()}` : raw;
	return completeValue(definition.type, field, value, ctx);
}

function completeObject(
	typename: string,
	selectionSet: SelectionSetNode | undefined,
	source: Record<string, unknown>,
	ctx: WalkContext
): Record<string, unknown> {
	if (!selectionSet) return {};
	const backing =
		typeof source.id === 'string' && typename !== QUERY_TYPE_NAME
			? ctx.lookup?.(typename, source.id)
			: undefined;
	const fields = collectFields(selectionSet, typename, ctx);
	return Object.fromEntries(
		fields.map((field) => [
			field.alias?.value ?? field.name.value,
			completeField(field, { typename, source, backing }, ctx)
		])
	);
}

/**
 * Completes `data` (a canned answer, possibly partial or empty) against the query operation
 * in `document`, returning a fresh object holding exactly what the selection asks for, every
 * field present. The canned objects themselves are never mutated.
 */
export function completeLocalDemoQueryAnswer(
	document: DocumentNode,
	variables: unknown,
	data: Record<string, unknown>,
	lookup?: LocalDemoEntityLookup
): Record<string, unknown> {
	const fragments = new Map<string, FragmentDefinitionNode>();
	let operation: OperationDefinitionNode | undefined;
	for (const definition of document.definitions) {
		if (definition.kind === 'FragmentDefinition') fragments.set(definition.name.value, definition);
		else if (definition.kind === 'OperationDefinition' && !operation) operation = definition;
	}
	if (!operation) return data;

	return completeObject(QUERY_TYPE_NAME, operation.selectionSet, data, {
		variables: (variables ?? {}) as Record<string, unknown>,
		fragments,
		lookup
	});
}
