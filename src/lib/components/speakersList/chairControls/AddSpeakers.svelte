<script lang="ts">
	import { representation } from '$api/db/schema';
	import type { CommitteeTeamQuery$result } from '$houdini';
	import Combobox from '$lib/components/Combobox.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';

	interface Props {
		speakersList?: NonNullable<
			CommitteeTeamQuery$result['findFirstCommittee']['activeAgendaItem']
		>['speakersList'][number];
		members: CommitteeTeamQuery$result['findFirstCommittee']['members'];
	}

	let { speakersList, members }: Props = $props();

	let value = $state('');

	const filter = (x: string, value: string) => x.toLowerCase().includes(value.toLowerCase());
	const getName = (representation: NonNullable<typeof members>[number]['representation']) =>
		representation?.name
			? representation.name
			: getTranslatedCountryNameFromAlpha3Code(representation?.alpha3Code);
</script>

<Combobox
	{value}
	options={members ?? []}
	filter={({ representation }, value) => filter(getName(representation), value)}
	placeholder="Search for a country"
	getStringValue={({ representation }) => getName(representation)}
>
	{#snippet ListItem(option)}
		<Flag
			size="xs"
			alpha2Code={option.representation?.alpha2Code}
			nsa={!option.representation?.alpha2Code}
			icon={option.representation?.faIcon}
		/>
		<span class="ml-2">
			{getName(option.representation)}
		</span>
	{/snippet}
</Combobox>
