<script lang="ts">
	import type { CommitteeTeamQuery$result } from '$houdini';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { flip } from 'svelte/animate';
	import Flag from '../Flag.svelte';
	import { cubicInOut, cubicOut } from 'svelte/easing';
	import { blur, fly } from 'svelte/transition';
	import StripesAlert from './StripesAlert.svelte';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		rawSpeakers?: NonNullable<
			CommitteeTeamQuery$result['findFirstCommittee']['activeAgendaItem']
		>['speakersList'][number]['speakers'];
		closed?: boolean;
	}

	let { rawSpeakers, closed = false }: Props = $props();

	let speakers = $derived(rawSpeakers?.toSpliced(0, 1));
</script>

<div class="flex w-full flex-col gap-4">
	{#if speakers && speakers.length > 0}
		{#each speakers as speaker, i (speaker.id)}
			<div
				class="flex items-center gap-4"
				animate:flip={{ duration: 500, easing: cubicInOut }}
				in:fly={{ duration: 500, y: 20, easing: cubicOut }}
				out:fly={{ duration: 500, y: -20, easing: cubicOut }}
			>
				<div class="w-4 text-sm opacity-50">{i + 1}.</div>
				<Flag
					alpha2Code={speaker.committeeMember?.representation?.alpha2Code}
					nsa={!speaker.committeeMember?.representation?.alpha2Code}
					icon={speaker.committeeMember?.representation?.faIcon}
					size="sm"
				/>
				<h2 class="text-lg font-bold">
					{speaker.committeeMember?.representation?.name ||
						getTranslatedCountryNameFromAlpha3Code(
							speaker.committeeMember?.representation?.alpha3Code
						)}
				</h2>
			</div>
		{/each}
	{:else}
		<StripesAlert badgeText={m.listEmpty()} />
	{/if}
	{#if closed}
		<StripesAlert badgeColor="error" stripeColor="error" faIcon="lock" badgeText={m.listClosed()} />
	{/if}
</div>
