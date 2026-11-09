import { GraphQLError } from 'graphql';
import { parseClauseFragment } from '@deutschemodelunitednations/munify-resolution-editor/res-markup';
import type {
	OperativeClause,
	Resolution
} from '@deutschemodelunitednations/munify-resolution-editor/schema';
import type { schema } from '#api/db/db';

type AmendmentRow = typeof schema.amendment.$inferSelect;
type AmendmentChange = Pick<
	AmendmentRow,
	'type' | 'targetClauseId' | 'newContent' | 'targetPosition'
>;

function parseFragmentOrThrow(text: string): OperativeClause {
	const result = parseClauseFragment(text);
	if (!result.valid) {
		throw new GraphQLError(`Invalid RES-Markup: ${result.errors.map((e) => e.code).join(', ')}`);
	}
	return result.clause;
}

function clamp(value: number, max: number) {
	return Math.max(0, Math.min(value, max));
}

type ClauseEdit = (operative: OperativeClause[], amendment: AmendmentChange) => boolean;

/** Each kind of amendment, applied to a copy of the operative clauses; false when it cannot be. */
const EDITS: Record<AmendmentChange['type'], ClauseEdit> = {
	DELETE: (operative, { targetClauseId }) => {
		if (!targetClauseId) return false;
		const kept = operative.filter((c) => c.id !== targetClauseId);
		operative.splice(0, operative.length, ...kept);
		return true;
	},
	ADD: (operative, { newContent, targetPosition }) => {
		if (!newContent) return false;
		const clause = parseFragmentOrThrow(newContent);
		operative.splice(clamp(targetPosition ?? operative.length, operative.length), 0, clause);
		return true;
	},
	ALTER_TEXT: (operative, { targetClauseId, newContent }) => {
		if (!targetClauseId || !newContent) return false;
		const fresh = parseFragmentOrThrow(newContent);
		const index = operative.findIndex((c) => c.id === targetClauseId);
		if (index < 0) return false;
		// Preserve clause id to keep cursors stable; replace blocks.
		operative[index] = { ...fresh, id: targetClauseId };
		return true;
	},
	ALTER_POSITION: (operative, { targetClauseId, targetPosition }) => {
		if (!targetClauseId || targetPosition == null) return false;
		const index = operative.findIndex((c) => c.id === targetClauseId);
		if (index < 0) return false;
		const [clause] = operative.splice(index, 1);
		operative.splice(clamp(targetPosition, operative.length), 0, clause);
		return true;
	}
};

/** The clause an ALTER_TEXT amendment replaces, as it read before, for the amendment's record. */
function replacedClause(current: Resolution, amendment: AmendmentChange) {
	if (amendment.type !== 'ALTER_TEXT' || !amendment.targetClauseId) return null;
	const old = current.operative.find((c) => c.id === amendment.targetClauseId);
	return old ? JSON.stringify(old) : null;
}

/**
 * What accepting the amendment makes of the resolution: the new text (null when the amendment
 * cannot apply, which leaves the text alone) and the replaced clause's old content.
 */
export function applyAmendment(current: Resolution, amendment: AmendmentChange) {
	const next: Resolution = JSON.parse(JSON.stringify(current));
	const oldContent = replacedClause(current, amendment);
	const applied = EDITS[amendment.type](next.operative, amendment);
	return { next: applied ? next : null, oldContent };
}

/** The status an accepted amendment gets. */
export function acceptedStatus(consensus: boolean | null | undefined) {
	return consensus ? ('CONSENSUS_ADOPTED' as const) : ('ACCEPTED' as const);
}

/** The amendment's optional targets, with what the caller left out as null. */
export function amendmentTargets(args: {
	targetClauseId?: string | null;
	targetOperativeIndex?: number | null;
	newContent?: string | null;
	targetPosition?: number | null;
}) {
	return {
		targetClauseId: args.targetClauseId ?? null,
		targetOperativeIndex: args.targetOperativeIndex ?? null,
		newContent: args.newContent ?? null,
		targetPosition: args.targetPosition ?? null
	};
}
