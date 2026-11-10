import { describe, expect, it } from 'vitest';
import { m } from '#lib/paraglide/messages';
import {
	amendmentTypeIcon,
	amendmentVoteName,
	canRankByImpact,
	changeSummary,
	decisionMessage,
	groupPendingReviews,
	rankMap,
	scopeAmendments,
	statusBadge,
	typeLabel
} from './amendmentListState';
import {
	amendmentStatusBadgeClass,
	amendmentStatusLabel,
	amendmentTypeLabel
} from './paperContext';

const reviewItem = (
	id: string,
	triggerId: string | null,
	overrides: {
		phase?: string;
		status?: string;
		type?: string;
		triggerClause?: string | null;
		subjectClause?: string | null;
	} = {}
) => ({
	id,
	phase: overrides.phase ?? 'REWRITE',
	triggerAmendment: triggerId
		? { id: triggerId, targetClauseId: overrides.triggerClause ?? 'c1' }
		: null,
	subjectAmendment: {
		status: overrides.status ?? 'SUBMITTED',
		type: overrides.type ?? 'ALTER_TEXT',
		targetClauseId: overrides.subjectClause ?? 'c1'
	}
});

describe('groupPendingReviews', () => {
	it('groups unresolved submitted text changes on the clause by trigger', () => {
		const groups = groupPendingReviews({
			items: [reviewItem('1', 't1'), reviewItem('2', 't2'), reviewItem('3', 't1')],
			clauseId: 'c1'
		});
		expect(groups.map((g) => [g.triggerId, g.items.map((i) => i.id)])).toEqual([
			['t1', ['1', '3']],
			['t2', ['2']]
		]);
		expect(groups[0].trigger?.id).toBe('t1');
	});

	it('leaves out resolved, unsubmitted, other types, other clauses and items without trigger', () => {
		const groups = groupPendingReviews({
			items: [
				reviewItem('1', 't1', { phase: 'RESOLVED' }),
				reviewItem('2', 't1', { status: 'PENDING' }),
				reviewItem('3', 't1', { type: 'DELETE' }),
				reviewItem('4', 't1', { triggerClause: 'c2' }),
				reviewItem('5', 't1', { subjectClause: 'c2' }),
				reviewItem('6', null)
			],
			clauseId: 'c1'
		});
		expect(groups).toEqual([]);
		expect(groupPendingReviews({ items: undefined, clauseId: null })).toEqual([]);
	});
});

describe('scopeAmendments', () => {
	const row = (
		id: string,
		type: string,
		status: string,
		createdAt: number,
		targetClauseId: string | null = 'c1'
	) => ({ id, type, status, createdAt, targetClauseId });
	const ids = (list: { id: string }[]) => list.map((a) => a.id);

	it('shows the clause amendments, or the document level ones without a clause', () => {
		const list = [row('a', 'DELETE', 'SUBMITTED', 1), row('b', 'ADD', 'SUBMITTED', 2, null)];
		expect(ids(scopeAmendments({ amendments: list, clauseId: 'c1', ranks: new Map() }))).toEqual([
			'a'
		]);
		expect(ids(scopeAmendments({ amendments: list, clauseId: null, ranks: new Map() }))).toEqual([
			'b'
		]);
		expect(scopeAmendments({ amendments: null, clauseId: null, ranks: new Map() })).toEqual([]);
	});

	it('puts active ones first by type and age, processed then pending ones in their order', () => {
		const list = [
			row('pending', 'DELETE', 'PENDING', 1),
			row('accepted2', 'ALTER_TEXT', 'ACCEPTED', 3),
			row('accepted1', 'DELETE', 'REJECTED', 2),
			row('move', 'ALTER_POSITION', 'SUBMITTED', 4),
			row('text-new', 'ALTER_TEXT', 'SUBMITTED', 6),
			row('text-old', 'ALTER_TEXT', 'SUBMITTED', 5),
			row('add', 'ADD', 'SUBMITTED', 7),
			row('odd', 'OTHER', 'SUBMITTED', 8),
			row('delete', 'DELETE', 'SUBMITTED', 9)
		];
		expect(ids(scopeAmendments({ amendments: list, clauseId: 'c1', ranks: new Map() }))).toEqual([
			'delete',
			'text-old',
			'text-new',
			'add',
			'move',
			'odd',
			'accepted2',
			'accepted1',
			'pending'
		]);
	});

	it('orders text changes by AI rank, unranked ones last', () => {
		const list = [
			row('x', 'ALTER_TEXT', 'SUBMITTED', 1),
			row('y', 'ALTER_TEXT', 'SUBMITTED', 2),
			row('z', 'ALTER_TEXT', 'SUBMITTED', 3)
		];
		const ranks = rankMap(['z', 'y']);
		expect(ids(scopeAmendments({ amendments: list, clauseId: 'c1', ranks }))).toEqual([
			'z',
			'y',
			'x'
		]);
	});
});

describe('rankMap', () => {
	it('ranks by position', () => {
		expect([...rankMap(['a', 'b'])]).toEqual([
			['a', 0],
			['b', 1]
		]);
	});
});

describe('canRankByImpact', () => {
	it('needs an idle sorter, two candidates and AI switched on', () => {
		expect(canRankByImpact({ busy: false, candidates: 2, preference: 'local' })).toBe(true);
		expect(canRankByImpact({ busy: true, candidates: 2, preference: 'local' })).toBe(false);
		expect(canRankByImpact({ busy: false, candidates: 1, preference: 'local' })).toBe(false);
		expect(canRankByImpact({ busy: false, candidates: 3, preference: 'off' })).toBe(false);
	});
});

describe('changeSummary', () => {
	it('describes deleting and altering a clause by number', () => {
		const clause = ` – ${m.operativeClausePresentation()} 3`;
		expect(changeSummary({ type: 'DELETE', targetOperativeIndex: 2 })).toEqual({
			headline: `${m.deleteClausePresentation()}${clause}`
		});
		expect(
			changeSummary({ type: 'ALTER_TEXT', targetOperativeIndex: 2, newContent: 'text' })
		).toEqual({ headline: `${m.alterClausePresentation()}${clause}`, body: 'text' });
		expect(changeSummary({ type: 'DELETE' })).toEqual({
			headline: m.deleteClausePresentation()
		});
	});

	it('describes adding and moving by position', () => {
		expect(changeSummary({ type: 'ADD', targetPosition: 1, newContent: 'n' })).toEqual({
			headline: `${m.addClausePresentation()} – ${m.insertAfterPresentation({ index: 2 })}`,
			body: 'n'
		});
		expect(changeSummary({ type: 'ALTER_POSITION' })).toEqual({
			headline: `${m.moveClausePresentation()} – ${m.moveToPositionPresentation({ position: 1 })}`
		});
	});

	it('falls back to the type for anything else', () => {
		expect(changeSummary({ type: 'OTHER' })).toEqual({ headline: 'OTHER' });
	});
});

describe('amendmentVoteName and typeLabel', () => {
	it('names the vote by document number and type', () => {
		const label = amendmentTypeLabel('ADD');
		expect(amendmentVoteName({ type: 'ADD', documentNumber: 'A/1' })).toBe(`A/1 – ${label}`);
		expect(amendmentVoteName({ type: 'ADD' })).toBe(label);
		expect(typeLabel(null)).toBe('');
	});
});

describe('decisionMessage', () => {
	it('asks for the decision taken', () => {
		expect(decisionMessage('accept')).toBe(m.confirmAcceptAmendment());
		expect(decisionMessage('consensus')).toBe(m.confirmAdoptByConsensus());
		expect(decisionMessage('reject')).toBe(m.confirmRejectAmendment());
	});
});

describe('amendmentTypeIcon', () => {
	it('maps the types and nothing else', () => {
		expect(amendmentTypeIcon('ADD')).toBe('plus');
		expect(amendmentTypeIcon('ALTER_POSITION')).toBe('arrows-down-up');
		expect(amendmentTypeIcon('OTHER')).toBeNull();
		expect(amendmentTypeIcon(null)).toBeNull();
	});
});

describe('statusBadge', () => {
	it('labels known statuses', () => {
		expect(statusBadge('ACCEPTED')).toEqual({
			label: amendmentStatusLabel('ACCEPTED'),
			cls: amendmentStatusBadgeClass('ACCEPTED')
		});
		expect(statusBadge('PENDING').cls).toBe('badge-ghost');
	});

	it('shows an unknown status as it is', () => {
		expect(statusBadge('ODD')).toEqual({ label: 'ODD', cls: '' });
		expect(statusBadge(undefined)).toEqual({ label: '', cls: '' });
	});
});
