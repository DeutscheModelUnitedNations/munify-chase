/** Helpers both the chairs' and the participants' resolution lists use. */
import { m } from '#lib/paraglide/messages';
import { errorMessage } from '#lib/helpers/errorMessage';
import { workingPaperName } from '#lib/helpers/paperName';
import type { PaperStatus } from '#lib/components/resolutions/paperContext';
import { seatRepresentation } from './selections';

/** What a paper list reads of each paper. */
export const paperListSelection = {
	id: true,
	title: true,
	status: true,
	documentNumber: true,
	creatorCommitteeMember: { id: true, representation: seatRepresentation },
	sponsors: { id: true }
} as const;

type PaperNames = { id: string; title?: string | null; documentNumber?: string | null };

/** A paper by its title, else the name made from its id. */
export function paperTitle(paper: PaperNames) {
	return paper.title || workingPaperName(paper.id);
}

/** A published paper goes by its document number first. */
export function paperLabel(paper: PaperNames) {
	return paper.documentNumber || paperTitle(paper);
}

/**
 * Creates a paper on the active agenda item and opens it. Without an active agenda item,
 * or when creating fails, it reports why instead.
 */
export async function createPaperAndOpen({
	agendaItemId,
	create,
	open,
	setCreating,
	onError
}: {
	agendaItemId: string | null | undefined;
	create: (agendaItemId: string) => Promise<{ id: string } | null | undefined>;
	open: (paperId: string) => Promise<unknown>;
	setCreating: (creating: boolean) => void;
	onError: (message: string) => void;
}) {
	if (!agendaItemId) {
		onError(m.selectActiveAgendaItemFirst());
		return;
	}
	setCreating(true);
	try {
		const created = await create(agendaItemId);
		if (created) await open(created.id);
	} catch (err) {
		onError(errorMessage(err, 'Failed to create paper'));
	} finally {
		setCreating(false);
	}
}

const PUBLISHED: readonly string[] = [
	'DRAFT_RESOLUTION',
	'AMENDMENT_PHASE',
	'VOTING_PHASE',
	'FINAL'
] satisfies PaperStatus[];

type ListedPaper = {
	status: string;
	creatorCommitteeMember?: { id: string } | null;
	editors?: { conferenceUser?: { id: string } | null }[] | null;
};

/** The participants' list in its three parts: their own working papers, submitted, published. */
export function participantPaperGroups<P extends ListedPaper>({
	papers,
	myMemberId,
	myConferenceUserId
}: {
	papers: readonly P[] | null | undefined;
	myMemberId: string | null;
	myConferenceUserId: string;
}) {
	const isMine = (p: P) =>
		(!!myMemberId && p.creatorCommitteeMember?.id === myMemberId) ||
		(p.editors ?? []).some((e) => e.conferenceUser?.id === myConferenceUserId);
	const all = papers ?? [];
	return {
		mine: all.filter((p) => p.status === 'WORKING_PAPER' && isMine(p)),
		submitted: all.filter((p) => p.status === 'SUBMITTED'),
		published: all.filter((p) => PUBLISHED.includes(p.status))
	};
}

/** The chairs' list: the active agenda item's papers in a status, most sponsors first. */
export function chairPaperList<
	P extends { status: string; agendaItem?: { id: string } | null; sponsors?: unknown[] | null }
>({
	papers,
	activeAgendaItemId,
	status
}: {
	papers: readonly P[] | null | undefined;
	activeAgendaItemId: string | null | undefined;
	status: string;
}) {
	return (papers ?? [])
		.filter((p) => !activeAgendaItemId || p.agendaItem?.id === activeAgendaItemId)
		.filter((p) => status === 'ALL' || p.status === status)
		.sort((a, b) => (b.sponsors?.length ?? 0) - (a.sponsors?.length ?? 0));
}
