<script lang="ts">
	import type { CommitteeTeamQuery$result, SpeakersListCategoryEnum$options } from '$houdini';
	import SpeechControls from './SpeechControls.svelte';
	import MoreOptions from './MoreOptions.svelte';
	import NextSpeech from './NextSpeech.svelte';
	import AddSpeakers from './AddSpeakers.svelte';

	interface Props {
		committeeId: string;
		type: SpeakersListCategoryEnum$options;
		members: CommitteeTeamQuery$result['findFirstCommittee']['members'];
		speakersList?:
			| NonNullable<
					CommitteeTeamQuery$result['findFirstCommittee']['activeAgendaItem']
			  >['speakersList'][number]
			| null;
		childListId?: string;
	}

	let { committeeId, members, type, speakersList, childListId }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<SpeechControls {type} {speakersList} />

	<div class="flex gap-2">
		<NextSpeech {speakersList} {childListId} {type} />
		<MoreOptions {type} {speakersList} />
	</div>

	<AddSpeakers {members} {speakersList} />
</div>
