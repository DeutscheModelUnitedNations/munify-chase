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
};

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

const localDemoNsaRepresentation = {
	__typename: 'Representation' as const,
	id: 'representation-icrc',
	type: 'NSA' as const,
	name: 'ICRC',
	alpha2Code: null,
	alpha3Code: null,
	faIcon: 'kit-medical',
	regionalGroup: null
};

const localDemoUnRepresentation = {
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

/** Referenced from within a speakers list's own `agendaItem { committee { ... } }`
 * sub-selection (see speakers-list/+page.svelte) — kept separate from
 * `localDemoCommittee` below since that object isn't defined yet at this point. */
const localDemoSpeakersListCommitteeRef = {
	__typename: 'Committee' as const,
	id: 'localcommittee',
	allowDelegationsToAddThemselvesToSpeakersList: true,
	conferenceId: LOCAL_CONFERENCE_ID
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
	agendaItem: { ...localDemoAgendaItem, committee: localDemoSpeakersListCommitteeRef }
};

const localDemoCommentList = {
	...localDemoSpeakersList,
	id: 'localcommentlist',
	type: 'COMMENT_LIST' as const
};

const localDemoCommittee = {
	__typename: 'Committee' as const,
	id: 'localcommittee',
	name: 'General Assembly',
	abbreviation: 'GA',
	activeAgendaItem: {
		...localDemoAgendaItem,
		speakersList: [localDemoSpeakersList, localDemoCommentList] as unknown[]
	} as { __typename: 'Agendaitem'; id: string; title: string; speakersList: unknown[] } | null,
	activeAgendaItemId: localDemoAgendaItem.id as string | null,
	// Same shape as `activeAgendaItem` (rather than a smaller `{id, title}` stub) so a newly
	// selected item — restored from localStorage by loadPersistedLocalDemoAgendaItems, or
	// pushed by createAgendaItem's localDemoExtraMutationEffects entry — can be assigned
	// straight into `activeAgendaItem` without a shape mismatch.
	agendaItems: [
		{
			...localDemoAgendaItem,
			speakersList: [localDemoSpeakersList, localDemoCommentList] as unknown[]
		}
	] as { __typename: 'Agendaitem'; id: string; title: string; speakersList: unknown[] }[],
	activeRollCallSession: null as { __typename: 'Rollcallsession'; id: string } | null,
	activeVotingSession: null as { __typename: 'Votingsession'; id: string } | null,
	activeVotingSessionId: null as string | null,
	activeDraftResolutionId: null as string | null,
	activeDraftResolution: null as { __typename: 'Resolutionpaper'; id: string } | null,
	activeAmendmentId: null as string | null,
	activeAmendment: null as { __typename: 'Amendment'; id: string } | null,
	members: localDemoCommitteeMembers,
	status: 'FORMAL' as const,
	statusHeadline: 'In session',
	statusUntil: new Date(now.getTime() + 60 * 60 * 1000),
	stateOfDebate: null,
	lastResolutionAdoptionDate: null,
	whiteboardContent: null,
	showWhiteboard: true,
	allowDelegationsToAddThemselvesToSpeakersList: true,
	amendmentSubmissionOpen: true,
	amendmentSponsoringOpen: true,
	supportReevaluationOpen: false,
	currentOperativeIndex: 0,
	presentationLayout: 'default',
	presentationRootFontSize: 16,
	presentationResolutionFontSize: 16,
	displayRegionalGroups: false,
	totalPresent: localDemoTotalPresent,
	simpleMajority: calculateMajority(localDemoTotalPresent, 'simple'),
	twoThirdsMajority: calculateMajority(localDemoTotalPresent, 'twoThirds'),
	conference: {
		__typename: 'Conference' as const,
		id: LOCAL_CONFERENCE_ID,
		hasModeratedCaucus: false,
		uniqueConferenceMembers: localDemoUniqueConferenceMembers
	}
};

const localDemoConference = {
	__typename: 'Conference' as const,
	id: LOCAL_CONFERENCE_ID,
	title: 'Local Demo Conference',
	location: 'This device (offline)',
	startDate: now,
	endDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
	committees: [localDemoCommittee]
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
 */
const localDemoEntitiesById = new Map<string, Record<string, unknown>>([
	[`Conference:${localDemoConference.id}`, localDemoConference],
	[`Committee:${localDemoCommittee.id}`, localDemoCommittee],
	...localDemoCommitteeMembers.map(
		(member) => [`Committeemember:${member.id}`, member] as [string, Record<string, unknown>]
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
 * Restores whatever persistLocalDemoState last saved, run once at module load so every seed
 * entity only ever starts from its hardcoded defaults on the true first-ever visit — any later
 * load picks up right where the previous session left off.
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

loadPersistedLocalDemoState();

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

loadPersistedLocalDemoRollCallSessions();

const LOCAL_DEMO_AGENDA_ITEMS_KEY = 'chase-local-demo-agenda-items';

/**
 * `persistLocalDemoState` only patches *scalar* fields already present on a seed entity —
 * `Committee.agendaItems` (a list that grows via createAgendaItem) and `.activeAgendaItem`
 * (a relation, not a scalar) both fall outside that, so they need their own round-trip here,
 * same idea as persistLocalDemoRollCallSessions.
 */
function persistLocalDemoAgendaItems() {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(
			LOCAL_DEMO_AGENDA_ITEMS_KEY,
			JSON.stringify({
				agendaItems: localDemoCommittee.agendaItems,
				activeAgendaItemId: localDemoCommittee.activeAgendaItemId
			})
		);
	} catch {
		// Best-effort only — see persistLocalDemoState.
	}
}

function loadPersistedLocalDemoAgendaItems() {
	if (typeof localStorage === 'undefined') return;
	let raw: string | null;
	try {
		raw = localStorage.getItem(LOCAL_DEMO_AGENDA_ITEMS_KEY);
	} catch {
		return;
	}
	if (!raw) return;
	let persisted: { agendaItems?: unknown; activeAgendaItemId?: string | null };
	try {
		persisted = JSON.parse(raw);
	} catch {
		return;
	}
	if (Array.isArray(persisted.agendaItems)) {
		localDemoCommittee.agendaItems = persisted.agendaItems as typeof localDemoCommittee.agendaItems;
	}
	if (typeof persisted.activeAgendaItemId === 'string' || persisted.activeAgendaItemId === null) {
		localDemoCommittee.activeAgendaItemId = persisted.activeAgendaItemId;
		localDemoCommittee.activeAgendaItem = persisted.activeAgendaItemId
			? (localDemoCommittee.agendaItems.find((item) => item.id === persisted.activeAgendaItemId) ??
				null)
			: null;
	}
}

loadPersistedLocalDemoAgendaItems();

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
 * `rollCallSessions` (presence page's "past roll calls" history): unlike committee/
 * conference, there's no single well-known entity whose in-place mutation this root-level
 * list could passively pick up just by being kept correct in the cache, so it's tracked
 * here directly. `startRollCallSession`'s and `completeRollCallSession`'s real handlers
 * (which set/clear `Committee.activeRollCallSession`) still run first via the real
 * `updates.Mutation` map — this only ever adds to what they already do.
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
	// `commitLocalDemoEntity` only patches scalars/singular relations onto the seed objects —
	// a list field like Committee.agendaItems needs append semantics instead (mirroring
	// addToList's cache-side behavior), so any `committee` query — a different page's, or this
	// same page's after a reload, see resolveLocalDemoRootField — sees the new item too, not
	// just whatever graphcache's own cache happened to already have.
	createAgendaItem: (_args, [entity]) => {
		if (!entity?.id) return;
		if (localDemoCommittee.agendaItems.some((item) => item.id === entity.id)) return;
		localDemoCommittee.agendaItems.push({
			__typename: 'Agendaitem',
			id: entity.id as string,
			title: entity.title as string,
			// Matches optimistic.createAgendaItem's own assumption for a brand new item —
			// the real handler creates two rows for it, but nothing here has read them yet.
			speakersList: []
		});
		persistLocalDemoAgendaItems();
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
			if (id !== undefined && id !== localDemoCommittee.id) return undefined;
			return { committee: localDemoCommittee };
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
	for (const key of Object.keys(fields)) {
		const kind = fieldKind(__typename, key);
		if (kind === 'object') relationFieldNames.push(key);
		else if (kind === 'scalar') scalarFieldNames.push(key);
		// 'list' fields need append semantics (see addToList) — committing them here would
		// clobber the list with just this mutation's own view of it, so they're skipped.
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
	// entry from `agendaItems` (which does) so this stays in the same shape as every other
	// agenda item the seed hands out, and persist it (see persistLocalDemoAgendaItems' doc
	// comment for why this can't go through the generic scalar snapshot above).
	if (__typename === 'Committee' && relationFieldNames.includes('activeAgendaItem')) {
		const activeId = (fields.activeAgendaItem as { id?: string } | null)?.id ?? null;
		localDemoCommittee.activeAgendaItemId = activeId;
		localDemoCommittee.activeAgendaItem = activeId
			? (localDemoCommittee.agendaItems.find((item) => item.id === activeId) ?? null)
			: null;
		persistLocalDemoAgendaItems();
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
