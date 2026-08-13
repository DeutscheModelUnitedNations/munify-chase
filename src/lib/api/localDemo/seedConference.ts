import { gql, type Client } from '@urql/core';
import type {
	Cache,
	OptimisticMutationConfig,
	ResolveInfo,
	UpdatesConfig,
	Variables
} from '@urql/exchange-graphcache';
import worldCountries from 'world-countries';
import { calculateMajority } from '$lib/utils/majorities';
import { LOCAL_CONFERENCE_ID, isLocalConferenceActive } from '$lib/state/localDemo.svelte';
import { densifySpeakers } from '../optimisticUpdateHandlers';
import { schema } from '../rumbleClient/schema';

const now = new Date();

// Mirrors src/api/db/seedUtils.ts's mapping for the real backend seeder — duplicated
// here rather than imported since that file lives under the server-only `$api` tree.
const regionalGroupMapping: Record<
	(typeof worldCountries)[0]['unRegionalGroup'],
	string | undefined
> = {
	'African Group': 'AFRICA',
	'Asia and the Pacific Group': 'ASIA_PACIFIC',
	'Eastern European Group': 'EASTERN_EUROPE',
	'Latin American and Caribbean Group': 'LATIN_AMERICA_CARIBBEAN',
	'Western European and Others Group': 'WESTERN_EUROPE_OTHERS',
	'': undefined
};

function delegationRepresentation(alpha2Code: string) {
	const country = worldCountries.find((c) => c.cca2.toLowerCase() === alpha2Code.toLowerCase())!;
	return {
		__typename: 'Representation' as const,
		id: `representation-${country.cca3.toLowerCase()}`,
		type: 'DELEGATION' as const,
		name: null,
		alpha2Code: country.cca2.toLowerCase(),
		alpha3Code: country.cca3.toLowerCase(),
		faIcon: null,
		regionalGroup: regionalGroupMapping[country.unRegionalGroup]
	};
}

// A representative spread across all five UN regional groups, some present and some
// not, so the presence/attendance UIs have something to show instead of an empty list.
const LOCAL_DEMO_DELEGATION_CODES = [
	{ alpha2Code: 'US', present: true },
	{ alpha2Code: 'GB', present: true },
	{ alpha2Code: 'FR', present: true },
	{ alpha2Code: 'DE', present: true },
	{ alpha2Code: 'CN', present: true },
	{ alpha2Code: 'RU', present: false },
	{ alpha2Code: 'BR', present: true },
	{ alpha2Code: 'IN', present: true },
	{ alpha2Code: 'ZA', present: true },
	{ alpha2Code: 'JP', present: false },
	{ alpha2Code: 'AU', present: true },
	{ alpha2Code: 'EG', present: false }
];

type LocalDemoRepresentation = {
	__typename: 'Representation';
	id: string;
	type: 'DELEGATION' | 'NSA' | 'UN';
	name: string | null;
	alpha2Code: string | null;
	alpha3Code: string | null;
	faIcon: string | null;
	regionalGroup: string | null | undefined;
} & Record<string, unknown>;

const localDemoCommitteeMembers: {
	__typename: 'Committeemember';
	id: string;
	present: boolean;
	representation: LocalDemoRepresentation;
}[] = LOCAL_DEMO_DELEGATION_CODES.map(({ alpha2Code, present }) => ({
	__typename: 'Committeemember' as const,
	id: `committeemember-${alpha2Code.toLowerCase()}`,
	present,
	representation: delegationRepresentation(alpha2Code)
}));

const localDemoNsaRepresentation: LocalDemoRepresentation = {
	__typename: 'Representation' as const,
	id: 'representation-icrc',
	type: 'NSA' as const,
	name: 'ICRC',
	alpha2Code: null,
	alpha3Code: null,
	faIcon: 'kit-medical',
	regionalGroup: null
};

const localDemoUnRepresentation: LocalDemoRepresentation = {
	__typename: 'Representation' as const,
	id: 'representation-un-secretariat',
	type: 'UN' as const,
	name: 'UN Secretariat',
	alpha2Code: null,
	alpha3Code: null,
	faIcon: 'globe',
	regionalGroup: null
};

localDemoCommitteeMembers.push({
	__typename: 'Committeemember' as const,
	id: 'committeemember-icrc',
	present: true,
	representation: localDemoNsaRepresentation
});

/** Every `Representation` under the demo conference (delegations, NSAs, the UN
 * secretariat) — mutable/persisted, grown via createRepresentation on the config
 * page's Delegations/NSA tabs. See persistLocalDemoRepresentations. */
const localDemoRepresentations: LocalDemoRepresentation[] = [
	...localDemoCommitteeMembers.map((m) => m.representation),
	localDemoUnRepresentation
];

const localDemoUniqueConferenceMembers = [
	{
		__typename: 'Conferencemember' as const,
		id: 'conferencemember-un-secretariat',
		representation: localDemoUnRepresentation
	}
];

const localDemoTotalPresent = localDemoCommitteeMembers.filter(
	(m) => m.present && m.representation.type === 'DELEGATION'
).length;

const localDemoAgendaItem = {
	__typename: 'Agendaitem' as const,
	id: 'localagendaitem',
	title: 'General Debate'
};

const localDemoSpeakersList = {
	__typename: 'Speakerslist' as const,
	id: 'localspeakerslist',
	type: 'SPEAKERS_LIST' as const,
	isClosed: false,
	speakingTime: 90,
	timeLeft: 90,
	startTimestamp: null as Date | null,
	phase: 'SPEECH' as const,
	speakers: [] as unknown[],
	agendaItem: {
		...localDemoAgendaItem,
		committee: {
			__typename: 'Committee' as const,
			id: 'localcommittee',
			allowDelegationsToAddThemselvesToSpeakersList: true,
			conferenceId: LOCAL_CONFERENCE_ID
		}
	}
};

const localDemoCommentList = {
	...localDemoSpeakersList,
	id: 'localcommentlist',
	type: 'COMMENT_LIST' as const,
	// Must be a distinct array — spreading localDemoSpeakersList above only copies the
	// *reference* to its `speakers` array, so without this both lists would alias the
	// same array and a speaker added to one would silently appear on the other too.
	speakers: [] as unknown[]
};

type LocalDemoAgendaItemEntry = {
	__typename: 'Agendaitem';
	id: string;
	title: string;
	speakersList: unknown[];
};

type LocalDemoCommittee = {
	__typename: 'Committee';
	id: string;
	name: string;
	abbreviation: string;
	activeAgendaItem: LocalDemoAgendaItemEntry | null;
	activeAgendaItemId: string | null;
	agendaItems: LocalDemoAgendaItemEntry[];
	activeRollCallSession: { __typename: 'Rollcallsession'; id: string } | null;
	activeVotingSession: { __typename: 'Votingsession'; id: string } | null;
	activeVotingSessionId: string | null;
	activeDraftResolutionId: string | null;
	activeDraftResolution: { __typename: 'Resolutionpaper'; id: string } | null;
	activeAmendmentId: string | null;
	activeAmendment: { __typename: 'Amendment'; id: string } | null;
	members: unknown[];
	status: string;
	statusHeadline: string;
	statusUntil: Date;
	stateOfDebate: string | null;
	lastResolutionAdoptionDate: Date | null;
	whiteboardContent: string | null;
	showWhiteboard: boolean;
	allowDelegationsToAddThemselvesToSpeakersList: boolean;
	amendmentSubmissionOpen: boolean;
	amendmentSponsoringOpen: boolean;
	supportReevaluationOpen: boolean;
	currentOperativeIndex: number;
	presentationLayout: string;
	presentationRootFontSize: number;
	presentationResolutionFontSize: number;
	displayRegionalGroups: boolean;
	totalPresent: number;
	simpleMajority: number;
	twoThirdsMajority: number;
	conferenceId: string;
	conference: Record<string, unknown>;
} & Record<string, unknown>;

/** Builds a fresh committee with sensible defaults — used both for the seeded default
 * committee below and for any committee createCommittee's local-demo effect adds later. */
function makeLocalDemoCommittee(
	overrides: Partial<LocalDemoCommittee> & { id: string; name: string; abbreviation: string }
): LocalDemoCommittee {
	return {
		__typename: 'Committee',
		activeAgendaItem: null,
		activeAgendaItemId: null,
		agendaItems: [],
		activeRollCallSession: null,
		activeVotingSession: null,
		activeVotingSessionId: null,
		activeDraftResolutionId: null,
		activeDraftResolution: null,
		activeAmendmentId: null,
		activeAmendment: null,
		members: [],
		status: 'SUSPENSION',
		statusHeadline: '',
		statusUntil: new Date(),
		stateOfDebate: null,
		lastResolutionAdoptionDate: null,
		whiteboardContent: null,
		showWhiteboard: true,
		allowDelegationsToAddThemselvesToSpeakersList: false,
		amendmentSubmissionOpen: true,
		amendmentSponsoringOpen: true,
		supportReevaluationOpen: false,
		currentOperativeIndex: 0,
		presentationLayout: 'default',
		presentationRootFontSize: 16,
		presentationResolutionFontSize: 16,
		displayRegionalGroups: false,
		totalPresent: 0,
		simpleMajority: 0,
		twoThirdsMajority: 0,
		conferenceId: LOCAL_CONFERENCE_ID,
		conference: {
			__typename: 'Conference',
			id: LOCAL_CONFERENCE_ID,
			hasModeratedCaucus: false,
			uniqueConferenceMembers: localDemoUniqueConferenceMembers
		},
		...overrides
	};
}

const localDemoCommittee: LocalDemoCommittee = makeLocalDemoCommittee({
	id: 'localcommittee',
	name: 'General Assembly',
	abbreviation: 'GA',
	activeAgendaItem: {
		...localDemoAgendaItem,
		speakersList: [localDemoSpeakersList, localDemoCommentList]
	},
	activeAgendaItemId: localDemoAgendaItem.id,
	agendaItems: [
		{
			...localDemoAgendaItem,
			speakersList: [localDemoSpeakersList, localDemoCommentList]
		}
	],
	members: localDemoCommitteeMembers,
	status: 'FORMAL',
	statusHeadline: 'In session',
	statusUntil: new Date(now.getTime() + 60 * 60 * 1000),
	allowDelegationsToAddThemselvesToSpeakersList: false,
	totalPresent: localDemoTotalPresent,
	simpleMajority: calculateMajority(localDemoTotalPresent, 'simple'),
	twoThirdsMajority: calculateMajority(localDemoTotalPresent, 'twoThirds')
});

/** Every committee under the demo conference — mutable/persisted, grown/shrunk via
 * createCommittee/deleteCommittee on the config page's Committees tab. Kept as the SAME
 * array instance referenced by `localDemoConference.committees` (mutated in place, never
 * reassigned) so both stay in sync automatically. See persistLocalDemoCommittees. */
const localDemoCommittees: LocalDemoCommittee[] = [localDemoCommittee];

const localDemoConference = {
	__typename: 'Conference' as const,
	id: LOCAL_CONFERENCE_ID,
	title: 'Local Demo Conference',
	pressWebsite: null as string | null,
	location: 'This device (offline)',
	startDate: now,
	endDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
	hasModeratedCaucus: false,
	logoSvg: null as string | null,
	committees: localDemoCommittees,
	// The Users tab (inviting/managing OTHER conference users) doesn't make sense in a
	// single-device offline demo — the config page hides that tab entirely, but the
	// query still selects `users`, so it needs *some* answer rather than `undefined`.
	users: [] as unknown[],
	representations: localDemoRepresentations,
	members: localDemoUniqueConferenceMembers
};

/**
 * Backing store for the `rollCallSessions` root query (presence page's "past roll calls"
 * history) — unlike `committee`/`conference`, this has no single well-known entity for
 * withLocalDemoMutationCommits to keep in sync, so it's a plain live array instead:
 * `startRollCallSession`/`completeRollCallSession` (see localDemoRollCallSessionUpdates
 * below) push/update entries here directly, and resolveLocalDemoRootField always reads
 * the current array — no seed-once gating needed since it's never stale to begin with.
 */
const localDemoRollCallSessions: Record<string, unknown>[] = [];

/**
 * Every seed entity, keyed by `__typename:id` — mutated in place by
 * withLocalDemoMutationCommits so that resolveLocalDemoRootField's canned
 * responses reflect the latest state instead of the original snapshot. Without
 * this, remounting a component (e.g. switching tabs and back) re-issues its
 * query, the client's default `cache-and-network` policy answers that with a
 * fresh "network" result from resolveLocalDemoRootField, and that fresh result
 * — always the original seed data — overwrites whatever a mutation had
 * previously committed to the cache.
 *
 * Committee/Representation entries are rebuilt from scratch on load by
 * loadPersistedLocalDemoCommittees/loadPersistedLocalDemoRepresentations, since those
 * collections can grow/shrink — see the "Committee:"/"Representation:" prefix sweep in
 * each loader.
 */
const localDemoEntitiesById = new Map<string, Record<string, unknown>>([
	[`Conference:${localDemoConference.id}`, localDemoConference],
	[`Committee:${localDemoCommittee.id}`, localDemoCommittee],
	...localDemoCommitteeMembers.map(
		(member) => [`Committeemember:${member.id}`, member] as [string, Record<string, unknown>]
	),
	...localDemoRepresentations.map(
		(rep) => [`Representation:${rep.id}`, rep] as [string, Record<string, unknown>]
	)
]);

function isScalarValue(value: unknown): boolean {
	return value === null || typeof value !== 'object' || value instanceof Date;
}

const LOCAL_DEMO_STORAGE_KEY = 'chase-local-demo-state';

/**
 * Persists every entity's current scalar fields to localStorage, so a mutation's effect
 * survives a full page reload — not just a component remount within the same session. Without
 * this, the objects above are plain in-memory state: a reload re-evaluates this module from
 * scratch, resetting them to their hardcoded defaults regardless of what graphcache's own
 * IndexedDB-persisted cache still remembers.
 */
function persistLocalDemoState() {
	if (typeof localStorage === 'undefined') return;
	const snapshot: Record<string, Record<string, unknown>> = {};
	for (const [key, entity] of localDemoEntitiesById) {
		const scalarFields: Record<string, unknown> = {};
		for (const [field, value] of Object.entries(entity)) {
			if (isScalarValue(value)) scalarFields[field] = value;
		}
		snapshot[key] = scalarFields;
	}
	try {
		localStorage.setItem(LOCAL_DEMO_STORAGE_KEY, JSON.stringify(snapshot));
	} catch {
		// Best-effort only (e.g. storage disabled/full) — falls back to the in-memory state.
	}
}

/**
 * Restores whatever persistLocalDemoState last saved. Run *after* the committees/
 * representations collections have been restored to their persisted shape (see bottom of
 * this file) so a scalar edit (e.g. a renamed committee) can find that committee already
 * registered in localDemoEntitiesById, not just the hardcoded defaults.
 */
function loadPersistedLocalDemoState() {
	if (typeof localStorage === 'undefined') return;
	let raw: string | null;
	try {
		raw = localStorage.getItem(LOCAL_DEMO_STORAGE_KEY);
	} catch {
		return;
	}
	if (!raw) return;
	let persisted: Record<string, Record<string, unknown>>;
	try {
		persisted = JSON.parse(raw);
	} catch {
		return;
	}
	for (const [key, entity] of localDemoEntitiesById) {
		const savedFields = persisted[key];
		if (!savedFields) continue;
		for (const [field, value] of Object.entries(savedFields)) {
			// Dates round-trip through JSON as strings — convert back based on the default's type.
			entity[field] = entity[field] instanceof Date ? new Date(value as string) : value;
		}
	}
}

const LOCAL_DEMO_ROLL_CALL_SESSIONS_KEY = 'chase-local-demo-roll-call-sessions';
const ROLL_CALL_SESSION_DATE_FIELDS = ['createdAt', 'updatedAt', 'completedAt'] as const;

/**
 * Unlike persistLocalDemoState (which only ever patches scalar fields onto seed entities
 * that already exist), roll call sessions don't exist until startRollCallSession creates
 * one at runtime — so the whole array has to round-trip through JSON, not just a patch.
 */
function persistLocalDemoRollCallSessions() {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(
			LOCAL_DEMO_ROLL_CALL_SESSIONS_KEY,
			JSON.stringify(localDemoRollCallSessions)
		);
	} catch {
		// Best-effort only — see persistLocalDemoState.
	}
}

function loadPersistedLocalDemoRollCallSessions() {
	if (typeof localStorage === 'undefined') return;
	let raw: string | null;
	try {
		raw = localStorage.getItem(LOCAL_DEMO_ROLL_CALL_SESSIONS_KEY);
	} catch {
		return;
	}
	if (!raw) return;
	let persisted: Record<string, unknown>[];
	try {
		persisted = JSON.parse(raw);
	} catch {
		return;
	}
	for (const session of persisted) {
		for (const field of ROLL_CALL_SESSION_DATE_FIELDS) {
			if (typeof session[field] === 'string') session[field] = new Date(session[field] as string);
		}
		localDemoRollCallSessions.push(session);
		if (typeof session.id === 'string') {
			localDemoEntitiesById.set(`Rollcallsession:${session.id}`, session);
		}
	}
}

const LOCAL_DEMO_COMMITTEES_KEY = 'chase-local-demo-committees';
// Every Date-typed field that can appear anywhere inside a committee (including nested
// speakers-list entries) — JSON round-trips these as strings, so they need reviving.
const COMMITTEE_DATE_FIELDS = new Set([
	'statusUntil',
	'lastResolutionAdoptionDate',
	'startTimestamp'
]);

function committeeDateReviver(key: string, value: unknown) {
	return typeof value === 'string' && COMMITTEE_DATE_FIELDS.has(key) ? new Date(value) : value;
}

/**
 * Keeps `Committeemember:<id>` entries in localDemoEntitiesById pointing at the member
 * objects actually nested inside `committee.members` — commitLocalDemoEntity resolves
 * mutation targets (e.g. setPresenceForCommitteeMembers) through that map, so a member
 * object that only exists inside the committee tree (never registered here) would have
 * its cache write silently dropped from the durable snapshot on the next persist.
 */
function registerCommitteeMembers(committee: LocalDemoCommittee) {
	for (const member of committee.members as { id: string }[]) {
		localDemoEntitiesById.set(`Committeemember:${member.id}`, member as Record<string, unknown>);
	}
}

/**
 * `persistLocalDemoState` only patches *scalar* fields already present on a seed entity —
 * `Committee.agendaItems`/`.members` (lists that grow via createAgendaItem/
 * createCommitteeMember) and `.activeAgendaItem` (a relation, not a scalar) all fall
 * outside that, as does the very existence of a committee (grown/shrunk via
 * createCommittee/deleteCommittee) — so the whole committees collection round-trips here
 * instead, same idea as persistLocalDemoRollCallSessions.
 */
function persistLocalDemoCommittees() {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(LOCAL_DEMO_COMMITTEES_KEY, JSON.stringify(localDemoCommittees));
	} catch {
		// Best-effort only — see persistLocalDemoState.
	}
}

function loadPersistedLocalDemoCommittees() {
	if (typeof localStorage === 'undefined') return;
	let raw: string | null;
	try {
		raw = localStorage.getItem(LOCAL_DEMO_COMMITTEES_KEY);
	} catch {
		return;
	}
	if (!raw) return;
	let persisted: LocalDemoCommittee[];
	try {
		persisted = JSON.parse(raw, committeeDateReviver);
	} catch {
		return;
	}
	if (!Array.isArray(persisted) || persisted.length === 0) return;

	localDemoCommittees.length = 0;
	localDemoCommittees.push(...persisted);
	for (const key of [...localDemoEntitiesById.keys()]) {
		if (key.startsWith('Committee:') || key.startsWith('Committeemember:')) {
			localDemoEntitiesById.delete(key);
		}
	}
	for (const committee of localDemoCommittees) {
		localDemoEntitiesById.set(`Committee:${committee.id}`, committee);
		registerCommitteeMembers(committee);
	}
}

const LOCAL_DEMO_REPRESENTATIONS_KEY = 'chase-local-demo-representations';

/**
 * Same idea as persistLocalDemoCommittees — the existence of a representation (grown/
 * shrunk via createRepresentation/deleteRepresentation on the config page's Delegations/
 * NSA tabs) isn't a scalar field on any single entity, so the whole collection round-trips.
 */
function persistLocalDemoRepresentations() {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(LOCAL_DEMO_REPRESENTATIONS_KEY, JSON.stringify(localDemoRepresentations));
	} catch {
		// Best-effort only — see persistLocalDemoState.
	}
}

function loadPersistedLocalDemoRepresentations() {
	if (typeof localStorage === 'undefined') return;
	let raw: string | null;
	try {
		raw = localStorage.getItem(LOCAL_DEMO_REPRESENTATIONS_KEY);
	} catch {
		return;
	}
	if (!raw) return;
	let persisted: LocalDemoRepresentation[];
	try {
		persisted = JSON.parse(raw);
	} catch {
		return;
	}
	if (!Array.isArray(persisted) || persisted.length === 0) return;

	localDemoRepresentations.length = 0;
	localDemoRepresentations.push(...persisted);
	for (const key of [...localDemoEntitiesById.keys()]) {
		if (key.startsWith('Representation:')) localDemoEntitiesById.delete(key);
	}
	for (const rep of localDemoRepresentations) {
		localDemoEntitiesById.set(`Representation:${rep.id}`, rep);
	}
}

// Order matters: restore the growable collections (and re-register their entities into
// localDemoEntitiesById) BEFORE patching scalar fields onto whatever's now registered —
// otherwise a scalar edit to a committee/representation created in an earlier session
// would find nothing to patch yet and silently be dropped.
loadPersistedLocalDemoCommittees();
loadPersistedLocalDemoRepresentations();
loadPersistedLocalDemoState();
loadPersistedLocalDemoRollCallSessions();

type LocalDemoSpeaker = { id: string; position: number } & Record<string, unknown>;
type LocalDemoSpeakersListEntity = {
	__typename?: string;
	id: string;
	speakers: LocalDemoSpeaker[];
} & Record<string, unknown>;

/** Finds a committee by id across the live committees collection. */
function findLocalDemoCommittee(committeeId: string): LocalDemoCommittee | undefined {
	return localDemoCommittees.find((c) => c.id === committeeId);
}

/** Finds a speakers list by id across every committee's every agenda item's `speakersList`
 * — the seeded default pair (`localDemoSpeakersList`/`localDemoCommentList`) as well as any
 * list belonging to a TOP created at runtime via createAgendaItem's own effect below. */
function findLocalDemoSpeakersList(
	speakersListId: string
): LocalDemoSpeakersListEntity | undefined {
	for (const committee of localDemoCommittees) {
		for (const agendaItem of committee.agendaItems) {
			const list = (agendaItem.speakersList as LocalDemoSpeakersListEntity[] | undefined)?.find(
				(l) => l.id === speakersListId
			);
			if (list) return list;
		}
	}
	return undefined;
}

/**
 * Like createAgendaItem's own effect, `commitLocalDemoEntity` skips `Speakerslist.speakers`
 * entirely (it's a 'list' field), so a newly added/removed/moved speaker only ever lives in
 * graphcache's own cache — never in the seed snapshot the "committee"/"conference" queries
 * fall back to for any query operation that hasn't been freshly answered yet (a different
 * page's differently-shaped query, or this same page's query after a reload). Without these
 * effects that stale, always-empty seed snapshot silently overwrites whatever the cache
 * already holds, which is what makes speakers vanish or reappear duplicated.
 */
function addLocalDemoSpeaker(speakersListId: string, speaker: LocalDemoCommittableEntity) {
	if (!speaker.id) return;
	const list = findLocalDemoSpeakersList(speakersListId);
	if (!list) return;
	if (list.speakers.some((s) => s.id === speaker.id)) return;
	list.speakers.push(speaker as LocalDemoSpeaker);
	persistLocalDemoCommittees();
}

/** Replaces a list's speakers with `incoming` (id + position only, as produced by the
 * remove/self-remove optimistic handlers), preserving each surviving speaker's existing
 * richer fields (committeeMember, representation, etc.) rather than discarding them. */
function replaceLocalDemoSpeakers(speakersListId: string, incoming: LocalDemoSpeaker[]) {
	const list = findLocalDemoSpeakersList(speakersListId);
	if (!list) return;
	const byId = new Map(list.speakers.map((s) => [s.id, s]));
	list.speakers = incoming.map((s) => ({ ...(byId.get(s.id) ?? {}), ...s }));
	persistLocalDemoCommittees();
}

/**
 * Not a real backend mutation — client.ts intercepts any operation whose
 * context carries `localDemoSeed` and answers it synthetically without
 * touching the network. Routing the seed through a (fake) mutation rather
 * than writing to the cache directly is what lets graphcache normalize and
 * persist the Conference entity the same way it would a real server
 * response.
 */
const SEED_LOCAL_DEMO_CONFERENCE_MUTATION = gql`
	mutation SeedLocalDemoConference {
		seedLocalDemoConference {
			id
			title
			location
			startDate
			endDate
			committees {
				id
				name
				abbreviation
				activeAgendaItem {
					id
					title
				}
				status
				statusHeadline
				statusUntil
				stateOfDebate
				lastResolutionAdoptionDate
			}
		}
	}
`;

/**
 * Links the newly-written Conference entity into the `conferences` root
 * list. This has to live in `updates` rather than a `resolvers` config —
 * graphcache throws "Invalid Cache write" if `cache.link`/`cache.writeFragment`
 * are called from a resolver, since resolvers run during cache reads and must
 * stay read-only. `updates` runs during the write of a mutation result, where
 * writes are allowed.
 */
export const localDemoConferenceUpdates: UpdatesConfig['Mutation'] = {
	seedLocalDemoConference: (_result, _args, cache) => {
		const key = cache.keyOfEntity(localDemoConference);
		if (!key) return;
		const existing = cache.resolve('Query', 'conferences') as string[] | null;
		if (Array.isArray(existing)) {
			if (!existing.includes(key)) cache.link('Query', 'conferences', [...existing, key]);
		} else {
			cache.link('Query', 'conferences', [key]);
		}
	}
};

/**
 * Extra local-demo-only side effects that run *alongside* (not instead of) a mutation's
 * real `updates` handler — see withLocalDemoMutationCommits, which calls both. Needed for
 * list-typed fields (see fieldKind/commitLocalDemoEntity): unlike a single well-known
 * entity's own scalar fields, a *list*'s membership (which committees/representations/
 * agenda items/speakers exist) isn't picked up by the generic committer, so it's tracked
 * here directly, mirroring addToList's cache-side append/remove semantics.
 */
const localDemoExtraMutationEffects: Record<
	string,
	(args: Variables, producedEntities: LocalDemoCommittableEntity[]) => void
> = {
	startRollCallSession: (_args, [entity]) => {
		if (!entity?.id) return;
		if (localDemoRollCallSessions.some((s) => s.id === entity.id)) return;
		localDemoRollCallSessions.push(entity);
		localDemoEntitiesById.set(`Rollcallsession:${entity.id}`, entity);
		persistLocalDemoRollCallSessions();
	},
	completeRollCallSession: (args) => {
		const session = localDemoRollCallSessions.find((s) => s.id === args.id);
		if (!session) return;
		session.completedAt = new Date();
		persistLocalDemoRollCallSessions();
	},
	// ---------------------------------------------------------------
	// committee.ts
	// ---------------------------------------------------------------
	createCommittee: (_args, [entity]) => {
		if (!entity?.id) return;
		if (findLocalDemoCommittee(entity.id as string)) return;
		const committee = makeLocalDemoCommittee({
			id: entity.id as string,
			name: entity.name as string,
			abbreviation: entity.abbreviation as string
		});
		localDemoCommittees.push(committee);
		localDemoEntitiesById.set(`Committee:${committee.id}`, committee);
		persistLocalDemoCommittees();
	},
	deleteCommittee: (args) => {
		const id = args.id as string;
		const index = localDemoCommittees.findIndex((c) => c.id === id);
		if (index === -1) return;
		localDemoCommittees.splice(index, 1);
		localDemoEntitiesById.delete(`Committee:${id}`);
		persistLocalDemoCommittees();
	},
	// ---------------------------------------------------------------
	// committeeMember.ts — assigning/unassigning a delegation to a committee
	// ---------------------------------------------------------------
	createCommitteeMember: (args, [entity]) => {
		if (!entity?.id) return;
		const committee = findLocalDemoCommittee(args.committeeId as string);
		if (!committee) return;
		if ((committee.members as { id: string }[]).some((m) => m.id === entity.id)) return;
		committee.members.push(entity);
		localDemoEntitiesById.set(`Committeemember:${entity.id}`, entity as Record<string, unknown>);
		persistLocalDemoCommittees();
	},
	deleteCommitteeMember: (args) => {
		const id = args.id as string;
		for (const committee of localDemoCommittees) {
			const index = (committee.members as { id: string }[]).findIndex((m) => m.id === id);
			if (index !== -1) {
				committee.members.splice(index, 1);
				localDemoEntitiesById.delete(`Committeemember:${id}`);
				persistLocalDemoCommittees();
				return;
			}
		}
	},
	// ---------------------------------------------------------------
	// representation.ts
	// ---------------------------------------------------------------
	createRepresentation: (_args, [entity]) => {
		if (!entity?.id) return;
		if (localDemoRepresentations.some((r) => r.id === entity.id)) return;
		localDemoRepresentations.push(entity as LocalDemoRepresentation);
		localDemoEntitiesById.set(`Representation:${entity.id}`, entity);
		persistLocalDemoRepresentations();
	},
	deleteRepresentation: (args) => {
		const id = args.id as string;
		const index = localDemoRepresentations.findIndex((r) => r.id === id);
		if (index === -1) return;
		localDemoRepresentations.splice(index, 1);
		localDemoEntitiesById.delete(`Representation:${id}`);
		// Mirror the server's cascade: drop any committee membership pointing at this
		// representation, same as updates.Mutation.deleteRepresentation's cache-side cascade.
		let committeesChanged = false;
		for (const committee of localDemoCommittees) {
			const before = committee.members.length;
			committee.members = (committee.members as { representation: { id: string } }[]).filter(
				(m) => m.representation?.id !== id
			);
			if (committee.members.length !== before) committeesChanged = true;
		}
		persistLocalDemoRepresentations();
		if (committeesChanged) persistLocalDemoCommittees();
	},
	// ---------------------------------------------------------------
	// agendaItem.ts
	// ---------------------------------------------------------------
	// `commitLocalDemoEntity` only patches scalars/singular relations onto the seed objects —
	// a list field like Committee.agendaItems needs append semantics instead (mirroring
	// addToList's cache-side behavior), so any `committee` query — a different page's, or this
	// same page's after a reload, see resolveLocalDemoRootField — sees the new item too, not
	// just whatever graphcache's own cache happened to already have.
	createAgendaItem: (args, [entity]) => {
		if (!entity?.id) return;
		const committee = findLocalDemoCommittee(args.committeeId as string);
		if (!committee) return;
		if (committee.agendaItems.some((item) => item.id === entity.id)) return;
		committee.agendaItems.push({
			__typename: 'Agendaitem',
			id: entity.id as string,
			title: entity.title as string,
			// optimistic.createAgendaItem now builds the two child speakersList rows
			// (client-supplied ids), so the committed entity already carries them.
			speakersList: (entity.speakersList as unknown[]) ?? []
		});
		persistLocalDemoCommittees();
	},
	addSpeakerOnList: (args, [entity]) => {
		if (!entity) return;
		addLocalDemoSpeaker(args.speakersListId as string, entity);
	},
	selfAddToSpeakersList: (args, [entity]) => {
		if (!entity) return;
		addLocalDemoSpeaker(args.speakersListId as string, entity);
	},
	// removeSpeakerOnList/selfRemoveFromSpeakersList's optimistic handlers already return the
	// full recomputed Speakerslist (id + densified speakers), so there's no separate args-based
	// list id to look up — the produced entity's own id IS the speakersListId.
	removeSpeakerOnList: (_args, [entity]) => {
		if (!entity?.id) return;
		replaceLocalDemoSpeakers(entity.id as string, (entity.speakers as LocalDemoSpeaker[]) ?? []);
	},
	selfRemoveFromSpeakersList: (_args, [entity]) => {
		if (!entity?.id) return;
		replaceLocalDemoSpeakers(entity.id as string, (entity.speakers as LocalDemoSpeaker[]) ?? []);
	},
	moveSpeakerToPosition: (_args, [entity]) => {
		if (!entity?.id) return;
		const speakersListId = entity.speakersListId as string | undefined;
		const targetPosition = entity.position as number | undefined;
		if (!speakersListId || typeof targetPosition !== 'number') return;

		const list = findLocalDemoSpeakersList(speakersListId);
		if (!list) return;
		const currentPosition = list.speakers.find((s) => s.id === entity.id)?.position;
		if (currentPosition === undefined || currentPosition === targetPosition) return;

		// Mirror optimistic.moveSpeakerToPosition's shift semantics.
		const shifted = list.speakers.map((s) => {
			if (s.id === entity.id) return { ...s, position: targetPosition };
			if (targetPosition > currentPosition) {
				if (s.position > currentPosition && s.position <= targetPosition) {
					return { ...s, position: s.position - 1 };
				}
			} else if (s.position >= targetPosition && s.position < currentPosition) {
				return { ...s, position: s.position + 1 };
			}
			return s;
		});
		list.speakers = densifySpeakers(shifted);
		persistLocalDemoCommittees();
	},
	updateSpeakerOnList: (_args, [entity]) => {
		if (!entity?.id) return;
		for (const committee of localDemoCommittees) {
			for (const agendaItem of committee.agendaItems) {
				for (const list of (agendaItem.speakersList as LocalDemoSpeakersListEntity[] | undefined) ??
					[]) {
					const speaker = list.speakers.find((s) => s.id === entity.id);
					if (!speaker) continue;
					speaker.overwriteName = entity.overwriteName ?? null;
					persistLocalDemoCommittees();
					return;
				}
			}
		}
	}
};

/**
 * `committee`/`conference`/`conferences` answer with the FULL hardcoded seed object,
 * embedding nested entities (members, agendaItems, activeAgendaItem.speakersList, etc.)
 * that mutations update permanently in the cache via `withLocalDemoMutationCommits`
 * below. Because the client always runs `cache-and-network`, every single query for
 * these fields — not just the very first one — re-triggers this "network" answer, which
 * would otherwise re-serve the same original nested objects every time and silently
 * overwrite whatever a mutation had since written to the cache.
 *
 * Once a given *operation* (this exact query document + variables, identified by urql's own
 * `operation.key`) has successfully answered once, there's nothing further to add for that
 * operation — the cache already holds everything its own selection needs, kept correct by
 * ordinary mutation `updates` handlers exactly as it would be for a real backend. So on every
 * later occurrence of that same operation, this returns `null` (see LocalDemoFieldAnswer below)
 * to defer entirely to the cache instead of re-answering.
 *
 * This has to be keyed by the exact operation, not just by entity (e.g. "committee for this
 * committeeId") — different pages select different subsets of fields for the "same" entity,
 * and each such distinct query needs its OWN one real answer to ever get the fields it asked
 * for and set up graphcache's dependency tracking for its own subscription. Gating by entity
 * alone means whichever page's query happens to run first "wins" and every other page's
 * differently-shaped query for that entity gets `null` forever — never receiving real data at
 * all, since it has no cache entry of its own to defer to yet. (Learned this the hard way: an
 * earlier version did exactly that and broke live updates entirely for any page other than the
 * first one to query a given entity — see git history.)
 *
 * This deliberately does NOT persist across a reload (in-memory `Set` only, reset on every
 * fresh module evaluation) — a reload gets a genuinely fresh answer for every operation, same
 * as the very first load ever did. That's what makes it safe to rely on the seed objects
 * (`localDemoCommittee` et al.) rather than graphcache's own IndexedDB-persisted cache for
 * reload correctness: `withLocalDemoMutationCommits` keeps them patched in place for every
 * mutation (see `commitLocalDemoEntity` and `localDemoExtraMutationEffects`), so "answer fresh
 * again" and "answer with whatever a previous session mutated" are the same thing — and unlike
 * waiting on graphcache's storage restore (an async IndexedDB round trip racing against this
 * component's first render), reading it back out of the seed objects is synchronous. Restoring
 * this Set from localStorage instead — so a reload defers to graphcache's cache like any other
 * later-in-session query — was tried and reverted: that IndexedDB restore doesn't reliably win
 * the race against the page's very first query on a cold load, so the query would defer to a
 * cache that isn't there yet and never correct itself afterwards (no further network answer
 * ever arrives for an operation this guard considers already-answered).
 */
const DEFERRABLE_QUERY_FIELDS = new Set(['committee', 'conference', 'conferences']);
const answeredOperationKeys = new Set<number>();

/**
 * `Record<string, unknown>`: canned success data.
 * `undefined`: genuinely unhandled field — caller should answer with an offline error.
 * `null`: a handled field whose answer has already been served for this exact operation
 * — caller should neither error nor emit new data, deferring entirely to the cache.
 */
export type LocalDemoFieldAnswer = Record<string, unknown> | undefined | null;

/**
 * Canned answers for the handful of queries pages under the local conference route need
 * in order to render at all without a backend. Used by both the browser exchange
 * (localDemoExchange) and the SSR remote-functions exchange (remoteFunctionsExchange) in
 * client.ts. `operationKey` is urql's `Operation.key` — omit it (e.g. from SSR, which has
 * no persistent cache to defer to) to always get a fresh answer.
 */
export function resolveLocalDemoRootField(
	fieldName: string | undefined,
	variables: unknown,
	operationKey?: number
): LocalDemoFieldAnswer {
	if (
		fieldName &&
		operationKey !== undefined &&
		DEFERRABLE_QUERY_FIELDS.has(fieldName) &&
		answeredOperationKeys.has(operationKey)
	) {
		return null;
	}

	const data = computeLocalDemoCannedAnswer(fieldName, variables);
	if (data && fieldName && operationKey !== undefined && DEFERRABLE_QUERY_FIELDS.has(fieldName)) {
		answeredOperationKeys.add(operationKey);
	}
	return data;
}

function computeLocalDemoCannedAnswer(
	fieldName: string | undefined,
	variables: unknown
): Record<string, unknown> | undefined {
	switch (fieldName) {
		case 'isGlobalAdmin':
			return { isGlobalAdmin: true };
		case 'conferenceUsers':
			return { conferenceUsers: [] };
		case 'committeeMembers':
			return { committeeMembers: localDemoCommitteeMembers };
		case 'rollCallSessions':
			return { rollCallSessions: localDemoRollCallSessions };
		case 'presenceEvents':
			return { presenceEvents: [] };
		case 'resolutionPapers':
			return { resolutionPapers: [] };
		case 'conference': {
			const id = (variables as { id?: string } | null | undefined)?.id;
			if (id !== undefined && id !== LOCAL_CONFERENCE_ID) return undefined;
			return { conference: localDemoConference };
		}
		case 'conferences':
			return { conferences: [localDemoConference] };
		case 'committee': {
			const id = (variables as { id?: string } | null | undefined)?.id;
			const match = id !== undefined ? findLocalDemoCommittee(id) : localDemoCommittees[0];
			if (!match) return undefined;
			return { committee: match };
		}
		default:
			return undefined;
	}
}

type LocalDemoCommittableEntity = { __typename?: string } & Record<string, unknown>;

type IntrospectionTypeRef = { kind: string; name?: string; ofType?: IntrospectionTypeRef | null };

/** Whether `typename.fieldName` is a to-one relation (needs `cache.link`) vs a scalar/enum
 * (needs `writeFragment`) or a to-many list (needs list-append semantics, e.g. addToList —
 * committing it here would overwrite the list instead of growing it, so it's left alone). */
const FIELD_KIND_CACHE = new Map<string, 'scalar' | 'object' | 'list'>();
function fieldKind(typename: string, fieldName: string): 'scalar' | 'object' | 'list' {
	const cacheKey = `${typename}.${fieldName}`;
	const cached = FIELD_KIND_CACHE.get(cacheKey);
	if (cached) return cached;

	const type = schema.__schema.types.find((t) => t.kind === 'OBJECT' && t.name === typename);
	const field =
		type && 'fields' in type ? type.fields?.find((f) => f.name === fieldName) : undefined;

	let kind: 'scalar' | 'object' | 'list' = 'scalar';
	if (field) {
		let ref = field.type as IntrospectionTypeRef;
		let isList = false;
		while (ref && (ref.kind === 'NON_NULL' || ref.kind === 'LIST')) {
			if (ref.kind === 'LIST') isList = true;
			ref = ref.ofType as IntrospectionTypeRef;
		}
		kind = isList ? 'list' : ref?.kind === 'OBJECT' ? 'object' : 'scalar';
	}
	FIELD_KIND_CACHE.set(cacheKey, kind);
	return kind;
}

/**
 * Writes one optimistic-shaped entity permanently into the cache — allowed here because
 * `updates` runs during a real write, unlike a `resolvers` config which is read-only. That
 * makes the change permanent instead of just "optimistic for as long as the mutation is in
 * flight," so any live query reading that entity reflects it going forward, not just for an
 * instant.
 */
function commitLocalDemoEntity(cache: Cache, entity: LocalDemoCommittableEntity | undefined) {
	if (!entity?.__typename) return;
	const { __typename, ...fields } = entity;

	const scalarFieldNames: string[] = [];
	const relationFieldNames: string[] = [];
	const emptyListFieldNames: string[] = [];
	for (const key of Object.keys(fields)) {
		const kind = fieldKind(__typename, key);
		if (kind === 'object') relationFieldNames.push(key);
		else if (kind === 'scalar') scalarFieldNames.push(key);
		else if (
			kind === 'list' &&
			Array.isArray(fields[key]) &&
			(fields[key] as unknown[]).length === 0
		) {
			// A genuinely empty list (e.g. a brand-new Committee's `members: []`) is safe to
			// link directly — there's nothing to clobber yet. A non-empty list still needs
			// addToList-style append semantics instead (committing it here would clobber the
			// list with just this mutation's own view of it), so those stay skipped. Without
			// this, a newly created entity's list field is never written at all unless the
			// mutation's OWN selection set happened to ask for it — any query with a broader
			// selection than that (e.g. a page listing every committee's members) can't
			// resolve the new entity from cache and, offline, never gets a network round trip
			// to fill the gap either, so the new entity silently never appears anywhere.
			emptyListFieldNames.push(key);
		}
	}

	if (scalarFieldNames.length > 0) {
		cache.writeFragment(
			gql`fragment LocalDemoMutationCommit on ${__typename} { ${scalarFieldNames.join(' ')} }`,
			entity
		);
	}

	// Singular relations (e.g. Committee.activeAgendaItem) can't go through writeFragment —
	// an object-typed field needs its own GraphQL sub-selection, not a bare field name — so
	// link them directly instead. Without this, selecting a new agenda item/voting
	// session/etc. only ever set the *Id scalar column; the UI reads the relation object
	// itself and the selection would revert once the optimistic layer cleared.
	for (const key of relationFieldNames) {
		const value = fields[key] as { __typename?: string; id?: string } | null;
		cache.link(
			{ __typename, id: entity.id as string },
			key,
			value && typeof value.__typename === 'string' && typeof value.id === 'string'
				? { __typename: value.__typename, id: value.id }
				: null
		);
	}

	for (const key of emptyListFieldNames) {
		cache.link({ __typename, id: entity.id as string }, key, []);
	}

	// Keep the seed's own snapshot in sync too — see localDemoEntitiesById — so a *different*
	// page's first-ever (and therefore genuinely fresh-answered, see resolveLocalDemoRootField)
	// query for this entity sees the change instead of the original hardcoded relation.
	const known = localDemoEntitiesById.get(`${__typename}:${entity.id}`);
	if (known) {
		for (const name of relationFieldNames) known[name] = fields[name];
		for (const name of scalarFieldNames) known[name] = fields[name];
		persistLocalDemoState();
	}

	// `optimistic.updateCommittee` only produces a minimal `{__typename, id}` stub for
	// activeAgendaItem (it doesn't know the item's title/speakersList) — swap in the full
	// entry from that committee's own `agendaItems` (which does) so this stays in the same
	// shape as every other agenda item the seed hands out, and persist it (see
	// persistLocalDemoCommittees' doc comment for why this can't go through the generic
	// scalar snapshot above).
	if (__typename === 'Committee' && relationFieldNames.includes('activeAgendaItem')) {
		const committee = findLocalDemoCommittee(entity.id as string);
		if (committee) {
			const activeId = (fields.activeAgendaItem as { id?: string } | null)?.id ?? null;
			committee.activeAgendaItemId = activeId;
			committee.activeAgendaItem = activeId
				? (committee.agendaItems.find((item) => item.id === activeId) ?? null)
				: null;
			persistLocalDemoCommittees();
		}
	}
}

/**
 * Every mutation (see makeLocalDemoMutationResult in client.ts) resolves successfully with a
 * "confirmed" result, but graphcache only persists the fields present in the mutation's *own*
 * GraphQL selection set (often just `id`) from that — everything else that was only ever set
 * via the `optimistic` config (e.g. a committee's new status) gets discarded the moment that
 * optimistic layer tears down, reverting the UI right back.
 *
 * There's no real backend to confirm those other fields with, so this re-runs the exact same
 * `optimistic` handler that already produced the entity/entities for the optimistic layer, and
 * writes the result(s) straight into the cache via commitLocalDemoEntity, making the change
 * permanent. Wraps `realUpdates` in a Proxy so a mutation's own explicit handler (e.g.
 * seedLocalDemoConference's cache.link call, or a real handler that assumes a subscription will
 * arrive later to confirm the true values — never true offline) still runs first, and this
 * generic committer *also* runs afterwards to actually persist what the real handler alone
 * wouldn't — but only while `isLocalConferenceActive()`; for a real conference this is a no-op,
 * identical to there being no wrapping at all.
 */
export function withLocalDemoMutationCommits(
	realUpdates: UpdatesConfig['Mutation'],
	optimisticConfig: OptimisticMutationConfig
): UpdatesConfig['Mutation'] {
	return new Proxy(realUpdates ?? {}, {
		get(target, prop, receiver) {
			const existing = Reflect.get(target, prop, receiver) as
				((result: unknown, args: Variables, cache: Cache, info: ResolveInfo) => void) | undefined;
			if (typeof prop !== 'string') return existing;

			return (result: unknown, args: Variables, cache: Cache, info: ResolveInfo) => {
				existing?.(result, args, cache, info);
				if (!isLocalConferenceActive()) return;
				const produced = optimisticConfig[prop]?.(args, cache, info);
				const entities = (Array.isArray(produced) ? produced : [produced]) as (
					LocalDemoCommittableEntity | undefined
				)[];
				for (const entity of entities) {
					commitLocalDemoEntity(cache, entity);
				}
				localDemoExtraMutationEffects[prop]?.(
					args,
					entities.filter((e): e is LocalDemoCommittableEntity => !!e?.__typename)
				);
			};
		}
	});
}

let seeded = false;

/** Very rudimentary offline seed: fires once per app load so the local demo
 * conference shows up in the launcher's `conferences` list without a backend. */
export function seedLocalDemoConference(urqlClient: Client) {
	if (seeded) return;
	seeded = true;
	urqlClient
		.mutation(
			SEED_LOCAL_DEMO_CONFERENCE_MUTATION,
			{},
			{ localDemoSeed: { seedLocalDemoConference: localDemoConference } }
		)
		.toPromise();
}
