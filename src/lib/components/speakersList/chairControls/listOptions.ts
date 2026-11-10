import { m } from '#lib/paraglide/messages';
import { compareSpeakers } from '#lib/helpers/speakerSort';
import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';

type Speaker = { id: string; position: number };
type List<S extends Speaker> = { speakers: S[] } | null | undefined;

/** The list's name for toasts: the comment list or the speakers list */
export function listLabel(type: string): string {
	return type === 'COMMENT_LIST' ? m.commentList() : m.speakersList();
}

/** The speaker currently at the front of the list */
export function firstSpeaker<S extends Speaker>(list: List<S>): S | undefined {
	return list?.speakers.toSorted(compareSpeakers).at(0);
}

export function hasSpeakers(list: { speakers?: unknown[] | null } | null | undefined): boolean {
	return !!list?.speakers?.length;
}

/** The command that opens a closed list, or closes an open one */
export function toggleClosedCommand(isClosed: boolean) {
	return isClosed
		? { title: m.commandSpeakersListOpenList, icon: 'lock-open' }
		: { title: m.commandSpeakersListCloseList, icon: 'lock' };
}

/**
 * Whom renaming the current speaker applies to: nothing to do without a list or a name,
 * an error without anyone speaking.
 */
export function renameTarget<S extends Speaker>({
	list,
	name
}: {
	list: (List<S> & { id: string; type: string }) | null | undefined;
	name: string;
}): 'skip' | 'noSpeaker' | { speakerId: string; listType: string } {
	if (!list?.id || !name) return 'skip';
	const speaker = firstSpeaker(list);
	return speaker ? { speakerId: speaker.id, listType: list.type } : 'noSpeaker';
}

type NamedMember = {
	id: string;
	representation?: { name?: string | null; alpha3Code?: string | null } | null;
};

/** A member's name: the representation's, else the country's */
export function memberName(member: NamedMember | undefined): string {
	return (
		member?.representation?.name ||
		getTranslatedCountryNameFromAlpha3Code(member?.representation?.alpha3Code)
	);
}

/** The committee and conference member a picked name stands for, or null when it matches none */
export function membersNamed({
	committeeMembers,
	conferenceMembers,
	name
}: {
	committeeMembers: NamedMember[];
	conferenceMembers: NamedMember[];
	name: string;
}) {
	if (!name) return null;
	const committeeMember = committeeMembers.find((x) => memberName(x) === name);
	const conferenceMember = conferenceMembers.find((x) => memberName(x) === name);
	const member = committeeMember ?? conferenceMember;
	if (!member) return null;
	return {
		committeeMemberId: committeeMember?.id,
		conferenceMemberId: conferenceMember?.id,
		label: memberName(member)
	};
}
