<script lang="ts">
	import { getWsConnected, justReconnected } from '#lib/state/connection.svelte';
	import { m } from '#lib/paraglide/messages';
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	import { fly } from 'svelte/transition';
	import { dodgeOnHover } from './dodgeOnHover';

	// Presentation view sits at /app/{conferenceId}/{committeeId} with no further segments.
	let isPresentation = $derived(/^\/app\/[^/]+\/[^/]+\/?$/.test(page.url.pathname));

	// Home page and conference selection don't need the offline hint.
	let isHomeOrSelection = $derived(/^\/(app(\/import)?)?\/?$/.test(page.url.pathname));

	// Only show offline banner once we have a confirmed disconnected state — not while
	// the initial WS handshake is still in progress (null).
	let showBanner = $derived(getWsConnected() === false && !isPresentation);

	let dodging = $state(false);

	$effect(() => {
		if (justReconnected()) {
			toast.success(m.backOnline(), { duration: 4000 });
		}
	});
</script>

{#if showBanner}
	<div
		{@attach dodgeOnHover((near) => (dodging = near))}
		class="pointer-events-none fixed right-4 bottom-2 z-50 transition-all duration-300 ease-out {dodging
			? 'translate-y-2 scale-95 opacity-0'
			: 'translate-y-0 scale-100 opacity-100'}"
		transition:fly={{ y: 16, duration: 200 }}
	>
		<div
			class="bg-warning text-warning-content flex items-center gap-2 rounded-2xl px-3 py-1.5 text-sm shadow-lg"
		>
			<i aria-hidden="true" class="ph-fill ph-wifi-slash"></i>
			<div class="flex flex-col leading-tight">
				<span class="font-medium">{m.offlineBannerTitle()}</span>
				<span class="text-xs opacity-75">{m.offlineBannerDescription()}</span>
			</div>
		</div>
	</div>
{/if}
