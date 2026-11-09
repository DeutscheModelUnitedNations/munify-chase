import { getCountryNameFromCode } from '#lib/utils/nationTranslationHelper.svelte';

export type SpeakingRow = {
	representationId: string;
	representationName: string | null;
	alpha2Code: string | null;
	regionalGroup?: string | null;
	representationType?: string | null;
	totalSeconds: number;
	speechCount: number;
	commentCount: number;
};
export type RegionRow = {
	group: string;
	totalSeconds: number;
	delegationCount: number;
	speechCount: number;
};
export type CommitteeRow = {
	committeeId: string;
	committeeName: string;
	committeeAbbreviation: string;
	totalSpeakingSeconds: number;
	speechCount: number;
	voteCount: number;
};
export type FairnessData = { gini: number; stdDevSeconds: number };
export type ContrarianRow = {
	representationId: string;
	representationName: string | null;
	alpha2Code: string | null;
	contraryVotes: number;
	totalVotes: number;
};
export type AlignmentRow = {
	representation1Id: string;
	representation1Name: string | null;
	representation1Alpha2Code: string | null;
	representation2Id: string;
	representation2Name: string | null;
	representation2Alpha2Code: string | null;
	agreementRate: number;
	votesCompared: number;
};
export type AmendmentRow = {
	representationId: string;
	representationName: string | null;
	alpha2Code: string | null;
	total: number;
	accepted: number;
};
export type SponsorRow = {
	representationId: string;
	representationName: string | null;
	alpha2Code: string | null;
	sponsorships: number;
};

/** Country name from representation.name or alpha2 lookup; falls back to a short ID fragment. */
export function repLabel({
	name,
	alpha2,
	id
}: {
	name: string | null;
	alpha2: string | null;
	id: string;
}): string {
	return name ?? getCountryNameFromCode(alpha2) ?? id.slice(0, 8);
}

const REGION_LABELS: Record<string, string> = {
	AFRICA: 'Africa',
	ASIA_PACIFIC: 'Asia-Pacific',
	EASTERN_EUROPE: 'Eastern Europe',
	LATIN_AMERICA_CARIBBEAN: 'Latin America & Caribbean',
	WESTERN_EUROPE_OTHERS: 'Western Europe & Others',
	OTHER: 'Other'
};

export function regionLabel(group: string): string {
	return REGION_LABELS[group] ?? group;
}

/** Seconds as `1h 05m` or `3m 07s`. */
export function fmtTime(s: number): string {
	if (s <= 0) return '0s';
	const h = Math.floor(s / 3600);
	const min = Math.floor((s % 3600) / 60);
	if (h > 0) return `${h}h ${String(min).padStart(2, '0')}m`;
	return `${min}m ${String(s % 60).padStart(2, '0')}s`;
}

export function pct({ part, whole }: { part: number; whole: number }): string {
	return whole > 0 ? `${Math.round((part / whole) * 100)}%` : '—';
}

/** Whether a list from the stats query has rows. */
export function hasRows(rows: readonly unknown[] | null | undefined) {
	return (rows?.length ?? 0) > 0;
}

/** The delegations that made comments, at most twenty. */
export function commentLeaders(rows: readonly SpeakingRow[] | null | undefined) {
	return (rows ?? []).filter((r) => r.commentCount > 0).slice(0, 20);
}

/** Committees by speaking time, longest first. */
export function committeesBySpeakingTime(rows: readonly CommitteeRow[] | null | undefined) {
	return [...(rows ?? [])].sort((a, b) => b.totalSpeakingSeconds - a.totalSpeakingSeconds);
}

/** Times of the speaking timeline, with the date at the first bucket of each day. */
export function timelineLabels(dates: readonly Date[]) {
	return dates.map((d, i) => {
		const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
		const isNewDay = i === 0 || dates[i - 1].toDateString() !== d.toDateString();
		if (!isNewDay) return time;
		return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${time}`;
	});
}

export function speakingMinutesLabel(minutes: number) {
	const h = Math.floor(minutes / 60);
	const rest = minutes % 60;
	return h > 0 ? ` ${h}h ${String(rest).padStart(2, '0')}m speaking` : ` ${rest}m speaking`;
}

/** 30px per day, between 180 and 280. */
export function trendChartHeight(points: number) {
	return Math.max(180, Math.min(points * 30, 280));
}
