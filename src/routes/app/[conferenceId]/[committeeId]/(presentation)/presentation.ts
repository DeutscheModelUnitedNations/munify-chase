import type { RegionalgroupEnum } from '#lib/api/rumbleClient/client';

/** The order the regional groups take turns in on the projector. */
const REGION_ORDER: RegionalgroupEnum[] = [
	'AFRICA',
	'ASIA_PACIFIC',
	'EASTERN_EUROPE',
	'LATIN_AMERICA_CARIBBEAN',
	'WESTERN_EUROPE_OTHERS'
];

export function nextGroup(group: RegionalgroupEnum): RegionalgroupEnum {
	return REGION_ORDER[(REGION_ORDER.indexOf(group) + 1) % REGION_ORDER.length];
}

/** How long a group stays up: a quarter second per flag, between five and nine seconds. */
export function groupDisplayMs(members: number) {
	return Math.min(Math.max(members * 250, 5000), 9000);
}

type Amendment = { id: string };

/** What the resolution preview highlights in each phase of the active draft. */
export function resolutionPreviewState<A extends Amendment>(committee: {
	activeDraftResolution?: { status: string } | null;
	currentOperativeIndex?: number | null;
	activeAmendment?: A | null;
}) {
	const status = committee.activeDraftResolution?.status;
	const amending = status === 'AMENDMENT_PHASE';
	return {
		currentOperativeIndex:
			amending || status === 'VOTING_PHASE' ? committee.currentOperativeIndex : undefined,
		showAmendments: amending,
		activeAmendment: amending ? (committee.activeAmendment ?? null) : null
	};
}
