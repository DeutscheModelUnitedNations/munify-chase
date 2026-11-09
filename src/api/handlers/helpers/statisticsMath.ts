/** Pure calculations behind the statistics and mission control queries. */

export interface RegionalSpeaking {
	group: string;
	totalSeconds: number;
	delegationCount: number;
	speechCount: number;
}

export interface RepresentationTypeSpeaking {
	representationType: string;
	totalSeconds: number;
	delegationCount: number;
}

export interface CommitteeActivity {
	committeeId: string;
	committeeName: string;
	committeeAbbreviation: string;
	totalSpeakingSeconds: number;
	speechCount: number;
	voteCount: number;
}

interface SpeakingRow {
	regionalGroup: string | null;
	representationType: string | null;
	totalSeconds: number;
	speechCount: number;
}

export function gini(values: number[]): number {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const n = sorted.length;
	const total = sorted.reduce((a, b) => a + b, 0);
	if (total === 0) return 0;
	let numerator = 0;
	for (let i = 0; i < n; i++) numerator += (2 * (i + 1) - n - 1) * sorted[i];
	return Math.max(0, numerator / (n * total));
}

export function stdDev(values: number[]): number {
	if (values.length === 0) return 0;
	const mean = values.reduce((a, b) => a + b, 0) / values.length;
	return Math.sqrt(values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length);
}

function secondsBetween(from: Date, to: number) {
	return Math.max(0, Math.floor((to - from.getTime()) / 1000));
}

/**
 * The time someone was present, from their presence events: each arrival until the next
 * departure, an open arrival until `now`; and the committees they arrived in.
 */
export function computeAttendance(
	events: { present: boolean; timestamp: Date; committeeId: string }[],
	now = Date.now()
): { totalSeconds: number; committeeIds: Set<string> } {
	const sorted = [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
	let totalSeconds = 0;
	const committeeIds = new Set<string>();
	let openIn: Date | null = null;

	for (const e of sorted) {
		if (e.present) {
			openIn = e.timestamp;
			committeeIds.add(e.committeeId);
		} else if (openIn) {
			totalSeconds += secondsBetween(openIn, e.timestamp.getTime());
			openIn = null;
		}
	}
	if (openIn) totalSeconds += secondsBetween(openIn, now);
	return { totalSeconds, committeeIds };
}

function byTotalSecondsDesc<T extends { totalSeconds: number }>(entries: Iterable<T>) {
	return Array.from(entries).toSorted((a, b) => b.totalSeconds - a.totalSeconds);
}

/** Speaking time summed per regional group (no group counts as OTHER), most first. */
export function speakingByRegion(rows: SpeakingRow[]): RegionalSpeaking[] {
	const groups = new Map<string, RegionalSpeaking>();
	for (const row of rows) {
		const group = row.regionalGroup ?? 'OTHER';
		const entry = groups.get(group) ?? {
			group,
			totalSeconds: 0,
			delegationCount: 0,
			speechCount: 0
		};
		entry.totalSeconds += row.totalSeconds;
		entry.delegationCount++;
		entry.speechCount += row.speechCount;
		groups.set(group, entry);
	}
	return byTotalSecondsDesc(groups.values());
}

/** Speaking time summed per representation type (none counts as OTHER), most first. */
export function speakingByRepresentationType(rows: SpeakingRow[]): RepresentationTypeSpeaking[] {
	const types = new Map<string, RepresentationTypeSpeaking>();
	for (const row of rows) {
		const representationType = row.representationType ?? 'OTHER';
		const entry = types.get(representationType) ?? {
			representationType,
			totalSeconds: 0,
			delegationCount: 0
		};
		entry.totalSeconds += row.totalSeconds;
		entry.delegationCount++;
		types.set(representationType, entry);
	}
	return byTotalSecondsDesc(types.values());
}

export function toCommitteeActivity(row: CommitteeActivity): CommitteeActivity {
	return {
		committeeId: row.committeeId,
		committeeName: row.committeeName,
		committeeAbbreviation: row.committeeAbbreviation,
		totalSpeakingSeconds: row.totalSpeakingSeconds,
		speechCount: row.speechCount,
		voteCount: row.voteCount
	};
}

/** Rounded to one decimal; NaN counts as 0. */
function oneDecimal(value: number) {
	return Math.round(value * 10) / 10 || 0;
}

function average(values: number[]) {
	return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}

/** The share (percent, one decimal) of speakers who spoke less than `seconds`. */
export function speakingPercentile({
	allTotals,
	seconds
}: {
	allTotals: number[];
	seconds: number;
}) {
	if (allTotals.length === 0) return 0;
	const share = allTotals.filter((t) => t < seconds).length / allTotals.length;
	return Math.round(share * 1000) / 10 || 0;
}

/** Someone's speeches and comments, from the periods they spoke. */
export function personalSpeaking(
	periods: { duration: number | null; waitSeconds: number | null; listType: string }[]
) {
	const totalSeconds = Math.round(periods.reduce((acc, p) => acc + (p.duration ?? 0), 0));
	const speeches = periods.filter((p) => p.listType === 'SPEAKERS_LIST');
	const speechDurations = speeches.map((p) => p.duration ?? 0);
	return {
		totalSeconds: totalSeconds || 0,
		speechCount: speeches.length,
		commentCount: periods.filter((p) => p.listType === 'COMMENT_LIST').length,
		avgSpeechSeconds: oneDecimal(average(speechDurations)),
		longestSpeechSeconds: Math.round(speeches.length > 0 ? Math.max(...speechDurations) : 0) || 0,
		avgWaitSeconds: oneDecimal(average(periods.map((p) => p.waitSeconds ?? 0)))
	};
}

/** Speaking time as a percentage (one decimal) of the time present. */
export function speakingToAttendanceRatio({
	speakingSeconds,
	attendanceSeconds
}: {
	speakingSeconds: number;
	attendanceSeconds: number;
}) {
	if (attendanceSeconds <= 0) return 0;
	return Math.round((speakingSeconds / attendanceSeconds) * 1000) / 10 || 0;
}

export function tallyVotes(votes: { vote: string }[]) {
	const pro = votes.filter((v) => v.vote === 'PRO').length;
	const con = votes.filter((v) => v.vote === 'CON').length;
	const abstain = votes.filter((v) => v.vote === 'ABSTAIN').length;
	return { pro, con, abstain, total: pro + con + abstain };
}

export function acceptedAmendments(amendments: { status: string }[]) {
	return amendments.filter((a) => a.status === 'ACCEPTED' || a.status === 'CONSENSUS_ADOPTED')
		.length;
}

/** The count a single-row count query answered, 0 without a row. */
export function countOf(rows: { cnt: number }[]) {
	return rows[0]?.cnt ?? 0;
}

/** The count of one status among per-status counts. */
export function statusCount<S>({
	rows,
	status
}: {
	rows: { status: S; cnt: number }[];
	status: S;
}) {
	return rows.find((r) => r.status === status)?.cnt ?? 0;
}
