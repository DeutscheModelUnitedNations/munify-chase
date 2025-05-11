<script lang="ts">
	import type {
		CommitteeTeamQuery,
		CommitteeTeamQuery$result,
		SpeakersListCategoryEnum$options
	} from '$houdini';
	import { m } from '$lib/paraglide/messages';
	import { getFullTranslatedCountryNameFromISO3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { Command } from 'bits-ui';
	import hotkeys from 'hotkeys-js';
	import { onMount } from 'svelte';
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
	}

	let { committeeId, members, type, speakersList }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<SpeechControls {type} {speakersList} />

	<div class="flex gap-2">
		<NextSpeech {type} {speakersList} />
		<MoreOptions {type} {speakersList} />
	</div>

	<AddSpeakers />
</div>
