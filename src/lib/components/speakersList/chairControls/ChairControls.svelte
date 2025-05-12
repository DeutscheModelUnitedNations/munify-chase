<script lang="ts">
	import type { CommitteeTeamQuery$result, SpeakersListCategoryEnum$options } from '$houdini';
	import SpeechControls from './SpeechControls.svelte';
	import MoreOptions from './MoreOptions.svelte';
	import NextSpeech from './NextSpeech.svelte';
	import AddSpeakers from './AddSpeakers.svelte';

	type List =
		| NonNullable<
				CommitteeTeamQuery$result['findFirstCommittee']['activeAgendaItem']
		  >['speakersList'][number]
		| null;

	interface Props {
		committeeId: string;
		type: SpeakersListCategoryEnum$options;
		members: CommitteeTeamQuery$result['findFirstCommittee']['members'];
		speakersList?: List;
		childList?: List;
		otherList?: List;
	}

	let { committeeId, members, type, speakersList, childList, otherList }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<SpeechControls {type} {speakersList} otherList={childList ?? otherList} />

	<div class="flex gap-2">
		<NextSpeech {speakersList} {childList} {type} />
		<MoreOptions {type} {speakersList} />
	</div>

	<AddSpeakers {members} {speakersList} />
</div>
