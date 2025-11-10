<script lang="ts">
import { cubicOut } from "svelte/easing";
import { scale } from "svelte/transition";
import type { CommitteeTeamQuery$result } from "$houdini";
import { m } from "$lib/paraglide/messages";
import { getTranslatedCountryNameFromAlpha3Code } from "$lib/utils/nationTranslationHelper.svelte";
import Flag from "../Flag.svelte";

interface Props {
  currentIndex: number;
  members: CommitteeTeamQuery$result["findFirstCommittee"]["members"];
  height?: string;
  icons?: {
    id: string;
    icon: string;
    color?: "info" | "success" | "error";
  }[];
}

const { currentIndex, members, height = "70vh", icons }: Props = $props();

let containerRef: HTMLElement;
let listContainerRef: HTMLElement;

let offset = $state(0);

function centerSelectedCountry() {
  if (!containerRef || !listContainerRef) return;

  const parentHeight = listContainerRef.clientHeight;

  const containerHeight = containerRef.clientHeight;

  const elementHeight = containerHeight / members.length;
  const elementOffset = elementHeight * currentIndex + elementHeight / 2;

  offset = -elementOffset + parentHeight / 2;
}

// Watch for changes in currentCountry
$effect(() => {
  if (currentIndex !== undefined) {
    centerSelectedCountry();
  }
});
</script>

<div class="relative flex h-full w-full flex-col gap-2 overflow-hidden pl-6 pr-6">
	<div class="absolute bottom-0 left-0 top-0 z-40 flex items-center justify-center">
		<i class="fas fa-caret-right text-4xl"></i>
	</div>
	<div class="absolute bottom-0 right-0 top-0 z-40 flex items-center justify-center">
		<i class="fas fa-caret-left text-4xl"></i>
	</div>
	<div class="relative overflow-hidden" bind:this={listContainerRef} style="max-height: {height};">
		<div
			class="from-base-100 pointer-events-none absolute left-0 top-0 z-40 h-32 w-full bg-gradient-to-b to-transparent"
		></div>
		<div
			class="from-base-100 pointer-events-none absolute bottom-0 left-0 z-40 h-32 w-full bg-gradient-to-t to-transparent"
		></div>
		<div class="card bg-base-300 h-22 absolute left-0 top-1/2 -z-10 w-full -translate-y-1/2"></div>
		<div
			class="transition-transform duration-500"
			style="transform: translateY({offset}px);"
			bind:this={containerRef}
		>
			{#each members as member, index}
				{@const rep = member.representation}
				{@const icon = icons?.find((x) => x.id === member.id)}
				{@const present = member.present && index < currentIndex}
				{@const notPresent = !member.present && index < currentIndex}
				<div
					class="flex w-full flex-shrink-0 flex-row items-center gap-4 p-2 {currentIndex === index
						? 'card-active'
						: ''}"
				>
					<Flag representation={member.representation} size="md" />
					<h3 class="flex-1 text-2xl {notPresent ? 'opacity-40' : ''} transition-all duration-500">
						{#if rep && (rep.name || rep.alpha3Code)}
							{rep.name ?? getTranslatedCountryNameFromAlpha3Code(rep.alpha3Code!)}
						{:else}
							{m.unknown()}
						{/if}
					</h3>
					<div class="relative w-12">
						{#if icon && index < currentIndex}
							<i
								class="fas fa-{icon.icon.replace(
									'fa-',
									''
								)} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-2xl text-{icon.color}"
								transition:scale={{
									delay: 600,
									duration: 500,
									easing: cubicOut,
									opacity: 0
								}}
							></i>
						{:else if notPresent}
							<i
								class="fas fa-circle-xmark text-error absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-3xl"
								transition:scale={{
									delay: 600,
									duration: 500,
									easing: cubicOut,
									opacity: 0
								}}
							></i>
						{:else if present}
							<i
								class="fas fa-check fa-beatfade text-success absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-3xl"
								in:scale={{
									delay: 600,
									duration: 500,
									easing: cubicOut,
									opacity: 0
								}}
							></i>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
