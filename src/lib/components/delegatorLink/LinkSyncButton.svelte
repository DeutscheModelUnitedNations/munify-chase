<script lang="ts">
	import toast from 'svelte-french-toast';
	import { CombinedError } from '@urql/core';
	import { m } from '#lib/paraglide/messages';
	import { client } from '#lib/api/rumbleClient/client';
	import { syncLinkBothWays } from '#lib/api/delegatorLink';
	import { withBackendMessage } from '#lib/utils/toast';
	import { registerCommands } from '#lib/commands/registry.svelte';

	/**
	 * "Sync now" for the link to MUNify DELEGATOR, for global admins: this instance asks DELEGATOR for
	 * everything again, and DELEGATOR reads this instance again (`docs/plans/delegator-link.md`).
	 * The last sync on the launcher's link card updates by itself once the worker wrote.
	 */
	let { class: className = '' }: { class?: string } = $props();

	let syncing = $state(false);

	// the generated client types a mutation without arguments as its result, not as a call
	const call = (mutation: unknown) => () => (mutation as () => Promise<boolean>)();

	function messageOf(error: unknown) {
		if (error instanceof CombinedError && error.graphQLErrors.length > 0) {
			return error.graphQLErrors[0].message;
		}
		return error instanceof Error ? error.message : String(error);
	}

	/** This side failing is an error; DELEGATOR failing is said on its own, this side still syncs. */
	function report({ local, remote }: Awaited<ReturnType<typeof syncLinkBothWays>>) {
		if (local.status === 'rejected') {
			return toast.error(withBackendMessage(m.delegatorLinkSyncFailed(), local.reason));
		}
		if (!local.value) return toast.error(m.delegatorLinkSyncNoLink());
		if (remote.status === 'rejected') {
			const error = messageOf(remote.reason);
			return toast.error(m.delegatorLinkSyncRemoteFailed({ error }), { duration: 8000 });
		}
		toast.success(m.delegatorLinkSyncRequested());
	}

	async function syncNow() {
		if (syncing) return;
		syncing = true;
		try {
			report(
				await syncLinkBothWays({
					requestLocal: call(client.mutate.requestLinkSync),
					requestRemote: call(client.mutate.requestRemoteLinkSync)
				})
			);
		} finally {
			syncing = false;
		}
	}

	registerCommands(() => [
		{
			id: 'delegator-link.sync-now',
			title: m.delegatorLinkSyncNow,
			group: 'page',
			icon: 'arrows-clockwise',
			keywords: ['DELEGATOR', 'sync'],
			enabled: () => !syncing,
			run: syncNow
		}
	]);
</script>

<button
	type="button"
	class="btn btn-sm {className}"
	onclick={syncNow}
	disabled={syncing}
	title={m.delegatorLinkSyncHint()}
>
	{#if syncing}
		<span class="loading loading-spinner loading-xs" aria-hidden="true"></span>
	{:else}
		<i aria-hidden="true" class="ph-duotone ph-arrows-clockwise"></i>
	{/if}
	{m.delegatorLinkSyncNow()}
</button>
