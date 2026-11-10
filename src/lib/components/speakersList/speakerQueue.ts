import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';

type Representation =
	| { name?: string | null; alpha2Code?: string | null; alpha3Code?: string | null }
	| null
	| undefined;
type Member = { representation?: Representation } | null | undefined;

/** The representation a speaker speaks for: their committee seat, else their conference seat */
export function speakerMember<M extends Member>(speaker: {
	committeeMember?: M;
	conferenceMember?: M;
}): M | undefined {
	return speaker.committeeMember || speaker.conferenceMember || undefined;
}

/** The representation's name, else the country's, ignoring any overwritten name */
export function representationLabel(member: Member): string {
	const representation = member?.representation;
	return representation?.name || getTranslatedCountryNameFromAlpha3Code(representation?.alpha3Code);
}

/** The uppercase alpha-2 code, `N/A` without one */
export function shortCode(member: Member): string {
	return member?.representation?.alpha2Code?.toUpperCase() || 'N/A';
}

/** Row and reserved heights of the queue, with fallbacks while nothing is rendered yet */
export function queueMetrics({
	containerHeight,
	firstRowHeight,
	overflowHeight
}: {
	containerHeight: number;
	firstRowHeight: number | undefined;
	overflowHeight: number;
}) {
	return {
		containerHeight,
		rowHeight: firstRowHeight || 20,
		reservedHeight: overflowHeight || 50
	};
}
