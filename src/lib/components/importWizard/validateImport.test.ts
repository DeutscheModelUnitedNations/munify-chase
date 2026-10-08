import { describe, expect, it } from 'vitest';
import { m } from '$lib/paraglide/messages';
import { validateImport } from './validateImport';

type Data = Parameters<typeof validateImport>[0];

const base = (overrides: Partial<Data> = {}): Data => ({
	id: 'conf',
	title: 'MUN 2026',
	committees: [{ id: 'ga', name: 'General Assembly', abbreviation: 'GA' }],
	representations: [],
	conferenceMembers: [],
	committeeMembers: [{ id: 'cm1', representationId: 'r1', committeeId: 'ga' }],
	agendaItems: [],
	...overrides
});

describe('validateImport', () => {
	it('accepts complete data', () => {
		expect(validateImport(base())).toEqual([]);
	});

	it('requires a title and at least one committee', () => {
		expect(validateImport(base({ title: '', committees: [] }))).toEqual([
			{ severity: 'error', step: 1, msg: m.missingConferenceTitle() },
			{ severity: 'error', step: 2, msg: m.noCommitteesCreated() }
		]);
	});

	it('flags incomplete committees and committees without delegations', () => {
		const data = base({
			committees: [{ id: 'sc', name: '', abbreviation: 'SC' }],
			committeeMembers: []
		});
		expect(validateImport(data)).toEqual([
			{ severity: 'error', step: 2, msg: m.committeeIncomplete({ name: 'SC' }) },
			{ severity: 'warning', step: 3, msg: m.committeeNoDelegations({ name: 'SC' }) }
		]);
	});

	it('reports each duplicated name and abbreviation once', () => {
		const committee = { name: 'General Assembly', abbreviation: 'GA' };
		const data = base({
			committees: ['a', 'b', 'c'].map((id) => ({ id, ...committee })),
			committeeMembers: ['a', 'b', 'c'].map((id) => ({
				id: `cm-${id}`,
				representationId: 'r1',
				committeeId: id
			}))
		});
		expect(validateImport(data)).toEqual([
			{ severity: 'error', step: 2, msg: m.duplicateCommitteeName({ name: 'General Assembly' }) },
			{ severity: 'error', step: 2, msg: m.duplicateCommitteeAbbreviation({ abbreviation: 'GA' }) }
		]);
	});
});
