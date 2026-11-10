import { m } from '#lib/paraglide/messages';
import type { MissionControlChartKind } from './chartConfig';

export function fmtDuration(totalSeconds: number): string {
	const h = Math.floor(totalSeconds / 3600);
	const min = Math.floor((totalSeconds % 3600) / 60);
	return h > 0 ? `${h}h ${String(min).padStart(2, '0')}m` : `${min}m`;
}

/** Share of `part` in `total` in percent, 0 for an empty total. */
export function percentOf(part: number, total: number): number {
	return total > 0 ? (part / total) * 100 : 0;
}

const PAPER_STATUS_LABELS: Record<string, () => string> = {
	WORKING_PAPER: m.workingPaper,
	SUBMITTED: m.submitted,
	DRAFT_RESOLUTION: m.draftResolution,
	AMENDMENT_PHASE: m.amendmentPhase,
	VOTING_PHASE: m.votingPhase,
	FINAL: m.final
};

const REPRESENTATION_TYPE_LABELS: Record<string, () => string> = {
	DELEGATION: m.delegation,
	NSA: m.nonStateActor,
	UN: m.unActor
};

const AMENDMENT_STATUS_LABELS: Record<string, () => string> = {
	PENDING: m.pending,
	SUBMITTED: m.submitted,
	CONSENSUS_ADOPTED: m.consensusAdopted,
	ACCEPTED: m.accepted,
	REJECTED: m.rejected,
	WITHDRAWN: m.withdrawn
};

function labelFrom(labels: Record<string, () => string>, value: string): string {
	return Object.hasOwn(labels, value) ? labels[value]() : value;
}

export const paperStatusLabel = (status: string) => labelFrom(PAPER_STATUS_LABELS, status);
export const representationTypeLabel = (type: string) =>
	labelFrom(REPRESENTATION_TYPE_LABELS, type);
export const amendmentStatusLabel = (status: string) => labelFrom(AMENDMENT_STATUS_LABELS, status);

function seededRandom(seed: number) {
	let s = seed % 2147483647;
	if (s <= 0) s += 2147483646;
	return () => {
		s = (s * 16807) % 2147483647;
		return (s - 1) / 2147483646;
	};
}

/** A copy of `items` in an order that only depends on `seed`. */
export function shuffled<T>(items: T[], seed: number): T[] {
	const rand = seededRandom(seed + 1);
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

// Each chart-shaped tile picks its diagram type from a small pool suited to
// its data (an ordered funnel reads better as a bar than a pie, for
// instance), reseeded on every rotation tick alongside the tile shuffle —
// so the same stat doesn't always render as the same chart.
function hashString(s: string): number {
	let h = 0;
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
	return Math.abs(h);
}

const CHART_TYPE_POOLS: Record<string, MissionControlChartKind[]> = {
	resolutionFunnel: ['bar', 'doughnut', 'polarArea'],
	speakingByRegion: ['doughnut', 'polarArea', 'pie'],
	speakingByRepresentationType: ['pie', 'doughnut', 'polarArea'],
	amendmentActivity: ['polarArea', 'bar', 'doughnut']
};

export function chartTypeFor({
	kind,
	key,
	tick
}: {
	kind: string;
	key: string;
	tick: number;
}): MissionControlChartKind {
	const pool = CHART_TYPE_POOLS[kind] ?? ['doughnut'];
	return pool[(hashString(key) + tick) % pool.length];
}
