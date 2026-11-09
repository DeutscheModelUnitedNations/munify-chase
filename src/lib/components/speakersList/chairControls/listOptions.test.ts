import { describe, expect, it } from 'vitest';
import { m } from '#lib/paraglide/messages';
import {
	firstSpeaker,
	hasSpeakers,
	listLabel,
	memberName,
	membersNamed,
	renameTarget,
	toggleClosedCommand
} from './listOptions';

const list = {
	id: 'l',
	type: 'COMMENT_LIST',
	speakers: [
		{ id: 'b', position: 1 },
		{ id: 'a', position: 0 }
	]
};

describe('list helpers', () => {
	it('names the list', () => {
		expect(listLabel('COMMENT_LIST')).toBe(m.commentList());
		expect(listLabel('SPEAKERS_LIST')).toBe(m.speakersList());
	});

	it('finds the speaker at the front', () => {
		expect(firstSpeaker(list)?.id).toBe('a');
		expect(firstSpeaker(null)).toBeUndefined();
	});

	it('knows whether anyone is on the list', () => {
		expect(hasSpeakers(list)).toBe(true);
		expect(hasSpeakers({ speakers: [] })).toBe(false);
		expect(hasSpeakers(undefined)).toBe(false);
	});

	it('offers to open a closed list and close an open one', () => {
		expect(toggleClosedCommand(true)).toEqual({
			title: m.commandSpeakersListOpenList,
			icon: 'lock-open'
		});
		expect(toggleClosedCommand(false).icon).toBe('lock');
	});
});

describe('renameTarget', () => {
	it('renames the current speaker', () => {
		expect(renameTarget({ list, name: 'X' })).toEqual({ speakerId: 'a', listType: 'COMMENT_LIST' });
	});

	it('skips without a list or a name, and reports an empty list', () => {
		expect(renameTarget({ list: null, name: 'X' })).toBe('skip');
		expect(renameTarget({ list, name: '' })).toBe('skip');
		expect(renameTarget({ list: { ...list, speakers: [] }, name: 'X' })).toBe('noSpeaker');
	});
});

describe('members by name', () => {
	const committeeMembers = [{ id: 'cm', representation: { name: 'WHO' } }];
	const conferenceMembers = [{ id: 'conf', representation: { alpha3Code: 'DEU' } }];

	it('names a member by its representation or country', () => {
		expect(memberName(committeeMembers[0])).toBe('WHO');
		expect(memberName(conferenceMembers[0])).toBe(
			memberName({ id: 'x', representation: { alpha3Code: 'DEU' } })
		);
	});

	it('finds the members a name stands for', () => {
		expect(membersNamed({ committeeMembers, conferenceMembers, name: 'WHO' })).toEqual({
			committeeMemberId: 'cm',
			conferenceMemberId: undefined,
			label: 'WHO'
		});
		const country = memberName(conferenceMembers[0]);
		expect(membersNamed({ committeeMembers, conferenceMembers, name: country })).toMatchObject({
			committeeMemberId: undefined,
			conferenceMemberId: 'conf'
		});
	});

	it('finds nothing for an empty or unknown name', () => {
		expect(membersNamed({ committeeMembers, conferenceMembers, name: '' })).toBeNull();
		expect(membersNamed({ committeeMembers, conferenceMembers, name: 'Nobody' })).toBeNull();
	});
});
