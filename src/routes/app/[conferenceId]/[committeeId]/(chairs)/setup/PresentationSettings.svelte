<script lang="ts">
	import Tabs from '$lib/components/Tabs.svelte';
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

	let committeeSettings = liveQuery(() => localDB.committeeSettings.get(committeeId));

	const changeLayoutKey = async (e: Event) => {
		await toast.promise(
			localDB.committeeSettings.update(committeeId, {
				layout: (e.target as HTMLSelectElement).value as PresentationLayoutPresetOptions
			}),
			promiseToastStrings(m.layout(), 'update')
		);
	};

	const toggleRegionalGroups = async (tab: boolean | undefined) => {
		await toast.promise(
			localDB.committeeSettings.update(committeeId, {
				displayRegionalGroups: tab || false
			}),
			promiseToastStrings(m.displayRegionalGroups(), 'update')
		);
	};

	onMount(async () => {
		if (!(await localDB.committeeSettings.get(committeeId))) {
			await localDB.committeeSettings.add({
				committeeId,
				layout: 'default',
				displayRegionalGroups: false,
				roleCall: null
			});
		}
	});

	const regionalGroupTabs = [
		{
			id: true,
			label: m.on(),
			faIcon: 'fa-check'
		},
		{
			id: false,
			label: m.off(),
			faIcon: 'fa-xmark'
		}
	];
</script>

<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
	<legend class="fieldset-legend">{m.layout()}</legend>
	<select class="select w-full" onchange={changeLayoutKey}>
		<option disabled selected>{m.layoutSelect()}</option>
		{#each getPresentationLayoutPresets() as preset}
			<option value={preset} selected={$committeeSettings?.layout === preset}>
				{m.layoutPreset({ preset })}
			</option>
		{/each}
	</select>
	<p class="label w-full whitespace-normal">{m.layoutDescription()}</p>
</fieldset>

<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
	<legend class="fieldset-legend">{m.displayRegionalGroups()}</legend>
	<Tabs
		activeTab={$committeeSettings?.displayRegionalGroups}
		tabs={regionalGroupTabs}
		onTabChange={toggleRegionalGroups}
	/>
</fieldset>
