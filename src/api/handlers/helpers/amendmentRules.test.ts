import { describe, expect, test } from 'vitest';
import type { Resolution } from '@deutschemodelunitednations/munify-resolution-editor/schema';
import { acceptedStatus, amendmentTargets, applyAmendment } from './amendmentRules';

function clause(id: string, text: string) {
	return { id, blocks: [{ type: 'text' as const, id: `${id}-t`, content: text }] };
}

const resolution: Resolution = {
	committeeName: 'GA',
	preamble: [],
	operative: [clause('a', 'First'), clause('b', 'Second'), clause('c', 'Third')]
};

const none = { targetClauseId: null, newContent: null, targetPosition: null };

function ids(result: ReturnType<typeof applyAmendment>) {
	return result.next?.operative.map((c) => c.id);
}

describe('applyAmendment', () => {
	test('deletes the target clause', () => {
		expect(
			ids(applyAmendment(resolution, { ...none, type: 'DELETE', targetClauseId: 'b' }))
		).toEqual(['a', 'c']);
	});

	test('adds a clause at the position, clamped to the end', () => {
		const added = applyAmendment(resolution, {
			...none,
			type: 'ADD',
			newContent: 'Requests more',
			targetPosition: 1
		});
		expect(added.next?.operative).toHaveLength(4);
		expect(added.next?.operative[0].id).toBe('a');
		expect(added.next?.operative[2].id).toBe('b');

		const appended = applyAmendment(resolution, {
			...none,
			type: 'ADD',
			newContent: 'Requests more',
			targetPosition: 99
		});
		expect(appended.next?.operative[3].id).not.toMatch(/^[abc]$/);
	});

	test('replaces a clause’s text, keeping its id and the old text', () => {
		const altered = applyAmendment(resolution, {
			...none,
			type: 'ALTER_TEXT',
			targetClauseId: 'b',
			newContent: 'Changed'
		});
		expect(ids(altered)).toEqual(['a', 'b', 'c']);
		expect(JSON.stringify(altered.next?.operative[1])).toContain('Changed');
		expect(altered.oldContent).toBe(JSON.stringify(resolution.operative[1]));
	});

	test('moves a clause', () => {
		expect(
			ids(
				applyAmendment(resolution, {
					...none,
					type: 'ALTER_POSITION',
					targetClauseId: 'a',
					targetPosition: 2
				})
			)
		).toEqual(['b', 'c', 'a']);
	});

	test('leaves the text alone when the amendment cannot apply', () => {
		expect(applyAmendment(resolution, { ...none, type: 'DELETE' }).next).toBeNull();
		expect(applyAmendment(resolution, { ...none, type: 'ADD' }).next).toBeNull();
		expect(
			applyAmendment(resolution, {
				...none,
				type: 'ALTER_TEXT',
				targetClauseId: 'x',
				newContent: 'Changed'
			}).next
		).toBeNull();
		expect(
			applyAmendment(resolution, { ...none, type: 'ALTER_POSITION', targetClauseId: 'a' }).next
		).toBeNull();
		expect(
			applyAmendment(resolution, {
				...none,
				type: 'ALTER_POSITION',
				targetClauseId: 'x',
				targetPosition: 0
			}).next
		).toBeNull();
	});

	test('keeps the old text of a clause even when the new one cannot apply', () => {
		const result = applyAmendment(resolution, {
			...none,
			type: 'ALTER_TEXT',
			targetClauseId: 'a'
		});
		expect(result.next).toBeNull();
		expect(result.oldContent).toBe(JSON.stringify(resolution.operative[0]));
	});

	test('refuses invalid RES-Markup', () => {
		expect(() =>
			applyAmendment(resolution, { ...none, type: 'ADD', newContent: 'chapeau\n--> orphan;' })
		).toThrow('ERR_ORPHAN_TAIL');
	});

	test('never changes the resolution it is given', () => {
		const before = JSON.stringify(resolution);
		applyAmendment(resolution, { ...none, type: 'DELETE', targetClauseId: 'a' });
		expect(JSON.stringify(resolution)).toBe(before);
	});
});

describe('acceptedStatus', () => {
	test('marks a consensus as such', () => {
		expect(acceptedStatus(true)).toBe('CONSENSUS_ADOPTED');
		expect(acceptedStatus(false)).toBe('ACCEPTED');
		expect(acceptedStatus(undefined)).toBe('ACCEPTED');
	});
});

describe('amendmentTargets', () => {
	test('stores what is left out as null', () => {
		expect(amendmentTargets({ targetClauseId: 'a' })).toEqual({
			targetClauseId: 'a',
			targetOperativeIndex: null,
			newContent: null,
			targetPosition: null
		});
	});
});
