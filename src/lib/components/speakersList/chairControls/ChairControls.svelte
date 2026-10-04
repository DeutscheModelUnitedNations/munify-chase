<script lang="ts">
	import type { SpeakerslistcategoryEnum } from '$lib/api/rumbleClient/client';
	import SpeechControls from './SpeechControls.svelte';
	import MoreOptions from './MoreOptions.svelte';
	import NextSpeech from './NextSpeech.svelte';
	import AddSpeakers from './AddSpeakers.svelte';

	type List = {
		id: string;
		type: string;
		isClosed: boolean;
		speakingTime: number;
		startTimestamp?: Date | null;
		timeLeft: number;
		speakers: Array<{
			id: string;
			position: number;
			overwriteName?: string | null;
			committeeMember?: {
				id: string;
				representation?: {
					name?: string | null;
					alpha2Code?: string | null;
					alpha3Code?: string | null;
					faIcon?: string | null;
					type?: string | null;
				} | null;
			} | null;
			conferenceMember?: {
				id: string;
				representation?: {
					name?: string | null;
					alpha2Code?: string | null;
					alpha3Code?: string | null;
					faIcon?: string | null;
					type?: string | null;
				} | null;
			} | null;
		}>;
	} | null;

	type MemberLike = {
		id: string;
		present?: boolean;
		representation?: {
			name?: string | null;
			alpha2Code?: string | null;
			alpha3Code?: string | null;
			faIcon?: string | null;
			type?: string | null;
		} | null;
	};

	interface Props {
		type: SpeakerslistcategoryEnum;
		committeeMembers: MemberLike[];
		conferenceMembers: MemberLike[];
		speakersList?: List;
		childList?: List;
		otherList?: List;
	}

	let { committeeMembers, conferenceMembers, type, speakersList, childList, otherList }: Props =
		$props();

	// Tour anchors only on the main list, so the tour doesn't jump between both columns
	const tourAnchor = (name: string) =>
		type === 'SPEAKERS_LIST' ? `speakers-list.${name}` : undefined;
</script>

<div class="flex flex-col gap-4">
	<div data-tour={tourAnchor('timer')}>
		<SpeechControls {type} {speakersList} otherList={childList ?? otherList} />
	</div>

	<div class="flex gap-2" data-tour={tourAnchor('queue-controls')}>
		<NextSpeech {speakersList} {childList} parentList={otherList} {type} />
		<MoreOptions {speakersList} {type} />
	</div>

	<div data-tour={tourAnchor('add-speakers')}>
		<AddSpeakers {committeeMembers} {conferenceMembers} {speakersList} {type} />
	</div>
</div>
