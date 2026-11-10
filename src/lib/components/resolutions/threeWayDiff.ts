import {
	buildDiffRenderClause,
	buildRenderClause,
	type RenderBlock,
	type RenderClause,
	type RenderItem,
	type RenderText
} from '@deutschemodelunitednations/munify-resolution-editor';
import { parseClauseFragment } from '@deutschemodelunitednations/munify-resolution-editor/res-markup';

export type TripleStatus = 'same' | 'trigger-added' | 'trigger-removed' | 'ai-added' | 'ai-removed';

export interface AnnotatedWord {
	value: string;
	status: TripleStatus;
}

export interface AnnotatedText {
	type: 'text';
	words: AnnotatedWord[];
	punctuation: string;
	blockStatus: TripleStatus;
}

export interface AnnotatedSubclauses {
	type: 'subclauses';
	items: AnnotatedSubItem[];
}

export interface AnnotatedSubItem {
	status: TripleStatus;
	blocks: AnnotatedBlock[];
}

export type AnnotatedBlock = AnnotatedText | AnnotatedSubclauses;

export interface AnnotatedClause {
	blocks: AnnotatedBlock[];
}

/** A consumable multiset of the words of the trigger version (B). */
function wordBag(tree: RenderClause | null) {
	const bag = new Map<string, number>();
	const collect = (block: RenderBlock): void => {
		if (block.type === 'text') {
			for (const w of block.words) bag.set(w.value, (bag.get(w.value) ?? 0) + 1);
			return;
		}
		for (const item of block.items) item.blocks.forEach(collect);
	};
	tree?.blocks.forEach(collect);
	return {
		/** Takes one occurrence of the word out of the bag; false when there is none left. */
		consume(word: string | undefined): boolean {
			if (word === undefined) return false;
			const n = bag.get(word) ?? 0;
			if (n === 0) return false;
			bag.set(word, n - 1);
			return true;
		}
	};
}

/**
 * Who made a change: an added word that B has was placed by the trigger, else
 * by the AI; a removed word that B still has was removed by the AI, else by
 * the trigger.
 */
function attribute(acStatus: 'added' | 'removed', inB: boolean): TripleStatus {
	if (acStatus === 'added') return inB ? 'trigger-added' : 'ai-added';
	return inB ? 'ai-removed' : 'trigger-removed';
}

/** A wholly changed block counts as changed through B when its first word does. */
function blockAttribution(blockStatus: 'added' | 'removed', firstWord: TripleStatus | undefined) {
	return attribute(blockStatus, firstWord === attribute(blockStatus, true));
}

/**
 * Annotate the A→C diff with whether each change came from the trigger
 * amendment (B) or the AI's revision (C).
 */
export function annotateThreeWayDiff({
	diffAC,
	triggerTree
}: {
	diffAC: RenderClause;
	triggerTree: RenderClause | null;
}): AnnotatedClause {
	const bag = wordBag(triggerTree);

	function annotateText(rt: RenderText): AnnotatedText {
		const words = rt.words.map((w) => ({
			value: w.value,
			status: w.status === 'same' ? ('same' as const) : attribute(w.status, bag.consume(w.value))
		}));
		// A wholly added or removed block takes the attribution of its first word.
		const blockStatus =
			rt.blockStatus === 'same' ? 'same' : blockAttribution(rt.blockStatus, words[0]?.status);
		return { type: 'text', words, punctuation: rt.punctuation, blockStatus };
	}

	function annotateBlock(b: RenderBlock): AnnotatedBlock {
		if (b.type === 'text') return annotateText(b);
		return { type: 'subclauses', items: b.items.map(annotateItem) };
	}

	function annotateItem(item: RenderItem): AnnotatedSubItem {
		// The first word decides whether the trigger or the AI added / removed a subclause.
		const firstText = item.blocks.find((b): b is RenderText => b.type === 'text');
		const status =
			item.status === 'same'
				? 'same'
				: attribute(item.status, bag.consume(firstText?.words[0]?.value));
		return { status, blocks: item.blocks.map(annotateBlock) };
	}

	return { blocks: diffAC.blocks.map(annotateBlock) };
}

/**
 * The three-way diff of a clause: original (A), after the trigger amendment
 * (B) and the AI's suggestion (C). `null` when A or C does not parse.
 */
export function threeWayDiff({
	originalMarkup,
	triggerMarkup,
	aiMarkup
}: {
	originalMarkup: string;
	triggerMarkup: string;
	aiMarkup: string;
}): AnnotatedClause | null {
	const pA = parseClauseFragment(originalMarkup ?? '');
	const pB = parseClauseFragment(triggerMarkup ?? '');
	const pC = parseClauseFragment(aiMarkup ?? '');
	if (!pA.valid || !pC.valid) return null;
	return annotateThreeWayDiff({
		diffAC: buildDiffRenderClause(pA.clause, pC.clause),
		triggerTree: pB.valid ? buildRenderClause(pB.clause) : null
	});
}

const STATUS_CLASSES: Record<TripleStatus, string> = {
	same: '',
	'trigger-added': 'bg-warning/20 text-warning-content rounded-sm',
	'trigger-removed': 'text-warning line-through decoration-warning',
	'ai-added': 'bg-success/15 text-success rounded-sm',
	'ai-removed': 'bg-error/10 text-error line-through decoration-error'
};

/** Highlight classes for a word or block of the given attribution. */
export function statusClasses(status: TripleStatus): string {
	return STATUS_CLASSES[status];
}
