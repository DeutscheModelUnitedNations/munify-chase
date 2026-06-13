import { gql } from '@urql/core';
import type {
	Cache,
	OptimisticMutationConfig,
	UpdatesConfig
} from '@urql/exchange-graphcache';
import { nanoid } from '$lib/helpers/nanoid';
import { attendanceCode as generateAttendanceCode } from '$lib/helpers/attendanceCode';
import { getServerTime } from '$lib/state/serverClock.svelte';

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
	setPresenceForCommitteeMembers: (args) =>
		(args.ids as string[]).map((id) => ({
			__typename: 'Committeemember',
			id,
			present: args.present
		})),

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
	startRollCallSession: (args, cache) => {
		// Resume the active session for this committee if one is already cached — the
		// server does the same lookup and returns the existing record on a duplicate start.
		const existing = findActiveSessionId(cache, 'Rollcallsession', args.committeeId as string);
		const id = existing ?? ensureId(args.id);
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

		const updatedSpeakers = [...shifted, added];

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

		return {
			__typename: 'Speakeronlist',
			id: newId,
			position,
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
			speakers: remaining.map((s) => ({
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

		return {
			__typename: 'Speakeronlist',
			id: newId,
			position,
			speakersListId: args.speakersListId,
			speakersList: { __typename: 'Speakerslist', id: args.speakersListId as string },
			overwriteName: null,
			committeeMemberId,
			conferenceMemberId,
			committeeMember: committeeMemberId
				? { __typename: 'Committeemember', id: committeeMemberId }
				: null,
			conferenceMember: conferenceMemberId
				? { __typename: 'Conferencemember', id: conferenceMemberId }
				: null
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
			speakers: remaining.map((s) => ({
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
		cache.writeFragment(ADD_SPEAKER_LIST_FRAGMENT, {
			__typename: 'Speakerslist',
			id: target.speakersListId,
			speakers: updatedSpeakers.map((s) => ({
				__typename: 'Speakeronlist',
				id: s.id,
				position: s.position
			}))
		} as unknown as Record<string, unknown>);

		return {
			__typename: 'Speakeronlist',
			id: args.id,
			position: targetPos,
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
	startVotingSession: (args, cache) => {
		const existing = findActiveSessionId(cache, 'Votingsession', args.committeeId as string);
		const id = existing ?? ensureId(args.id);
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

function findActiveSessionId(
	cache: Cache,
	typename: 'Rollcallsession' | 'Votingsession',
	committeeId: string
): string | null {
	const queryFields = cache.inspectFields('Query');
	const keys = new Set<string>();
	const prefix = `${typename}:`;
	for (const f of queryFields) {
		const value = cache.resolve('Query', f.fieldName, f.arguments);
		if (Array.isArray(value)) {
			for (const v of value) if (typeof v === 'string' && v.startsWith(prefix)) keys.add(v);
		} else if (typeof value === 'string' && value.startsWith(prefix)) {
			keys.add(value);
		}
	}
	for (const key of keys) {
		const id = key.slice(prefix.length);
		const data = readEntity<{
			id: string;
			committeeId?: string;
			completedAt?: string | Date | null;
		}>(
			cache,
			typename === 'Rollcallsession'
				? gql`
						fragment ActiveRollCallSnapshot on Rollcallsession {
							id
							committeeId
							completedAt
						}
					`
				: gql`
						fragment ActiveVotingSnapshot on Votingsession {
							id
							committeeId
							completedAt
						}
					`,
			{ __typename: typename, id }
		);
		if (!data) continue;
		if (data.committeeId !== committeeId) continue;
		if (data.completedAt) continue;
		return data.id;
	}
	return null;
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
			void args;
			void cache;
		},
		completeRollCallSession: (_result, args, cache) => {
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
				speakers: [
					...shifted,
					{ __typename: 'Speakeronlist', id: newSpeaker.id as string, position }
				]
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
				speakers: [
					...list.speakers,
					{ __typename: 'Speakeronlist', id: newSpeaker.id as string, position }
				]
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
