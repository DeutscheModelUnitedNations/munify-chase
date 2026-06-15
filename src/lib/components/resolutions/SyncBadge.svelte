<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { YjsConnectionState } from '$lib/api/yjs/createPaperYjs.svelte';

	interface Props {
		connectionState: YjsConnectionState;
		persistenceLoaded: boolean;
		wsSynced: boolean;
	}

	let { connectionState, persistenceLoaded, wsSynced }: Props = $props();

	const state = $derived.by(() => {
		if (connectionState === 'error') return 'error';
		if (!persistenceLoaded) return 'loading';
		if (wsSynced) return 'synced';
		if (connectionState === 'connected') return 'syncing';
		if (connectionState === 'connecting') return 'syncing';
		return 'offline';
	});
</script>

<div
	class="badge badge-sm gap-1"
	class:badge-success={state === 'synced'}
	class:badge-warning={state === 'syncing' || state === 'loading'}
	class:badge-error={state === 'error'}
	class:badge-ghost={state === 'offline'}
	title={state === 'error' ? m.yjsCorrupt() : undefined}
>
	{#if state === 'synced'}
		<i class="fas fa-cloud-check"></i>
		{m.yjsSynced()}
	{:else if state === 'syncing'}
		<i class="fas fa-cloud-arrow-up fa-fade"></i>
		{m.yjsSyncing()}
	{:else if state === 'loading'}
		<i class="fas fa-spinner fa-spin"></i>
		{m.loadingDocument()}
	{:else if state === 'error'}
		<i class="fas fa-triangle-exclamation"></i>
		{m.yjsCorrupt()}
	{:else}
		<i class="fas fa-cloud-slash"></i>
		{m.yjsOffline()}
	{/if}
</div>
