import type { PaperStatus } from './paperContext';

/**
 * What advancing to the next stage takes: the amendment phase asks about its
 * settings first, the voting phase also opens the first clause, and finalising
 * asks for confirmation.
 */
export type AdvanceAction =
	'none' | 'askAmendmentSettings' | 'startVoting' | 'confirmFinal' | 'advance';

const ADVANCE_ACTIONS: Partial<Record<PaperStatus, AdvanceAction>> = {
	AMENDMENT_PHASE: 'askAmendmentSettings',
	VOTING_PHASE: 'startVoting',
	FINAL: 'confirmFinal'
};

export function advanceAction(nextStatus: PaperStatus | undefined): AdvanceAction {
	if (!nextStatus) return 'none';
	return ADVANCE_ACTIONS[nextStatus] ?? 'advance';
}

/**
 * A lifecycle step's relation to the current stage: the next one advances,
 * earlier ones revert, the others are not interactive.
 */
export type StepKind = 'past' | 'current' | 'next' | 'future';

export function stepKind({ index, currentIdx }: { index: number; currentIdx: number }): StepKind {
	if (index < currentIdx) return 'past';
	if (index === currentIdx) return 'current';
	return index === currentIdx + 1 ? 'next' : 'future';
}

/**
 * The bubble of a step: the next stage shows the play icon in place of its
 * number, a revertable earlier one shows it on hover.
 */
export function stepBubble({
	kind,
	index,
	hovered
}: {
	kind: StepKind;
	index: number;
	hovered: boolean;
}) {
	if (kind === 'next' || (kind === 'past' && hovered)) return '▶';
	return String(index + 1);
}

type VoteMode = 'SHOW_OF_HANDS' | 'ROLL_CALL' | 'DEVICE_BASED';
type Majority = 'SIMPLE' | 'ABSOLUTE' | 'TWO_THIRDS';

/** The voting modal options that resume a committee's running vote. */
export function resumeVoteOptions({
	session,
	fallbackName
}: {
	session: {
		mode: string;
		voteName?: string | null;
		majority?: string | null;
		withAbstentions?: boolean | null;
	};
	fallbackName: string;
}) {
	return {
		voteType: session.mode as VoteMode,
		voteName: session.voteName ?? fallbackName,
		majority: (session.majority ?? 'ABSOLUTE') as Majority,
		withAbstentions: session.withAbstentions ?? true
	};
}
