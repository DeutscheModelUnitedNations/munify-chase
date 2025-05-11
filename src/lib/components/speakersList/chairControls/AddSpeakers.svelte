<script lang="ts">
	import { representation } from '$api/db/schema';
	import type { CommitteeTeamQuery$result } from '$houdini';
	import Combobox from '$lib/components/Combobox.svelte';
	import { getFullTranslatedCountryNameFromISO3Code } from '$lib/utils/nationTranslationHelper.svelte';

	interface Props {
		speakersList?: NonNullable<
			CommitteeTeamQuery$result['findFirstCommittee']['activeAgendaItem']
		>['speakersList'][number];
		members?: CommitteeTeamQuery$result['findFirstCommittee']['members'];
	}

	let { speakersList, members }: Props = $props();

	let searchValue = $state('');

	let options = $derived(
		members?.map((member) => ({
			representation: member.representation
		}))
	);
</script>

<Combobox bind:value={searchValue} side="bottom" placeholder="Search for Country" {options}
></Combobox>
