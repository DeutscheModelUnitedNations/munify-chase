<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import type { YjsConnectionState } from '#lib/api/yjs/createPaperYjs.svelte';

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
		<i aria-hidden="true" class="ph-fill ph-cloud-check"></i>
		{m.yjsSynced()}
	{:else if state === 'syncing'}
		<i aria-hidden="true" class="ph-fill ph-cloud-arrow-up icon-fade"></i>
		{m.yjsSyncing()}
	{:else if state === 'loading'}
		<i aria-hidden="true" class="ph-fill ph-spinner-gap animate-spin"></i>
		{m.loadingDocument()}
	{:else if state === 'error'}
		<i aria-hidden="true" class="ph-fill ph-warning"></i>
		{m.yjsCorrupt()}
	{:else}
		<i aria-hidden="true" class="ph-fill ph-cloud-slash"></i>
		{m.yjsOffline()}
	{/if}
</div>
