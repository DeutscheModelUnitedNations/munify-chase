import { m } from '#lib/paraglide/messages';
import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';

interface AuthorRepresentation {
	name?: string | null;
	alpha3Code?: string | null;
}

export interface CommentAuthor<R extends AuthorRepresentation = AuthorRepresentation> {
	name?: string | null;
	userEmail?: string | null;
	conferenceUserType?: string | null;
	user?: {
		givenName?: string | null;
		familyName?: string | null;
		preferredUsername?: string | null;
	} | null;
	committeeMember?: { representation?: R | null } | null;
	conferenceMember?: { representation?: R | null } | null;
}

function participantName(rep: AuthorRepresentation | null): string {
	if (rep?.name) return rep.name;
	return (rep?.alpha3Code ? getTranslatedCountryNameFromAlpha3Code(rep.alpha3Code) : null) ?? '?';
}

/** The team member's own name, else their name from the provider, username or email. */
function teamMemberName(author: CommentAuthor): string {
	const oidcName =
		[author.user?.givenName, author.user?.familyName].filter(Boolean).join(' ').trim() || null;
	return author.name ?? oidcName ?? author.user?.preferredUsername ?? author.userEmail ?? '?';
}

/**
 * Who a comment shows as: delegates and NSAs by their delegation and flag;
 * team members by name to the team, and as "Team" to everybody else.
 */
export function commentAuthorDisplay<R extends AuthorRepresentation>({
	author,
	viewerIsTeam
}: {
	author: CommentAuthor<R> | null | undefined;
	viewerIsTeam: boolean;
}): { name: string; representation: R | null } {
	if (!author) return { name: '?', representation: null };
	const type = author.conferenceUserType;
	if (type === 'DELEGATE' || type === 'NON_STATE_ACTOR') {
		const representation =
			author.committeeMember?.representation ?? author.conferenceMember?.representation ?? null;
		return { name: participantName(representation), representation };
	}
	return { name: viewerIsTeam ? teamMemberName(author) : m.roleTeam(), representation: null };
}

/** The `createResolutionComment` arguments; team-only only where the author may post that. */
export function newCommentArgs({
	id,
	paperId,
	content,
	clauseId,
	replyTo,
	teamOnly
}: {
	id: string;
	paperId: string;
	content: string;
	clauseId: string | null;
	replyTo: string | null;
	teamOnly: boolean;
}) {
	return {
		id,
		paperId,
		content,
		clauseId: clauseId ?? undefined,
		parentCommentId: replyTo ?? undefined,
		visibility: teamOnly ? ('TEAM_ONLY' as const) : ('PUBLIC' as const)
	};
}

/** Enter sends a non-empty draft, Shift+Enter breaks the line. */
export function sendsOnKey({
	key,
	shiftKey,
	sending,
	draft
}: {
	key: string;
	shiftKey: boolean;
	sending: boolean;
	draft: string;
}): boolean {
	return key === 'Enter' && !shiftKey && !sending && draft.trim() !== '';
}
