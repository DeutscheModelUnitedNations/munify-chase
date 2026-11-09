import Fuse from 'fuse.js';
import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';

interface NamedRepresentation {
	name?: string | null;
	alpha3Code?: string | null;
}

/** A representation's name in the current locale, else its stored name, else `fallback`. */
export function representationName(
	representation: NamedRepresentation | null | undefined,
	fallback = ''
): string {
	return (
		getTranslatedCountryNameFromAlpha3Code(representation?.alpha3Code) ??
		representation?.name ??
		fallback
	);
}

/** Sorts a copy of `items` by the name `getName` gives each. */
function sortByName<T>(items: readonly T[], getName: (item: T) => string): T[] {
	return [...items].sort((a, b) => getName(a).localeCompare(getName(b)));
}

interface SponsorRow {
	committeeMember?: { id: string; representation?: NamedRepresentation | null } | null;
}

/** Sponsors in alphabetical order of their delegation's name. */
export function sortSponsors<T extends SponsorRow>(sponsors: readonly T[] | null | undefined): T[] {
	return sortByName(sponsors ?? [], (s) => representationName(s.committeeMember?.representation));
}

/** The viewer's own sponsorship among `sponsors`, if any. */
export function ownSponsorship<T extends SponsorRow>(
	sponsors: readonly T[] | null | undefined,
	memberId: string | null
): T | undefined {
	return (sponsors ?? []).find((s) => s.committeeMember?.id === memberId);
}

/**
 * A Combobox filter over committee members: a fuzzy search by name while
 * something is typed, all members alphabetically otherwise. `exclude` drops
 * members that must not be offered (those already sponsoring).
 */
export function createMemberFilter<T extends { id: string }>({
	getName,
	exclude = () => false
}: {
	getName: (member: T) => string;
	exclude?: (member: T) => boolean;
}) {
	const fuse = new Fuse<T & { label: string }>([], {
		keys: ['label'],
		ignoreFieldNorm: true,
		ignoreDiacritics: true,
		shouldSort: true
	});
	return (members: T[], search: string): T[] => {
		const offered = members.filter((member) => !exclude(member));
		if (search.length === 0) return sortByName(offered, getName);
		fuse.setCollection(offered.map((member) => ({ ...member, label: getName(member) })));
		return fuse.search(search).map((result) => result.item);
	};
}

/** Whether a delegation may sponsor the paper on its own: only before it is a draft resolution. */
export function canSponsorPaper({
	team,
	myMemberId,
	sponsoring,
	paperStatus
}: {
	team: boolean;
	myMemberId: string | null;
	sponsoring: boolean;
	paperStatus: string;
}): boolean {
	if (team || !myMemberId || sponsoring) return false;
	return paperStatus === 'WORKING_PAPER' || paperStatus === 'SUBMITTED';
}

/**
 * Whether a delegation may sponsor an amendment on its own: not its own
 * proposal, while sponsoring is open and the amendment is still alive.
 */
export function canSponsorAmendment({
	team,
	myMemberId,
	proposerMemberId,
	sponsoring,
	sponsoringOpen,
	amendmentStatus
}: {
	team: boolean;
	myMemberId: string | null;
	proposerMemberId: string | null | undefined;
	sponsoring: boolean;
	sponsoringOpen: boolean;
	amendmentStatus: string | null | undefined;
}): boolean {
	if (team || !myMemberId || sponsoring || !sponsoringOpen) return false;
	if (myMemberId === proposerMemberId) return false;
	return amendmentStatus !== 'REJECTED' && amendmentStatus !== 'WITHDRAWN';
}
