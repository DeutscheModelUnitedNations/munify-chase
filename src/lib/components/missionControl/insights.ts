import type { CommitteestatusEnum, VotingmodeEnum } from '#lib/api/rumbleClient/client';
import { compareSpeakers } from '#lib/helpers/speakerSort';
import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';

export interface InsightRepresentation {
	name?: string | null;
	alpha2Code?: string | null;
	alpha3Code?: string | null;
	icon?: string | null;
	type?: string | null;
}

export interface InsightSpeaker {
	id: string;
	position: number;
	overwriteName?: string | null;
	committeeMember?: { representation?: InsightRepresentation | null } | null;
	conferenceMember?: { representation?: InsightRepresentation | null } | null;
}

export interface InsightCommittee {
	id: string;
	abbreviation: string;
	name: string;
	status: CommitteestatusEnum;
	statusUntil: Date;
	// Set by the chairs: a custom status text and the state of debate
	statusHeadline?: string | null;
	stateOfDebate?: string | null;
	totalPresent?: number | null;
	members?: Array<{ present: boolean; representation?: { type?: string | null } | null }> | null;
	activeAgendaItem?: {
		title?: string | null;
		speakersList?: Array<{
			isClosed: boolean;
			startTimestamp?: Date | null;
			speakers: InsightSpeaker[];
		}> | null;
	} | null;
	votingSessions?: Array<{
		id: string;
		mode: VotingmodeEnum;
		voteName?: string | null;
		createdAt: Date;
	}> | null;
}

export interface InsightPulse {
	heartbeat: {
		speechesToday: number;
		votesHeldToday: number;
		resolutionsAdoptedToday: number;
		debateSecondsToday: number;
	};
	busiestCommittee: {
		committeeAbbreviation: string;
		committeeName: string;
		interventionCount: number;
	} | null;
	closestVote: {
		committeeAbbreviation: string;
		committeeName: string;
		voteName?: string | null;
		votesPro: number;
		votesCon: number;
		margin: number;
	} | null;
	recentAdoptions: Array<{
		committeeAbbreviation: string;
		committeeName: string;
		paperTitle?: string | null;
		documentNumber?: string | null;
		agendaItemTitle: string;
		adoptedAt: Date;
	}>;
	committeeActivityLeaderboard: Array<{
		committeeAbbreviation: string;
		committeeName: string;
		totalSpeakingSeconds: number;
		speechCount: number;
		voteCount: number;
	}>;
	speakingByRegion: Array<{
		group: string;
		totalSeconds: number;
		delegationCount: number;
		speechCount: number;
	}>;
	conferenceOverview: {
		totalDelegates: number;
		totalCommittees: number;
		totalSpeechesAllTime: number;
		totalResolutionsAdoptedAllTime: number;
	};
	resolutionFunnel: Array<{ status: string; count: number }>;
	speakingByRepresentationType: Array<{
		representationType: string;
		totalSeconds: number;
		delegationCount: number;
	}>;
	longestSpeechToday: {
		committeeAbbreviation: string;
		committeeName: string;
		durationSeconds: number;
	} | null;
	amendmentActivity: Array<{ status: string; count: number }>;
	voteOutcomesToday: Array<{ outcome: string; count: number }>;
	papersAwaitingVote: number;
	papersPerCommittee: Array<{
		committeeAbbreviation: string;
		committeeName: string;
		paperCount: number;
	}>;
}

// Statuses that carry a meaningful countdown worth surfacing on the caucus
// tile — FORMAL has no "end" the way a caucus/pause/suspension does.
const TIMED_STATUSES: CommitteestatusEnum[] = [
	'INFORMAL',
	'MODERATED_INFORMAL',
	'PAUSE',
	'SUSPENSION'
];

export function committeesOnBreak(committees: InsightCommittee[]) {
	return committees
		.filter((c) => TIMED_STATUSES.includes(c.status))
		.toSorted((a, b) => new Date(a.statusUntil).getTime() - new Date(b.statusUntil).getTime());
}

export function committeesRunning(committees: InsightCommittee[]) {
	return committees
		.filter((c) => !TIMED_STATUSES.includes(c.status))
		.toSorted((a, b) => a.abbreviation.localeCompare(b.abbreviation));
}

// Delegation names are frequently unset on the representation record itself
// (only alpha codes are guaranteed) — fall back to the translated country
// name the same way the rest of the app does, rather than showing "unknown".
export function speakerLabel(
	speaker: InsightSpeaker,
	representation?: InsightRepresentation | null
) {
	return (
		speaker.overwriteName ||
		representation?.name ||
		getTranslatedCountryNameFromAlpha3Code(representation?.alpha3Code)
	);
}

function currentSpeakerFor(committee: InsightCommittee) {
	for (const list of committee.activeAgendaItem?.speakersList ?? []) {
		if (list.isClosed || !list.startTimestamp) continue;
		const speaker = list.speakers.toSorted(compareSpeakers).at(0);
		if (!speaker) continue;
		const representation =
			speaker.committeeMember?.representation ?? speaker.conferenceMember?.representation;
		const label = speakerLabel(speaker, representation);
		if (label) return { committee, label, representation };
	}
	return null;
}

// The open (running) speakers/comment list with at least one speaker queued —
// "something is going on" here, worth spotlighting the whole queue rather
// than just the current speaker.
function openSpeakersListFor(committee: InsightCommittee) {
	for (const list of committee.activeAgendaItem?.speakersList ?? []) {
		if (list.isClosed || !list.startTimestamp) continue;
		const speakers = list.speakers.toSorted(compareSpeakers);
		if (speakers.length === 0) continue;
		return { committee, speakers };
	}
	return null;
}

export type InsightTile =
	| { kind: 'votingSessions'; key: string; committees: InsightCommittee[] }
	| {
			kind: 'speakingPulse';
			key: string;
			speakers: NonNullable<ReturnType<typeof currentSpeakerFor>>[];
	  }
	| { kind: 'attendance'; key: string; present: number; total: number; committeeCount: number }
	| { kind: 'adoptions'; key: string; pulse: InsightPulse }
	| { kind: 'heartbeat'; key: string; pulse: InsightPulse }
	| (NonNullable<InsightPulse['busiestCommittee']> & { kind: 'busiestCommittee'; key: string })
	| (NonNullable<InsightPulse['closestVote']> & { kind: 'closestVote'; key: string })
	| {
			kind: 'committeeActivity';
			key: string;
			entries: InsightPulse['committeeActivityLeaderboard'];
	  }
	| { kind: 'speakingByRegion'; key: string; entries: InsightPulse['speakingByRegion'] }
	| {
			kind: 'speakersListSpotlight';
			key: string;
			committee: InsightCommittee;
			speakers: InsightSpeaker[];
	  }
	| { kind: 'conferenceOverview'; key: string; overview: InsightPulse['conferenceOverview'] }
	| { kind: 'resolutionFunnel'; key: string; entries: InsightPulse['resolutionFunnel'] }
	| {
			kind: 'speakingByRepresentationType';
			key: string;
			entries: InsightPulse['speakingByRepresentationType'];
	  }
	| (NonNullable<InsightPulse['longestSpeechToday']> & { kind: 'longestSpeechToday'; key: string })
	| { kind: 'amendmentActivity'; key: string; entries: InsightPulse['amendmentActivity'] }
	| { kind: 'voteOutcomesToday'; key: string; entries: InsightPulse['voteOutcomesToday'] }
	| { kind: 'papersAwaitingVote'; key: string; count: number }
	| { kind: 'papersPerCommittee'; key: string; entries: InsightPulse['papersPerCommittee'] };

function committeeAttendance(committees: InsightCommittee[]) {
	let present = 0;
	let total = 0;
	for (const c of committees) {
		present += c.totalPresent ?? 0;
		total += (c.members ?? []).filter((m) => m.representation?.type === 'DELEGATION').length;
	}
	return { present, total };
}

function committeeTiles(committees: InsightCommittee[]): InsightTile[] {
	const tiles: InsightTile[] = [];

	const activeVotes = committees.filter((c) => (c.votingSessions?.length ?? 0) > 0);
	if (activeVotes.length > 0) {
		tiles.push({ kind: 'votingSessions', key: 'voting', committees: activeVotes });
	}

	const speakers = committees.map(currentSpeakerFor).filter((s) => s != null);
	if (speakers.length > 0) {
		tiles.push({ kind: 'speakingPulse', key: 'speaking', speakers });
	}

	// One spotlight tile per committee with an open, non-empty speakers list —
	// the shuffle/rotation already handles "randomly occasionally show" for us.
	for (const open of committees.map(openSpeakersListFor)) {
		if (!open) continue;
		tiles.push({
			kind: 'speakersListSpotlight',
			key: `speakersList-${open.committee.id}`,
			committee: open.committee,
			speakers: open.speakers
		});
	}

	const { present, total } = committeeAttendance(committees);
	// A conference with no delegation members yet has nothing to report —
	// "0 of 0 delegates present" isn't meaningful data.
	if (total > 0) {
		tiles.push({
			kind: 'attendance',
			key: 'attendance',
			present,
			total,
			committeeCount: committees.length
		});
	}

	return tiles;
}

function hasHeartbeat({ heartbeat }: InsightPulse) {
	// Nothing happened today yet — an all-zero heartbeat isn't worth a tile.
	return (
		heartbeat.speechesToday > 0 ||
		heartbeat.votesHeldToday > 0 ||
		heartbeat.resolutionsAdoptedToday > 0 ||
		heartbeat.debateSecondsToday > 0
	);
}

/** The tile while `shown`, else none. */
function tileIf(shown: boolean, tile: () => InsightTile): InsightTile[] {
	return shown ? [tile()] : [];
}

/** The tile built from `value` while there is one, else none. */
function tileOf<T>(value: T | null, tile: (value: T) => InsightTile): InsightTile[] {
	return value ? [tile(value)] : [];
}

/** A tile listing `entries`, or none while there is nothing to list. */
function listTile(tile: InsightTile & { entries: readonly unknown[] }): InsightTile[] {
	return tile.entries.length > 0 ? [tile] : [];
}

/** The pulse's tiles, in the order the grid shows them. */
function pulseTiles(pulse: InsightPulse): InsightTile[] {
	const { busiestCommittee, closestVote, longestSpeechToday } = pulse;
	return [
		...tileIf(hasHeartbeat(pulse), () => ({ kind: 'heartbeat', key: 'heartbeat', pulse })),
		...tileIf(pulse.recentAdoptions.length > 0, () => ({
			kind: 'adoptions',
			key: 'adoptions',
			pulse
		})),
		...tileOf(busiestCommittee, (busiest) => ({
			kind: 'busiestCommittee',
			key: 'busiest',
			...busiest
		})),
		...tileOf(closestVote, (closest) => ({ kind: 'closestVote', key: 'closest', ...closest })),
		...listTile({
			kind: 'committeeActivity',
			key: 'committeeActivity',
			entries: pulse.committeeActivityLeaderboard
		}),
		...listTile({
			kind: 'speakingByRegion',
			key: 'speakingByRegion',
			entries: pulse.speakingByRegion
		}),
		...listTile({
			kind: 'amendmentActivity',
			key: 'amendmentActivity',
			entries: pulse.amendmentActivity
		}),
		...listTile({
			kind: 'voteOutcomesToday',
			key: 'voteOutcomesToday',
			entries: pulse.voteOutcomesToday
		}),
		...tileIf(pulse.papersAwaitingVote > 0, () => ({
			kind: 'papersAwaitingVote',
			key: 'papersAwaitingVote',
			count: pulse.papersAwaitingVote
		})),
		...listTile({
			kind: 'papersPerCommittee',
			key: 'papersPerCommittee',
			entries: pulse.papersPerCommittee
		}),
		{ kind: 'conferenceOverview', key: 'conferenceOverview', overview: pulse.conferenceOverview },
		...listTile({
			kind: 'resolutionFunnel',
			key: 'resolutionFunnel',
			entries: pulse.resolutionFunnel
		}),
		...listTile({
			kind: 'speakingByRepresentationType',
			key: 'speakingByRepresentationType',
			entries: pulse.speakingByRepresentationType
		}),
		...tileOf(longestSpeechToday, (longest) => ({
			kind: 'longestSpeechToday',
			key: 'longestSpeechToday',
			...longest
		}))
	];
}

// Per-committee status/topic is shown once, in the unified committee grid — this
// pool only covers conference-wide facts that don't belong to a single committee.
export function buildInsightTiles(
	committees: InsightCommittee[],
	pulse: InsightPulse | null
): InsightTile[] {
	return [...committeeTiles(committees), ...(pulse ? pulseTiles(pulse) : [])];
}

export type TileOf<K extends InsightTile['kind']> = Extract<InsightTile, { kind: K }>;

function tileGroup<const K extends InsightTile['kind']>(kinds: readonly K[]) {
	return (tile: InsightTile): tile is TileOf<K> => kinds.some((kind) => kind === tile.kind);
}

const LIST_KINDS = [
	'votingSessions',
	'speakingPulse',
	'adoptions',
	'speakersListSpotlight',
	'committeeActivity',
	'papersPerCommittee'
] as const;
const CHART_KINDS = [
	'speakingByRegion',
	'resolutionFunnel',
	'speakingByRepresentationType',
	'amendmentActivity',
	'voteOutcomesToday'
] as const;
const STAT_KINDS = [
	'attendance',
	'heartbeat',
	'busiestCommittee',
	'closestVote',
	'conferenceOverview',
	'longestSpeechToday',
	'papersAwaitingVote'
] as const;

/** Tiles listing a few rows each */
export const isListTile = tileGroup(LIST_KINDS);
export type ListTile = TileOf<(typeof LIST_KINDS)[number]>;
/** Tiles drawing a chart or a proportion bar */
export const isChartTile = tileGroup(CHART_KINDS);
export type ChartTile = TileOf<(typeof CHART_KINDS)[number]>;
/** Tiles showing one or a few big numbers */
export const isStatTile = tileGroup(STAT_KINDS);
export type StatTile = TileOf<(typeof STAT_KINDS)[number]>;
