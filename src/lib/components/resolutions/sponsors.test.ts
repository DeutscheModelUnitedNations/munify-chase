import { describe, expect, it, vi } from 'vitest';

vi.mock('#lib/paraglide/runtime', () => ({
	locales: ['de', 'en', 'pt'],
	getLocale: () => 'en'
}));

const {
	canSponsorAmendment,
	canSponsorPaper,
	createMemberFilter,
	ownSponsorship,
	representationName,
	sortSponsors
} = await import('./sponsors');

const sponsor = (id: string, memberId: string, name: string, alpha3Code?: string) => ({
	id,
	committeeMember: { id: memberId, representation: { name, alpha3Code } }
});

describe('representationName', () => {
	it('prefers the translated country name', () => {
		expect(representationName({ name: 'Deutschland', alpha3Code: 'DEU' })).toBe('Germany');
	});

	it('reads N/A without a known country code, as the translation helper answers', () => {
		expect(representationName({ name: 'Amnesty' })).toBe('N/A');
		expect(representationName(null, '?')).toBe('N/A');
	});
});

describe('sortSponsors', () => {
	it('sorts by delegation name without touching the input', () => {
		const input = [sponsor('1', 'a', 'Zeta', 'ZAF'), sponsor('2', 'b', 'Alpha', 'AUT')];
		expect(sortSponsors(input).map((s) => s.id)).toEqual(['2', '1']);
		expect(input[0].id).toBe('1');
	});

	it('treats a missing list as empty', () => {
		expect(sortSponsors(undefined)).toEqual([]);
	});
});

describe('ownSponsorship', () => {
	it('finds the sponsorship of the given member', () => {
		const list = [sponsor('1', 'a', 'A'), sponsor('2', 'b', 'B')];
		expect(ownSponsorship(list, 'b')?.id).toBe('2');
		expect(ownSponsorship(list, null)).toBeUndefined();
		expect(ownSponsorship(null, 'a')).toBeUndefined();
	});
});

describe('createMemberFilter', () => {
	const members = [
		{ id: 'c', name: 'Chile' },
		{ id: 'a', name: 'Austria' },
		{ id: 'b', name: 'Brazil' }
	];
	type Member = { id: string; name: string };
	const getName = (member: Member) => member.name;

	it('lists all members alphabetically without a search', () => {
		const filter = createMemberFilter<Member>({ getName });
		expect(filter(members, '').map((x) => x.id)).toEqual(['a', 'b', 'c']);
	});

	it('searches fuzzily and leaves excluded members out', () => {
		const filter = createMemberFilter<Member>({ getName, exclude: (member) => member.id === 'b' });
		expect(filter(members, 'Brazil')).toEqual([]);
		expect(filter(members, 'Chil').map((x) => x.id)).toEqual(['c']);
		expect(filter(members, '').map((x) => x.id)).toEqual(['a', 'c']);
	});
});

describe('canSponsorPaper', () => {
	const base = { team: false, myMemberId: 'm', sponsoring: false, paperStatus: 'WORKING_PAPER' };

	it('lets a delegation sponsor a working or submitted paper', () => {
		expect(canSponsorPaper(base)).toBe(true);
		expect(canSponsorPaper({ ...base, paperStatus: 'SUBMITTED' })).toBe(true);
	});

	it('refuses the team, non-members, current sponsors and later stages', () => {
		expect(canSponsorPaper({ ...base, team: true })).toBe(false);
		expect(canSponsorPaper({ ...base, myMemberId: null })).toBe(false);
		expect(canSponsorPaper({ ...base, sponsoring: true })).toBe(false);
		expect(canSponsorPaper({ ...base, paperStatus: 'DRAFT_RESOLUTION' })).toBe(false);
	});
});

describe('canSponsorAmendment', () => {
	const base = {
		team: false,
		myMemberId: 'm',
		proposerMemberId: 'p',
		sponsoring: false,
		sponsoringOpen: true,
		amendmentStatus: 'PENDING'
	};

	it('lets another delegation sponsor a live amendment while sponsoring is open', () => {
		expect(canSponsorAmendment(base)).toBe(true);
	});

	it('refuses the proposer, closed sponsoring and finished amendments', () => {
		expect(canSponsorAmendment({ ...base, team: true })).toBe(false);
		expect(canSponsorAmendment({ ...base, myMemberId: null })).toBe(false);
		expect(canSponsorAmendment({ ...base, sponsoring: true })).toBe(false);
		expect(canSponsorAmendment({ ...base, sponsoringOpen: false })).toBe(false);
		expect(canSponsorAmendment({ ...base, proposerMemberId: 'm' })).toBe(false);
		expect(canSponsorAmendment({ ...base, amendmentStatus: 'REJECTED' })).toBe(false);
		expect(canSponsorAmendment({ ...base, amendmentStatus: 'WITHDRAWN' })).toBe(false);
	});
});
