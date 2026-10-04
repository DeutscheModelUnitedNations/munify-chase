import { parse, type DocumentNode } from 'graphql';
import { describe, expect, it, vi } from 'vitest';
import { schema } from '../rumbleClient/schema';
import { getLocalDemoField, LOCAL_DEMO_QUERY_FIELD_NAMES } from './completeAnswer';

// Fails when any query under the offline demo conference could hit the "no backend" error
// (an HTTP 500 during SSR) or hand graphcache an answer missing a selected field (which
// blanks the page). Every root Query field is queried with a deep selection, and the answer
// must satisfy the schema's nullability for every selected field.

vi.mock('$app/state', () => ({
	page: { url: new URL('http://localhost/app/localconference/mission-control') }
}));

const { resolveLocalDemoQuery } = await import('./seedConference');

type TypeRef = { kind: string; name?: string; ofType?: TypeRef | null };

const objectTypes = new Set(
	schema.__schema.types.filter((t) => t.kind === 'OBJECT').map((t) => t.name)
);

function namedType(ref: TypeRef): string | undefined {
	let t: TypeRef | null | undefined = ref;
	while (t && (t.kind === 'NON_NULL' || t.kind === 'LIST')) t = t.ofType;
	return t?.name;
}

/** Selects every field of `typename`, nesting object fields up to `depth` levels (enough to
 * reach e.g. `conference.committees.votingSessions`). Field arguments are left out — the
 * local demo answers don't look at them beyond `id`. */
function selectionFor(typename: string, depth: number): string {
	const type = schema.__schema.types.find((t) => t.name === typename);
	const fields = (type && 'fields' in type && type.fields) || [];
	const parts: string[] = [];
	for (const field of fields) {
		const inner = namedType(field.type as TypeRef);
		if (inner && objectTypes.has(inner)) {
			if (depth > 0) parts.push(`${field.name} ${selectionFor(inner, depth - 1)}`);
		} else {
			parts.push(field.name);
		}
	}
	return `{ __typename ${parts.join(' ')} }`;
}

function queryFor(fieldName: string): DocumentNode {
	const field = getLocalDemoField('Query', fieldName)!;
	const inner = namedType(field.type as TypeRef)!;
	const selection = objectTypes.has(inner) ? selectionFor(inner, 3) : '';
	return parse(`query { ${fieldName} ${selection} }`);
}

/** Every field selectionFor selected (same `depth`) must be present, non-null ones non-null,
 * lists arrays — i.e. what graphcache needs to not treat the answer as a cache miss. */
function violations(typeRef: TypeRef, value: unknown, depth: number, path: string, out: string[]) {
	if (typeRef.kind === 'NON_NULL') {
		if (value === null || value === undefined) out.push(`${path} is ${value} but non-null`);
		else violations(typeRef.ofType!, value, depth, path, out);
		return;
	}
	if (value === undefined) {
		out.push(`${path} is missing`);
		return;
	}
	if (value === null) return;
	if (typeRef.kind === 'LIST') {
		if (!Array.isArray(value)) out.push(`${path} is not a list`);
		else value.forEach((item, i) => violations(typeRef.ofType!, item, depth, `${path}.${i}`, out));
		return;
	}
	if (typeRef.kind !== 'OBJECT') return;
	const object = value as Record<string, unknown>;
	const type = schema.__schema.types.find((t) => t.name === typeRef.name);
	for (const field of (type && 'fields' in type && type.fields) || []) {
		const inner = namedType(field.type as TypeRef);
		const isObject = !!inner && objectTypes.has(inner);
		if (isObject && depth === 0) continue;
		const fieldPath = `${path}.${field.name}`;
		violations(field.type as TypeRef, object[field.name], isObject ? depth - 1 : 0, fieldPath, out);
	}
}

describe('local demo conference queries', () => {
	it.each(LOCAL_DEMO_QUERY_FIELD_NAMES)('answers %s completely', (fieldName) => {
		const document = queryFor(fieldName);
		// `id` steers the canned `conference`/`committee` answers to the seeded entities.
		const data = resolveLocalDemoQuery(document, {
			id: fieldName === 'conference' ? 'localconference' : 'localcommittee'
		});
		expect(data).toBeTruthy();
		expect(data).toHaveProperty(fieldName);

		const out: string[] = [];
		violations(
			getLocalDemoField('Query', fieldName)!.type as TypeRef,
			data![fieldName],
			3,
			fieldName,
			out
		);
		expect(out).toEqual([]);
	});

	it('fills fields the canned seed objects lack', () => {
		const document = parse(`query ($id: ID!) {
			conference(id: $id) {
				id title
				committees { id name votingSessions { id } activeAgendaItem { speakersList { speakers { conferenceMember { id } } } } }
			}
		}`);
		const data = resolveLocalDemoQuery(document, { id: 'localconference' }) as {
			conference: { title: string; committees: { votingSessions: unknown[] }[] };
		};
		expect(data.conference.title).toBe('Local Demo Conference');
		expect(data.conference.committees.length).toBeGreaterThan(0);
		expect(data.conference.committees[0].votingSessions).toEqual([]);
	});

	it('fills nested stubs from the full seed entity instead of zero values', () => {
		const document = parse(`query ($id: ID!) {
			committee(id: $id) { id conference { id title } }
		}`);
		const data = resolveLocalDemoQuery(document, { id: 'localcommittee' }) as {
			committee: { conference: { title: string } };
		};
		expect(data.committee.conference.title).toBe('Local Demo Conference');
	});
});
