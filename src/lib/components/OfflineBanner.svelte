<script lang="ts">
	import { getWsConnected, justReconnected } from '$lib/state/connection.svelte';
	import { m } from '$lib/paraglide/messages';
	import toast from 'svelte-french-toast';
	import { fly } from 'svelte/transition';

	// Only show offline banner once we have a confirmed disconnected state — not while
	// the initial WS handshake is still in progress (null).
	let showBanner = $derived(getWsConnected() === false);

	$effect(() => {
		if (justReconnected()) {
			toast.success(m.backOnline(), { duration: 4000 });
		}
	});
</script>

{#if showBanner}
	<div
		class="fixed right-4 bottom-2 z-50"
		transition:fly={{ y: 16, duration: 200 }}
	>
		<div class="bg-warning text-warning-content flex items-center gap-2 rounded-2xl px-3 py-1.5 text-sm shadow-lg">
			<i class="fas fa-wifi-slash"></i>
			<div class="flex flex-col leading-tight">
				<span class="font-medium">{m.offlineBannerTitle()}</span>
				<span class="text-xs opacity-75">{m.offlineBannerDescription()}</span>
			</div>
		</div>
	</div>
{/if}
