import { CombinedError, type Operation } from '@urql/core';
import { schema } from '../rumbleClient/schema';
import { ensureId } from '../optimisticUpdateHandlers';

/** The name of an operation's first root field, e.g. `createCommittee` */
export function getRootFieldName(operation: Operation): string | undefined {
	const firstSelections = operation.query.definitions.flatMap((def) =>
		def.kind === 'OperationDefinition' ? def.selectionSet.selections.slice(0, 1) : []
	);
	const field = firstSelections.find((selection) => selection.kind === 'Field');
	return field?.kind === 'Field' ? field.name.value : undefined;
}

export function makeSuccessResult(operation: Operation, data: unknown) {
	return { operation, data, error: undefined, extensions: undefined, stale: false, hasNext: false };
}

export function makeOfflineErrorResult(operation: Operation) {
	return {
		operation,
		data: undefined,
		error: new CombinedError({
			networkError: new Error('network error: local demo conference has no backend')
		}),
		extensions: undefined,
		stale: false,
		hasNext: false
	};
}

/**
 * A handful of mutations return something shaped nothing like their own args — most notably
 * bulk-by-id mutations, e.g. `setPresenceForCommitteeMembers(ids, present) -> [Committeemember]`.
 * Echoing the raw `{ ids, present }` args back as that field's "result" would hand graphcache a
 * shape it fundamentally can't reinterpret as a list, no matter what `__typename` is attached —
 * this is the one case needing bespoke reshaping. Everything else just needs a `__typename`
 * attached (see MUTATION_RETURN_TYPENAMES below) to be a valid single-entity echo.
 */
const LOCAL_DEMO_MUTATION_RESULT_SHAPES: Record<
	string,
	(variables: Record<string, unknown>) => unknown
> = {
	setPresenceForCommitteeMembers: (variables) =>
		(variables.ids as string[]).map((id) => ({
			__typename: 'Committeemember',
			id,
			present: variables.present
		})),
	// `currentMemberIndex` isn't one of this mutation's own args — every new session starts
	// at 0, matching what its `optimistic` handler already assumes.
	startRollCallSession: (variables) => ({
		__typename: 'Rollcallsession',
		id: variables.id,
		currentMemberIndex: 0
	}),
	// The echo would write the target position onto the speaker before the commit re-runs
	// the optimistic handler, which then sees "already there" and skips shifting the others
	moveSpeakerToPosition: (variables) => ({ __typename: 'Speakeronlist', id: variables.id })
};

type TypeRef = { kind: string; name?: string; ofType?: unknown };

function unwrapNamedTypeName(typeRef: TypeRef): string | undefined {
	let t: TypeRef | undefined = typeRef;
	while (t?.kind === 'NON_NULL' || t?.kind === 'LIST') t = t.ofType as TypeRef | undefined;
	return t?.name;
}

/**
 * Maps every Mutation field to its GraphQL return type's name — used to attach a `__typename` to
 * the echoed-args fallback below. Object-kind types only; a mutation returning a scalar (Boolean,
 * ID, ...) has nothing to normalize as an entity, so it's left out and falls back to a bare echo.
 */
const MUTATION_RETURN_TYPENAMES: Record<string, string> = (() => {
	const types = schema.__schema.types;
	const objectTypeNames = new Set(types.filter((t) => t.kind === 'OBJECT').map((t) => t.name));
	const mutationName = schema.__schema.mutationType?.name;
	const mutationType = types.find((t) => t.kind === 'OBJECT' && t.name === mutationName);
	const fields = mutationType && 'fields' in mutationType ? mutationType.fields : [];
	return Object.fromEntries(
		fields.flatMap((field) => {
			const typeName = unwrapNamedTypeName(field.type as TypeRef);
			return typeName !== undefined && objectTypeNames.has(typeName)
				? [[field.name, typeName] as const]
				: [];
		})
	);
})();

/**
 * The mutation's own args as its result, with a `__typename` so graphcache can normalize it.
 * Many "create" mutations don't pass a client-supplied id (the real server issues one).
 * `ensureId` is memoized by the variables' value, so whichever call site — this echo, the
 * optimistic handler, or `withLocalDemoMutationCommits`'s manual commit — runs first settles
 * the id, and the rest agree with it instead of each minting their own.
 */
function echoedArgs({
	fieldName,
	variables
}: {
	fieldName: string;
	variables: Record<string, unknown>;
}) {
	const typename = MUTATION_RETURN_TYPENAMES[fieldName];
	if (!typename) return variables;
	return { __typename: typename, ...variables, id: variables.id ?? ensureId(variables) };
}

/**
 * Mutations under the local conference have no real backend to confirm anything with, so an
 * error here isn't a transient failure a user should be warned about — it's just the vehicle
 * component code awaits (often via `toast.promise`, which shows a scary "failed" toast on any
 * rejection). Resolve successfully instead, echoing the mutation's own args back as its "result"
 * — most mutations in this app already pass a client-supplied id (offline-first design), so this
 * is a reasonable stand-in for "yes, that happened" without needing to know the real return
 * type's other fields.
 */
export function makeLocalDemoMutationResult(operation: Operation) {
	const fieldName = getRootFieldName(operation);
	if (!fieldName) return makeSuccessResult(operation, {});
	const variables = (operation.variables ?? {}) as Record<string, unknown>;
	const result =
		LOCAL_DEMO_MUTATION_RESULT_SHAPES[fieldName]?.(variables) ??
		echoedArgs({ fieldName, variables });
	return makeSuccessResult(operation, { [fieldName]: result });
}
