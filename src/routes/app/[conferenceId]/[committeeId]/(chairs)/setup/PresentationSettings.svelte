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
				presentationRootFontSize: 16,
				presentationGridHeight: 60,
				rollCall: null,

				showOfHandsVotingActive: false,
				showOfHandsVotingStage: null,
				showOfHandsVotingVotesPro: 0,
				showOfHandsVotingVotesCon: 0,
				showOfHandsVotingVotesAbstain: 0,
				showOfHandsVotingVotesTotal: 0,

				rollCallVotingActive: false,
				rollCallVotingPro: [],
				rollCallVotingCon: [],
				rollCallVotingAbstain: [],

				votingVoteName: '',
				votingMajority: null,
				votingWithAbstentions: null,
				votingMajorityAmount: null
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
	<div class="divider"></div>
	<div class="flex items-center gap-4">
		<i class="fa-duotone fa-text-size text-2xl"></i>
		<div class="join">
			<button
				class="btn join-item"
				onclick={() => {
					localDB.committeeSettings.update(committeeId, {
						presentationRootFontSize: ($committeeSettings?.presentationRootFontSize || 16) - 1
					});
				}}
				aria-label="Font Size Decrease"
			>
				<i class="fas fa-minus"></i>
			</button>
			<div class="btn join-item btn-active">
				{$committeeSettings?.presentationRootFontSize || '?'}
			</div>
			<button
				class="btn join-item"
				onclick={() => {
					localDB.committeeSettings.update(committeeId, {
						presentationRootFontSize: ($committeeSettings?.presentationRootFontSize || 16) + 1
					});
				}}
				aria-label="Font Size Increase"
			>
				<i class="fas fa-plus"></i>
			</button>
			<button
				class="btn join-item"
				onclick={() => {
					localDB.committeeSettings.update(committeeId, {
						presentationRootFontSize: 16
					});
				}}
				aria-label="Font Size Reset"
			>
				<i class="fas fa-rotate-left"></i>
			</button>
		</div>
	</div>
	<div class="flex items-center gap-4">
		<i class="fa-duotone fa-line-height text-2xl"></i>
		<div class="join">
			<button
				class="btn join-item"
				onclick={() => {
					localDB.committeeSettings.update(committeeId, {
						presentationRootFontSize: ($committeeSettings?.presentationGridHeight || 60) - 10
					});
				}}
				aria-label="Font Size Decrease"
			>
				<i class="fas fa-minus"></i>
			</button>
			<div class="btn join-item btn-active">
				{$committeeSettings?.presentationGridHeight || '?'}
			</div>
			<button
				class="btn join-item"
				onclick={() => {
					localDB.committeeSettings.update(committeeId, {
						presentationRootFontSize: ($committeeSettings?.presentationGridHeight || 60) + 10
					});
				}}
				aria-label="Font Size Increase"
			>
				<i class="fas fa-plus"></i>
			</button>
			<button
				class="btn join-item"
				onclick={() => {
					localDB.committeeSettings.update(committeeId, {
						presentationGridHeight: 60
					});
				}}
				aria-label="Font Size Reset"
			>
				<i class="fas fa-rotate-left"></i>
			</button>
		</div>
	</div>
	<p class="label w-full whitespace-normal">{m.baseFontSizeDescription()}</p>
</fieldset>

<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
	<legend class="fieldset-legend">{m.displayRegionalGroups()}</legend>
	<Tabs
		activeTab={$committeeSettings?.displayRegionalGroups}
		tabs={regionalGroupTabs}
		onTabChange={toggleRegionalGroups}
	/>
</fieldset>
