import type {
	PresenceUserMeta,
	RemotePresence,
	YjsConnectionState
} from '#lib/api/yjs/createPaperYjs.svelte';
import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';

export type SyncState = 'error' | 'loading' | 'synced' | 'syncing' | 'offline';

/** What the sync badge shows for the Y.js document's connection. */
export function syncBadgeState({
	connectionState,
	persistenceLoaded,
	wsSynced
}: {
	connectionState: YjsConnectionState;
	persistenceLoaded: boolean;
	wsSynced: boolean;
}): SyncState {
	if (connectionState === 'error') return 'error';
	if (!persistenceLoaded) return 'loading';
	if (wsSynced) return 'synced';
	return connectionState === 'disconnected' ? 'offline' : 'syncing';
}

/**
 * Who a co-editor is, as far as the viewer may know: participants by their
 * nation, team members by name for the team and anonymously for everyone else.
 */
export type PresenceIdentity =
	| { kind: 'person'; name: string }
	| { kind: 'participant'; name: string; meta: PresenceUserMeta }
	| { kind: 'team' };

function isParticipant(meta: PresenceUserMeta) {
	return meta.conferenceUserType === 'DELEGATE' || meta.conferenceUserType === 'NON_STATE_ACTOR';
}

function nationName(meta: PresenceUserMeta): string {
	const translated = meta.alpha3Code
		? getTranslatedCountryNameFromAlpha3Code(meta.alpha3Code)
		: null;
	return translated ?? meta.nationName ?? '?';
}

export function presenceIdentity({
	presence,
	viewerIsTeam
}: {
	presence: Pick<RemotePresence, 'user' | 'userMeta'>;
	viewerIsTeam: boolean;
}): PresenceIdentity {
	const meta = presence.userMeta;
	if (meta && isParticipant(meta)) return { kind: 'participant', name: nationName(meta), meta };
	if (!meta || viewerIsTeam) return { kind: 'person', name: presence.user.name || '?' };
	return { kind: 'team' };
}

/** Convert an ISO alpha-2 code to a flag emoji (e.g. "DE" → "🇩🇪"). */
export function toFlagEmoji(alpha2: string | null | undefined): string | null {
	if (alpha2?.length !== 2) return null;
	const base = 0x1f1e6 - 0x41;
	const upper = alpha2.toUpperCase();
	return String.fromCodePoint(base + upper.charCodeAt(0), base + upper.charCodeAt(1));
}

/** One remote presence per user (the same user in several tabs appears once). */
export function uniqueByUser<T extends { user: { id: string } }>(presences: readonly T[]): T[] {
	return presences.filter((p, i, arr) => arr.findIndex((q) => q.user.id === p.user.id) === i);
}
