import { describe, expect, it, vi } from 'vitest';

vi.mock('#lib/utils/nationTranslationHelper.svelte', () => ({
	sortTranslatedCountries: (a: { name?: string | null }, b: { name?: string | null }) =>
		(a.name ?? '').localeCompare(b.name ?? '')
}));

import {
	chartPercentage,
	committeeMajorityAmount,
	deviceVotingExpired,
	finishVote,
	handsCountState,
	handsProgress,
	idsByVote,
	membersByVote,
	nextShowOfHandsStage,
	presentDelegations,
	presentationTally,
	previousShowOfHandsStage,
	resumeVotingConfig,
	resumedShowOfHands,
	rollCallIcon,
	rollCallKeyVote,
	showOfHandsForwardAction,
	showOfHandsMajority,
	showOfHandsResultBoxes,
	showOfHandsTotal,
	voteSetupArgs,
	votingConfigWithDefaults,
	withVote
} from './votingMath';

const committee = { totalPresent: 10, simpleMajority: 6, twoThirdsMajority: 7 };

describe('presentDelegations', () => {
	it('keeps present delegations sorted by name', () => {
		const members = [
			{ id: 'b', present: true, representation: { name: 'B', type: 'DELEGATION' } },
			{ id: 'a', present: true, representation: { name: 'A', type: 'DELEGATION' } },
			{ id: 'c', present: false, representation: { name: 'C', type: 'DELEGATION' } },
			{ id: 'n', present: true, representation: { name: 'N', type: 'NSA' } }
		];
		expect(presentDelegations(members).map((m) => m.id)).toEqual(['a', 'b']);
	});
});

describe('committeeMajorityAmount', () => {
	it('computes each majority', () => {
		expect(committeeMajorityAmount({ majority: 'SIMPLE', committee, abstainCount: 2 })).toBe(5);
		expect(committeeMajorityAmount({ majority: 'ABSOLUTE', committee, abstainCount: 2 })).toBe(6);
		expect(committeeMajorityAmount({ majority: 'TWO_THIRDS', committee, abstainCount: 0 })).toBe(7);
		expect(committeeMajorityAmount({ majority: undefined, committee, abstainCount: 0 })).toBe(0);
		expect(committeeMajorityAmount({ majority: 'SIMPLE', committee: null, abstainCount: 0 })).toBe(
			0
		);
	});
});

describe('show of hands majority', () => {
	it('counts abstentions only for the absolute majority', () => {
		expect(showOfHandsTotal({ majority: 'SIMPLE', pro: 3, con: 2, abstain: 4 })).toBe(5);
		expect(showOfHandsTotal({ majority: 'TWO_THIRDS', pro: 3, con: null, abstain: 4 })).toBe(3);
		expect(showOfHandsTotal({ majority: 'ABSOLUTE', pro: 3, con: 2, abstain: 4 })).toBe(9);
		expect(showOfHandsTotal({ majority: 'ABSOLUTE', pro: 3, con: 2, abstain: null })).toBe(5);
		expect(showOfHandsTotal({ majority: null, pro: 3, con: 2 })).toBe(0);
	});

	it('needs a simple or two thirds majority of the total', () => {
		expect(showOfHandsMajority({ majority: 'SIMPLE', total: 10 })).toBe(6);
		expect(showOfHandsMajority({ majority: 'ABSOLUTE', total: 9 })).toBe(5);
		expect(showOfHandsMajority({ majority: 'TWO_THIRDS', total: 9 })).toBe(6);
		expect(showOfHandsMajority({ majority: undefined, total: 9 })).toBe(0);
	});
});

describe('finishVote', () => {
	const tally = { majorityAmount: 5, votesFor: 5, votesAgainst: 3, votesAbstain: 1 };

	it('adopts or rejects a completed vote', () => {
		expect(finishVote({ completed: true, ...tally })).toEqual({
			outcome: 'ADOPTED',
			result: {
				outcome: 'ADOPTED',
				votesFor: 5,
				votesAgainst: 3,
				votesAbstain: 1,
				cancelled: false
			}
		});
		expect(finishVote({ completed: true, ...tally, votesFor: 4 }).outcome).toBe('REJECTED');
	});

	it('cancels a vote closed early', () => {
		expect(finishVote({ completed: false, ...tally })).toEqual({
			outcome: null,
			result: { votesFor: 0, votesAgainst: 0, votesAbstain: 0, cancelled: true }
		});
	});
});

describe('votes by choice', () => {
	const votes = [
		{ committeeMemberId: 'a', vote: 'PRO' },
		{ committeeMemberId: 'b', vote: 'CON' },
		{ committeeMemberId: 'c', vote: 'ABSTAIN' }
	];

	it('groups ids', () => {
		expect(idsByVote(votes)).toEqual({ PRO: ['a'], CON: ['b'], ABSTAIN: ['c'] });
	});

	it('groups members, keeping those who have not voted', () => {
		const members = ['a', 'b', 'c', 'd'].map((id) => ({ id }));
		expect(membersByVote({ members, votes })).toEqual({
			REMAINING: [{ id: 'd' }],
			PRO: [{ id: 'a' }],
			CON: [{ id: 'b' }],
			ABSTAIN: [{ id: 'c' }]
		});
	});

	it('replaces a member vote', () => {
		const ids = { PRO: ['a'], CON: ['b'], ABSTAIN: [] };
		expect(withVote({ votes: ids, memberId: 'a', vote: 'ABSTAIN' })).toEqual({
			PRO: [],
			CON: ['b'],
			ABSTAIN: ['a']
		});
	});
});

describe('deviceVotingExpired', () => {
	it('expires once the window has passed', () => {
		const startedAt = '2026-01-01T10:00:00Z';
		expect(deviceVotingExpired({ startedAt, windowSeconds: 20, now: '2026-01-01T10:00:19Z' })).toBe(
			false
		);
		expect(deviceVotingExpired({ startedAt, windowSeconds: 20, now: '2026-01-01T10:00:20Z' })).toBe(
			true
		);
		expect(deviceVotingExpired({ startedAt: null, windowSeconds: 20, now: startedAt })).toBe(false);
		expect(deviceVotingExpired({ startedAt, windowSeconds: 0, now: startedAt })).toBe(false);
	});
});

describe('show of hands stages', () => {
	it('moves forward', () => {
		expect(nextShowOfHandsStage({ stage: 'PRO', withAbstentions: false })).toBe('CON');
		expect(nextShowOfHandsStage({ stage: 'CON', withAbstentions: true })).toBe('ABSTAIN');
		expect(nextShowOfHandsStage({ stage: 'CON', withAbstentions: false })).toBe('EVALUATION');
		expect(nextShowOfHandsStage({ stage: 'ABSTAIN', withAbstentions: true })).toBe('EVALUATION');
		expect(nextShowOfHandsStage({ stage: 'EVALUATION', withAbstentions: true })).toBe('DONE');
	});

	it('moves back', () => {
		expect(previousShowOfHandsStage({ stage: 'PRO', withAbstentions: true })).toBe('PRO');
		expect(previousShowOfHandsStage({ stage: 'CON', withAbstentions: true })).toBe('PRO');
		expect(previousShowOfHandsStage({ stage: 'ABSTAIN', withAbstentions: true })).toBe('CON');
		expect(previousShowOfHandsStage({ stage: 'EVALUATION', withAbstentions: true })).toBe(
			'ABSTAIN'
		);
		expect(previousShowOfHandsStage({ stage: 'EVALUATION', withAbstentions: false })).toBe('CON');
	});

	it('names the forward button', () => {
		expect(showOfHandsForwardAction({ stage: 'PRO', withAbstentions: false })).toBe('forward');
		expect(showOfHandsForwardAction({ stage: 'CON', withAbstentions: false })).toBe('publish');
		expect(showOfHandsForwardAction({ stage: 'ABSTAIN', withAbstentions: true })).toBe('publish');
		expect(showOfHandsForwardAction({ stage: 'EVALUATION', withAbstentions: true })).toBe('close');
	});
});

describe('counted hands', () => {
	it('compares to the present delegations', () => {
		expect(handsCountState({ votesCast: 11, votesTotal: 11, presentDelegations: 10 })).toBe('over');
		expect(handsCountState({ votesCast: 10, votesTotal: 10, presentDelegations: 10 })).toBe(
			'matching'
		);
		expect(handsCountState({ votesCast: 4, votesTotal: 4, presentDelegations: 10 })).toBe('open');
		expect(handsCountState({ votesCast: 4, votesTotal: 4, presentDelegations: 0 })).toBe('open');
	});

	it('measures progress', () => {
		expect(handsProgress({ votesCast: 5, presentDelegations: 10 })).toBe(50);
		expect(handsProgress({ votesCast: 15, presentDelegations: 10 })).toBe(100);
		expect(handsProgress({ votesCast: 5, presentDelegations: 0 })).toBe(0);
	});

	it('restores a resumed session', () => {
		expect(resumedShowOfHands({ currentStage: 'CON', votesPro: 2 })).toEqual({
			stage: 'CON',
			pro: 2,
			con: 0,
			abstain: 0
		});
		expect(resumedShowOfHands({ votesCon: 1, votesAbstain: 3 })).toEqual({
			stage: null,
			pro: 0,
			con: 1,
			abstain: 3
		});
	});
});

describe('showOfHandsResultBoxes', () => {
	it('shows abstentions only when allowed', () => {
		expect(showOfHandsResultBoxes(null)).toEqual([]);
		expect(
			showOfHandsResultBoxes({ votesPro: 3, votesCon: 2, withAbstentions: false }).map(
				(box) => box.value
			)
		).toEqual([3, 2]);
		expect(
			showOfHandsResultBoxes({ votesAbstain: 1, withAbstentions: true }).map((box) => box.value)
		).toEqual([0, 1, 0]);
	});
});

describe('roll call', () => {
	it('maps keys to votes', () => {
		expect(rollCallKeyVote({ key: 'j', stage: 'ROLL_CALL' })).toBe('CON');
		expect(rollCallKeyVote({ key: 'l', stage: 'ROLL_CALL' })).toBe('PRO');
		expect(rollCallKeyVote({ key: 'k', stage: 'ROLL_CALL', withAbstentions: true })).toBe(
			'ABSTAIN'
		);
		expect(rollCallKeyVote({ key: 'k', stage: 'ROLL_CALL', withAbstentions: false })).toBeNull();
		expect(rollCallKeyVote({ key: 'x', stage: 'ROLL_CALL' })).toBeNull();
		expect(rollCallKeyVote({ key: 'l', stage: 'EVALUATION' })).toBeNull();
	});

	it('picks icons', () => {
		const votes = { PRO: ['p'], CON: ['c'], ABSTAIN: ['a'] };
		expect(rollCallIcon({ memberId: 'a', votes })).toEqual({ icon: 'circle', color: 'info' });
		expect(rollCallIcon({ memberId: 'p', votes }).icon).toBe('plus-circle');
		expect(rollCallIcon({ memberId: 'c', votes }).icon).toBe('minus-circle');
		expect(rollCallIcon({ memberId: 'x', votes }).icon).toBe('question');
	});
});

describe('voting config', () => {
	it('fills in defaults', () => {
		expect(votingConfigWithDefaults({})).toEqual({
			voteType: 'SHOW_OF_HANDS',
			voteName: '',
			majority: 'SIMPLE',
			withAbstentions: false,
			deviceVotingWindowSeconds: 20
		});
	});

	it('resumes a session', () => {
		expect(
			resumeVotingConfig({
				mode: 'ROLL_CALL',
				voteName: 'Draft',
				majority: 'TWO_THIRDS',
				withAbstentions: true,
				deviceVotingWindowSeconds: 30
			})
		).toEqual({
			voteType: 'ROLL_CALL',
			voteName: 'Draft',
			majority: 'TWO_THIRDS',
			withAbstentions: true,
			deviceVotingWindowSeconds: 30
		});
		expect(resumeVotingConfig({ mode: 'OTHER', majority: 'OTHER' })).toMatchObject({
			voteType: 'DEVICE_BASED',
			majority: 'SIMPLE'
		});
	});
});

describe('chartPercentage', () => {
	it('is a share of the total', () => {
		expect(chartPercentage({ value: 1, total: 4 })).toBe('25%');
		expect(chartPercentage({ value: 2, total: null })).toBe('200%');
		expect(chartPercentage({ value: null, total: 4 })).toBe(0);
		expect(chartPercentage({ value: 1, total: 0 })).toBe(0);
	});
});

describe('voteSetupArgs', () => {
	it('fills in defaults', () => {
		expect(voteSetupArgs({})).toEqual({
			majority: 'SIMPLE',
			majorityAmount: 0,
			withAbstentions: false,
			voteName: null
		});
		expect(
			voteSetupArgs({ majority: 'ABSOLUTE', withAbstentions: true, voteName: 'Draft' })
		).toEqual({
			majority: 'ABSOLUTE',
			majorityAmount: 0,
			withAbstentions: true,
			voteName: 'Draft'
		});
	});
});

describe('presentationTally', () => {
	it('is empty without a session or committee', () => {
		expect(presentationTally({ committee: null, session: null })).toEqual({
			members: [],
			votes: [],
			majorityAmount: 0
		});
	});

	it('counts abstentions against a simple majority', () => {
		const member = { id: 'a', present: true, representation: { name: 'A', type: 'DELEGATION' } };
		const tally = presentationTally({
			committee: { id: 'c', ...committee, members: [member] },
			session: { majority: 'SIMPLE', votes: [{ committeeMemberId: 'a', vote: 'ABSTAIN' }] }
		});
		expect(tally.members).toEqual([member]);
		expect(tally.majorityAmount).toBe(5);
	});
});
