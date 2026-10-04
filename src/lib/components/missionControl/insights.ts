import type { CommitteestatusEnum, VotingmodeEnum } from '$lib/api/rumbleClient/client';
import { compareSpeakers } from '$lib/helpers/speakerSort';
import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';

export interface InsightRepresentation {
	name?: string | null;
	alpha2Code?: string | null;
	alpha3Code?: string | null;
	faIcon?: string | null;
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

export function currentSpeakerFor(committee: InsightCommittee) {
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
export function openSpeakersListFor(committee: InsightCommittee) {
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

// Per-committee status/topic is shown once, in the unified committee grid — this
// pool only covers conference-wide facts that don't belong to a single committee.
export function buildInsightTiles(
	committees: InsightCommittee[],
	pulse: InsightPulse | null
): InsightTile[] {
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
	for (const committee of committees) {
		const open = openSpeakersListFor(committee);
		if (open) {
			tiles.push({
				kind: 'speakersListSpotlight',
				key: `speakersList-${committee.id}`,
				committee: open.committee,
				speakers: open.speakers
			});
		}
	}

	if (committees.length > 0) {
		let present = 0;
		let total = 0;
		for (const c of committees) {
			present += c.totalPresent ?? 0;
			total += (c.members ?? []).filter((m) => m.representation?.type === 'DELEGATION').length;
		}
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
	}

	if (pulse) {
		const { speechesToday, votesHeldToday, resolutionsAdoptedToday, debateSecondsToday } =
			pulse.heartbeat;
		// Nothing happened today yet — an all-zero heartbeat isn't worth a tile.
		if (
			speechesToday > 0 ||
			votesHeldToday > 0 ||
			resolutionsAdoptedToday > 0 ||
			debateSecondsToday > 0
		) {
			tiles.push({ kind: 'heartbeat', key: 'heartbeat', pulse });
		}
		if (pulse.recentAdoptions.length > 0) {
			tiles.push({ kind: 'adoptions', key: 'adoptions', pulse });
		}
		if (pulse.busiestCommittee) {
			tiles.push({ kind: 'busiestCommittee', key: 'busiest', ...pulse.busiestCommittee });
		}
		if (pulse.closestVote) {
			tiles.push({ kind: 'closestVote', key: 'closest', ...pulse.closestVote });
		}
		if (pulse.committeeActivityLeaderboard.length > 0) {
			tiles.push({
				kind: 'committeeActivity',
				key: 'committeeActivity',
				entries: pulse.committeeActivityLeaderboard
			});
		}
		if (pulse.speakingByRegion.length > 0) {
			tiles.push({
				kind: 'speakingByRegion',
				key: 'speakingByRegion',
				entries: pulse.speakingByRegion
			});
		}
		if (pulse.amendmentActivity.length > 0) {
			tiles.push({
				kind: 'amendmentActivity',
				key: 'amendmentActivity',
				entries: pulse.amendmentActivity
			});
		}
		if (pulse.voteOutcomesToday.length > 0) {
			tiles.push({
				kind: 'voteOutcomesToday',
				key: 'voteOutcomesToday',
				entries: pulse.voteOutcomesToday
			});
		}
		if (pulse.papersAwaitingVote > 0) {
			tiles.push({
				kind: 'papersAwaitingVote',
				key: 'papersAwaitingVote',
				count: pulse.papersAwaitingVote
			});
		}
		if (pulse.papersPerCommittee.length > 0) {
			tiles.push({
				kind: 'papersPerCommittee',
				key: 'papersPerCommittee',
				entries: pulse.papersPerCommittee
			});
		}
		tiles.push({
			kind: 'conferenceOverview',
			key: 'conferenceOverview',
			overview: pulse.conferenceOverview
		});
		if (pulse.resolutionFunnel.length > 0) {
			tiles.push({
				kind: 'resolutionFunnel',
				key: 'resolutionFunnel',
				entries: pulse.resolutionFunnel
			});
		}
		if (pulse.speakingByRepresentationType.length > 0) {
			tiles.push({
				kind: 'speakingByRepresentationType',
				key: 'speakingByRepresentationType',
				entries: pulse.speakingByRepresentationType
			});
		}
		if (pulse.longestSpeechToday) {
			tiles.push({
				kind: 'longestSpeechToday',
				key: 'longestSpeechToday',
				...pulse.longestSpeechToday
			});
		}
	}

	return tiles;
}
