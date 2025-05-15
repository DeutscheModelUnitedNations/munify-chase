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

<div class="flex w-full flex-col">
	{#if speakers && speakers.length > 0}
		{#each speakers as speaker, i (speaker.id)}
			<div
				class="hover:border-primary/30 border-base-100 card group relative flex flex-row items-center gap-4 border-1 p-4 transition-colors duration-300"
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
				<h2 class="flex-1 text-lg font-bold">
					{speaker.committeeMember?.representation?.name ||
						getTranslatedCountryNameFromAlpha3Code(
							speaker.committeeMember?.representation?.alpha3Code
						)}
				</h2>
				<div
					class="join invisible absolute right-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100"
				>
					<button
						class="btn btn-sm join-item btn-square btn-error btn-soft"
						aria-label="Delete Speaker"
					>
						<i class="fa-solid fa-trash"></i>
					</button>
					<button
						class="btn btn-sm join-item btn-square btn-soft btn-primary"
						aria-label="Move Speaker Up"
					>
						<i class="fa-solid fa-chevron-up"></i>
					</button>
					<button
						class="btn btn-sm join-item btn-square btn-soft btn-primary"
						aria-label="Move Speaker Down"
					>
						<i class="fa-solid fa-chevron-down"></i>
					</button>
					<button
						class="btn btn-sm join-item btn-square btn-primary btn-soft"
						aria-label="Move Speaker to Top"
					>
						<i class="fa-solid fa-chevrons-up"></i>
					</button>
				</div>
			</div>
		{/each}
	{:else}
		<StripesAlert badgeText={m.listEmpty()} />
	{/if}
	{#if closed}
		<StripesAlert badgeColor="error" stripeColor="error" faIcon="lock" badgeText={m.listClosed()} />
	{/if}
</div>
