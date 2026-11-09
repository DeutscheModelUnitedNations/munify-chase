import { serializeClause } from '@deutschemodelunitednations/munify-resolution-editor/res-markup';

type Maybe<T> = T | null | undefined;

export interface ReviewRepresentation {
	name: Maybe<string>;
	alpha2Code: Maybe<string>;
	alpha3Code: Maybe<string>;
	icon: Maybe<string>;
	type: Maybe<string>;
}

/** An amendment as the review steps show it: what it changes and who proposed it. */
export interface ReviewAmendment {
	id: string;
	documentNumber: Maybe<string>;
	type: Maybe<string>;
	newContent: Maybe<string>;
	oldContent: Maybe<string>;
	targetOperativeIndex: Maybe<number>;
	proposer: Maybe<{ id: string; representation: Maybe<ReviewRepresentation> }>;
	sponsors: Maybe<Array<{ id: string }>>;
}

/** A sibling amendment to review after `triggerAmendment` was accepted. */
export interface ReviewItem {
	id: string;
	phase: Maybe<string>;
	aiObsolete: Maybe<boolean>;
	aiRewriteSuggestion: Maybe<string>;
	triggerAmendment: Maybe<ReviewAmendment>;
	subjectAmendment: Maybe<ReviewAmendment & { status: Maybe<string> }>;
}

/** The clause text before the trigger was applied, as RES-Markup, if it can be read. */
export function parseOldMarkup(raw: Maybe<string>): string | undefined {
	if (!raw) return undefined;
	try {
		return serializeClause(JSON.parse(raw));
	} catch {
		return undefined;
	}
}

/** English label of an amendment type, for the review steps. */
export function reviewTypeLabel(type: Maybe<string>): string {
	if (type === 'ALTER_TEXT') return 'Alter text';
	if (type === 'DELETE') return 'Delete';
	if (type === 'ADD') return 'Add';
	if (type === 'ALTER_POSITION') return 'Move';
	return type ?? '';
}

/** The badge of the AI's obsolescence verdict, null while there is none. */
export function obsoleteBadge(obsolete: Maybe<boolean>) {
	if (obsolete == null) return null;
	if (obsolete) return { label: 'Possibly obsolete', cls: 'badge-warning' };
	return { label: 'No issue', cls: 'badge-success' };
}

/** What the AI is told about the accepted amendment. */
export function triggerInput({ trigger, item }: { trigger: ReviewAmendment; item: ReviewItem }) {
	return {
		id: trigger.id,
		documentNumber: trigger.documentNumber,
		newContent: trigger.newContent,
		targetOperativeIndex: trigger.targetOperativeIndex,
		oldContent: item.triggerAmendment?.oldContent
	};
}

/**
 * What the AI is told about the amendment under review. The rewrite leaves its
 * old text out, so it compares against the trigger's baseline.
 */
export function subjectInput({
	item,
	withOldContent
}: {
	item: ReviewItem;
	withOldContent: boolean;
}) {
	const subject = item.subjectAmendment;
	return {
		id: item.id,
		documentNumber: subject?.documentNumber,
		newContent: subject?.newContent,
		...(withOldContent ? { oldContent: subject?.oldContent } : {}),
		targetOperativeIndex: subject?.targetOperativeIndex
	};
}

export type AiTask = { type: 'obsolescence' | 'rewrite'; item: ReviewItem };

/**
 * The AI tasks not queued yet, in display order: obsolescence checks for
 * items without a verdict, rewrites for items without a suggestion.
 */
export function newAiTasks({
	obsolescenceItems,
	rewriteItems,
	startedObsolescence,
	startedRewrite
}: {
	obsolescenceItems: readonly ReviewItem[];
	rewriteItems: readonly ReviewItem[];
	startedObsolescence: ReadonlySet<string>;
	startedRewrite: ReadonlySet<string>;
}): AiTask[] {
	const obsolescence = obsolescenceItems.filter(
		(i) => i.aiObsolete == null && !startedObsolescence.has(i.id)
	);
	const rewrite = rewriteItems.filter(
		(i) => i.aiRewriteSuggestion === null && !startedRewrite.has(i.id)
	);
	return [
		...obsolescence.map((item) => ({ type: 'obsolescence' as const, item })),
		...rewrite.map((item) => ({ type: 'rewrite' as const, item }))
	];
}

/** The text a chair commits for an item: their edit, else the proposed text. */
export function editedContent({ edit, item }: { edit: Maybe<string>; item: ReviewItem }): string {
	return edit ?? item.subjectAmendment?.newContent ?? '';
}

/**
 * The manual edit of a rewrite item: what the editor starts with (the AI's
 * suggestion, else the proposed text), what it holds now, and whether it
 * changed.
 */
export function rewriteDraft({
	aiSuggestion,
	original,
	edit
}: {
	aiSuggestion: string;
	original: string;
	edit: Maybe<string>;
}) {
	const initial = aiSuggestion || original;
	const current = edit ?? initial;
	return { initial, current, unchanged: current === initial };
}
