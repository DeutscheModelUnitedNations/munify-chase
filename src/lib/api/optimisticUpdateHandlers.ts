import { gql } from '@urql/core';
import type { Cache, OptimisticMutationConfig, UpdatesConfig } from '@urql/exchange-graphcache';
import { nanoid } from '$lib/helpers/nanoid';
import { attendanceCode as generateAttendanceCode } from '$lib/helpers/attendanceCode';
import { getServerTime } from '$lib/state/serverClock.svelte';
import { calculateMajority } from '$lib/utils/majorities';
import { compareSpeakers } from '$lib/helpers/speakerSort';

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

/** Remove an entity reference from every variant of a list field on a parent. */
function removeFromList(cache: Cache, parent: Entity, fieldName: string, childKey: string) {
	const fields = cache.inspectFields(parent).filter((f) => f.fieldName === fieldName);
	for (const f of fields) {
		const current = cache.resolve(parent, fieldName, f.arguments) as string[] | null | undefined;
		if (!Array.isArray(current)) continue;
		const next = current.filter((k) => k !== childKey);
		if (next.length === current.length) continue;
		cache.link(parent, fieldName, f.arguments, next);
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

function ensureId(id: unknown): string {
	if (typeof id === 'string' && id.length > 0) return id;
	return nanoid();
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
function densifySpeakers<T extends { id: string; position: number }>(speakers: T[]): T[] {
	return [...speakers]
		.sort(compareSpeakers)
		.map((s, i) => (s.position === i ? s : { ...s, position: i }));
}

// ---------------------------------------------------------------------------
// Optimistic mutations — mirrors src/api/handlers/*.ts
// ---------------------------------------------------------------------------

export const optimistic: OptimisticMutationConfig = {
	// -------------------------------------------------------------------------
	// agendaItem.ts
	// -------------------------------------------------------------------------
	createAgendaItem: (args) => {
		const id = ensureId(args.id);
		return {
			__typename: 'Agendaitem',
			id,
			title: args.title as string,
			committeeId: args.committeeId as string,
			committee: { __typename: 'Committee', id: args.committeeId as string },
			isActive: false,
			speakersList: [],
			createdAt: new Date(),
			updatedAt: null
		};
	},

	// -------------------------------------------------------------------------
	// committee.ts
	// -------------------------------------------------------------------------
	createCommittee: (args) => {
		const id = ensureId(args.id);
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
			activeAgendaItemId: null,
			activeAgendaItem: null,
			customSimpleMajority: null,
			customTwoThirdsMajority: null,
			presentationLayout: 'default',
			presentationRootFontSize: 16,
			presentationResolutionFontSize: 16,
			displayRegionalGroups: false,
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
			id: args.id
		};
		for (const field of [
			'abbreviation',
			'activeAgendaItemId',
			'allowDelegationsToAddThemselvesToSpeakersList',
			'displayRegionalGroups',
			'name',
			'presentationLayout',
			'presentationRootFontSize',
			'presentationResolutionFontSize',
			'showWhiteboard',
			'stateOfDebate',
			'status',
			'statusHeadline',
			'statusUntil',
			'whiteboardContent'
		]) {
			if ((args as Record<string, unknown>)[field] !== undefined) {
				result[field] = (args as Record<string, unknown>)[field];
			}
		}
		if (args.activeAgendaItemId !== undefined) {
			result.activeAgendaItem = args.activeAgendaItemId
				? { __typename: 'Agendaitem', id: args.activeAgendaItemId }
				: null;
		}
		return result;
	},
	deleteCommittee: () => true,
	setCommitteeResolutionToggles: (args) => {
		const result: Record<string, unknown> = {
			__typename: 'Committee',
			id: args.committeeId
		};
		for (const field of [
			'amendmentSubmissionOpen',
			'amendmentSponsoringOpen',
			'supportReevaluationOpen',
			'currentOperativeIndex'
		]) {
			if ((args as Record<string, unknown>)[field] !== undefined) {
				result[field] = (args as Record<string, unknown>)[field];
			}
		}
		return result;
	},

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
		const id = ensureId(args.id);
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
			id: args.id
		};
		for (const field of [
			'title',
			'pressWebsite',
			'location',
			'startDate',
			'endDate',
			'hasModeratedCaucus'
		]) {
			if ((args as Record<string, unknown>)[field] !== undefined) {
				result[field] = (args as Record<string, unknown>)[field];
			}
		}
		if (args.logoSvg !== undefined) {
			const trimmed = typeof args.logoSvg === 'string' ? args.logoSvg.trim() : null;
			result.logoSvg = trimmed === '' ? null : args.logoSvg;
		}
		return result;
	},
	deleteConference: () => true,

	// -------------------------------------------------------------------------
	// conferenceMember.ts
	// -------------------------------------------------------------------------
	createConferenceMember: (args) => {
		const id = ensureId(args.id);
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
		const id = ensureId(args.id);
		const type = args.conferenceUserType as string;
		const attendanceCode = type === 'NON_STATE_ACTOR' ? generateAttendanceCode() : null;
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
			attendanceCode,
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
	updateConferenceUser: (args, cache) => {
		const current = readEntity<{ attendanceCode?: string | null; conferenceUserType?: string }>(
			cache,
			gql`
				fragment UpdateConferenceUserCurrent on Conferenceuser {
					id
					attendanceCode
					conferenceUserType
				}
			`,
			{ __typename: 'Conferenceuser', id: args.id as string }
		);

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
			if (current?.attendanceCode) result.attendanceCode = null;
		} else {
			if (args.conferenceMemberId !== undefined) {
				result.conferenceMemberId = args.conferenceMemberId ?? null;
				result.conferenceMember = args.conferenceMemberId
					? { __typename: 'Conferencemember', id: args.conferenceMemberId as string }
					: null;
			}
			// Promotion to NSA without an existing code → mint one locally so the UI can
			// display it immediately. The server will replace it with a unique value.
			if (!current?.attendanceCode) {
				result.attendanceCode = generateAttendanceCode();
			}
		}

		return result;
	},
	deleteConferenceUser: () => true,

	// -------------------------------------------------------------------------
	// presenceEvent.ts
	// -------------------------------------------------------------------------
	recordNsaCheckIn: (args, cache) => {
		const id = ensureId(args.id);
		const now = getServerTime().toDate();
		// Best-effort: try to resolve the NSA conferenceUser from the cache by scanning
		// known Conferenceuser entries. If we can't find them we still return a phantom
		// event — the conferenceUserId will be reconciled when the real response arrives.
		const target = resolveNsaTargetInCache(cache, args.committeeId as string, args.code as string);
		const conferenceUserId = target?.id ?? `pending-${id}`;

		// If the user is currently checked into a different committee, mirror the server's
		// AUTO_SWITCH side effect: flip their derived fields and the latest event chain.
		if (
			target?.isCheckedIn &&
			target.currentCommitteeId &&
			target.currentCommitteeId !== args.committeeId
		) {
			cache.writeFragment(
				gql`
					fragment NsaAutoSwitch on Conferenceuser {
						id
						isCheckedIn
						currentCommitteeId
						currentCheckedInSince
					}
				`,
				{
					__typename: 'Conferenceuser',
					id: target.id,
					isCheckedIn: true,
					currentCommitteeId: args.committeeId,
					currentCheckedInSince: now
				}
			);
		} else if (target) {
			cache.writeFragment(
				gql`
					fragment NsaCheckIn on Conferenceuser {
						id
						isCheckedIn
						currentCommitteeId
						currentCheckedInSince
					}
				`,
				{
					__typename: 'Conferenceuser',
					id: target.id,
					isCheckedIn: true,
					currentCommitteeId: args.committeeId,
					currentCheckedInSince: now
				}
			);
		}

		return {
			__typename: 'Presenceevent',
			id,
			conferenceUserId,
			conferenceUser: { __typename: 'Conferenceuser', id: conferenceUserId },
			committeeId: args.committeeId,
			committee: { __typename: 'Committee', id: args.committeeId as string },
			present: true,
			type: 'NSA_SCAN',
			timestamp: now,
			note: null,
			rollCallSessionId: null,
			rollCallSession: null,
			triggeredBy: null
		};
	},
	recordNsaCheckOut: (args, cache) => {
		const id = ensureId(args.id);
		const now = getServerTime().toDate();
		const target = resolveNsaTargetInCache(cache, args.committeeId as string, args.code as string);
		const conferenceUserId = target?.id ?? `pending-${id}`;

		if (target) {
			cache.writeFragment(
				gql`
					fragment NsaCheckOut on Conferenceuser {
						id
						isCheckedIn
						currentCommitteeId
						currentCheckedInSince
					}
				`,
				{
					__typename: 'Conferenceuser',
					id: target.id,
					isCheckedIn: false,
					currentCommitteeId: null,
					currentCheckedInSince: null
				}
			);
		}

		return {
			__typename: 'Presenceevent',
			id,
			conferenceUserId,
			conferenceUser: { __typename: 'Conferenceuser', id: conferenceUserId },
			committeeId: args.committeeId,
			committee: { __typename: 'Committee', id: args.committeeId as string },
			present: false,
			type: 'NSA_SCAN',
			timestamp: now,
			note: null,
			rollCallSessionId: null,
			rollCallSession: null,
			triggeredBy: null
		};
	},
	insertPresenceEvent: (args, cache) => {
		const id = ensureId(args.id);
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
			id: args.id
		};
		if (args.timestamp !== undefined && args.timestamp !== null)
			result.timestamp = new Date(args.timestamp as string | Date);
		if (args.present !== undefined && args.present !== null) result.present = args.present;
		if (args.committeeId !== undefined && args.committeeId !== null) {
			result.committeeId = args.committeeId;
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
	regenerateNsaAttendanceCode: (args) => ({
		__typename: 'Conferenceuser',
		id: args.conferenceUserId,
		attendanceCode: generateAttendanceCode()
	}),

	// -------------------------------------------------------------------------
	// representation.ts
	// -------------------------------------------------------------------------
	createRepresentation: (args) => {
		const id = ensureId(args.id);
		return {
			__typename: 'Representation',
			id,
			conferenceId: args.conferenceId as string,
			conference: { __typename: 'Conference', id: args.conferenceId as string },
			type: args.type,
			name: (args.name as string | undefined) ?? null,
			alpha2Code: (args.alpha2Code as string | undefined) ?? null,
			alpha3Code: (args.alpha3Code as string | undefined) ?? null,
			faIcon: (args.faIcon as string | undefined) ?? null,
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
		const id = ensureId(args.id);
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
		const id = ensureId(args.id);
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
	updateResolutionPaper: (args) => {
		const result: Record<string, unknown> = {
			__typename: 'Resolutionpaper',
			id: args.id
		};
		if (args.title != null) result.title = args.title;
		if (args.status != null) result.status = args.status;
		if (args.documentNumber != null) result.documentNumber = args.documentNumber;
		return result;
	},
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
		const id = ensureId(args.id);
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
		const id = ensureId(args.id);
		const sponsorId = nanoid();

		// Chairs supply the proposer via args; delegates resolve from the cached
		// conferenceUser row (same logic as findSelfConferenceUser).
		let proposerCommitteeMemberId = (args.proposerCommitteeMemberId as string | undefined) ?? null;
		if (!proposerCommitteeMemberId) {
			const paperId = args.paperId as string;
			const committeeId = cache.resolve(
				{ __typename: 'Resolutionpaper', id: paperId },
				'committeeId'
			) as string | null | undefined;
			if (committeeId) {
				const conferenceId = cache.resolve(
					{ __typename: 'Committee', id: committeeId },
					'conferenceId'
				) as string | null | undefined;
				const self = findSelfConferenceUser(cache, conferenceId ?? null);
				proposerCommitteeMemberId = self?.committeeMemberId ?? null;
			}
		}

		// Mirror the server's auto-sponsor: write an Amendmentsponsor entity for the
		// proposer so AmendmentList shows the correct sponsor count immediately.
		if (proposerCommitteeMemberId) {
			const proposerMember = readEntity<{
				id: string;
				representation?: {
					id: string;
					name?: string | null;
					alpha2Code?: string | null;
					alpha3Code?: string | null;
					faIcon?: string | null;
					type?: string | null;
				} | null;
			}>(
				cache,
				gql`
					fragment CreateAmendmentProposer on Committeemember {
						id
						representation {
							id
							name
							alpha2Code
							alpha3Code
							faIcon
							type
						}
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
							representation {
								id
								name
								alpha2Code
								alpha3Code
								faIcon
								type
							}
						}
					}
				`,
				{
					__typename: 'Amendmentsponsor',
					id: sponsorId,
					amendmentId: id,
					committeeMember: proposerMember
				} as Record<string, unknown>
			);
			// Link sponsor into any already-open Query.amendmentSponsors query for
			// this amendment (e.g. the sponsor panel was opened before the create).
			const sponsorKey = cache.keyOfEntity({ __typename: 'Amendmentsponsor', id: sponsorId });
			if (sponsorKey) {
				const fields = cache
					.inspectFields('Query')
					.filter(
						(f) =>
							f.fieldName === 'amendmentSponsors' &&
							(f.arguments as { where?: { amendment?: { id?: string } } } | null)?.where?.amendment
								?.id === id
					);
				for (const f of fields) {
					const current = cache.resolve('Query', 'amendmentSponsors', f.arguments) as
						| string[]
						| null
						| undefined;
					if (Array.isArray(current) && !current.includes(sponsorKey)) {
						cache.link('Query', 'amendmentSponsors', f.arguments, [...current, sponsorKey]);
					}
				}
			}
		}

		// Link the new amendment into any already-open amendments lists (both Query
		// and Subscription roots, since liveQuery uses both) so the AmendmentList
		// updates immediately without waiting for the server subscription to fire.
		const paperId = args.paperId as string;
		const amendmentKey = `Amendment:${id}`;
		for (const rootType of ['Query', 'Subscription']) {
			const amendmentFields = cache
				.inspectFields(rootType)
				.filter(
					(f) =>
						f.fieldName === 'amendments' &&
						(f.arguments as { where?: { paper?: { id?: string } } } | null)?.where?.paper?.id ===
							paperId
				);
			for (const f of amendmentFields) {
				const current = cache.resolve(rootType, 'amendments', f.arguments) as
					| string[]
					| null
					| undefined;
				if (Array.isArray(current) && !current.includes(amendmentKey)) {
					cache.link(rootType, 'amendments', f.arguments, [...current, amendmentKey]);
				}
			}
		}

		return {
			__typename: 'Amendment',
			id,
			paperId: args.paperId as string,
			paper: { __typename: 'Resolutionpaper', id: args.paperId as string },
			proposerCommitteeMemberId,
			proposer: proposerCommitteeMemberId
				? { __typename: 'Committeemember', id: proposerCommitteeMemberId }
				: null,
			type: args.type as string,
			status: (args.status as string | undefined) ?? 'PENDING',
			targetClauseId: (args.targetClauseId as string | undefined) ?? null,
			targetOperativeIndex: (args.targetOperativeIndex as number | undefined) ?? null,
			newContent: (args.newContent as string | undefined) ?? null,
			targetPosition: (args.targetPosition as number | undefined) ?? null,
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
		const id = ensureId(args.id);
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
		const id = ensureId(args.id);
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
		if (args.committeeMemberId && args.conferenceMemberId) return null;
		if (!args.committeeMemberId && !args.conferenceMemberId) return null;

		// Use the minimal fragment — we only need id+position for ordering.
		const list = readEntity<{ id: string; speakers: SpeakerEntry[] }>(
			cache,
			ADD_SPEAKER_LIST_FRAGMENT,
			{ __typename: 'Speakerslist', id: args.speakersListId as string }
		);
		const speakers: SpeakerEntry[] = list?.speakers ?? [];

		// Mirror server position semantics: when caller passes a position, every entry
		// with position >= newPosition shifts up by 1; otherwise we append at the end.
		const explicit = typeof args.position === 'number' ? (args.position as number) : null;
		const position = explicit ?? speakers.length;

		const newId = ensureId(args.id);

		const shifted = speakers.map((s) => {
			if (explicit !== null && s.position >= explicit) return { ...s, position: s.position + 1 };
			return s;
		});

		const added = {
			__typename: 'Speakeronlist',
			id: newId,
			position,
			committeeMemberId: (args.committeeMemberId as string | undefined) ?? null,
			conferenceMemberId: (args.conferenceMemberId as string | undefined) ?? null
		};

		// Densify so the cache stays a dense 0..n-1 sequence even when a prior offline
		// edit left it drifted; this also settles the new entry's final position.
		const updatedSpeakers = densifySpeakers([...shifted, added]);
		const finalPosition = updatedSpeakers.find((s) => s.id === newId)?.position ?? position;

		// Write the parent list with the recomputed speaker positions so the cache sees
		// the new ordering immediately without waiting for `updates` to fire.
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

		let committeeMember = null;
		if (args.committeeMemberId) {
			committeeMember = readEntity(
				cache,
				gql`
					fragment AddSpeakerOptimisticCM on Committeemember {
						id
						representation {
							id
							name
							alpha2Code
							alpha3Code
							faIcon
							type
						}
					}
				`,
				{ __typename: 'Committeemember', id: args.committeeMemberId as string }
			);
		}

		let conferenceMember = null;
		if (args.conferenceMemberId) {
			conferenceMember = readEntity(
				cache,
				gql`
					fragment AddSpeakerOptimisticConM on Conferencemember {
						id
						representation {
							id
							name
							alpha2Code
							alpha3Code
							faIcon
							type
						}
					}
				`,
				{ __typename: 'Conferencemember', id: args.conferenceMemberId as string }
			);
		}

		// Write the new Speakeronlist's member link explicitly. Callers typically request a
		// minimal mutation selection (id, position, speakersListId) — the embedded member
		// data we return below would be dropped by graphcache's selection-set-aware write.
		// Online, the speakers list subscription quickly fills the gap; offline, no
		// subscription arrives so the entry would otherwise render as "N/A" without a flag.
		cache.writeFragment(
			gql`
				fragment AddedSpeakerLink on Speakeronlist {
					id
					committeeMember {
						id
						representation {
							id
							name
							alpha2Code
							alpha3Code
							faIcon
							type
						}
					}
					conferenceMember {
						id
						representation {
							id
							name
							alpha2Code
							alpha3Code
							faIcon
							type
						}
					}
				}
			`,
			{
				__typename: 'Speakeronlist',
				id: newId,
				committeeMember,
				conferenceMember
			} as unknown as Record<string, unknown>
		);

		return {
			__typename: 'Speakeronlist',
			id: newId,
			position: finalPosition,
			speakersListId: args.speakersListId,
			speakersList: { __typename: 'Speakerslist', id: args.speakersListId as string },
			overwriteName: null,
			committeeMemberId: (args.committeeMemberId as string | undefined) ?? null,
			conferenceMemberId: (args.conferenceMemberId as string | undefined) ?? null,
			committeeMember: committeeMember ?? null,
			conferenceMember: conferenceMember ?? null
		};
	},
	removeSpeakerOnList: (args, cache) => {
		const target = readEntity<{
			id: string;
			speakersListId: string;
			position: number;
		}>(
			cache,
			gql`
				fragment RemoveSpeakerSource on Speakeronlist {
					id
					speakersListId
					position
				}
			`,
			{ __typename: 'Speakeronlist', id: args.speakerOnListId as string }
		);
		if (!target?.speakersListId) return null;

		// Use the minimal fragment — we only need id+position for re-sequencing.
		const list = readEntity<{ id: string; speakers: SpeakerEntry[] }>(
			cache,
			ADD_SPEAKER_LIST_FRAGMENT,
			{ __typename: 'Speakerslist', id: target.speakersListId }
		);
		if (!list?.speakers) return null;

		const remaining = list.speakers
			.filter((s) => s.id !== args.speakerOnListId)
			.map((s) => (s.position > target.position ? { ...s, position: s.position - 1 } : s));

		return {
			__typename: 'Speakerslist',
			id: target.speakersListId,
			speakers: densifySpeakers(remaining).map((s) => ({
				__typename: 'Speakeronlist',
				id: s.id,
				position: s.position
			}))
		};
	},
	selfAddToSpeakersList: (args, cache) => {
		// Resolve the calling user's committeeMember / conferenceMember from cache.
		const list = readSpeakersList(cache, args.speakersListId as string);
		if (!list?.agendaItem?.committee) return null;
		const committee = list.agendaItem.committee;
		if (!committee.allowDelegationsToAddThemselvesToSpeakersList) return null;
		if (list.isClosed) return null;

		const self = findSelfConferenceUser(cache, committee.conferenceId ?? null);
		if (!self) return null;

		let committeeMemberId: string | null = null;
		let conferenceMemberId: string | null = null;
		if (self.conferenceUserType === 'DELEGATE') {
			if (!self.committeeMemberId) return null;
			committeeMemberId = self.committeeMemberId;
		} else if (self.conferenceUserType === 'NON_STATE_ACTOR') {
			if (!self.conferenceMemberId) return null;
			conferenceMemberId = self.conferenceMemberId;
		} else {
			return null;
		}

		const speakers = list.speakers ?? [];
		// Prevent duplicate self-adds.
		if (
			speakers.some(
				(s) =>
					(committeeMemberId && s.committeeMemberId === committeeMemberId) ||
					(conferenceMemberId && s.conferenceMemberId === conferenceMemberId)
			)
		) {
			return null;
		}

		const newId = ensureId(args.id);
		const position = speakers.length;

		// Mirror addSpeakerOnList: ensure the new Speakeronlist's member link is in the
		// cache even when the mutation selection set omits it, so offline self-adds don't
		// render as "N/A" without a flag.
		let committeeMember = null;
		if (committeeMemberId) {
			committeeMember = readEntity(
				cache,
				gql`
					fragment SelfAddSpeakerOptimisticCM on Committeemember {
						id
						representation {
							id
							name
							alpha2Code
							alpha3Code
							faIcon
							type
						}
					}
				`,
				{ __typename: 'Committeemember', id: committeeMemberId }
			);
		}
		let conferenceMember = null;
		if (conferenceMemberId) {
			conferenceMember = readEntity(
				cache,
				gql`
					fragment SelfAddSpeakerOptimisticConM on Conferencemember {
						id
						representation {
							id
							name
							alpha2Code
							alpha3Code
							faIcon
							type
						}
					}
				`,
				{ __typename: 'Conferencemember', id: conferenceMemberId }
			);
		}
		cache.writeFragment(
			gql`
				fragment SelfAddedSpeakerLink on Speakeronlist {
					id
					committeeMember {
						id
						representation {
							id
							name
							alpha2Code
							alpha3Code
							faIcon
							type
						}
					}
					conferenceMember {
						id
						representation {
							id
							name
							alpha2Code
							alpha3Code
							faIcon
							type
						}
					}
				}
			`,
			{
				__typename: 'Speakeronlist',
				id: newId,
				committeeMember,
				conferenceMember
			} as unknown as Record<string, unknown>
		);

		return {
			__typename: 'Speakeronlist',
			id: newId,
			position,
			speakersListId: args.speakersListId,
			speakersList: { __typename: 'Speakerslist', id: args.speakersListId as string },
			overwriteName: null,
			committeeMemberId,
			conferenceMemberId,
			committeeMember: committeeMember ?? null,
			conferenceMember: conferenceMember ?? null
		};
	},
	selfRemoveFromSpeakersList: (args, cache) => {
		const list = readSpeakersList(cache, args.speakersListId as string);
		if (!list?.agendaItem?.committee) return null;
		const conferenceId = list.agendaItem.committee.conferenceId ?? null;
		const self = findSelfConferenceUser(cache, conferenceId);
		if (!self) return null;
		const speakers = list.speakers ?? [];
		const own = speakers.find(
			(s) =>
				(self.committeeMemberId && s.committeeMemberId === self.committeeMemberId) ||
				(self.conferenceMemberId && s.conferenceMemberId === self.conferenceMemberId)
		);
		if (!own) return null;

		const remaining = speakers
			.filter((s) => s.id !== own.id)
			.map((s) => (s.position > own.position ? { ...s, position: s.position - 1 } : s));

		return {
			__typename: 'Speakerslist',
			id: args.speakersListId,
			speakers: densifySpeakers(remaining).map((s) => ({
				__typename: 'Speakeronlist',
				id: s.id,
				position: s.position
			}))
		};
	},
	moveSpeakerToPosition: (args, cache) => {
		const target = readEntity<{
			id: string;
			speakersListId: string;
			position: number;
		}>(
			cache,
			gql`
				fragment MoveSpeakerSource on Speakeronlist {
					id
					speakersListId
					position
				}
			`,
			{ __typename: 'Speakeronlist', id: args.id as string }
		);
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
		cache.writeFragment(ADD_SPEAKER_LIST_FRAGMENT, {
			__typename: 'Speakerslist',
			id: target.speakersListId,
			speakers: densified.map((s) => ({
				__typename: 'Speakeronlist',
				id: s.id,
				position: s.position
			}))
		} as unknown as Record<string, unknown>);

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
		const result: Record<string, unknown> = {
			__typename: 'Speakerslist',
			id: args.id
		};
		if (args.isClosed != null) result.isClosed = args.isClosed;
		if (args.speakingTime != null) result.speakingTime = args.speakingTime;

		// Snapshot the current list so we can mirror the server's derived calculations
		// for timeLeft (on stopTimer) and phase (auto-derivation).
		const current = readEntity<{
			phase?: string | null;
			timeLeft?: number | null;
			startTimestamp?: string | Date | null;
		}>(
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

		if (args.stopTimer) {
			result.startTimestamp = null;
			// Compute remaining time the same way the server does so all clients agree.
			if (
				current?.startTimestamp &&
				typeof current.timeLeft === 'number' &&
				args.timeLeft == null
			) {
				const startMs = new Date(current.startTimestamp).getTime();
				// Use server time so the elapsed calculation is consistent with the
				// startTimestamp anchor (which is server-time-based after confirmation).
				const elapsedSec = (getServerTime().valueOf() - startMs) / 1000;
				result.timeLeft = Math.round(current.timeLeft - elapsedSec);
			} else if (args.timeLeft != null) {
				result.timeLeft = args.timeLeft;
			}
		} else {
			if (args.timeLeft != null) result.timeLeft = args.timeLeft;
			if (args.startTimestamp !== undefined && args.startTimestamp !== null) {
				// Use the timestamp from args (already getServerTime().toDate() at call site)
				// rather than new Date(), so the optimistic anchor matches the server anchor
				// and the timer display is accurate before the server confirms.
				result.startTimestamp = new Date(args.startTimestamp as string | Date);
			}
		}

		// Phase: explicit wins, otherwise derive from current.
		let phase: string | undefined;
		if (args.phase !== undefined && args.phase !== null) phase = args.phase as string;
		else if (current?.phase) {
			if (args.stopTimer && args.timeLeft != null) phase = 'SPEECH';
			else if (args.stopTimer) {
				if (current.phase === 'SPEECH') phase = 'SPEECH_DONE';
				else if (current.phase === 'ANSWER') phase = 'ANSWER_DONE';
			} else if (args.startTimestamp !== undefined && args.startTimestamp !== null) {
				if (current.phase === 'SPEECH_DONE') phase = 'SPEECH';
				else if (current.phase === 'ANSWER_DONE') phase = 'ANSWER';
			}
		}
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
		const id = ensureId(args.id);
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
			votes: [],
			createdAt: new Date(),
			updatedAt: null
		};
	},
	updateVotingSession: (args) => {
		const result: Record<string, unknown> = { __typename: 'Votingsession', id: args.id };
		if (args.currentStage !== undefined && args.currentStage !== null)
			result.currentStage = args.currentStage;
		if (args.votesPro != null) result.votesPro = args.votesPro;
		if (args.votesCon != null) result.votesCon = args.votesCon;
		if (args.votesAbstain != null) result.votesAbstain = args.votesAbstain;
		if (args.currentMemberIndex != null) result.currentMemberIndex = args.currentMemberIndex;
		return result;
	},
	completeVotingSession: (args) => {
		// Boolean return: we still apply the completion timestamp via the updates resolver
		// below, but graphcache requires a primitive here.
		void args;
		return true;
	},
	setVoteForMember: (args, cache) => {
		// Mirror server upsert: if a vote already exists for (sessionId, committeeMemberId),
		// reuse its id so we update the same entity instead of creating a phantom.
		const existingId = findExistingVoteId(
			cache,
			args.sessionId as string,
			args.committeeMemberId as string
		);
		const id = existingId ?? ensureId(args.id);
		return {
			__typename: 'Votingvote',
			id,
			votingSessionId: args.sessionId,
			votingSession: { __typename: 'Votingsession', id: args.sessionId as string },
			committeeMemberId: args.committeeMemberId,
			committeeMember: { __typename: 'Committeemember', id: args.committeeMemberId as string },
			vote: args.vote,
			createdAt: new Date(),
			updatedAt: null
		};
	}
};

// ---------------------------------------------------------------------------
// Cache-lookup helpers used by optimistic handlers
// ---------------------------------------------------------------------------

function resolveNsaTargetInCache(
	cache: Cache,
	committeeId: string,
	rawCode: string
): {
	id: string;
	isCheckedIn?: boolean;
	currentCommitteeId?: string | null;
} | null {
	const code = (rawCode ?? '').trim();
	if (!code) return null;
	const upper = code.toUpperCase();

	// Walk every cached Conferenceuser and match by id / attendanceCode / linked userId.
	const queryFields = cache.inspectFields('Query');
	const userKeys = new Set<string>();
	for (const f of queryFields) {
		const value = cache.resolve('Query', f.fieldName, f.arguments);
		if (Array.isArray(value)) {
			for (const v of value)
				if (typeof v === 'string' && v.startsWith('Conferenceuser:')) userKeys.add(v);
		} else if (typeof value === 'string' && value.startsWith('Conferenceuser:')) {
			userKeys.add(value);
		}
	}

	// Fall back: if we know the committee, walk the conference's users via the committee → conference link.
	const conferenceId = cache.resolve(
		{ __typename: 'Committee', id: committeeId },
		'conferenceId'
	) as string | undefined;

	for (const key of userKeys) {
		const id = key.slice('Conferenceuser:'.length);
		const data = readEntity<{
			id: string;
			conferenceId?: string;
			conferenceUserType?: string;
			attendanceCode?: string | null;
			isCheckedIn?: boolean;
			currentCommitteeId?: string | null;
			user?: { id?: string } | null;
		}>(
			cache,
			gql`
				fragment NsaResolveSnapshot on Conferenceuser {
					id
					conferenceId
					conferenceUserType
					attendanceCode
					isCheckedIn
					currentCommitteeId
					user {
						id
					}
				}
			`,
			{ __typename: 'Conferenceuser', id }
		);
		if (!data) continue;
		if (data.conferenceUserType !== 'NON_STATE_ACTOR') continue;
		if (conferenceId && data.conferenceId && data.conferenceId !== conferenceId) continue;
		if (data.id === code || data.attendanceCode === upper || data.user?.id === code) {
			return {
				id: data.id,
				isCheckedIn: data.isCheckedIn,
				currentCommitteeId: data.currentCommitteeId ?? null
			};
		}
	}
	return null;
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
	const affectedMemberKeys = new Set(memberIds.map((id) => `Committeemember:${id}`));

	// `committeeId` is not in every page's selection set, so cache.resolve(member, 'committeeId')
	// may return undefined. Instead, walk known Committee entities (discovered via root Query
	// fields) and pick those whose `members` link contains any of the affected member keys.
	const committeeIds = new Set<string>();
	const queryFields = cache.inspectFields('Query');
	const committeeKeys = new Set<string>();
	for (const f of queryFields) {
		const value = cache.resolve('Query', f.fieldName, f.arguments);
		if (Array.isArray(value)) {
			for (const v of value)
				if (typeof v === 'string' && v.startsWith('Committee:')) committeeKeys.add(v);
		} else if (typeof value === 'string' && value.startsWith('Committee:')) {
			committeeKeys.add(value);
		}
	}
	for (const key of committeeKeys) {
		const id = key.slice('Committee:'.length);
		const memberFields = cache
			.inspectFields({ __typename: 'Committee', id })
			.filter((f) => f.fieldName === 'members');
		for (const f of memberFields) {
			const members = cache.resolve({ __typename: 'Committee', id }, 'members', f.arguments) as
				| string[]
				| null
				| undefined;
			if (!Array.isArray(members)) continue;
			if (members.some((m) => typeof m === 'string' && affectedMemberKeys.has(m))) {
				committeeIds.add(id);
				break;
			}
		}
	}

	for (const committeeId of committeeIds) {
		// Read members + representation type. We have to walk the link manually because
		// readFragment returns null entirely if any requested field is missing from the
		// cache, and we want this to work even on pages that select a slim member shape.
		const memberFields = cache
			.inspectFields({ __typename: 'Committee', id: committeeId })
			.filter((f) => f.fieldName === 'members');
		const memberKeys = new Set<string>();
		for (const f of memberFields) {
			const arr = cache.resolve(
				{ __typename: 'Committee', id: committeeId },
				'members',
				f.arguments
			) as string[] | null | undefined;
			if (!Array.isArray(arr)) continue;
			for (const k of arr) if (typeof k === 'string') memberKeys.add(k);
		}
		if (memberKeys.size === 0) continue;

		let totalPresent = 0;
		for (const key of memberKeys) {
			if (!key.startsWith('Committeemember:')) continue;
			const id = key.slice('Committeemember:'.length);
			const member = { __typename: 'Committeemember', id };
			const representationKey = cache.resolve(member, 'representation') as
				| string
				| null
				| undefined;
			let type: string | null | undefined = null;
			if (typeof representationKey === 'string') {
				const repId = representationKey.startsWith('Representation:')
					? representationKey.slice('Representation:'.length)
					: representationKey;
				type = cache.resolve({ __typename: 'Representation', id: repId }, 'type') as
					| string
					| null
					| undefined;
			}
			if (type !== 'DELEGATION') continue;
			const cachedPresent = cache.resolve(member, 'present') as boolean | null | undefined;
			const effectivePresent = affected.has(id) ? present : !!cachedPresent;
			if (effectivePresent) totalPresent += 1;
		}

		const customSimple = cache.resolve(
			{ __typename: 'Committee', id: committeeId },
			'customSimpleMajority'
		) as number | null | undefined;
		const customTwoThirds = cache.resolve(
			{ __typename: 'Committee', id: committeeId },
			'customTwoThirdsMajority'
		) as number | null | undefined;

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
				__typename: 'Committee',
				id: committeeId,
				totalPresent,
				simpleMajority:
					typeof customSimple === 'number'
						? customSimple
						: calculateMajority(totalPresent, 'simple'),
				twoThirdsMajority:
					typeof customTwoThirds === 'number'
						? customTwoThirds
						: calculateMajority(totalPresent, 'twoThirds')
			} as Record<string, unknown>
		);
	}
}

function findExistingVoteId(
	cache: Cache,
	sessionId: string,
	committeeMemberId: string
): string | null {
	const votes = cache.resolve({ __typename: 'Votingsession', id: sessionId }, 'votes') as
		| string[]
		| null
		| undefined;
	if (!Array.isArray(votes)) return null;
	for (const key of votes) {
		if (typeof key !== 'string' || !key.startsWith('Votingvote:')) continue;
		const id = key.slice('Votingvote:'.length);
		const data = readEntity<{ id: string; committeeMemberId?: string }>(
			cache,
			gql`
				fragment ExistingVoteSnapshot on Votingvote {
					id
					committeeMemberId
				}
			`,
			{ __typename: 'Votingvote', id }
		);
		if (data?.committeeMemberId === committeeMemberId) return data.id;
	}
	return null;
}

function findSelfConferenceUser(
	cache: Cache,
	conferenceId: string | null
): {
	id: string;
	conferenceUserType: string;
	committeeMemberId?: string | null;
	conferenceMemberId?: string | null;
} | null {
	// The participant abilities query only returns the calling user's own attendance code,
	// so we can scan known Conferenceuser entries and pick the one whose attendanceCode is
	// readable (server hides it for everyone else). Falls back to the first match in the
	// given conference where the role is DELEGATE / NON_STATE_ACTOR.
	const queryFields = cache.inspectFields('Query');
	const keys = new Set<string>();
	for (const f of queryFields) {
		const value = cache.resolve('Query', f.fieldName, f.arguments);
		if (Array.isArray(value)) {
			for (const v of value)
				if (typeof v === 'string' && v.startsWith('Conferenceuser:')) keys.add(v);
		} else if (typeof value === 'string' && value.startsWith('Conferenceuser:')) {
			keys.add(value);
		}
	}
	for (const key of keys) {
		const id = key.slice('Conferenceuser:'.length);
		const data = readEntity<{
			id: string;
			conferenceId?: string;
			conferenceUserType?: string;
			committeeMemberId?: string | null;
			conferenceMemberId?: string | null;
			userEmail?: string | null;
		}>(
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
		if (!data) continue;
		if (conferenceId && data.conferenceId !== conferenceId) continue;
		if (data.conferenceUserType !== 'DELEGATE' && data.conferenceUserType !== 'NON_STATE_ACTOR')
			continue;
		// userEmail is only readable on the self row, so finding any readable email
		// uniquely identifies the calling user in this conference.
		if (data.userEmail) {
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
			if (repKey) {
				const cmKeys =
					(cache.resolve(rep, 'committeeMembers') as string[] | null | undefined) ?? [];
				const cnmKeys =
					(cache.resolve(rep, 'conferenceMembers') as string[] | null | undefined) ?? [];
				for (const k of cmKeys) {
					if (typeof k !== 'string' || !k.startsWith('Committeemember:')) continue;
					const id = k.slice('Committeemember:'.length);
					const member = { __typename: 'Committeemember', id };
					const committeeId = cache.resolve(member, 'committeeId') as string | undefined;
					if (committeeId) {
						removeFromList(cache, { __typename: 'Committee', id: committeeId }, 'members', k);
					}
					cache.invalidate(member);
				}
				for (const k of cnmKeys) {
					if (typeof k !== 'string' || !k.startsWith('Conferencemember:')) continue;
					const id = k.slice('Conferencemember:'.length);
					const member = { __typename: 'Conferencemember', id };
					if (conferenceId) {
						removeFromList(cache, { __typename: 'Conference', id: conferenceId }, 'members', k);
					}
					cache.invalidate(member);
				}
				if (conferenceId) {
					removeFromList(
						cache,
						{ __typename: 'Conference', id: conferenceId },
						'representations',
						repKey
					);
				}
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
			if (!newSpeaker?.id) return;

			const list = cache.readFragment(ADD_SPEAKER_LIST_FRAGMENT, {
				__typename: 'Speakerslist',
				id: args.speakersListId
			} as Record<string, unknown>) as {
				speakers: Array<{ id: string; position: number; __typename: string }>;
			} | null;
			if (!list) return;

			if (list.speakers.some((s) => s.id === newSpeaker.id)) return;

			const explicit = typeof args.position === 'number' ? (args.position as number) : null;
			const position =
				typeof newSpeaker.position === 'number'
					? (newSpeaker.position as number)
					: (explicit ?? list.speakers.length);

			// When an explicit position was used, shift existing entries to mirror the
			// server's unique(speakersListId, position) constraint resolution.
			const shifted =
				explicit !== null
					? list.speakers.map((s) =>
							s.position >= explicit ? { ...s, position: s.position + 1 } : s
						)
					: list.speakers;

			cache.writeFragment(ADD_SPEAKER_LIST_FRAGMENT, {
				__typename: 'Speakerslist',
				id: args.speakersListId,
				speakers: densifySpeakers([
					...shifted,
					{ __typename: 'Speakeronlist', id: newSpeaker.id as string, position }
				])
			} as Record<string, unknown>);
		},
		selfAddToSpeakersList: (result, args, cache) => {
			const newSpeaker = (result as Record<string, Record<string, unknown>>).selfAddToSpeakersList;
			if (!newSpeaker?.id) return;
			const list = cache.readFragment(ADD_SPEAKER_LIST_FRAGMENT, {
				__typename: 'Speakerslist',
				id: args.speakersListId
			} as Record<string, unknown>) as {
				speakers: Array<{ id: string; position: number; __typename: string }>;
			} | null;
			if (!list) return;
			if (list.speakers.some((s) => s.id === newSpeaker.id)) return;
			const position =
				typeof newSpeaker.position === 'number'
					? (newSpeaker.position as number)
					: list.speakers.length;
			cache.writeFragment(ADD_SPEAKER_LIST_FRAGMENT, {
				__typename: 'Speakerslist',
				id: args.speakersListId,
				speakers: densifySpeakers([
					...list.speakers,
					{ __typename: 'Speakeronlist', id: newSpeaker.id as string, position }
				])
			} as Record<string, unknown>);
		},
		// removeSpeakerOnList: no updates handler needed.
		// The mutation returns the updated parent Speakerslist (speakers array already
		// renumbered), so the link from Speakerslist.speakers is corrected by the
		// mutation result write. cache.invalidate was previously called here to clean up
		// the deleted Speakeronlist entity, but it caused a double RC decrement bug:
		//   1. invalidate() writes undefined to xxx.committeeMember (in the write layer)
		//      → decrements Committeemember:cm1's RC by 1
		//   2. gc() later reads from the BASE layer (unsquashed) where xxx.committeeMember
		//      is still cm1 → decrements cm1's RC a second time → cm1 hits RC=0 → GC'd
		// This briefly removed cm1 from the store, causing committee.members to return
		// null data for that delegate on the next render, producing the visible page flicker.
		// The deleted entity is naturally GC'd by the normal RC=0 path without invalidate.

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
				withAbstentions: args.withAbstentions
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
			const conferenceUserId =
				(deleted.conferenceUserId as string | undefined) ??
				(cache.resolve(event, 'conferenceUserId') as string | undefined);
			const committeeId =
				(deleted.committeeId as string | undefined) ??
				(cache.resolve(event, 'committeeId') as string | undefined);
			if (key) {
				if (conferenceUserId) {
					removeFromList(
						cache,
						{ __typename: 'Conferenceuser', id: conferenceUserId },
						'presenceEvents',
						key
					);
				}
				if (committeeId) {
					removeFromList(
						cache,
						{ __typename: 'Committee', id: committeeId },
						'presenceEvents',
						key
					);
				}
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
			const child = { __typename: 'Amendment', id };

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
				{
					__typename: 'Amendment',
					id,
					type: args.type as string,
					status: (args.status as string | undefined) ?? 'PENDING',
					targetClauseId: (args.targetClauseId as string | undefined) ?? null,
					targetOperativeIndex: (args.targetOperativeIndex as number | undefined) ?? null,
					newContent: (args.newContent as string | undefined) ?? null,
					targetPosition: (args.targetPosition as number | undefined) ?? null,
					paperId: args.paperId as string
				} as Record<string, unknown>
			);

			addToList(
				cache,
				{ __typename: 'Resolutionpaper', id: args.paperId as string },
				'amendments',
				child
			);
			// Update the root-level amendments lists that AmendmentList queries directly.
			// liveQuery uses both a regular query (Query root) and a subscription
			// (Subscription root); link in both so the list updates immediately without
			// waiting for the WS subscription push.
			const paperId = args.paperId as string;
			const childKey = cache.keyOfEntity(child);
			if (childKey) {
				for (const rootType of ['Query', 'Subscription']) {
					const fields = cache
						.inspectFields(rootType)
						.filter(
							(f) =>
								f.fieldName === 'amendments' &&
								(f.arguments as { where?: { paper?: { id?: string } } } | null)?.where?.paper
									?.id === paperId
						);
					for (const f of fields) {
						const current = cache.resolve(rootType, 'amendments', f.arguments) as
							| string[]
							| null
							| undefined;
						if (Array.isArray(current) && !current.includes(childKey)) {
							cache.link(rootType, 'amendments', f.arguments, [...current, childKey]);
						}
					}
				}
			}
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
			const fields: Record<string, unknown> = {};
			if (args.phase !== undefined) fields.phase = args.phase;
			if (args.aiObsolete !== undefined) fields.aiObsolete = args.aiObsolete;
			if (args.aiObsoleteReason !== undefined) fields.aiObsoleteReason = args.aiObsoleteReason;
			if (args.aiRewriteSuggestion !== undefined)
				fields.aiRewriteSuggestion = args.aiRewriteSuggestion;
			if (args.aiRewriteReason !== undefined) fields.aiRewriteReason = args.aiRewriteReason;
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
			// linkOperativeClauseVote is an upsert: if a vote for this clause already
			// exists, remove the stale entry before adding the fresh one so the list
			// stays deduplicated and the old entity is GC'd.
			const paper = { __typename: 'Resolutionpaper', id: args.paperId as string };
			const voteFields = cache
				.inspectFields(paper)
				.filter((f) => f.fieldName === 'operativeClauseVotes');
			for (const f of voteFields) {
				const existing = cache.resolve(paper, 'operativeClauseVotes', f.arguments) as
					| string[]
					| null
					| undefined;
				if (!Array.isArray(existing)) continue;
				for (const k of existing) {
					if (typeof k !== 'string' || !k.startsWith('Operativeclausevote:')) continue;
					const id = k.slice('Operativeclausevote:'.length);
					if (id === (created.id as string)) continue;
					const clauseId = cache.resolve({ __typename: 'Operativeclausevote', id }, 'clauseId');
					if (clauseId === args.clauseId) {
						removeFromList(cache, paper, 'operativeClauseVotes', k);
						cache.invalidate({ __typename: 'Operativeclausevote', id });
					}
				}
			}
			addToList(cache, paper, 'operativeClauseVotes', {
				__typename: 'Operativeclausevote',
				id: created.id as string
			});
		},
		unlinkOperativeClauseVote: (_result, args, cache) => {
			const paper = { __typename: 'Resolutionpaper', id: args.paperId as string };
			const voteFields = cache
				.inspectFields(paper)
				.filter((f) => f.fieldName === 'operativeClauseVotes');
			for (const f of voteFields) {
				const existing = cache.resolve(paper, 'operativeClauseVotes', f.arguments) as
					| string[]
					| null
					| undefined;
				if (!Array.isArray(existing)) continue;
				for (const k of existing) {
					if (typeof k !== 'string' || !k.startsWith('Operativeclausevote:')) continue;
					const id = k.slice('Operativeclausevote:'.length);
					const clauseId = cache.resolve({ __typename: 'Operativeclausevote', id }, 'clauseId');
					if (clauseId === args.clauseId) {
						removeFromList(cache, paper, 'operativeClauseVotes', k);
						cache.invalidate({ __typename: 'Operativeclausevote', id });
					}
				}
			}
		},

		// ---------------------------------------------------------------
		// amendmentSponsor
		// ---------------------------------------------------------------
		addAmendmentSponsor: (result, args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).addAmendmentSponsor;
			if (!created?.id) return;
			const child = { __typename: 'Amendmentsponsor', id: created.id as string };

			// Update Amendment.sponsors (used by AmendmentList for count)
			addToList(
				cache,
				{ __typename: 'Amendment', id: args.amendmentId as string },
				'sponsors',
				child
			);

			// Update root Query.amendmentSponsors (used by AmendmentSponsorPanel liveQuery)
			const childKey = cache.keyOfEntity(child);
			if (childKey) {
				const fields = cache
					.inspectFields('Query')
					.filter(
						(f) =>
							f.fieldName === 'amendmentSponsors' &&
							(f.arguments as { where?: { amendment?: { id?: string } } } | null)?.where?.amendment
								?.id === (args.amendmentId as string)
					);
				for (const f of fields) {
					const current = cache.resolve('Query', 'amendmentSponsors', f.arguments) as
						| string[]
						| null
						| undefined;
					if (!Array.isArray(current) || current.includes(childKey)) continue;
					cache.link('Query', 'amendmentSponsors', f.arguments, [...current, childKey]);
				}
			}
		},

		removeAmendmentSponsor: (_result, args, cache) => {
			const sponsor = { __typename: 'Amendmentsponsor', id: args.id as string };
			const amendmentId = cache.resolve(sponsor, 'amendmentId') as string | undefined;
			if (amendmentId) {
				const key = cache.keyOfEntity(sponsor);
				if (key) {
					// Remove from Amendment.sponsors (used by AmendmentList for count)
					removeFromList(cache, { __typename: 'Amendment', id: amendmentId }, 'sponsors', key);
					// Remove from root Query.amendmentSponsors (used by AmendmentSponsorPanel liveQuery)
					const fields = cache
						.inspectFields('Query')
						.filter(
							(f) =>
								f.fieldName === 'amendmentSponsors' &&
								(f.arguments as { where?: { amendment?: { id?: string } } } | null)?.where
									?.amendment?.id === amendmentId
						);
					for (const f of fields) {
						const current = cache.resolve('Query', 'amendmentSponsors', f.arguments) as
							| string[]
							| null
							| undefined;
						if (!Array.isArray(current)) continue;
						cache.link(
							'Query',
							'amendmentSponsors',
							f.arguments,
							current.filter((k) => k !== key)
						);
					}
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
		// importDelegatorConference — too coarse to optimistically project; just
		// invalidate the conference list so the next query refetches fresh data.
		// ---------------------------------------------------------------
		importDelegatorConference: (result, _args, cache) => {
			const created = (result as Record<string, Record<string, unknown>>).importDelegatorConference;
			if (!created?.id) return;
			// Force the participant/admin conference index queries to refetch since we
			// can't easily project the entire imported tree into the cache.
			const queryFields = cache.inspectFields('Query');
			for (const f of queryFields) {
				if (f.fieldName === 'findManyConferences' || f.fieldName === 'findFirstConference') {
					cache.invalidate('Query', f.fieldName, f.arguments);
				}
			}
		}
	}
};
