<script lang="ts">
import { onMount } from "svelte";
import { flip } from "svelte/animate";
import { cubicInOut, cubicOut } from "svelte/easing";
import { fly } from "svelte/transition";
import Marquee from "svelte-fast-marquee";
import { browser } from "$app/environment";
import type { CommitteeTeamQuery$result } from "$houdini";
import { m } from "$lib/paraglide/messages";
import { getTranslatedCountryNameFromAlpha3Code } from "$lib/utils/nationTranslationHelper.svelte";
import Flag from "../Flag.svelte";
import StripesAlert from "./StripesAlert.svelte";

interface Props {
  rawSpeakers?: NonNullable<
    CommitteeTeamQuery$result["findFirstCommittee"]["activeAgendaItem"]
  >["speakersList"][number]["speakers"];
  closed?: boolean;
  resizeFn?: () => void;
}

let { rawSpeakers, closed = false, resizeFn = $bindable() }: Props = $props();

const speakers = $derived(
  rawSpeakers?.toSorted((a, b) => a.position - b.position).toSpliced(0, 1),
);

const container = $state<HTMLElement | null>(null);
const overflowContainer = $state<HTMLElement | null>(null);
let containerHeight = $state(250);
let rowHeight = $state(70);
let reservedHeight = $state(50); // Reserve space for the header and footer, adjust as needed
const visibleCount = $derived(
  Math.floor((containerHeight - reservedHeight) / rowHeight),
);

const resize = () => {
  if (container && overflowContainer) {
    containerHeight = container.clientHeight;
    rowHeight = container.children[0]?.clientHeight || 20;
    reservedHeight = overflowContainer?.clientHeight || 50;
  }
};

$effect(() => {
  if (browser) {
    resize();
    window.addEventListener("resize", resize);
    container?.addEventListener("reset", resize);
    return () => {
      window.removeEventListener("resize", resize);
      container?.removeEventListener("reset", resize);
    };
  }
});

onMount(() => {
  resizeFn = resize;
});
</script>

<div class="relative flex h-full w-full flex-col overflow-hidden" bind:this={container}>
	{#if speakers && speakers.length > 0}
		{#each speakers.slice(0, visibleCount) as speaker, i (speaker.id)}
			{@const member = speaker.committeeMember || speaker.conferenceMember}
			<div
				class="flex items-center gap-4 py-2"
				animate:flip={{ duration: 500, easing: cubicInOut }}
				in:fly={{ duration: 500, y: 20, easing: cubicOut }}
				out:fly={{ duration: 500, y: -20, easing: cubicOut }}
			>
				<div class="w-4 text-sm opacity-50">{i + 1}.</div>
				<Flag representation={member?.representation} size="sm" />
				<h2 class="text-lg font-bold">
					{member?.representation?.name ||
						getTranslatedCountryNameFromAlpha3Code(member?.representation?.alpha3Code)}
				</h2>
			</div>
		{/each}
		<div
			class="bg-base-200 card inset-shadow-sm mt-2 flex w-full items-center justify-center {speakers.length >
			visibleCount
				? 'opacity-100'
				: 'opacity-0'} transition-all duration-300"
		>
			<Marquee speed={30} gap="3rem">
				<div class="flex items-center justify-center gap-2 py-4" bind:this={overflowContainer}>
					{#each speakers.slice(visibleCount) as speaker, i (i)}
						{@const member = speaker.committeeMember || speaker.conferenceMember}
						<div class="card bg-base-100 flex w-16 items-center justify-center gap-1 p-2 shadow-sm">
							<div class="w-4 text-sm opacity-50">{i + 1 + visibleCount}.</div>
							<Flag representation={member?.representation} size="full" />
							<div class="text-center font-mono font-bold">
								{member?.representation?.alpha2Code?.toUpperCase() || 'N/A'}
							</div>
						</div>
					{/each}
				</div>
				{#if closed}
					<StripesAlert
						badgeColor="error"
						stripeColor="error"
						faIcon="lock"
						badgeText={m.listClosed()}
					/>
				{/if}
			</Marquee>
		</div>
	{:else}
		<StripesAlert badgeText={m.listEmpty()} />
	{/if}
	{#if closed && (speakers?.length || 0) <= visibleCount}
		<StripesAlert badgeColor="error" stripeColor="error" faIcon="lock" badgeText={m.listClosed()} />
	{/if}
</div>
