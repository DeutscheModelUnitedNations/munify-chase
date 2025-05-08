<script lang="ts">
	import {
		getPresentationLayoutPresets,
		type PresentationLayoutPresetOptions
	} from '$lib/data/presentationLayoutPresets';
	import { localDB } from '$lib/local-db/localDB';
	import { m } from '$lib/paraglide/messages';
	import { promiseToastStrings } from '$lib/utils/toast';
	import { liveQuery } from 'dexie';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	interface Props {
		committeeId: string;
	}

	let { committeeId }: Props = $props();

	let layoutKey = liveQuery(() => localDB.committeeSettings.get(committeeId));

	const changeLayoutKey = async (e: Event) => {
		await toast.promise(
			localDB.committeeSettings.update(committeeId, {
				layout: (e.target as HTMLSelectElement).value as PresentationLayoutPresetOptions
			}),
			promiseToastStrings(m.layout(), 'update')
		);
	};

	onMount(async () => {
		if (!(await localDB.committeeSettings.get(committeeId))) {
			await localDB.committeeSettings.add({
				committeeId,
				layout: 'default'
			});
		}
	});
</script>

<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
	<legend class="fieldset-legend">{m.layout()}</legend>
	<select class="select w-full" onchange={changeLayoutKey}>
		<option disabled selected>{m.layoutSelect()}</option>
		{#each getPresentationLayoutPresets() as preset}
			<option value={preset} selected={$layoutKey?.layout === preset}>
				{m.layoutPreset({ preset })}
			</option>
		{/each}
	</select>
	<p class="label w-full whitespace-normal">{m.layoutDescription()}</p>
</fieldset>
