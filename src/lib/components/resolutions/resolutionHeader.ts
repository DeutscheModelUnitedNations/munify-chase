import type { ResolutionHeaderData } from '@deutschemodelunitednations/munify-resolution-editor';
import { svgToDataUrl } from '#lib/utils/svgToDataUrl';
import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';

interface Representation {
	name?: string | null;
	alpha3Code?: string | null;
}

interface HeaderCommittee {
	name?: string | null;
	abbreviation?: string | null;
	conference?: { title?: string | null; logoSvg?: string | null } | null;
}

interface HeaderPaper {
	documentNumber?: string | null;
	updatedAt?: Date | string | null;
	agendaItem?: { title?: string | null } | null;
	creatorCommitteeMember?: { representation?: Representation | null } | null;
	sponsors?: { committeeMember?: { representation?: Representation | null } | null }[] | null;
}

/** A delegation's name in the viewer's language, else as stored. */
export function delegationName(representation: Representation | null | undefined) {
	return (
		getTranslatedCountryNameFromAlpha3Code(representation?.alpha3Code) ??
		representation?.name ??
		undefined
	);
}

/** The resolution header (preview, export, presentation) of a paper in its committee. */
export function resolutionHeaderData({
	committee,
	paper
}: {
	committee: HeaderCommittee | undefined;
	paper: HeaderPaper | undefined;
}): ResolutionHeaderData {
	return {
		conferenceTitle: committee?.conference?.title ?? undefined,
		conferenceEmblem: svgToDataUrl(committee?.conference?.logoSvg),
		committeeAbbreviation: committee?.abbreviation ?? undefined,
		committeeFullName: committee?.name ?? undefined,
		documentNumber: paper?.documentNumber ?? undefined,
		topic: paper?.agendaItem?.title ?? undefined,
		authoringDelegation: delegationName(paper?.creatorCommitteeMember?.representation),
		sponsoringDelegations: (paper?.sponsors ?? []).map(
			(s) => delegationName(s.committeeMember?.representation) ?? ''
		),
		lastEdited: paper?.updatedAt ?? undefined
	};
}
