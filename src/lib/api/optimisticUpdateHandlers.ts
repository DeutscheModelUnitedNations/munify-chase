import { gql } from '@urql/core';
import type {
	Cache,
	FieldArgs,
	OptimisticMutationConfig,
	UpdatesConfig
} from '@urql/exchange-graphcache';
import { nanoid } from '#lib/helpers/nanoid';
import { getServerTime } from '#lib/state/serverClock.svelte';
import { calculateMajority } from '#lib/utils/majorities';
import { compareSpeakers } from '#lib/helpers/speakerSort';

// Optimistic / updates handlers that mirror the server resolvers in src/api/handlers.
// The goal is to keep the cache aligned with what the server will eventually return so
// the UI updates instantly and the app stays usable while a mutation is in flight or
// the network is unavailable. Where mutations accept a client-provided `id`, callers
// SHOULD pass one (via `nanoid()`) so the optimistic entity key matches the eventual
// server key one-for-one and no entity flicker happens when the real result lands.

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Entity = { __typename: string; id: string };

/** Add an entity reference to every variant (per-arguments) of a list field on a parent. */
function addToList(cache: Cache, parent: Entity, fieldName: string, child: Entity) {
	const childKey = cache.keyOfEntity(child);
	if (!childKey) return;
	const fields = cache.inspectFields(parent).filter((f) => f.fieldName === fieldName);
	if (fields.length === 0) {
		cache.link(parent, fieldName, [child]);
		return;
	}
	for (const f of fields) {
		const current = cache.resolve(parent, fieldName, f.arguments) as string[] | null | undefined;
		if (!Array.isArray(current)) continue;
		if (current.includes(childKey)) continue;
		cache.link(parent, fieldName, f.arguments, [...current, childKey]);
	}
}

type Parent = Entity | 'Query' | 'Subscription';

/** Every cached variant of a list field on a parent, with the keys it holds */
function listVariants(cache: Cache, parent: Parent, fieldName: string) {
	return cache
		.inspectFields(parent)
		.filter((f) => f.fieldName === fieldName)
		.flatMap((f) => {
			const keys = cache.resolve(parent, fieldName, f.arguments);
			return Array.isArray(keys) ? [{ args: f.arguments, keys: keys as string[] }] : [];
		});
}

/** Remove an entity reference from every variant of a list field on a parent. */
function removeFromList(cache: Cache, parent: Parent, fieldName: string, childKey: string) {
	for (const { args, keys } of listVariants(cache, parent, fieldName)) {
		const next = keys.filter((k) => k !== childKey);
		if (next.length !== keys.length) cache.link(parent, fieldName, args, next);
	}
}

/** A member's representation, as speaker entries and sponsors show it */
const REPRESENTATION_FIELDS = `
	representation {
		id
		name
		alpha2Code
		alpha3Code
		icon
		type
	}
`;

type WhereArgs = { where?: { paper?: { id?: string }; amendment?: { id?: string } } } | null;
const wherePaperId = (args: FieldArgs) => (args as WhereArgs)?.where?.paper?.id;
const whereAmendmentId = (args: FieldArgs) => (args as WhereArgs)?.where?.amendment?.id;

/**
 * Appends `key` to every root list `fieldName` whose arguments `matches` accepts, so lists a
 * page queries directly (liveQuery reads both Query and Subscription) update immediately.
 */
function appendToRootLists({
	cache,
	rootTypes = ['Query'],
	fieldName,
	matches,
	key
}: {
	cache: Cache;
	rootTypes?: ('Query' | 'Subscription')[];
	fieldName: string;
	matches: (args: FieldArgs) => boolean;
	key: string;
}) {
	for (const root of rootTypes) {
		for (const { args, keys } of listVariants(cache, root, fieldName)) {
			if (matches(args) && !keys.includes(key)) cache.link(root, fieldName, args, [...keys, key]);
		}
	}
}

/** Keys of every `typename` entity a root Query field links to directly */
function rootEntityKeys(cache: Cache, typename: string): Set<string> {
	const prefix = `${typename}:`;
	const keys = new Set<string>();
	for (const f of cache.inspectFields('Query')) {
		const value = cache.resolve('Query', f.fieldName, f.arguments);
		for (const v of Array.isArray(value) ? value : [value]) {
			if (typeof v === 'string' && v.startsWith(prefix)) keys.add(v);
		}
	}
	return keys;
}

/** Ids of the `typename` entities among `keys`, other keys skipped */
function idsOfType(keys: Iterable<unknown>, typename: string): string[] {
	const prefix = `${typename}:`;
	return [...keys].flatMap((k) =>
		typeof k === 'string' && k.startsWith(prefix) ? [k.slice(prefix.length)] : []
	);
}

/** The given fields of a partial update's args, left-out and null ones skipped */
function nonNullFields(args: Record<string, unknown>, fields: readonly string[]) {
	return Object.fromEntries(
		fields.filter((field) => args[field] != null).map((field) => [field, args[field]])
	);
}

/** `{ __typename, id }`, or null without an id */
function refOrNull(__typename: string, id: unknown) {
	return id ? { __typename, id: id as string } : null;
}

/** The given fields of a partial update's args, left-out ones skipped */
function definedFields(args: Record<string, unknown>, fields: readonly string[]) {
	return Object.fromEntries(
		fields.filter((field) => args[field] !== undefined).map((field) => [field, args[field]])
	);
}

/** Every cached variant of the args-filtered Query.requests, see the request updates */
function invalidateRequestLists(cache: Cache) {
	for (const f of cache.inspectFields('Query').filter((x) => x.fieldName === 'requests')) {
		cache.invalidate('Query', 'requests', f.arguments);
	}
}

/** Resolve a referenced entity key to a partial fragment, or null on cache miss. */
function readEntity<T extends Record<string, unknown>>(
	cache: Cache,
	fragment: Parameters<Cache['readFragment']>[0],
	entity: Entity
): T | null {
	return cache.readFragment(fragment, entity as Record<string, unknown>) as T | null;
}

// Local demo mode invokes an optimistic handler's id generation more than once for the
// same mutation call (once to build the optimistic entity, once from
// `withLocalDemoMutationCommits` to commit a "server" entity, and once more when shaping
// the fake mutation result in client.ts). Against a real backend this doesn't matter —
// the server issues the authoritative id and callers reconcile against it — but the local
// demo has no such authority, so all three call sites must agree on one id. They're NOT
// guaranteed to receive the exact same `args` object reference (urql/graphcache/crosstab-sync
// clone operation.variables at some hops), so memoize by a value-based key (JSON of the args)
// rather than object identity. A short TTL bounds the (rare) risk of two genuinely distinct
// mutation calls with byte-identical args colliding into the same id.
const ENSURE_ID_TTL_MS = 2000;
const ensuredIds = new Map<string, { id: string; expiresAt: number }>();
export function ensureId(args: unknown): string {
	const id = (args as Record<string, unknown> | undefined)?.id;
	if (typeof id === 'string' && id.length > 0) return id;
	if (!args || typeof args !== 'object') return nanoid();

	const now = Date.now();
	const key = JSON.stringify(args);
	const cached = ensuredIds.get(key);
	if (cached) {
		if (cached.expiresAt > now) return cached.id;
		ensuredIds.delete(key);
	}

	// Opportunistic sweep so the map can't grow unbounded over a long editing session —
	// every entry not read again within its TTL would otherwise sit here until the tab closes.
	for (const [k, v] of ensuredIds) {
		if (v.expiresAt <= now) ensuredIds.delete(k);
	}

	const generated = nanoid();
	ensuredIds.set(key, { id: generated, expiresAt: now + ENSURE_ID_TTL_MS });
	return generated;
}

// ---------------------------------------------------------------------------
// Committee "currently active session" fragments. Both modals (chair + popup)
// open iff the corresponding FK on the committee is non-null, so every start /
// complete optimistic update writes through these fragments to set/clear the
// reference.
// ---------------------------------------------------------------------------

const COMMITTEE_ACTIVE_ROLL_CALL_FRAGMENT = gql`
	fragment CommitteeActiveRollCall on Committee {
		id
		activeRollCallSessionId
		activeRollCallSession {
			id
		}
	}
`;

const COMMITTEE_ACTIVE_VOTING_FRAGMENT = gql`
	fragment CommitteeActiveVoting on Committee {
		id
		activeVotingSessionId
		activeVotingSession {
			id
		}
	}
`;

// Descriptive voting-session fields the chair's `startVotingSession` selection
// omits (it only carries the vote-tally fields it needs for its own UI) but the
// presentation popup reads. Written from the mutation args in `updates` so the
// offline / cross-tab cache has them — see updates.startVotingSession.
const VOTING_SESSION_DETAILS_FRAGMENT = gql`
	fragment StartVotingSessionDetails on Votingsession {
		id
		committeeId
		mode
		voteName
		majority
		withAbstentions
		deviceVotingStartedAt
		deviceVotingWindowSeconds
	}
`;

// ---------------------------------------------------------------------------
// Speakers list helpers
// ---------------------------------------------------------------------------

const SPEAKER_LIST_WITH_SPEAKERS = gql`
	fragment SpeakersListWithSpeakers on Speakerslist {
		id
		isClosed
		phase
		timeLeft
		startTimestamp
		agendaItem {
			id
			committee {
				id
				allowDelegationsToAddThemselvesToSpeakersList
				conferenceId
			}
		}
		speakers {
			id
			position
			committeeMemberId
			conferenceMemberId
		}
	}
`;

type SpeakerEntry = {
	id: string;
	position: number;
	committeeMemberId?: string | null;
	conferenceMemberId?: string | null;
};

type SpeakersListSnapshot = {
	id: string;
	isClosed?: boolean | null;
	phase?: string | null;
	timeLeft?: number | null;
	startTimestamp?: string | Date | null;
	agendaItem?: {
		id: string;
		committee?: {
			id: string;
			allowDelegationsToAddThemselvesToSpeakersList?: boolean | null;
			conferenceId?: string | null;
		} | null;
	} | null;
	speakers?: SpeakerEntry[] | null;
};

function readSpeakersList(cache: Cache, id: string): SpeakersListSnapshot | null {
	return readEntity<SpeakersListSnapshot>(cache, SPEAKER_LIST_WITH_SPEAKERS, {
		__typename: 'Speakerslist',
		id
	});
}

/**
 * Re-sequence a speakers array to a dense, collision-free 0..n-1 ordering,
 * sorting by current position then id (see compareSpeakers) and preserving every
 * other field on each entry.
 *
 * Every optimistic speaker write runs through this so the offline cache is
 * self-correcting: without a speakers-list subscription to repair drift, a
 * single position collision or gap (e.g. an append computed from list length
 * while the cached list is non-dense) would otherwise corrupt the sequence and
 * break every subsequent shift/move/remove calculation, which is exactly how the
 * offline ordering "stops reacting". Densifying mirrors the server's 0-based
 * dense scheme, so for an already-dense list it is a no-op (no cache churn).
 */
export function densifySpeakers<T extends { id: string; position: number }>(speakers: T[]): T[] {
	return [...speakers]
		.sort(compareSpeakers)
		.map((s, i) => (s.position === i ? s : { ...s, position: i }));
}

/**
 * Shared by optimistic.removeSpeakerOnList/selfRemoveFromSpeakersList AND their
 * updates.Mutation counterparts (see below) — computes the speakers list with
 * `removedId` filtered out and positions shifted, reading straight from cache so
 * it never depends on the mutation's own `result` (which local demo mode can't
 * shape correctly for this mutation — see the updates.Mutation entries).
 * Idempotent: if `removedId` is already absent (e.g. a repeat invocation for the
 * same logical call — see ensureId's doc comment above), returns the list as-is
 * instead of re-applying the position shift a second time.
 */
function removeSpeakerFromList(
	cache: Cache,
	speakersListId: string,
	removedId: string,
	removedPosition: number
): { id: string; speakers: SpeakerEntry[] } | null {
	const list = readEntity<{ id: string; speakers: SpeakerEntry[] }>(
		cache,
		ADD_SPEAKER_LIST_FRAGMENT,
		{ __typename: 'Speakerslist', id: speakersListId }
	);
	if (!list?.speakers) return null;

	const alreadyRemoved = !list.speakers.some((s) => s.id === removedId);
	const remaining = alreadyRemoved
		? list.speakers
		: list.speakers
				.filter((s) => s.id !== removedId)
				.map((s) => (s.position > removedPosition ? { ...s, position: s.position - 1 } : s));

	return { id: list.id, speakers: densifySpeakers(remaining) };
}

/**
 * Resolves the calling user's own entry on a speakers list — shared by
 * optimistic.selfRemoveFromSpeakersList and its updates.Mutation counterpart, so
 * both agree on exactly which entry "self" refers to.
 */
function findOwnSpeakerEntry(cache: Cache, speakersListId: string): SpeakerEntry | null {
	const list = readSpeakersList(cache, speakersListId);
	if (!list?.agendaItem?.committee) return null;
	const conferenceId = list.agendaItem.committee.conferenceId ?? null;
	const self = findSelfConferenceUser(cache, conferenceId);
	if (!self) return null;
	return (list.speakers ?? []).find((s) => isEntryOf(s, self)) ?? null;
}

/** A speakers list's entries as graphcache writes them, ids and positions only */
function speakerListData(list: { id: string; speakers: SpeakerEntry[] }) {
	return {
		__typename: 'Speakerslist',
		id: list.id,
		speakers: list.speakers.map((s) => ({
			__typename: 'Speakeronlist',
			id: s.id,
			position: s.position
		}))
	};
}

/** The list and position of a speaker entry */
function readSpeakerSource(cache: Cache, id: string) {
	return readEntity<{ id: string; speakersListId: string; position: number }>(
		cache,
		gql`
			fragment SpeakerSource on Speakeronlist {
				id
				speakersListId
				position
			}
		`,
		{ __typename: 'Speakeronlist', id }
	);
}

/** The entry's list without it, see removeSpeakerFromList */
function listWithoutSpeaker(cache: Cache, speakerOnListId: string) {
	const target = readSpeakerSource(cache, speakerOnListId);
	if (!target?.speakersListId) return null;
	return removeSpeakerFromList(cache, target.speakersListId, speakerOnListId, target.position);
}

/** The list without the caller's own entry, see findOwnSpeakerEntry */
function listWithoutOwnEntry(cache: Cache, speakersListId: string) {
	const own = findOwnSpeakerEntry(cache, speakersListId);
	return own && removeSpeakerFromList(cache, speakersListId, own.id, own.position);
}

type MemberIds = { committeeMemberId?: string | null; conferenceMemberId?: string | null };

/** Whether a speaker entry is for the member `ids` names */
function isEntryOf(entry: SpeakerEntry, ids: MemberIds) {
	const byCommitteeMember =
		!!ids.committeeMemberId && entry.committeeMemberId === ids.committeeMemberId;
	const byConferenceMember =
		!!ids.conferenceMemberId && entry.conferenceMemberId === ids.conferenceMemberId;
	return byCommitteeMember || byConferenceMember;
}

/** The member ids the caller adds themselves to `list` with, null where they may not */
function selfSpeakerIds(
	cache: Cache,
	list: SpeakersListSnapshot | null
): { committeeMemberId: string | null; conferenceMemberId: string | null } | null {
	const committee = list?.agendaItem?.committee;
	if (!committee?.allowDelegationsToAddThemselvesToSpeakersList || list?.isClosed) return null;
	const self = findSelfConferenceUser(cache, committee.conferenceId ?? null);
	if (self?.conferenceUserType === 'DELEGATE' && self.committeeMemberId) {
		return { committeeMemberId: self.committeeMemberId, conferenceMemberId: null };
	}
	if (self?.conferenceUserType === 'NON_STATE_ACTOR' && self.conferenceMemberId) {
		return { committeeMemberId: null, conferenceMemberId: self.conferenceMemberId };
	}
	return null;
}

/**
 * Inserts a new entry like the server does: every entry at or after an explicit
 * `position` shifts up by one, otherwise it is appended. Densifies, so the cache stays a
 * dense 0..n-1 sequence even when a prior offline edit left it drifted, and answers where
 * the entry landed.
 */
function insertSpeaker({
	cache,
	list,
	newId,
	memberIds,
	position: requested
}: {
	cache: Cache;
	list: { id: string; speakers: SpeakerEntry[] } | null;
	newId: string;
	memberIds: MemberIds;
	position: unknown;
}): number {
	const speakers = list?.speakers ?? [];
	const explicit = typeof requested === 'number' ? requested : null;
	const position = explicit ?? speakers.length;
	const shifted =
		explicit === null
			? speakers
			: speakers.map((s) => (s.position >= explicit ? { ...s, position: s.position + 1 } : s));
	const updatedSpeakers = densifySpeakers([
		...shifted,
		{ __typename: 'Speakeronlist', id: newId, position, ...memberIds }
	]);

	// Write the parent list with the recomputed positions so the cache sees the new
	// ordering immediately without waiting for `updates` to fire.
	if (list) {
		cache.writeFragment(SPEAKER_LIST_WITH_SPEAKERS, {
			__typename: 'Speakerslist',
			id: list.id,
			speakers: updatedSpeakers.map((s) => ({
				__typename: 'Speakeronlist',
				id: s.id,
				position: s.position,
				committeeMemberId: s.committeeMemberId ?? null,
				conferenceMemberId: s.conferenceMemberId ?? null
			}))
		} as unknown as Record<string, unknown>);
	}
	return updatedSpeakers.find((s) => s.id === newId)?.position ?? position;
}

const COMMITTEE_MEMBER_REPRESENTATION = gql`
	fragment SpeakerCommitteeMember on Committeemember {
		id
		${REPRESENTATION_FIELDS}
	}
`;

const CONFERENCE_MEMBER_REPRESENTATION = gql`
	fragment SpeakerConferenceMember on Conferencemember {
		id
		${REPRESENTATION_FIELDS}
	}
`;

/**
 * Writes a new speaker entry's member link explicitly. Callers typically request a minimal
 * mutation selection (id, position, speakersListId), so the member data a handler returns
 * would be dropped by graphcache's selection-set-aware write. Online, the speakers list
 * subscription quickly fills the gap; offline, the entry would render as "N/A" without a flag.
 */
function writeSpeakerMemberLink({
	cache,
	id,
	committeeMemberId,
	conferenceMemberId
}: { cache: Cache; id: string } & MemberIds) {
	const committeeMember = committeeMemberId
		? readEntity(cache, COMMITTEE_MEMBER_REPRESENTATION, {
				__typename: 'Committeemember',
				id: committeeMemberId
			})
		: null;
	const conferenceMember = conferenceMemberId
		? readEntity(cache, CONFERENCE_MEMBER_REPRESENTATION, {
				__typename: 'Conferencemember',
				id: conferenceMemberId
			})
		: null;
	cache.writeFragment(
		gql`
			fragment AddedSpeakerLink on Speakeronlist {
				id
				committeeMember {
					id
					${REPRESENTATION_FIELDS}
				}
				conferenceMember {
					id
					${REPRESENTATION_FIELDS}
				}
			}
		`,
		{
			__typename: 'Speakeronlist',
			id,
			committeeMember,
			conferenceMember
		} as unknown as Record<string, unknown>
	);
	return { committeeMember, conferenceMember };
}

const COMMITTEE_UPDATE_FIELDS = [
	'abbreviation',
	'activeAgendaItemId',
	'allowDelegationsToAddThemselvesToSpeakersList',
	'allowRequests',
	'displayRegionalGroups',
	'name',
	'presentationLayout',
	'presentationRootFontSize',
	'presentationResolutionFontSize',
	'presentationShowRequests',
	'showWhiteboard',
	'stateOfDebate',
	'status',
	'statusHeadline',
	'statusUntil',
	'whiteboardContent'
] as const;

// ---------------------------------------------------------------------------
// Optimistic mutations — mirrors src/api/handlers/*.ts
// ---------------------------------------------------------------------------

export const optimistic: OptimisticMutationConfig = {
	// -------------------------------------------------------------------------
	// agendaItem.ts
	// -------------------------------------------------------------------------
	createAgendaItem: (args) => {
		const id = ensureId(args);
		const speakersListId = (args.speakersListId as string | undefined) ?? nanoid();
		const commentListId = (args.commentListId as string | undefined) ?? nanoid();
		const agendaItem = { __typename: 'Agendaitem' as const, id };
		const baseSpeakersList = {
			agendaItemId: id,
			agendaItem,
			timeLeft: 0,
			startTimestamp: null,
			isClosed: false,
			phase: 'SPEECH' as const,
			speakers: [],
			createdAt: new Date(),
			updatedAt: null
		};
		return {
			__typename: 'Agendaitem',
			id,
			title: args.title as string,
			committeeId: args.committeeId as string,
			committee: { __typename: 'Committee', id: args.committeeId as string },
			isActive: false,
			speakersList: [
				{
					__typename: 'Speakerslist',
					id: speakersListId,
					type: 'SPEAKERS_LIST',
					speakingTime: 180,
					...baseSpeakersList
				},
				{
					__typename: 'Speakerslist',
					id: commentListId,
					type: 'COMMENT_LIST',
					speakingTime: 30,
					...baseSpeakersList
				}
			],
			createdAt: new Date(),
			updatedAt: null
		};
	},

	// -------------------------------------------------------------------------
	// committee.ts
	// -------------------------------------------------------------------------
	createCommittee: (args) => {
		const id = ensureId(args);
		return {
			__typename: 'Committee',
			id,
			name: args.name as string,
			abbreviation: args.abbreviation as string,
			conferenceId: args.conferenceId as string,
			conference: { __typename: 'Conference', id: args.conferenceId as string },
			whiteboardContent: '<p></p>',
			showWhiteboard: true,
			status: 'SUSPENSION',
			statusHeadline: '',
			statusUntil: new Date(),
			stateOfDebate: null,
			allowDelegationsToAddThemselvesToSpeakersList: false,
			allowRequests: false,
			activeAgendaItemId: null,
			activeAgendaItem: null,
			customSimpleMajority: null,
			customTwoThirdsMajority: null,
			presentationLayout: 'default',
			presentationRootFontSize: 16,
			presentationResolutionFontSize: 16,
			displayRegionalGroups: false,
			presentationShowRequests: true,
			simpleMajority: 0,
			twoThirdsMajority: 0,
			totalPresent: 0,
			members: [],
			agendaItems: [],
			presenceEvents: [],
			createdAt: new Date(),
			updatedAt: null
		};
	},
	updateCommittee: (args) => {
		const result: Record<string, unknown> = {
			__typename: 'Committee',
			id: args.id,
			...definedFields(args, COMMITTEE_UPDATE_FIELDS)
		};
		if (args.activeAgendaItemId !== undefined) {
			result.activeAgendaItem = refOrNull('Agendaitem', args.activeAgendaItemId);
		}
		return result;
	},
	deleteCommittee: () => true,
	setCommitteeResolutionToggles: (args) => ({
		__typename: 'Committee',
		id: args.committeeId,
		...definedFields(args, [
			'amendmentSubmissionOpen',
			'amendmentSponsoringOpen',
			'supportReevaluationOpen',
			'currentOperativeIndex'
		])
	}),

	setActiveAmendment: (args) => {
		const amendmentId = (args.amendmentId as string | null | undefined) ?? null;
		return {
			__typename: 'Committee',
			id: args.committeeId as string,
			activeAmendmentId: amendmentId,
			activeAmendment: amendmentId ? { __typename: 'Amendment', id: amendmentId } : null
		};
	},

	// -------------------------------------------------------------------------
	// committeeMember.ts
	// -------------------------------------------------------------------------
	createCommitteeMember: (args) => {
		const id = ensureId(args);
		return {
			__typename: 'Committeemember',
			id,
			committeeId: args.committeeId as string,
			committee: { __typename: 'Committee', id: args.committeeId as string },
			representationId: args.representationId as string,
			representation: { __typename: 'Representation', id: args.representationId as string },
			present: false,
			users: [],
			votingVotes: [],
			createdAt: new Date(),
			updatedAt: null
		};
	},
	deleteCommitteeMember: () => true,
	setPresenceForCommitteeMembers: (args, cache) => {
		const ids = args.ids as string[];
		const present = args.present as boolean;
		recomputeCommitteeMajoritiesForMembers(cache, ids, present);
		return ids.map((id) => ({
			__typename: 'Committeemember',
			id,
			present
		}));
	},

	// -------------------------------------------------------------------------
	// conference.ts
	// -------------------------------------------------------------------------
	updateConference: (args) => {
		const result: Record<string, unknown> = {
			__typename: 'Conference',
			id: args.id,
			...definedFields(args, [
				'title',
				'pressWebsite',
				'location',
				'startDate',
				'endDate',
				'hasModeratedCaucus'
			])
		};
		if (args.logoSvg !== undefined) {
			// An empty logo clears it, like on the server
			const blank = typeof args.logoSvg === 'string' && args.logoSvg.trim() === '';
			result.logoSvg = blank ? null : args.logoSvg;
		}
		return result;
	},
	deleteConference: () => true,

	// -------------------------------------------------------------------------
	// conferenceMember.ts
	// -------------------------------------------------------------------------
	createConferenceMember: (args) => {
		const id = ensureId(args);
		return {
			__typename: 'Conferencemember',
			id,
			conferenceId: args.conferenceId as string,
			conference: { __typename: 'Conference', id: args.conferenceId as string },
			representationId: args.representationId as string,
			representation: { __typename: 'Representation', id: args.representationId as string },
			createdAt: new Date(),
			updatedAt: null
		};
	},
	deleteConferenceMember: () => true,

	// -------------------------------------------------------------------------
	// conferenceUser.ts
	// -------------------------------------------------------------------------
	createConferenceUser: (args) => {
		const id = ensureId(args);
		const type = args.conferenceUserType as string;
		const name =
			typeof args.name === 'string' && args.name.trim().length > 0 ? args.name.trim() : null;
		return {
			__typename: 'Conferenceuser',
			id,
			conferenceId: args.conferenceId as string,
			conference: { __typename: 'Conference', id: args.conferenceId as string },
			userEmail: args.userEmail as string,
			name,
			conferenceUserType: type,
			cardNumber: 1,
			committeeMemberId: null,
			committeeMember: null,
			conferenceMemberId: null,
			conferenceMember: null,
			isCheckedIn: false,
			currentCommitteeId: null,
			currentCheckedInSince: null,
			user: null,
			presenceEvents: [],
			createdAt: new Date(),
			updatedAt: null
		};
	},
	updateConferenceUser: (args) => {
		const result: Record<string, unknown> = {
			__typename: 'Conferenceuser',
			id: args.id,
			conferenceUserType: args.conferenceUserType
		};

		if (args.name !== undefined && args.name !== null) {
			const trimmed = String(args.name).trim();
			result.name = trimmed.length > 0 ? trimmed : null;
		}

		// Mirror server auto-clear semantics for role transitions.
		const type = args.conferenceUserType as string;
		if (type !== 'DELEGATE') {
			result.committeeMemberId = null;
			result.committeeMember = null;
		} else if (args.committeeMemberId !== undefined) {
			result.committeeMemberId = args.committeeMemberId ?? null;
			result.committeeMember = args.committeeMemberId
				? { __typename: 'Committeemember', id: args.committeeMemberId as string }
				: null;
		}

		if (type !== 'NON_STATE_ACTOR') {
			result.conferenceMemberId = null;
			result.conferenceMember = null;
		} else if (args.conferenceMemberId !== undefined) {
			result.conferenceMemberId = args.conferenceMemberId ?? null;
			result.conferenceMember = args.conferenceMemberId
				? { __typename: 'Conferencemember', id: args.conferenceMemberId as string }
				: null;
		}

		return result;
	},
	deleteConferenceUser: () => true,

	// -------------------------------------------------------------------------
	// presenceEvent.ts
	// -------------------------------------------------------------------------
	recordNsaCheckIn: (args, cache) => optimisticNsaScan({ args, cache, checkIn: true }),
	recordNsaCheckOut: (args, cache) => optimisticNsaScan({ args, cache, checkIn: false }),
	insertPresenceEvent: (args, cache) => {
		const id = ensureId(args);
		const timestamp = (args.timestamp as Date | string | undefined) ?? getServerTime().toDate();
		const targetId = args.conferenceUserId as string;

		// Mirror derived fields when this becomes the user's latest event.
		const latest = readEntity<{
			timestamp?: string | Date | null;
		}>(
			cache,
			gql`
				fragment LatestPresenceEvent on Conferenceuser {
					id
				}
			`,
			{ __typename: 'Conferenceuser', id: targetId }
		);
		if (latest) {
			cache.writeFragment(
				gql`
					fragment ApplyInsertPresence on Conferenceuser {
						id
						isCheckedIn
						currentCommitteeId
						currentCheckedInSince
					}
				`,
				{
					__typename: 'Conferenceuser',
					id: targetId,
					isCheckedIn: !!args.present,
					currentCommitteeId: args.present ? (args.committeeId as string) : null,
					currentCheckedInSince: args.present ? new Date(timestamp as string | Date) : null
				}
			);
		}

		return {
			__typename: 'Presenceevent',
			id,
			conferenceUserId: targetId,
			conferenceUser: { __typename: 'Conferenceuser', id: targetId },
			committeeId: args.committeeId,
			committee: { __typename: 'Committee', id: args.committeeId as string },
			present: args.present,
			type: (args.markerType as string | undefined) ?? 'MANUAL',
			timestamp: new Date(timestamp as string | Date),
			note: (args.note as string | undefined) ?? null,
			rollCallSessionId: null,
			rollCallSession: null,
			triggeredBy: null
		};
	},
	updatePresenceEvent: (args) => {
		const result: Record<string, unknown> = {
			__typename: 'Presenceevent',
			id: args.id,
			...nonNullFields(args, ['present', 'committeeId'])
		};
		if (args.timestamp != null) result.timestamp = new Date(args.timestamp as string | Date);
		if (args.committeeId != null) {
			result.committee = { __typename: 'Committee', id: args.committeeId as string };
		}
		if (args.note !== undefined) result.note = args.note ?? null;
		return result;
	},
	deletePresenceEvent: (args, cache) => {
		// Return a placeholder for the deleted entity. The real removal from list fields
		// happens in `updates.Mutation.deletePresenceEvent`.
		const existing = readEntity<{
			id: string;
			conferenceUserId: string;
			committeeId: string;
			present: boolean;
			type: string;
			timestamp: Date | string;
			note: string | null;
		}>(
			cache,
			gql`
				fragment DeletePresenceEventSnapshot on Presenceevent {
					id
					conferenceUserId
					committeeId
					present
					type
					timestamp
					note
				}
			`,
			{ __typename: 'Presenceevent', id: args.id as string }
		);
		return {
			__typename: 'Presenceevent',
			id: args.id,
			conferenceUserId: existing?.conferenceUserId ?? 'unknown',
			committeeId: existing?.committeeId ?? 'unknown',
			present: existing?.present ?? false,
			type: existing?.type ?? 'MANUAL',
			timestamp: existing?.timestamp ? new Date(existing.timestamp) : getServerTime().toDate(),
			note: existing?.note ?? null,
			rollCallSessionId: null,
			rollCallSession: null,
			triggeredBy: null,
			conferenceUser: { __typename: 'Conferenceuser', id: existing?.conferenceUserId ?? 'unknown' },
			committee: { __typename: 'Committee', id: existing?.committeeId ?? 'unknown' }
		};
	},

	// -------------------------------------------------------------------------
	// representation.ts
	// -------------------------------------------------------------------------
	createRepresentation: (args) => {
		const id = ensureId(args);
		return {
			__typename: 'Representation',
			id,
			conferenceId: args.conferenceId as string,
			conference: { __typename: 'Conference', id: args.conferenceId as string },
			type: args.type,
			name: (args.name as string | undefined) ?? null,
			alpha2Code: (args.alpha2Code as string | undefined) ?? null,
			alpha3Code: (args.alpha3Code as string | undefined) ?? null,
			icon: (args.icon as string | undefined) ?? null,
			regionalGroup: null,
			committeeMembers: [],
			conferenceMembers: [],
			createdAt: new Date(),
			updatedAt: null
		};
	},
	deleteRepresentation: () => true,

	// -------------------------------------------------------------------------
	// rollCallSession.ts
	// -------------------------------------------------------------------------
	startRollCallSession: (args) => {
		// `committee.activeRollCallSessionId` is the single source of truth for "is a
		// roll call open?" (see schema.ts) — the chair-side `id` arg lets the optimistic
		// entity key match the eventual server insert, and the matching cache write
		// of `committee.activeRollCallSession` happens in `updates` below so the
		// presentation popup's modal opens immediately. We don't fall back to a
		// findActive lookup any more; the chair passes its current FK as `id` when
		// resuming, and a fresh start always supplies a fresh nanoid.
		const id = ensureId(args);
		return {
			__typename: 'Rollcallsession',
			id,
			committeeId: args.committeeId as string,
			committee: { __typename: 'Committee', id: args.committeeId as string },
			startedByConferenceUserId: null,
			startedBy: null,
			currentMemberIndex: 0,
			completedAt: null,
			presenceEvents: [],
			createdAt: new Date(),
			updatedAt: null
		};
	},
	setRollCallSessionIndex: (args) => ({
		__typename: 'Rollcallsession',
		id: args.id,
		currentMemberIndex: args.currentMemberIndex
	}),
	completeRollCallSession: () => true,

	// -------------------------------------------------------------------------
	// resolutionPaper.ts
	// -------------------------------------------------------------------------
	createResolutionPaper: (args) => {
		const id = ensureId(args);
		return {
			__typename: 'Resolutionpaper',
			id,
			committeeId: args.committeeId as string,
			committee: { __typename: 'Committee', id: args.committeeId as string },
			agendaItemId: args.agendaItemId as string,
			agendaItem: { __typename: 'Agendaitem', id: args.agendaItemId as string },
			creatorCommitteeMemberId: (args.creatorCommitteeMemberId as string | undefined) ?? null,
			creatorCommitteeMember: args.creatorCommitteeMemberId
				? { __typename: 'Committeemember', id: args.creatorCommitteeMemberId as string }
				: null,
			status: (args.status as string | undefined) ?? 'WORKING_PAPER',
			title: (args.title as string | undefined) ?? null,
			documentNumber: null,
			voteVotingSessionId: null,
			vote: null,
			sponsors: [],
			editors: [],
			shareCodes: [],
			comments: [],
			amendments: [],
			operativeClauseVotes: [],
			snapshots: [],
			createdAt: new Date(),
			updatedAt: null
		};
	},
	updateResolutionPaper: (args) => ({
		__typename: 'Resolutionpaper',
		id: args.id,
		...nonNullFields(args, ['title', 'status', 'documentNumber'])
	}),
	deleteResolutionPaper: () => true,
	concludeResolutionPaperVote: (args) => ({
		__typename: 'Resolutionpaper',
		id: args.paperId,
		status: 'FINAL',
		voteVotingSessionId: args.votingSessionId ?? null
	}),
	setActiveDraftResolution: (args) => {
		const paperId = (args.paperId as string | null | undefined) ?? null;
		return {
			__typename: 'Committee',
			id: args.committeeId as string,
			activeDraftResolutionId: paperId,
			activeDraftResolution: paperId ? { __typename: 'Resolutionpaper', id: paperId } : null
		};
	},

	// -------------------------------------------------------------------------
	// resolutionComment.ts
	// -------------------------------------------------------------------------
	createResolutionComment: (args) => {
		const id = ensureId(args);
		return {
			__typename: 'Resolutioncomment',
			id,
			paperId: args.paperId as string,
			paper: { __typename: 'Resolutionpaper', id: args.paperId as string },
			clauseId: (args.clauseId as string | undefined) ?? null,
			authorConferenceUserId: null,
			author: null,
			content: args.content as string,
			visibility: (args.visibility as string | undefined) ?? 'PUBLIC',
			parentCommentId: (args.parentCommentId as string | undefined) ?? null,
			parent: args.parentCommentId
				? { __typename: 'Resolutioncomment', id: args.parentCommentId as string }
				: null,
			replies: [],
			createdAt: new Date(),
			updatedAt: null
		};
	},
	updateResolutionComment: (args) => ({
		__typename: 'Resolutioncomment',
		id: args.id,
		content: args.content
	}),
	deleteResolutionComment: () => true,

	// -------------------------------------------------------------------------
	// amendment.ts
	// -------------------------------------------------------------------------
	createAmendment: (args, cache) => {
		const id = ensureId(args);
		const sponsorId = nanoid();
		const paperId = args.paperId as string;

		const proposerCommitteeMemberId = amendmentProposerId(args, cache);
		if (proposerCommitteeMemberId) {
			writeProposerSponsor({ cache, amendmentId: id, sponsorId, proposerCommitteeMemberId });
		}

		// Link the new amendment into any already-open amendments lists so the AmendmentList
		// updates immediately without waiting for the server subscription to fire.
		appendToRootLists({
			cache,
			rootTypes: ['Query', 'Subscription'],
			fieldName: 'amendments',
			matches: (fieldArgs) => wherePaperId(fieldArgs) === paperId,
			key: `Amendment:${id}`
		});

		return {
			__typename: 'Amendment',
			id,
			paperId,
			paper: { __typename: 'Resolutionpaper', id: paperId },
			proposerCommitteeMemberId,
			proposer: refOrNull('Committeemember', proposerCommitteeMemberId),
			...amendmentFieldsFromArgs(args),
			documentNumber: null,
			sponsors: proposerCommitteeMemberId
				? [{ __typename: 'Amendmentsponsor', id: sponsorId }]
				: [],
			createdAt: new Date(),
			updatedAt: null
		};
	},
	submitAmendment: (args) => ({
		__typename: 'Amendment',
		id: args.id,
		status: 'SUBMITTED'
	}),
	acceptAmendment: (args) => ({
		__typename: 'Amendment',
		id: args.id,
		// Mirror server: consensus flag selects the status variant
		status: args.consensus ? 'CONSENSUS_ADOPTED' : 'ACCEPTED'
	}),
	rejectAmendment: (args) => ({
		__typename: 'Amendment',
		id: args.id,
		status: 'REJECTED'
	}),
	deleteAmendment: () => true,

	// -------------------------------------------------------------------------
	// paperEditor.ts
	// -------------------------------------------------------------------------
	addPaperEditor: (args) => {
		const id = ensureId(args);
		return {
			__typename: 'Papereditor',
			id,
			paperId: args.paperId as string,
			paper: { __typename: 'Resolutionpaper', id: args.paperId as string },
			conferenceUserId: args.conferenceUserId as string,
			conferenceUser: { __typename: 'Conferenceuser', id: args.conferenceUserId as string },
			createdAt: new Date(),
			updatedAt: null
		};
	},
	removePaperEditor: () => true,

	// -------------------------------------------------------------------------
	// paperShareCode.ts — createPaperShareCode is skipped because the share
	// code string is generated server-side and cannot be predicted locally.
	// -------------------------------------------------------------------------
	deletePaperShareCode: () => true,

	// -------------------------------------------------------------------------
	// operativeClauseVote.ts
	// -------------------------------------------------------------------------
	linkOperativeClauseVote: (args) => {
		const id = ensureId(args);
		return {
			__typename: 'Operativeclausevote',
			id,
			paperId: args.paperId as string,
			paper: { __typename: 'Resolutionpaper', id: args.paperId as string },
			clauseId: args.clauseId as string,
			votingSessionId: args.votingSessionId as string,
			vote: { __typename: 'Votingsession', id: args.votingSessionId as string },
			createdAt: new Date(),
			updatedAt: null
		};
	},
	unlinkOperativeClauseVote: () => true,

	// -------------------------------------------------------------------------
	// speakerOnList.ts
	// -------------------------------------------------------------------------
	updateSpeakerOnList: (args) => ({
		__typename: 'Speakeronlist',
		id: args.id,
		overwriteName: args.overwriteName ?? null
	}),
	addSpeakerOnList: (args, cache) => {
		// Exactly one of the two member ids names the speaker
		if (!args.committeeMemberId === !args.conferenceMemberId) return null;

		// Use the minimal fragment — we only need id+position for ordering.
		const list = readEntity<{ id: string; speakers: SpeakerEntry[] }>(
			cache,
			ADD_SPEAKER_LIST_FRAGMENT,
			{ __typename: 'Speakerslist', id: args.speakersListId as string }
		);
		const newId = ensureId(args);
		const memberIds = {
			committeeMemberId: (args.committeeMemberId as string | undefined) ?? null,
			conferenceMemberId: (args.conferenceMemberId as string | undefined) ?? null
		};

		// Idempotency guard: this handler can run more than once for the same logical
		// call — withLocalDemoMutationCommits re-invokes it (with the same args, so the
		// same newId) to backfill the member link once local demo's "real" result lands
		// (see ensureId's doc comment above). Appending again would push the SAME speaker
		// into the list a second time — a duplicate entity key in the cache, which crashes
		// Svelte's keyed each block on render.
		const existing = (list?.speakers ?? []).find((s) => s.id === newId);
		const position =
			existing?.position ??
			insertSpeaker({ cache, list, newId, memberIds, position: args.position });

		return {
			__typename: 'Speakeronlist',
			id: newId,
			position,
			speakersListId: args.speakersListId,
			speakersList: { __typename: 'Speakerslist', id: args.speakersListId as string },
			overwriteName: null,
			...memberIds,
			...writeSpeakerMemberLink({ cache, id: newId, ...memberIds })
		};
	},
	removeSpeakerOnList: (args, cache) => {
		const updated = listWithoutSpeaker(cache, args.speakerOnListId as string);
		return updated && speakerListData(updated);
	},
	selfAddToSpeakersList: (args, cache) => {
		const list = readSpeakersList(cache, args.speakersListId as string);
		const memberIds = selfSpeakerIds(cache, list);
		if (!memberIds) return null;

		const speakers = list?.speakers ?? [];
		// Prevent duplicate self-adds.
		if (speakers.some((s) => isEntryOf(s, memberIds))) return null;

		const newId = ensureId(args);
		return {
			__typename: 'Speakeronlist',
			id: newId,
			position: speakers.length,
			speakersListId: args.speakersListId,
			speakersList: { __typename: 'Speakerslist', id: args.speakersListId as string },
			overwriteName: null,
			...memberIds,
			...writeSpeakerMemberLink({ cache, id: newId, ...memberIds })
		};
	},
	selfRemoveFromSpeakersList: (args, cache) => {
		const updated = listWithoutOwnEntry(cache, args.speakersListId as string);
		return updated && speakerListData(updated);
	},
	moveSpeakerToPosition: (args, cache) => {
		const target = readSpeakerSource(cache, args.id as string);
		if (!target?.speakersListId) return null;

		// Only need id and position for the reordering calculation — use a minimal
		// fragment so this works even if phase/agendaItem haven't been cached yet.
		const list = readEntity<{ id: string; speakers: SpeakerEntry[] }>(
			cache,
			ADD_SPEAKER_LIST_FRAGMENT,
			{ __typename: 'Speakerslist', id: target.speakersListId }
		);
		if (!list?.speakers) return null;

		const currentPos = target.position;
		// Clamp to the occupied range — never allow sparse gaps beyond the last entry.
		const maxPos = Math.max(...list.speakers.map((s) => s.position));
		const targetPos = Math.max(0, Math.min(maxPos, args.position as number));
		if (currentPos === targetPos) return null;

		const updatedSpeakers = list.speakers.map((s) => {
			if (s.id === args.id) return { ...s, position: targetPos };
			if (targetPos > currentPos) {
				if (s.position > currentPos && s.position <= targetPos)
					return { ...s, position: s.position - 1 };
			} else {
				if (s.position >= targetPos && s.position < currentPos)
					return { ...s, position: s.position + 1 };
			}
			return s;
		});

		// Write the reordered list directly — this ensures graphcache tracks the
		// dependency and re-runs the committee query immediately (the same pattern
		// used by addSpeakerOnList / removeSpeakerOnList).
		const densified = densifySpeakers(updatedSpeakers);
		cache.writeFragment(
			ADD_SPEAKER_LIST_FRAGMENT,
			speakerListData({ id: target.speakersListId, speakers: densified })
		);

		return {
			__typename: 'Speakeronlist',
			id: args.id,
			position: densified.find((s) => s.id === args.id)?.position ?? targetPos,
			speakersListId: target.speakersListId
		};
	},

	// -------------------------------------------------------------------------
	// speakersList.ts
	// -------------------------------------------------------------------------
	updateSpeakersList: (args, cache) => {
		// Snapshot the current list so we can mirror the server's derived calculations
		// for timeLeft (on stopTimer) and phase (auto-derivation).
		const current = readEntity<SpeakersListTimer>(
			cache,
			gql`
				fragment UpdateSpeakersListCurrent on Speakerslist {
					id
					phase
					timeLeft
					startTimestamp
				}
			`,
			{ __typename: 'Speakerslist', id: args.id as string }
		);
		const result: Record<string, unknown> = {
			__typename: 'Speakerslist',
			id: args.id,
			...nonNullFields(args, ['isClosed', 'speakingTime']),
			...speakersListTimerFields(args, current)
		};
		const phase = derivedSpeakersListPhase(args, current);
		if (phase !== undefined) result.phase = phase;
		return result;
	},
	clearSpeakersList: (args) => ({
		__typename: 'Speakerslist',
		id: args.id,
		speakers: []
	}),

	// -------------------------------------------------------------------------
	// votingSession.ts
	// -------------------------------------------------------------------------
	startVotingSession: (args) => {
		// Same reasoning as startRollCallSession: `committee.activeVotingSessionId`
		// is the source of truth, so anchor the optimistic entity key to the
		// caller-supplied id and let the `updates` handler write the FK on the
		// committee. The chair passes the current FK as `id` when resuming and a
		// fresh nanoid when starting; no need to scan the cache for an existing.
		const id = ensureId(args);
		const mode = args.mode as string;
		return {
			__typename: 'Votingsession',
			id,
			committeeId: args.committeeId as string,
			committee: { __typename: 'Committee', id: args.committeeId as string },
			startedByConferenceUserId: null,
			startedBy: null,
			mode,
			majority: args.majority,
			majorityAmount: args.majorityAmount,
			withAbstentions: args.withAbstentions,
			voteName: (args.voteName as string | undefined) ?? null,
			currentStage:
				(args.currentStage as string | null | undefined) ??
				(mode === 'SHOW_OF_HANDS' ? 'PRO' : null),
			votesPro: 0,
			votesCon: 0,
			votesAbstain: 0,
			currentMemberIndex: 0,
			completedAt: null,
			outcome: null,
			deviceVotingWindowSeconds:
				mode === 'DEVICE_BASED'
					? ((args.deviceVotingWindowSeconds as number | undefined) ?? 20)
					: null,
			deviceVotingStartedAt: mode === 'DEVICE_BASED' ? getServerTime().toDate() : null,
			votes: [],
			createdAt: new Date(),
			updatedAt: null
		};
	},
	updateVotingSession: (args) => ({
		__typename: 'Votingsession',
		id: args.id,
		...nonNullFields(args, [
			'currentStage',
			'votesPro',
			'votesCon',
			'votesAbstain',
			'currentMemberIndex'
		])
	}),
	completeVotingSession: (args) => {
		// Boolean return: we still apply the completion timestamp via the updates resolver
		// below, but graphcache requires a primitive here.
		void args;
		return true;
	},
	setVoteForMember: (args, cache) => upsertedVote(args, cache),
	// `committeeMemberId` here is a cache-only hint (see the handler comment in
	// votingSession.ts) — the server always resolves the caller's own seat itself.
	castDeviceVote: (args, cache) => upsertedVote(args, cache),

	// -------------------------------------------------------------------------
	// paperShareCode.ts / paperSponsor.ts / amendmentSponsor.ts /
	// amendmentReviewItem.ts / paperContentSnapshot.ts
	//
	// `updates` below already has full addToList/removeFromList/writeFragment logic
	// for most of these mutations (someone wired the sync half already) — it was
	// just never reachable because these mutations had no `optimistic` entry, so
	// graphcache never marked `context.optimistic`, so a network failure surfaced
	// as a hard error instead of being queued for retry on reconnect (see
	// client.ts). Returning `{ __typename, id, ...knownFields }` here for the
	// entity-returning mutations (mirroring exactly what each resolve() in the
	// matching handlers/*.ts writes) both fixes that gate AND — since `updates`
	// keys off `result.<mutationName>.id` — makes the entity appear in its list
	// immediately, same as the mutations that already had both halves wired.
	//
	// The four Boolean-returning mutations (redeemPaperShareCode,
	// removePaperSponsor, removeAmendmentSponsor, updateAmendmentReviewItem) have
	// no entity to attach fields to via this return value; their `updates`
	// handlers (removePaperSponsor/removeAmendmentSponsor) work off `args.id`
	// alone, and updateAmendmentReviewItem's writes fields straight from `args`
	// via `cache.writeFragment` — so `() => true` is all `optimistic` needs to
	// supply, matching the existing `completeRollCallSession`/`completeVotingSession`
	// precedent above.
	//
	// `importDelegatorConference` (import.ts) is deliberately NOT given a stub
	// despite `updates` already handling it defensively: it's an admin-only,
	// non-idempotent bulk conference import, not something that should silently
	// auto-retry unattended after a network drop.
	// -------------------------------------------------------------------------
	createPaperShareCode: (args) => {
		const id = ensureId(args);
		return {
			__typename: 'Papersharecode',
			id,
			paperId: args.paperId as string,
			paper: { __typename: 'Resolutionpaper', id: args.paperId as string },
			code: '',
			permission: args.permission,
			createdAt: new Date(),
			updatedAt: null
		};
	},
	redeemPaperShareCode: () => true,
	addPaperSponsor: (args) => {
		const id = ensureId(args);
		return {
			__typename: 'Papersponsor',
			id,
			paperId: args.paperId as string,
			paper: { __typename: 'Resolutionpaper', id: args.paperId as string },
			committeeMemberId: (args.committeeMemberId as string | null) ?? null,
			createdAt: new Date()
		};
	},
	removePaperSponsor: () => true,
	addAmendmentSponsor: (args) => {
		const id = ensureId(args);
		return {
			__typename: 'Amendmentsponsor',
			id,
			amendmentId: args.amendmentId as string,
			amendment: { __typename: 'Amendment', id: args.amendmentId as string },
			committeeMemberId: (args.committeeMemberId as string | null) ?? null,
			createdAt: new Date()
		};
	},
	removeAmendmentSponsor: () => true,
	updateAmendmentReviewItem: () => true,
	createManualSnapshot: (args) => {
		const id = ensureId(args);
		return {
			__typename: 'Papercontentsnapshot',
			id,
			paperId: args.paperId as string,
			paper: { __typename: 'Resolutionpaper', id: args.paperId as string },
			content: '',
			trigger: 'MANUAL',
			createdAt: new Date(),
			updatedAt: null
		};
	},
	// Backend returns the pre-existing, unmodified snapshot being restored FROM
	// (not the new backup snapshot it creates as a side effect) — its content/
	// trigger are real, already-cached, immutable data, so touch only `id`
	// (enough to gate the offline queue) and never overwrite those fields with
	// a guessed placeholder.
	restorePaperFromSnapshot: (args) => ({
		__typename: 'Papercontentsnapshot',
		id: args.snapshotId
	}),

	// -------------------------------------------------------------------------
	// requestType.ts
	// -------------------------------------------------------------------------
	createRequestType: (args) => {
		const id = ensureId(args);
		return {
			__typename: 'Requesttype',
			id,
			conferenceId: args.conferenceId as string,
			conference: { __typename: 'Conference', id: args.conferenceId as string },
			name: args.name as string,
			icon: (args.icon as string | undefined) ?? null,
			priority: 0,
			enabled: true,
			delegatesOnly: (args.delegatesOnly as boolean | undefined) ?? false,
			showOnPresentation: (args.showOnPresentation as boolean | undefined) ?? true,
			requests: [],
			createdAt: new Date(),
			updatedAt: null
		};
	},
	updateRequestType: (args) => ({
		__typename: 'Requesttype',
		id: args.id,
		...definedFields(args, [
			'name',
			'icon',
			'priority',
			'enabled',
			'delegatesOnly',
			'showOnPresentation'
		])
	}),
	deleteRequestType: () => true
};

// ---------------------------------------------------------------------------
// Cache-lookup helpers used by optimistic handlers
// ---------------------------------------------------------------------------

type SpeakersListTimer = {
	phase?: string | null;
	timeLeft?: number | null;
	startTimestamp?: string | Date | null;
};

/** The timer fields updateSpeakersList writes, computed the way the server does */
function speakersListTimerFields(
	args: Record<string, unknown>,
	current: SpeakersListTimer | null
): { timeLeft?: unknown; startTimestamp?: Date | null } {
	const timeLeft = args.timeLeft ?? undefined;
	if (!args.stopTimer) {
		// The timestamp from args (server time at the call site) anchors the optimistic timer
		// like the server's, so the display is accurate before the server confirms.
		const start = args.startTimestamp ?? undefined;
		return {
			...(timeLeft !== undefined && { timeLeft }),
			...(start !== undefined && { startTimestamp: new Date(start as string | Date) })
		};
	}
	if (timeLeft !== undefined) return { startTimestamp: null, timeLeft };
	if (!current?.startTimestamp || typeof current.timeLeft !== 'number') {
		return { startTimestamp: null };
	}
	// Remaining time on server time, consistent with the startTimestamp anchor
	const elapsedSec =
		(getServerTime().valueOf() - new Date(current.startTimestamp).getTime()) / 1000;
	return { startTimestamp: null, timeLeft: Math.round(current.timeLeft - elapsedSec) };
}

const PHASE_AFTER_STOP: Record<string, string> = { SPEECH: 'SPEECH_DONE', ANSWER: 'ANSWER_DONE' };
const PHASE_AFTER_START: Record<string, string> = { SPEECH_DONE: 'SPEECH', ANSWER_DONE: 'ANSWER' };

/** The phase updateSpeakersList moves to: an explicit one wins, else derived from the current */
function derivedSpeakersListPhase(
	args: Record<string, unknown>,
	current: SpeakersListTimer | null
): string | undefined {
	if (args.phase != null) return args.phase as string;
	if (!current?.phase) return undefined;
	if (args.stopTimer) return args.timeLeft != null ? 'SPEECH' : PHASE_AFTER_STOP[current.phase];
	if (args.startTimestamp != null) return PHASE_AFTER_START[current.phase];
	return undefined;
}

/**
 * A member's vote in a session. Mirrors the server's upsert: an existing vote for
 * (sessionId, committeeMemberId) keeps its id, so the same entity is updated instead of a
 * phantom created.
 */
function upsertedVote(args: Record<string, unknown>, cache: Cache) {
	const sessionId = args.sessionId as string;
	const committeeMemberId = args.committeeMemberId as string;
	return {
		__typename: 'Votingvote',
		id: findExistingVoteId(cache, sessionId, committeeMemberId) ?? ensureId(args),
		votingSessionId: sessionId,
		votingSession: { __typename: 'Votingsession', id: sessionId },
		committeeMemberId,
		committeeMember: { __typename: 'Committeemember', id: committeeMemberId },
		vote: args.vote,
		createdAt: new Date(),
		updatedAt: null
	};
}

/** The fields of a new amendment its creating mutation's args determine */
function amendmentFieldsFromArgs(args: Record<string, unknown>) {
	return {
		type: args.type as string,
		status: (args.status as string | undefined) ?? 'PENDING',
		targetClauseId: (args.targetClauseId as string | undefined) ?? null,
		targetOperativeIndex: (args.targetOperativeIndex as number | undefined) ?? null,
		newContent: (args.newContent as string | undefined) ?? null,
		targetPosition: (args.targetPosition as number | undefined) ?? null
	};
}

/**
 * Chairs supply the proposer via args; delegates resolve from the cached conferenceUser row
 * (see findSelfConferenceUser).
 */
function amendmentProposerId(args: Record<string, unknown>, cache: Cache): string | null {
	const given = args.proposerCommitteeMemberId as string | undefined;
	if (given) return given;
	const committeeId = cache.resolve(
		{ __typename: 'Resolutionpaper', id: args.paperId as string },
		'committeeId'
	) as string | null | undefined;
	if (!committeeId) return null;
	const conferenceId = cache.resolve({ __typename: 'Committee', id: committeeId }, 'conferenceId');
	const self = findSelfConferenceUser(cache, (conferenceId as string | null | undefined) ?? null);
	return self?.committeeMemberId ?? null;
}

/**
 * Mirrors the server's auto-sponsor: writes an Amendmentsponsor for the proposer so the
 * AmendmentList shows the correct sponsor count immediately, and links it into any
 * already-open Query.amendmentSponsors of the amendment.
 */
function writeProposerSponsor({
	cache,
	amendmentId,
	sponsorId,
	proposerCommitteeMemberId
}: {
	cache: Cache;
	amendmentId: string;
	sponsorId: string;
	proposerCommitteeMemberId: string;
}) {
	const proposerMember = readEntity(
		cache,
		gql`
			fragment CreateAmendmentProposer on Committeemember {
				id
				${REPRESENTATION_FIELDS}
			}
		`,
		{ __typename: 'Committeemember', id: proposerCommitteeMemberId }
	);
	cache.writeFragment(
		gql`
			fragment CreateAmendmentSponsorEntry on Amendmentsponsor {
				id
				amendmentId
				committeeMember {
					id
					${REPRESENTATION_FIELDS}
				}
			}
		`,
		{
			__typename: 'Amendmentsponsor',
			id: sponsorId,
			amendmentId,
			committeeMember: proposerMember
		} as Record<string, unknown>
	);
	const sponsorKey = cache.keyOfEntity({ __typename: 'Amendmentsponsor', id: sponsorId });
	if (!sponsorKey) return;
	appendToRootLists({
		cache,
		fieldName: 'amendmentSponsors',
		matches: (fieldArgs) => whereAmendmentId(fieldArgs) === amendmentId,
		key: sponsorKey
	});
}

/**
 * The NSA a check-in or check-out names, as the cache knows them. The scanner identifies the
 * person itself (a scanned code, verified offline, or a pick from the name search) and sends their
 * id along; the server checks the code again.
 */
/**
 * A chair's NSA scan, before the server answers. Best-effort: the NSA is looked up in the cache;
 * without them it is still a phantom event, which the real response reconciles. Checking in here
 * also covers the server checking them out of another committee first (AUTO_SWITCH).
 */
function optimisticNsaScan({
	args,
	cache,
	checkIn
}: {
	args: Record<string, unknown>;
	cache: Cache;
	checkIn: boolean;
}) {
	const id = ensureId(args);
	const now = getServerTime().toDate();
	const committeeId = args.committeeId as string;
	const target = nsaTargetInCache(cache, args.conferenceUserId);
	const conferenceUserId = target?.id ?? `pending-${id}`;
	if (target) {
		writeNsaPresence(
			checkIn
				? { cache, id: target.id, committeeId, since: now }
				: { cache, id: target.id, committeeId: null, since: null }
		);
	}
	return {
		__typename: 'Presenceevent',
		id,
		conferenceUserId,
		conferenceUser: { __typename: 'Conferenceuser', id: conferenceUserId },
		committeeId,
		committee: { __typename: 'Committee', id: committeeId },
		present: checkIn,
		type: 'NSA_SCAN',
		timestamp: now,
		note: null,
		rollCallSessionId: null,
		rollCallSession: null,
		triggeredBy: null
	};
}

/** An NSA's derived presence fields: checked into `committeeId` since `since`, or out (`null`). */
function writeNsaPresence({
	cache,
	id,
	committeeId,
	since
}: {
	cache: Cache;
	id: string;
	committeeId: string | null;
	since: Date | null;
}) {
	cache.writeFragment(
		gql`
			fragment NsaPresence on Conferenceuser {
				id
				isCheckedIn
				currentCommitteeId
				currentCheckedInSince
			}
		`,
		{
			__typename: 'Conferenceuser',
			id,
			isCheckedIn: committeeId !== null,
			currentCommitteeId: committeeId,
			currentCheckedInSince: since
		}
	);
}

function nsaTargetInCache(
	cache: Cache,
	conferenceUserId: unknown
): { id: string; isCheckedIn?: boolean; currentCommitteeId?: string | null } | null {
	if (typeof conferenceUserId !== 'string' || !conferenceUserId) return null;
	const data = readEntity<{
		id: string;
		isCheckedIn?: boolean;
		currentCommitteeId?: string | null;
	}>(
		cache,
		gql`
			fragment NsaTargetSnapshot on Conferenceuser {
				id
				isCheckedIn
				currentCommitteeId
			}
		`,
		{ __typename: 'Conferenceuser', id: conferenceUserId }
	);
	if (!data) return null;
	return {
		id: data.id,
		isCheckedIn: data.isCheckedIn,
		currentCommitteeId: data.currentCommitteeId ?? null
	};
}

/**
 * Optimistic recompute of Committee.totalPresent / simpleMajority / twoThirdsMajority
 * after a setPresenceForCommitteeMembers mutation. The server derives these from
 * `members.filter(m => m.present && m.representation.type === 'DELEGATION').length`,
 * so we mirror that here using the cached members list. Without this, the majority
 * cards show stale values while the mutation is in flight or queued offline.
 */
function recomputeCommitteeMajoritiesForMembers(
	cache: Cache,
	memberIds: string[],
	present: boolean
) {
	const affected = new Set(memberIds);
	for (const committeeId of committeesWithMembers(cache, memberIds)) {
		// Walks the member links by hand: readFragment returns null entirely if any requested
		// field is missing, and this has to work on pages that select a slim member shape.
		const memberKeys = committeeMemberKeys(cache, committeeId);
		if (memberKeys.size === 0) continue;

		const totalPresent = idsOfType(memberKeys, 'Committeemember').filter((id) => {
			if (memberRepresentationType(cache, id) !== 'DELEGATION') return false;
			if (affected.has(id)) return present;
			return !!cache.resolve({ __typename: 'Committeemember', id }, 'present');
		}).length;
		writeCommitteeMajorities({ cache, committeeId, totalPresent });
	}
}

/** Every key the cached variants of a committee's `members` hold */
function committeeMemberKeys(cache: Cache, committeeId: string): Set<string> {
	const variants = listVariants(cache, { __typename: 'Committee', id: committeeId }, 'members');
	return new Set(variants.flatMap(({ keys }) => keys.filter((k) => typeof k === 'string')));
}

/**
 * The committees whose `members` hold any of `memberIds`. `committeeId` is not in every page's
 * selection set, so committees are found through the root Query fields instead.
 */
function committeesWithMembers(cache: Cache, memberIds: string[]): string[] {
	const memberKeys = new Set(memberIds.map((id) => `Committeemember:${id}`));
	return idsOfType(rootEntityKeys(cache, 'Committee'), 'Committee').filter((committeeId) =>
		listVariants(cache, { __typename: 'Committee', id: committeeId }, 'members').some(({ keys }) =>
			keys.some((k) => memberKeys.has(k))
		)
	);
}

function memberRepresentationType(cache: Cache, memberId: string) {
	const representationKey = cache.resolve(
		{ __typename: 'Committeemember', id: memberId },
		'representation'
	);
	if (typeof representationKey !== 'string') return null;
	const repId = representationKey.startsWith('Representation:')
		? representationKey.slice('Representation:'.length)
		: representationKey;
	return cache.resolve({ __typename: 'Representation', id: repId }, 'type');
}

/** totalPresent and the majorities it gives, unless the committee sets its own */
function writeCommitteeMajorities({
	cache,
	committeeId,
	totalPresent
}: {
	cache: Cache;
	committeeId: string;
	totalPresent: number;
}) {
	const committee = { __typename: 'Committee', id: committeeId };
	const customSimple = cache.resolve(committee, 'customSimpleMajority');
	const customTwoThirds = cache.resolve(committee, 'customTwoThirdsMajority');
	cache.writeFragment(
		gql`
			fragment CommitteeMajorityWrite on Committee {
				id
				totalPresent
				simpleMajority
				twoThirdsMajority
			}
		`,
		{
			...committee,
			totalPresent,
			simpleMajority:
				typeof customSimple === 'number' ? customSimple : calculateMajority(totalPresent, 'simple'),
			twoThirdsMajority:
				typeof customTwoThirds === 'number'
					? customTwoThirds
					: calculateMajority(totalPresent, 'twoThirds')
		} as Record<string, unknown>
	);
}

function findExistingVoteId(
	cache: Cache,
	sessionId: string,
	committeeMemberId: string
): string | null {
	const votes = cache.resolve({ __typename: 'Votingsession', id: sessionId }, 'votes');
	if (!Array.isArray(votes)) return null;
	const existing = idsOfType(votes, 'Votingvote')
		.map((id) =>
			readEntity<{ id: string; committeeMemberId?: string }>(
				cache,
				gql`
					fragment ExistingVoteSnapshot on Votingvote {
						id
						committeeMemberId
					}
				`,
				{ __typename: 'Votingvote', id }
			)
		)
		.find((vote) => vote?.committeeMemberId === committeeMemberId);
	return existing?.id ?? null;
}

type SelfConferenceUser = {
	id: string;
	conferenceUserType: string;
	committeeMemberId?: string | null;
	conferenceMemberId?: string | null;
};

/**
 * The caller's own Conferenceuser in `conferenceId` (any conference without one), as a
 * DELEGATE or NON_STATE_ACTOR. Participants read only their own row's email, so the cached
 * row whose email is readable is the caller's.
 */
function findSelfConferenceUser(
	cache: Cache,
	conferenceId: string | null
): SelfConferenceUser | null {
	for (const id of idsOfType(rootEntityKeys(cache, 'Conferenceuser'), 'Conferenceuser')) {
		const data = readEntity<
			SelfConferenceUser & { conferenceId?: string; userEmail?: string | null }
		>(
			cache,
			gql`
				fragment SelfConferenceUserSnapshot on Conferenceuser {
					id
					conferenceId
					conferenceUserType
					committeeMemberId
					conferenceMemberId
					userEmail
				}
			`,
			{ __typename: 'Conferenceuser', id }
		);
		if (data && isOwnParticipantRow(data, conferenceId)) {
			return {
				id: data.id,
				conferenceUserType: data.conferenceUserType,
				committeeMemberId: data.committeeMemberId ?? null,
				conferenceMemberId: data.conferenceMemberId ?? null
			};
		}
	}
	return null;
}

function isOwnParticipantRow(
	row: { conferenceId?: string; conferenceUserType?: string; userEmail?: string | null },
	conferenceId: string | null
) {
	if (conferenceId && row.conferenceId !== conferenceId) return false;
	const participates = ['DELEGATE', 'NON_STATE_ACTOR'].includes(row.conferenceUserType ?? '');
	return participates && !!row.userEmail;
}

// ---------------------------------------------------------------------------
// updates — list-membership and link maintenance after mutations resolve
// ---------------------------------------------------------------------------

const ADD_SPEAKER_LIST_FRAGMENT = gql`
	fragment AddSpeakerUpdateList on Speakerslist {
		id
		speakers {
			id
			position
		}
	}
`;

/**
 * Links a confirmed new speaker into its list's `speakers` unless it is there already: at its
 * result's position, else at `explicit` (shifting the entries from there), else at the end.
 */
function appendSpeakerToList({
	cache,
	speakersListId,
	newSpeaker,
	explicit
}: {
	cache: Cache;
	speakersListId: unknown;
	newSpeaker: Record<string, unknown> | undefined;
	explicit: number | null;
}) {
	if (!newSpeaker?.id) return;
	const list = readEntity<{ speakers: SpeakerEntry[] }>(cache, ADD_SPEAKER_LIST_FRAGMENT, {
		__typename: 'Speakerslist',
		id: speakersListId as string
	});
	if (!list || list.speakers.some((s) => s.id === newSpeaker.id)) return;

	const position =
		typeof newSpeaker.position === 'number'
			? newSpeaker.position
			: (explicit ?? list.speakers.length);
	const shifted =
		explicit === null
			? list.speakers
			: list.speakers.map((s) => (s.position >= explicit ? { ...s, position: s.position + 1 } : s));
	cache.writeFragment(ADD_SPEAKER_LIST_FRAGMENT, {
		__typename: 'Speakerslist',
		id: speakersListId,
		speakers: densifySpeakers([
			...shifted,
			{ __typename: 'Speakeronlist', id: newSpeaker.id as string, position }
		])
	} as Record<string, unknown>);
}

/** Drops members of a deleted representation, detaching them from their parent lists */
function dropRepresentationMembers({
	cache,
	keys,
	typename,
	parentOf
}: {
	cache: Cache;
	keys: unknown;
	typename: 'Committeemember' | 'Conferencemember';
	parentOf: (member: Entity) => { parent: Entity; fieldName: string } | null;
}) {
	for (const id of idsOfType(Array.isArray(keys) ? keys : [], typename)) {
		const member = { __typename: typename, id };
		const parent = parentOf(member);
		if (parent) removeFromList(cache, parent.parent, parent.fieldName, `${typename}:${id}`);
		cache.invalidate(member);
	}
}

/**
 * Removes the paper's operative clause votes for `clauseId` (but `keepId`) from its lists
 * and the cache, so an upsert's stale entry is GC'd.
 */
function dropClauseVotes({
	cache,
	paperId,
	clauseId,
	keepId
}: {
	cache: Cache;
	paperId: string;
	clauseId: unknown;
	keepId?: string;
}) {
	const paper = { __typename: 'Resolutionpaper', id: paperId };
	for (const { keys } of listVariants(cache, paper, 'operativeClauseVotes')) {
		for (const id of idsOfType(keys, 'Operativeclausevote')) {
			const vote = { __typename: 'Operativeclausevote', id };
			if (id === keepId || cache.resolve(vote, 'clauseId') !== clauseId) continue;
			removeFromList(cache, paper, 'operativeClauseVotes', `Operativeclausevote:${id}`);
			cache.invalidate(vote);
		}
	}
}

export const updates: UpdatesConfig = {
	Mutation: {
		// ---------------------------------------------------------------
		// agendaItem
		// ---------------------------------------------------------------
		createAgendaItem: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).createAgendaItem;
			if (!created?.id) return;
			addToList(cache, { __typename: 'Committee', id: args.committeeId as string }, 'agendaItems', {
				__typename: 'Agendaitem',
				id: created.id as string
			});
		},

		// ---------------------------------------------------------------
		// committee
		// ---------------------------------------------------------------
		createCommittee: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).createCommittee;
			if (!created?.id) return;
			addToList(
				cache,
				{ __typename: 'Conference', id: args.conferenceId as string },
				'committees',
				{ __typename: 'Committee', id: created.id as string }
			);
		},
		deleteCommittee: (_result, args, cache) => {
			const committee = { __typename: 'Committee', id: args.id as string };
			const key = cache.keyOfEntity(committee);
			const conferenceId = cache.resolve(committee, 'conferenceId') as string | undefined;
			if (key && conferenceId) {
				removeFromList(cache, { __typename: 'Conference', id: conferenceId }, 'committees', key);
			}
			cache.invalidate(committee);
		},

		// ---------------------------------------------------------------
		// committeeMember
		// ---------------------------------------------------------------
		createCommitteeMember: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).createCommitteeMember;
			if (!created?.id) return;
			addToList(cache, { __typename: 'Committee', id: args.committeeId as string }, 'members', {
				__typename: 'Committeemember',
				id: created.id as string
			});
			addToList(
				cache,
				{ __typename: 'Representation', id: args.representationId as string },
				'committeeMembers',
				{ __typename: 'Committeemember', id: created.id as string }
			);
		},
		deleteCommitteeMember: (_result, args, cache) => {
			const member = { __typename: 'Committeemember', id: args.id as string };
			const key = cache.keyOfEntity(member);
			const committeeId = cache.resolve(member, 'committeeId') as string | undefined;
			const representationId = cache.resolve(member, 'representationId') as string | undefined;
			if (key) {
				if (committeeId) {
					removeFromList(cache, { __typename: 'Committee', id: committeeId }, 'members', key);
				}
				if (representationId) {
					removeFromList(
						cache,
						{ __typename: 'Representation', id: representationId },
						'committeeMembers',
						key
					);
				}
			}
			cache.invalidate(member);
		},
		setPresenceForCommitteeMembers: (_result, args, cache) => {
			// Closes the flicker window between optimistic rollback and the committee
			// subscription arrival: the mutation result only carries members, so the base
			// layer's Committee.totalPresent / simpleMajority / twoThirdsMajority briefly
			// snap back to their stale values once the optimistic layer is removed. Re-run
			// the same recompute against the now-updated base layer to keep them stable
			// until the subscription confirms (or replaces) the value.
			recomputeCommitteeMajoritiesForMembers(cache, args.ids as string[], args.present as boolean);
		},

		// ---------------------------------------------------------------
		// conferenceMember
		// ---------------------------------------------------------------
		createConferenceMember: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).createConferenceMember;
			if (!created?.id) return;
			addToList(cache, { __typename: 'Conference', id: args.conferenceId as string }, 'members', {
				__typename: 'Conferencemember',
				id: created.id as string
			});
			addToList(
				cache,
				{ __typename: 'Representation', id: args.representationId as string },
				'conferenceMembers',
				{ __typename: 'Conferencemember', id: created.id as string }
			);
		},
		deleteConferenceMember: (_result, args, cache) => {
			const member = { __typename: 'Conferencemember', id: args.id as string };
			const key = cache.keyOfEntity(member);
			const conferenceId = cache.resolve(member, 'conferenceId') as string | undefined;
			const representationId = cache.resolve(member, 'representationId') as string | undefined;
			if (key) {
				if (conferenceId) {
					removeFromList(cache, { __typename: 'Conference', id: conferenceId }, 'members', key);
				}
				if (representationId) {
					removeFromList(
						cache,
						{ __typename: 'Representation', id: representationId },
						'conferenceMembers',
						key
					);
				}
			}
			cache.invalidate(member);
		},

		// ---------------------------------------------------------------
		// conferenceUser
		// ---------------------------------------------------------------
		createConferenceUser: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).createConferenceUser;
			if (!created?.id) return;
			// The conference doesn't have a users list field today, but invalidating the
			// users-list query for this conference keeps any future top-level query honest.
			void cache;
			void args;
		},
		deleteConferenceUser: (_result, args, cache) => {
			cache.invalidate({ __typename: 'Conferenceuser', id: args.id as string });
		},

		// ---------------------------------------------------------------
		// conference
		// ---------------------------------------------------------------
		deleteConference: (_result, args, cache) => {
			// No parent list to detach from — conferences are top-level queries which
			// graphcache invalidates automatically when the entity is dropped.
			cache.invalidate({ __typename: 'Conference', id: args.id as string });
		},

		// ---------------------------------------------------------------
		// representation
		// ---------------------------------------------------------------
		createRepresentation: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).createRepresentation;
			if (!created?.id) return;
			addToList(
				cache,
				{ __typename: 'Conference', id: args.conferenceId as string },
				'representations',
				{ __typename: 'Representation', id: created.id as string }
			);
		},
		deleteRepresentation: (_result, args, cache) => {
			// Mirror the server's explicit cascade: drop committee/conference members that
			// pointed at this representation, detaching them from every parent list as we go.
			const rep = { __typename: 'Representation', id: args.id as string };
			const repKey = cache.keyOfEntity(rep);
			const conferenceId = cache.resolve(rep, 'conferenceId') as string | undefined;
			const conference = conferenceId ? { __typename: 'Conference', id: conferenceId } : null;
			if (repKey) {
				dropRepresentationMembers({
					cache,
					keys: cache.resolve(rep, 'committeeMembers'),
					typename: 'Committeemember',
					parentOf: (member) => {
						const committeeId = cache.resolve(member, 'committeeId') as string | undefined;
						return committeeId
							? { parent: { __typename: 'Committee', id: committeeId }, fieldName: 'members' }
							: null;
					}
				});
				dropRepresentationMembers({
					cache,
					keys: cache.resolve(rep, 'conferenceMembers'),
					typename: 'Conferencemember',
					parentOf: () => conference && { parent: conference, fieldName: 'members' }
				});
				if (conference) removeFromList(cache, conference, 'representations', repKey);
			}
			cache.invalidate(rep);
		},

		// ---------------------------------------------------------------
		// rollCallSession
		// ---------------------------------------------------------------
		startRollCallSession: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).startRollCallSession;
			if (!created?.id) return;
			// Single source of truth for "modal open?" — write the FK on the committee.
			// Every consumer (chair, presentation popup, presence page) reads this and
			// reacts; the previous list-based dance is no longer needed.
			cache.writeFragment(COMMITTEE_ACTIVE_ROLL_CALL_FRAGMENT, {
				__typename: 'Committee',
				id: args.committeeId as string,
				activeRollCallSessionId: created.id as string,
				activeRollCallSession: { __typename: 'Rollcallsession', id: created.id as string }
			} as Record<string, unknown>);
			// Record committeeId on the session itself so completeRollCallSession can
			// resolve which committee to clear without the close mutation needing to carry
			// it. The committee subscription covers the online single-device case; this
			// covers the cross-tab / offline path, where the close replays through `updates`
			// and no query ever selected rollCallSession.committeeId. Mirrors how `open`
			// already propagates via args.committeeId.
			cache.writeFragment(
				gql`
					fragment StartRollCallSessionCommittee on Rollcallsession {
						id
						committeeId
					}
				`,
				{
					__typename: 'Rollcallsession',
					id: created.id as string,
					committeeId: args.committeeId as string
				} as Record<string, unknown>
			);
		},
		completeRollCallSession: (_result, args, cache) => {
			// Stamp completion on the session row for history queries…
			cache.writeFragment(
				gql`
					fragment CompleteRollCallSession on Rollcallsession {
						id
						completedAt
					}
				`,
				{
					__typename: 'Rollcallsession',
					id: args.id as string,
					completedAt: getServerTime().toDate()
				} as Record<string, unknown>
			);
			// …and clear the committee's FK so every modal closes. Resolve the
			// committee id from the cached session so we don't need it in the args.
			const committeeId = cache.resolve(
				{ __typename: 'Rollcallsession', id: args.id as string },
				'committeeId'
			) as string | undefined | null;
			if (committeeId) {
				cache.writeFragment(COMMITTEE_ACTIVE_ROLL_CALL_FRAGMENT, {
					__typename: 'Committee',
					id: committeeId,
					activeRollCallSessionId: null,
					activeRollCallSession: null
				} as Record<string, unknown>);
			}
		},

		// ---------------------------------------------------------------
		// speakerOnList — server returns the parent list for remove/clear/self-remove,
		// the child entity for add/move/update. Add needs an explicit list link.
		// ---------------------------------------------------------------
		addSpeakerOnList: (result, args, cache) => {
			const newSpeaker = (result as Record<string, Record<string, unknown>>).addSpeakerOnList;
			// When an explicit position was used, shift existing entries to mirror the
			// server's unique(speakersListId, position) constraint resolution.
			const explicit = typeof args.position === 'number' ? (args.position as number) : null;
			appendSpeakerToList({ cache, speakersListId: args.speakersListId, newSpeaker, explicit });
		},
		selfAddToSpeakersList: (result, args, cache) => {
			const newSpeaker = (result as Record<string, Record<string, unknown>>).selfAddToSpeakersList;
			appendSpeakerToList({
				cache,
				speakersListId: args.speakersListId,
				newSpeaker,
				explicit: null
			});
		},
		// For a real backend, the mutation returns the updated parent Speakerslist
		// (speakers array already renumbered), so the automatic mutation-result write
		// alone used to be enough — no explicit handler needed. Local demo mode breaks
		// that assumption: its generic result echo only has the mutation's own args
		// (`{ speakerOnListId }`), with no `id`/`speakers` to normalize, so the echoed
		// "real" result targets a bogus entity and the removal never reaches the base
		// cache layer once the optimistic layer tears down — the removed speaker
		// silently reappears at the head of the queue. Recomputing from cache directly
		// (like addSpeakerOnList's handler already does) works for both cases and
		// doesn't depend on `result` at all. This does NOT call cache.invalidate() on the
		// removed entity — an earlier version did, to clean up the deleted Speakeronlist,
		// but that caused a double refcount-decrement (invalidate() nulled its
		// committeeMember link in the write layer, then gc() re-read the still-linked
		// BASE layer and decremented the committee member's refcount a second time,
		// briefly GC'ing a delegate that was still present elsewhere). Only rewriting the
		// parent's `speakers` link array avoids that; the removed entity itself is
		// naturally GC'd once nothing else references it.
		removeSpeakerOnList: (_result, args, cache) => {
			const updated = listWithoutSpeaker(cache, args.speakerOnListId as string);
			if (updated) cache.writeFragment(ADD_SPEAKER_LIST_FRAGMENT, speakerListData(updated));
		},
		selfRemoveFromSpeakersList: (_result, args, cache) => {
			const updated = listWithoutOwnEntry(cache, args.speakersListId as string);
			if (updated) cache.writeFragment(ADD_SPEAKER_LIST_FRAGMENT, speakerListData(updated));
		},

		// ---------------------------------------------------------------
		// votingSession
		// ---------------------------------------------------------------
		startVotingSession: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).startVotingSession;
			if (!created?.id) return;
			cache.writeFragment(COMMITTEE_ACTIVE_VOTING_FRAGMENT, {
				__typename: 'Committee',
				id: args.committeeId as string,
				activeVotingSessionId: created.id as string,
				activeVotingSession: { __typename: 'Votingsession', id: created.id as string }
			} as Record<string, unknown>);
			// The chair's startVotingSession selection only carries the vote-tally fields
			// it needs for its own UI, so the presentation popup — which gates its modal on
			// `activeVotingSession.mode` and also reads majority / withAbstentions / voteName
			// — would find those non-null fields missing from the cache offline (no network
			// round-trip to fill them) and never open. Backfill them from the mutation args,
			// which mirror the row the server inserts. `committeeId` is written here too so
			// completeVotingSession can resolve which committee FK to clear on the offline /
			// cross-tab close replay (mirrors startRollCallSession).
			cache.writeFragment(VOTING_SESSION_DETAILS_FRAGMENT, {
				__typename: 'Votingsession',
				id: created.id as string,
				committeeId: args.committeeId as string,
				mode: args.mode,
				voteName: (args.voteName as string | null | undefined) ?? null,
				majority: args.majority,
				withAbstentions: args.withAbstentions,
				// Use the server's own values here (this handler runs post-resolution, unlike
				// `optimistic` above) rather than guessing "now" — a resumed session's window
				// started earlier, and re-stamping it here would restart the countdown for
				// every client that (re)opens the chair modal or reconnects.
				deviceVotingStartedAt: created.deviceVotingStartedAt ?? null,
				deviceVotingWindowSeconds: created.deviceVotingWindowSeconds ?? null
			} as Record<string, unknown>);
		},
		completeVotingSession: (_result, args, cache) => {
			cache.writeFragment(
				gql`
					fragment CompleteVotingSession on Votingsession {
						id
						completedAt
						outcome
					}
				`,
				{
					__typename: 'Votingsession',
					id: args.id as string,
					completedAt: getServerTime().toDate(),
					outcome: (args.outcome as string | null | undefined) ?? null
				} as Record<string, unknown>
			);
			const committeeId = cache.resolve(
				{ __typename: 'Votingsession', id: args.id as string },
				'committeeId'
			) as string | undefined | null;
			if (committeeId) {
				cache.writeFragment(COMMITTEE_ACTIVE_VOTING_FRAGMENT, {
					__typename: 'Committee',
					id: committeeId,
					activeVotingSessionId: null,
					activeVotingSession: null
				} as Record<string, unknown>);
			}
		},
		setVoteForMember: (result, args, cache) => {
			const vote = (result as Record<string, Record<string, unknown>>).setVoteForMember;
			if (!vote?.id) return;
			// The server upserts one vote per member and session, returning the existing
			// row's id. A result under a fresh id (the offline demo echoes the client's id)
			// replaces the member's earlier vote instead of counting twice.
			const previousId = findExistingVoteId(
				cache,
				args.sessionId as string,
				args.committeeMemberId as string
			);
			if (previousId && previousId !== vote.id) {
				const previousKey = cache.keyOfEntity({ __typename: 'Votingvote', id: previousId });
				if (previousKey) {
					removeFromList(
						cache,
						{ __typename: 'Votingsession', id: args.sessionId as string },
						'votes',
						previousKey
					);
					removeFromList(
						cache,
						{ __typename: 'Committeemember', id: args.committeeMemberId as string },
						'votingVotes',
						previousKey
					);
				}
			}
			addToList(cache, { __typename: 'Votingsession', id: args.sessionId as string }, 'votes', {
				__typename: 'Votingvote',
				id: vote.id as string
			});
			addToList(
				cache,
				{ __typename: 'Committeemember', id: args.committeeMemberId as string },
				'votingVotes',
				{ __typename: 'Votingvote', id: vote.id as string }
			);
		},
		castDeviceVote: (result, args, cache) => {
			const vote = (result as Record<string, Record<string, unknown>>).castDeviceVote;
			if (!vote?.id) return;
			addToList(cache, { __typename: 'Votingsession', id: args.sessionId as string }, 'votes', {
				__typename: 'Votingvote',
				id: vote.id as string
			});
			// The real committeeMemberId only becomes known once the mutation resolves
			// (the server never trusts the client-supplied hint) — key the member-side
			// list off the confirmed result, not args.
			if (vote.committeeMemberId) {
				addToList(
					cache,
					{ __typename: 'Committeemember', id: vote.committeeMemberId as string },
					'votingVotes',
					{ __typename: 'Votingvote', id: vote.id as string }
				);
			}
		},

		// ---------------------------------------------------------------
		// presenceEvent
		// ---------------------------------------------------------------
		recordNsaCheckIn: (result, args, cache) => {
			const event = (result as Record<string, Record<string, unknown>>).recordNsaCheckIn;
			if (!event?.id) return;
			void args;
			void cache;
		},
		recordNsaCheckOut: (result, args, cache) => {
			const event = (result as Record<string, Record<string, unknown>>).recordNsaCheckOut;
			if (!event?.id) return;
			void args;
			void cache;
		},
		insertPresenceEvent: (result, args, cache) => {
			const event = (result as Record<string, Record<string, unknown>>).insertPresenceEvent;
			if (!event?.id) return;
			addToList(
				cache,
				{ __typename: 'Conferenceuser', id: args.conferenceUserId as string },
				'presenceEvents',
				{ __typename: 'Presenceevent', id: event.id as string }
			);
			addToList(
				cache,
				{ __typename: 'Committee', id: args.committeeId as string },
				'presenceEvents',
				{ __typename: 'Presenceevent', id: event.id as string }
			);
		},
		deletePresenceEvent: (result, _args, cache) => {
			const deleted = (result as Record<string, Record<string, unknown>>).deletePresenceEvent;
			if (!deleted?.id) return;
			const event = { __typename: 'Presenceevent', id: deleted.id as string };
			const key = cache.keyOfEntity(event);
			// The result's ids, else the cached event's
			const idOf = (field: string) =>
				(deleted[field] as string | undefined) ??
				(cache.resolve(event, field) as string | undefined);
			const conferenceUserId = idOf('conferenceUserId');
			const committeeId = idOf('committeeId');
			if (key && conferenceUserId) {
				removeFromList(
					cache,
					{ __typename: 'Conferenceuser', id: conferenceUserId },
					'presenceEvents',
					key
				);
			}
			if (key && committeeId) {
				removeFromList(cache, { __typename: 'Committee', id: committeeId }, 'presenceEvents', key);
			}
			cache.invalidate(event);
		},

		// ---------------------------------------------------------------
		// resolutionPaper
		// ---------------------------------------------------------------
		createResolutionPaper: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).createResolutionPaper;
			if (!created?.id) return;
			addToList(
				cache,
				{ __typename: 'Committee', id: args.committeeId as string },
				'resolutionPapers',
				{
					__typename: 'Resolutionpaper',
					id: created.id as string
				}
			);
		},
		deleteResolutionPaper: (_result, args, cache) => {
			const paper = { __typename: 'Resolutionpaper', id: args.id as string };
			const key = cache.keyOfEntity(paper);
			const committeeId = cache.resolve(paper, 'committeeId') as string | undefined;
			if (key && committeeId) {
				removeFromList(
					cache,
					{ __typename: 'Committee', id: committeeId },
					'resolutionPapers',
					key
				);
			}
			cache.invalidate(paper);
		},

		// ---------------------------------------------------------------
		// resolutionComment
		// ---------------------------------------------------------------
		createResolutionComment: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).createResolutionComment;
			if (!created?.id) return;
			const child = { __typename: 'Resolutioncomment', id: created.id as string };
			addToList(
				cache,
				{ __typename: 'Resolutionpaper', id: args.paperId as string },
				'comments',
				child
			);
			if (args.parentCommentId) {
				addToList(
					cache,
					{ __typename: 'Resolutioncomment', id: args.parentCommentId as string },
					'replies',
					child
				);
			}
		},
		deleteResolutionComment: (_result, args, cache) => {
			const comment = { __typename: 'Resolutioncomment', id: args.id as string };
			const key = cache.keyOfEntity(comment);
			const paperId = cache.resolve(comment, 'paperId') as string | undefined;
			const parentCommentId = cache.resolve(comment, 'parentCommentId') as string | undefined;
			if (key) {
				if (paperId) {
					removeFromList(cache, { __typename: 'Resolutionpaper', id: paperId }, 'comments', key);
				}
				if (parentCommentId) {
					removeFromList(
						cache,
						{ __typename: 'Resolutioncomment', id: parentCommentId },
						'replies',
						key
					);
				}
			}
			cache.invalidate(comment);
		},

		// ---------------------------------------------------------------
		// amendment
		// ---------------------------------------------------------------
		createAmendment: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).createAmendment;
			if (!created?.id) return;
			const id = created.id as string;
			const paperId = args.paperId as string;

			// Write all known fields from args into the entity so the amendment card
			// renders fully before the subscription delivers the complete entity. Without
			// this the entity only has {id} after the optimistic layer is cleared, causing
			// a brief visual gap until the WS subscription fires.
			cache.writeFragment(
				gql`
					fragment CreateAmendmentCacheUpdate on Amendment {
						id
						type
						status
						targetClauseId
						targetOperativeIndex
						newContent
						targetPosition
						paperId
					}
				`,
				{ __typename: 'Amendment', id, ...amendmentFieldsFromArgs(args), paperId } as Record<
					string,
					unknown
				>
			);

			addToList(cache, { __typename: 'Resolutionpaper', id: paperId }, 'amendments', {
				__typename: 'Amendment',
				id
			});
			// The root-level lists AmendmentList queries directly
			appendToRootLists({
				cache,
				rootTypes: ['Query', 'Subscription'],
				fieldName: 'amendments',
				matches: (fieldArgs) => wherePaperId(fieldArgs) === paperId,
				key: `Amendment:${id}`
			});
		},
		acceptAmendment: (_result, _args, cache) => {
			// acceptAmendment may create amendmentReviewItem rows as a side effect.
			// Invalidate any open Query.amendmentReviewItems lists so the cache
			// refetches and the review banners appear without waiting for the
			// subscription push.
			for (const f of cache.inspectFields('Query')) {
				if (f.fieldName === 'amendmentReviewItems') {
					cache.invalidate('Query', f.fieldName, f.arguments);
				}
			}
		},
		deleteAmendment: (_result, args, cache) => {
			const amendment = { __typename: 'Amendment', id: args.id as string };
			const key = cache.keyOfEntity(amendment);
			const paperId = cache.resolve(amendment, 'paperId') as string | undefined;
			if (key && paperId) {
				removeFromList(cache, { __typename: 'Resolutionpaper', id: paperId }, 'amendments', key);
			}
			cache.invalidate(amendment);
		},

		// ---------------------------------------------------------------
		// amendmentReviewItem
		// ---------------------------------------------------------------
		// updateAmendmentReviewItem returns a bare Boolean, so graphcache has no
		// entity to normalize the response against. Without this, the only path
		// back to the client is the amendmentReviewItem(s) subscription — which,
		// combined with the persisted offline cache, can leave the AI re-run
		// badges (see ObsolescenceStep/RewriteStep "re-roll" click) stuck showing
		// stale field values until the page is reloaded. Write the mutated fields
		// directly from the known args instead of waiting on that round-trip.
		updateAmendmentReviewItem: (_result, args, cache) => {
			const fields = definedFields(args, [
				'phase',
				'aiObsolete',
				'aiObsoleteReason',
				'aiRewriteSuggestion',
				'aiRewriteReason'
			]);
			if (Object.keys(fields).length === 0) return;

			cache.writeFragment(
				gql`
					fragment AmendmentReviewItemAiUpdate on Amendmentreviewitem {
						id
						${Object.keys(fields).join('\n\t\t\t\t\t\t')}
					}
				`,
				{ __typename: 'Amendmentreviewitem', id: args.reviewItemId as string, ...fields }
			);
		},

		// ---------------------------------------------------------------
		// paperEditor
		// ---------------------------------------------------------------
		addPaperEditor: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).addPaperEditor;
			if (!created?.id) return;
			addToList(cache, { __typename: 'Resolutionpaper', id: args.paperId as string }, 'editors', {
				__typename: 'Papereditor',
				id: created.id as string
			});
		},
		removePaperEditor: (_result, args, cache) => {
			const editor = { __typename: 'Papereditor', id: args.id as string };
			const key = cache.keyOfEntity(editor);
			const paperId = cache.resolve(editor, 'paperId') as string | undefined;
			if (key && paperId) {
				removeFromList(cache, { __typename: 'Resolutionpaper', id: paperId }, 'editors', key);
			}
			cache.invalidate(editor);
		},

		// ---------------------------------------------------------------
		// paperShareCode
		// ---------------------------------------------------------------
		createPaperShareCode: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).createPaperShareCode;
			if (!created?.id) return;
			addToList(
				cache,
				{ __typename: 'Resolutionpaper', id: args.paperId as string },
				'shareCodes',
				{ __typename: 'Papersharecode', id: created.id as string }
			);
		},
		deletePaperShareCode: (_result, args, cache) => {
			const shareCode = { __typename: 'Papersharecode', id: args.id as string };
			const key = cache.keyOfEntity(shareCode);
			const paperId = cache.resolve(shareCode, 'paperId') as string | undefined;
			if (key && paperId) {
				removeFromList(cache, { __typename: 'Resolutionpaper', id: paperId }, 'shareCodes', key);
			}
			cache.invalidate(shareCode);
		},

		// ---------------------------------------------------------------
		// operativeClauseVote
		// ---------------------------------------------------------------
		linkOperativeClauseVote: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).linkOperativeClauseVote;
			if (!created?.id) return;
			// An upsert: a vote already linked to this clause is replaced, so the list stays
			// deduplicated and the old entity is GC'd.
			const paperId = args.paperId as string;
			dropClauseVotes({ cache, paperId, clauseId: args.clauseId, keepId: created.id as string });
			addToList(cache, { __typename: 'Resolutionpaper', id: paperId }, 'operativeClauseVotes', {
				__typename: 'Operativeclausevote',
				id: created.id as string
			});
		},
		unlinkOperativeClauseVote: (_result, args, cache) => {
			dropClauseVotes({ cache, paperId: args.paperId as string, clauseId: args.clauseId });
		},

		// ---------------------------------------------------------------
		// amendmentSponsor
		// ---------------------------------------------------------------
		addAmendmentSponsor: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).addAmendmentSponsor;
			if (!created?.id) return;
			const amendmentId = args.amendmentId as string;
			const child = { __typename: 'Amendmentsponsor', id: created.id as string };

			// Amendment.sponsors, which AmendmentList counts
			addToList(cache, { __typename: 'Amendment', id: amendmentId }, 'sponsors', child);
			// Query.amendmentSponsors, which the AmendmentSponsorPanel liveQuery reads
			const childKey = cache.keyOfEntity(child);
			if (!childKey) return;
			appendToRootLists({
				cache,
				fieldName: 'amendmentSponsors',
				matches: (fieldArgs) => whereAmendmentId(fieldArgs) === amendmentId,
				key: childKey
			});
		},

		removeAmendmentSponsor: (_result, args, cache) => {
			const sponsor = { __typename: 'Amendmentsponsor', id: args.id as string };
			const amendmentId = cache.resolve(sponsor, 'amendmentId') as string | undefined;
			const key = cache.keyOfEntity(sponsor);
			if (amendmentId && key) {
				// Amendment.sponsors and Query.amendmentSponsors, see addAmendmentSponsor
				removeFromList(cache, { __typename: 'Amendment', id: amendmentId }, 'sponsors', key);
				for (const { args: fieldArgs, keys } of listVariants(cache, 'Query', 'amendmentSponsors')) {
					if (whereAmendmentId(fieldArgs) !== amendmentId) continue;
					cache.link(
						'Query',
						'amendmentSponsors',
						fieldArgs,
						keys.filter((k) => k !== key)
					);
				}
			}
			cache.invalidate(sponsor);
		},

		// ---------------------------------------------------------------
		// paperSponsor
		// ---------------------------------------------------------------
		addPaperSponsor: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).addPaperSponsor;
			if (!created?.id) return;
			addToList(cache, { __typename: 'Resolutionpaper', id: args.paperId as string }, 'sponsors', {
				__typename: 'Papersponsor',
				id: created.id as string
			});
		},

		removePaperSponsor: (_result, args, cache) => {
			const sponsor = { __typename: 'Papersponsor', id: args.id as string };
			const paperId = cache.resolve(sponsor, 'paperId') as string | undefined;
			if (paperId) {
				const key = cache.keyOfEntity(sponsor);
				if (key)
					removeFromList(cache, { __typename: 'Resolutionpaper', id: paperId }, 'sponsors', key);
			}
			cache.invalidate(sponsor);
		},

		// ---------------------------------------------------------------
		// requestType — mutated both via the Conference.requestTypes parent-list
		// field (mission-control) and the top-level, args-filtered
		// Query.requestTypes(where: ...) (RequestsCard's picker), so every
		// mutation here also has to invalidate the latter or the picker keeps
		// showing a stale (often empty) list after the chair adds/edits/enables
		// a type.
		// ---------------------------------------------------------------
		createRequestType: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).createRequestType;
			if (!created?.id) return;
			addToList(
				cache,
				{ __typename: 'Conference', id: args.conferenceId as string },
				'requestTypes',
				{ __typename: 'Requesttype', id: created.id as string }
			);
			for (const f of cache.inspectFields('Query').filter((x) => x.fieldName === 'requestTypes')) {
				cache.invalidate('Query', 'requestTypes', f.arguments);
			}
		},
		updateRequestType: (_result, args, cache) => {
			for (const f of cache.inspectFields('Query').filter((x) => x.fieldName === 'requestTypes')) {
				cache.invalidate('Query', 'requestTypes', f.arguments);
			}
			cache.invalidate({ __typename: 'Requesttype', id: args.id as string });
		},
		deleteRequestType: (_result, args, cache) => {
			const requestType = { __typename: 'Requesttype', id: args.id as string };
			const key = cache.keyOfEntity(requestType);
			const conferenceId = cache.resolve(requestType, 'conferenceId') as string | undefined;
			if (key && conferenceId) {
				removeFromList(cache, { __typename: 'Conference', id: conferenceId }, 'requestTypes', key);
			}
			for (const f of cache.inspectFields('Query').filter((x) => x.fieldName === 'requestTypes')) {
				cache.invalidate('Query', 'requestTypes', f.arguments);
			}
			cache.invalidate(requestType);
		},

		// ---------------------------------------------------------------
		// request — the "my pending requests" list is a top-level, args-filtered
		// Query.requests(where: ...) rather than a parent list field, so there's
		// no single entity to addToList/removeFromList against. Just invalidate
		// every cached variant of the field so it refetches.
		// ---------------------------------------------------------------
		createRequest: (result, _args, cache) => {
			if ((result as Record<string, Record<string, unknown>>).createRequest?.id) {
				invalidateRequestLists(cache);
			}
		},
		createManualRequest: (result, _args, cache) => {
			if ((result as Record<string, Record<string, unknown>>).createManualRequest?.id) {
				invalidateRequestLists(cache);
			}
		},
		resolveRequest: (_result, _args, cache) => invalidateRequestLists(cache),
		withdrawRequest: (_result, _args, cache) => invalidateRequestLists(cache),

		// ---------------------------------------------------------------
		// importDelegatorConference — too coarse to optimistically project; just
		// invalidate the conference list so the next query refetches fresh data.
		// ---------------------------------------------------------------
		importDelegatorConference: (result, _args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).importDelegatorConference;
			if (!created?.id) return;
			// Force the participant/admin conference index queries to refetch since we
			// can't easily project the entire imported tree into the cache.
			const conferenceIndexes = ['findManyConferences', 'findFirstConference'];
			for (const f of cache.inspectFields('Query')) {
				if (conferenceIndexes.includes(f.fieldName)) {
					cache.invalidate('Query', f.fieldName, f.arguments);
				}
			}
		}
	}
};
