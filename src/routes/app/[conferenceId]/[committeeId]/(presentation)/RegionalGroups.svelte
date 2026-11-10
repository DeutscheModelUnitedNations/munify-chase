<script lang="ts">
	import type { RegionalgroupEnum } from '#lib/api/rumbleClient/client';
	import Flag from '#lib/components/Flag.svelte';
	import { translateRegionalGroupEnum } from '#lib/utils/enumTranslationHelper';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { groupDisplayMs, nextGroup } from './presentation';

	interface Props {
		open: boolean;
		committeeMembers: Array<{
			id: string;
			present: boolean;
			representation?: {
				name?: string | null;
				alpha2Code?: string | null;
				alpha3Code?: string | null;
				icon?: string | null;
				type?: string | null;
				regionalGroup?: string | null;
			} | null;
		}>;
	}

	let { open, committeeMembers }: Props = $props();

	let activeGroup: RegionalgroupEnum = $state('AFRICA');

	const getGroupMembers = (group: RegionalgroupEnum) =>
		committeeMembers.filter((member) => member.representation?.regionalGroup === group);

	$effect(() => {
		let timeout: ReturnType<typeof setTimeout> | undefined;
		if (activeGroup) {
			timeout = setTimeout(
				() => {
					activeGroup = nextGroup(activeGroup);
				},
				groupDisplayMs(getGroupMembers(activeGroup).length)
			);
		}

		return () => {
			if (timeout) clearTimeout(timeout);
		};
	});
</script>

{#snippet Modal(group: RegionalgroupEnum)}
	<div
		class="modal-box bg-base-200 max-h-9/12 w-full max-w-9/12"
		in:fly={{ x: 100, duration: 1000, delay: 700, easing: cubicOut }}
		out:fly={{ x: -100, duration: 1000, easing: cubicIn }}
	>
		<h2 class="mb-8 w-full text-center text-4xl font-bold">
			{translateRegionalGroupEnum(group)}
		</h2>
		<div class="flex h-full w-full flex-wrap items-center justify-center gap-4">
			{#each getGroupMembers(group) as member (member.id)}
				<div class="flex w-22 flex-col items-center justify-start gap-1">
					<Flag representation={member.representation} size="full" />
					<div class="text-center font-mono font-bold">
						{member.representation?.alpha2Code?.toUpperCase()}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#if open}
	<div class="modal modal-open">
		{#if activeGroup === 'AFRICA'}
			{@render Modal('AFRICA')}
		{:else if activeGroup === 'ASIA_PACIFIC'}
			{@render Modal('ASIA_PACIFIC')}
		{:else if activeGroup === 'EASTERN_EUROPE'}
			{@render Modal('EASTERN_EUROPE')}
		{:else if activeGroup === 'LATIN_AMERICA_CARIBBEAN'}
			{@render Modal('LATIN_AMERICA_CARIBBEAN')}
		{:else if activeGroup === 'WESTERN_EUROPE_OTHERS'}
			{@render Modal('WESTERN_EUROPE_OTHERS')}
		{/if}
	</div>
{/if}
