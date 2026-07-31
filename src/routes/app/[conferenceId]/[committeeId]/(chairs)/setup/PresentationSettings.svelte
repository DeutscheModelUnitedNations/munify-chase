<script lang="ts">
	import Tabs from '$lib/components/Tabs.svelte';
	import { getPresentationLayoutPresets } from '$lib/data/presentationLayoutPresets';
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import { promiseToastStrings } from '$lib/utils/toast';
	import toast from 'svelte-french-toast';

	interface Props {
		committeeId: string;
	}

	let { committeeId }: Props = $props();

	const layoutPresetLabels: Record<string, () => string> = {
		default: m.layoutPresetDefault,
		smallScreen: m.layoutPresetSmallScreen
	};

	const committeeData = await client.liveQuery.committee({
		__args: { id: committeeId },
		id: true,
		presentationLayout: true,
		presentationRootFontSize: true,
		presentationResolutionFontSize: true,
		displayRegionalGroups: true
	});

	// Local state for slider instant preview — initialized to defaults; $effects below sync from server
	let localRootFontSize = $state(16);
	let localResolutionFontSize = $state(16);

	// Keep local slider state in sync when server value changes (e.g. another device updates it)
	$effect(() => {
		if (committeeData?.presentationRootFontSize != null) {
			localRootFontSize = committeeData.presentationRootFontSize;
		}
	});
	$effect(() => {
		if (committeeData?.presentationResolutionFontSize != null) {
			localResolutionFontSize = committeeData.presentationResolutionFontSize;
		}
	});

	const changeLayoutKey = async (e: Event) => {
		await toast.promise(
			client.mutate.updateCommittee({
				__args: {
					id: committeeId,
					presentationLayout: (e.target as HTMLSelectElement).value
				},
				id: true
			}),
			promiseToastStrings(m.layout(), 'update')
		);
	};

	const toggleRegionalGroups = async (tab: boolean | undefined) => {
		await toast.promise(
			client.mutate.updateCommittee({
				__args: { id: committeeId, displayRegionalGroups: tab ?? false },
				id: true
			}),
			promiseToastStrings(m.displayRegionalGroups(), 'update')
		);
	};

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
		{#each getPresentationLayoutPresets() as preset (preset)}
			<option value={preset} selected={committeeData?.presentationLayout === preset}>
				{layoutPresetLabels[preset]?.() ?? preset}
			</option>
		{/each}
	</select>
	<p class="label w-full whitespace-normal">{m.layoutDescription()}</p>
	<div class="divider"></div>
	<div class="flex flex-col gap-4">
		<div class="flex items-center gap-4">
			<i class="fa-duotone fa-text-size text-2xl"></i>
			<input
				type="range"
				min="10"
				max="50"
				step="1"
				bind:value={localRootFontSize}
				onchange={() =>
					client.mutate
						.updateCommittee({
							__args: { id: committeeId, presentationRootFontSize: localRootFontSize },
							id: true
						})
						.catch(() => {})}
				class="range range-primary w-full"
			/>
			<span class="w-10 text-center">{localRootFontSize}</span>
		</div>
	</div>
	<p class="label w-full whitespace-normal">{m.baseFontSizeDescription()}</p>
	<div class="divider"></div>
	<div class="flex flex-col gap-4">
		<div class="flex items-center gap-4">
			<i class="fa-duotone fa-file-lines text-2xl"></i>
			<input
				type="range"
				min="10"
				max="50"
				step="1"
				bind:value={localResolutionFontSize}
				onchange={() =>
					client.mutate
						.updateCommittee({
							__args: {
								id: committeeId,
								presentationResolutionFontSize: localResolutionFontSize
							},
							id: true
						})
						.catch(() => {})}
				class="range range-primary w-full"
			/>
			<span class="w-10 text-center">{localResolutionFontSize}</span>
		</div>
	</div>
	<p class="label w-full whitespace-normal">{m.resolutionFontSizeDescription()}</p>
</fieldset>

<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
	<legend class="fieldset-legend">{m.displayRegionalGroups()}</legend>
	<Tabs
		activeTab={committeeData?.displayRegionalGroups}
		tabs={regionalGroupTabs}
		onTabChange={toggleRegionalGroups}
	/>
</fieldset>
