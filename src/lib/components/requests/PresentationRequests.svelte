<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { flip } from 'svelte/animate';
	import { queueFlip, queueIn, queueOut } from '#lib/helpers/queueTransitions';
	import { fly } from 'svelte/transition';
	import Flag from '../Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';

	type Representation = {
		name?: string | null;
		alpha2Code?: string | null;
		alpha3Code?: string | null;
		faIcon?: string | null;
		type?: string | null;
	};

	export type PresentationRequest = {
		id: string;
		requestType?: { name: string; faIcon?: string | null } | null;
		representation: Representation | null;
	};

	interface Props {
		/** Pending requests, already in queue order */
		requests: PresentationRequest[];
	}

	let { requests }: Props = $props();

	// Show as many rows as fit the tile and summarise the rest, like the
	// speakers queue does, instead of letting the list clip mid-row
	let listHeight = $state(0);
	let rowHeight = $state(0);
	const visibleCount = $derived.by(() => {
		if (!rowHeight) return requests.length;
		const fitting = Math.max(1, Math.floor(listHeight / rowHeight));
		// Keep a row free for the "+N more" line when not everything fits
		return fitting >= requests.length ? requests.length : Math.max(1, fitting - 1);
	});

	const name = (representation: Representation | null) =>
		representation?.name || getTranslatedCountryNameFromAlpha3Code(representation?.alpha3Code);
</script>

<div class="flex h-full min-h-0 w-full flex-col gap-3">
	<div class="flex shrink-0 items-center gap-3">
		<i class="fa-duotone fa-hand text-warning text-2xl"></i>
		<h2 class="flex-1 text-xl font-bold">{m.requests()}</h2>
		<span class="badge badge-warning badge-lg font-bold tabular-nums">{requests.length}</span>
	</div>
	<ol class="flex min-h-0 flex-1 flex-col overflow-hidden" bind:clientHeight={listHeight}>
		{#each requests.slice(0, visibleCount) as req (req.id)}
			<!-- Rows share one height, so whichever row renders last reports it -->
			<li
				bind:offsetHeight={rowHeight}
				class="flex items-center gap-3 py-1.5"
				animate:flip={queueFlip}
				in:fly={queueIn}
				out:fly={queueOut}
			>
				<i
					class="fas fa-{(req.requestType?.faIcon ?? 'fa-flag').replace(
						'fa-',
						''
					)} w-6 shrink-0 text-center text-lg"
				></i>
				<Flag representation={req.representation} size="xs" />
				<div class="flex min-w-0 flex-col leading-tight">
					<span class="truncate font-bold">{name(req.representation)}</span>
					<span class="text-base-content/60 truncate text-sm">{req.requestType?.name}</span>
				</div>
			</li>
		{/each}
		{#if requests.length > visibleCount}
			<li class="text-base-content/60 py-1.5 pl-9 text-sm">
				{m.presentationMoreRequests({ count: requests.length - visibleCount })}
			</li>
		{/if}
	</ol>
</div>
