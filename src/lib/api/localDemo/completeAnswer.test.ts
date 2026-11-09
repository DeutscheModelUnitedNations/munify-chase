import { parse } from 'graphql';
import { describe, expect, it } from 'vitest';
import { completeLocalDemoQueryAnswer } from './completeAnswer';

const complete = (
	query: string,
	data: Record<string, unknown> = {},
	options: { variables?: unknown; lookup?: Parameters<typeof completeLocalDemoQueryAnswer>[3] } = {}
) => completeLocalDemoQueryAnswer(parse(query), options.variables, data, options.lookup);

describe('completeLocalDemoQueryAnswer', () => {
	it('builds a missing object from the id the field asks for', () => {
		expect(complete('query { committee(id: "c1") { __typename id } }')).toEqual({
			committee: { __typename: 'Committee', id: 'c1' }
		});
		expect(
			complete('query ($id: ID!) { committee(id: $id) { id } }', {}, { variables: { id: 'c2' } })
		).toEqual({ committee: { id: 'c2' } });
		expect(complete('query { committee(id: 7) { id } }')).toEqual({ committee: { id: 7 } });
		expect(complete('query { committee(id: true) { id } }')).toEqual({
			committee: { id: 'local-demo-committee' }
		});
	});

	it('fills non-null fields with zero values and nullable ones with null', () => {
		const answer = complete(
			'query { committee(id: "c") { allowRequests createdAt conference { id } agendaItems { id } } }'
		);
		expect(answer.committee).toEqual({
			allowRequests: false,
			createdAt: new Date(0),
			conference: null,
			agendaItems: []
		});
	});

	it('keeps given values, aliases and fields the schema does not know', () => {
		const answer = complete(
			`query { c: committee(id: "c") { id allowRequests agendaItems { id } unknownField } }`,
			{ c: { id: 'c', allowRequests: true, agendaItems: 'not a list', unknownField: 3 } }
		);
		expect(answer).toEqual({
			c: { id: 'c', allowRequests: true, agendaItems: [], unknownField: 3 }
		});
	});

	it('follows fragments for the matching type only', () => {
		const answer = complete(
			`query {
				committee(id: "c") {
					...CommitteeFields
					... on Committee { allowRequests }
					... on Conference { title }
					... { conferenceId }
					...ConferenceFields
				}
			}
			fragment CommitteeFields on Committee { id }
			fragment ConferenceFields on Conference { title }`
		);
		expect(answer.committee).toEqual({ id: 'c', allowRequests: false, conferenceId: '' });
	});

	it('fills what a nested stub lacks from the full seed entity, keeping explicit nulls', () => {
		const lookup = (typename: string, id: string) =>
			typename === 'Conference' && id === 'conf' ? { title: 'Demo', start: 'x' } : undefined;
		const answer = complete(
			'query { committee(id: "c") { conference { id title start } } }',
			{ committee: { conference: { id: 'conf', start: null } } },
			{ lookup }
		);
		expect(answer.committee).toEqual({ conference: { id: 'conf', title: 'Demo', start: null } });
	});

	it('leaves documents without an operation alone', () => {
		const data = { a: 1 };
		expect(complete('fragment F on Committee { id }', data)).toBe(data);
	});
});
