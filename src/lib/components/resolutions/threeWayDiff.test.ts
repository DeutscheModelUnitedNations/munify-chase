import { describe, expect, it } from 'vitest';
import type { RenderClause } from '@deutschemodelunitednations/munify-resolution-editor';
import { annotateThreeWayDiff, statusClasses, threeWayDiff } from './threeWayDiff';

const text = (
	words: [string, 'same' | 'added' | 'removed'][],
	blockStatus: 'same' | 'added' | 'removed' = 'same'
) => ({
	type: 'text' as const,
	words: words.map(([value, status]) => ({ value, status })),
	blockStatus,
	punctuation: ';' as const
});

describe('annotateThreeWayDiff', () => {
	it('attributes changed words to the trigger when B has them, else to the AI', () => {
		const diffAC: RenderClause = {
			blocks: [
				text([
					['Decides ', 'same'],
					['quickly ', 'added'],
					['boldly ', 'added'],
					['slowly ', 'removed'],
					['gently ', 'removed']
				])
			]
		};
		const triggerTree: RenderClause = {
			blocks: [
				text([
					['quickly ', 'same'],
					['slowly ', 'same']
				])
			]
		};
		const [block] = annotateThreeWayDiff({ diffAC, triggerTree }).blocks;
		expect(block.type === 'text' && block.words.map((w) => w.status)).toEqual([
			'same',
			'trigger-added',
			'ai-added',
			'ai-removed',
			'trigger-removed'
		]);
	});

	it('consumes each word of B only once', () => {
		const diffAC: RenderClause = {
			blocks: [
				text([
					['a ', 'added'],
					['a ', 'added']
				])
			]
		};
		const triggerTree: RenderClause = { blocks: [text([['a ', 'same']])] };
		const [block] = annotateThreeWayDiff({ diffAC, triggerTree }).blocks;
		expect(block.type === 'text' && block.words.map((w) => w.status)).toEqual([
			'trigger-added',
			'ai-added'
		]);
	});

	it('gives wholly changed blocks the attribution of their first word', () => {
		const diffAC: RenderClause = {
			blocks: [
				text([['new ', 'added']], 'added'),
				text([['old ', 'removed']], 'removed'),
				text([['gone ', 'removed']], 'removed')
			]
		};
		const triggerTree: RenderClause = {
			blocks: [
				text([
					['new ', 'same'],
					['old ', 'same']
				])
			]
		};
		const blocks = annotateThreeWayDiff({ diffAC, triggerTree }).blocks;
		expect(blocks.map((b) => b.type === 'text' && b.blockStatus)).toEqual([
			'trigger-added',
			'ai-removed',
			'trigger-removed'
		]);
	});

	it('attributes subclauses by their first word and walks nested ones', () => {
		const diffAC: RenderClause = {
			blocks: [
				{
					type: 'subclauses',
					items: [
						{ status: 'added', blocks: [text([['x ', 'added']])] },
						{ status: 'removed', blocks: [text([['y ', 'removed']])] },
						{
							status: 'same',
							blocks: [{ type: 'subclauses', items: [{ status: 'added', blocks: [] }] }]
						}
					]
				}
			]
		};
		const triggerTree: RenderClause = {
			blocks: [
				{ type: 'subclauses', items: [{ status: 'same', blocks: [text([['x ', 'same']])] }] }
			]
		};
		const [block] = annotateThreeWayDiff({ diffAC, triggerTree }).blocks;
		if (block.type !== 'subclauses') throw new Error('expected subclauses');
		expect(block.items.map((i) => i.status)).toEqual(['trigger-added', 'trigger-removed', 'same']);
		const nested = block.items[2].blocks[0];
		expect(nested.type === 'subclauses' && nested.items[0].status).toBe('ai-added');
	});

	it('treats every change as the AI’s without a trigger version', () => {
		const diffAC: RenderClause = {
			blocks: [
				text([
					['a ', 'added'],
					['b ', 'removed']
				])
			]
		};
		const [block] = annotateThreeWayDiff({ diffAC, triggerTree: null }).blocks;
		expect(block.type === 'text' && block.words.map((w) => w.status)).toEqual([
			'ai-added',
			'trigger-removed'
		]);
	});
});

describe('threeWayDiff', () => {
	it('diffs parsed markup', () => {
		const result = threeWayDiff({
			originalMarkup: 'Decides to act;',
			triggerMarkup: 'Decides to act now;',
			aiMarkup: 'Decides to act now;'
		});
		expect(result?.blocks.length).toBeGreaterThan(0);
	});

	it('is null when the original or the suggestion does not parse', () => {
		const bad = 'chapeau\n--> orphan;';
		expect(
			threeWayDiff({ originalMarkup: bad, triggerMarkup: '', aiMarkup: 'Decides;' })
		).toBeNull();
		expect(
			threeWayDiff({ originalMarkup: 'Decides;', triggerMarkup: bad, aiMarkup: bad })
		).toBeNull();
		expect(
			threeWayDiff({ originalMarkup: 'Decides;', triggerMarkup: bad, aiMarkup: 'Decides;' })
		).not.toBeNull();
	});
});

describe('statusClasses', () => {
	it('highlights changes only', () => {
		expect(statusClasses('same')).toBe('');
		expect(statusClasses('ai-added')).toContain('text-success');
		expect(statusClasses('trigger-removed')).toContain('line-through');
	});
});
