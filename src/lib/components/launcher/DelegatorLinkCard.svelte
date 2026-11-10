<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { getLocale } from '#lib/paraglide/runtime';
	import { client } from '#lib/api/rumbleClient/client';
	import LinkSyncButton from '#lib/components/delegatorLink/LinkSyncButton.svelte';

	/**
	 * How the link to a MUNify DELEGATOR instance fares, for global admins
	 * (`docs/plans/delegator-link.md`). The link itself is configuration (`LINK_REMOTE_URL` and the
	 * rest), so there is nothing to change here but asking for a sync now. The card reads the link
	 * live, so the last sync moves once the worker wrote.
	 */
	const links = await client.liveQuery.instanceLinks({
		id: true,
		remoteUrl: true,
		lastEventAt: true,
		lastReconcileAt: true,
		lastError: true
	});
	const link = $derived((links ?? []).at(0));

	const formatTime = (date: Date | string | null | undefined) =>
		date
			? new Date(date).toLocaleString(getLocale(), { dateStyle: 'medium', timeStyle: 'short' })
			: '–';
</script>

{#if link}
	<section class="card bg-base-200 gap-3 p-5">
		<h2 class="m-0 text-lg font-bold">
			<i aria-hidden="true" class="ph-duotone ph-link"></i>
			{m.delegatorLinkActiveTitle()}
		</h2>
		<p class="m-0 text-sm">{m.delegatorLinkActiveBody({ url: link.remoteUrl })}</p>
		<div class="flex flex-wrap items-center gap-x-6 gap-y-2">
			<dl class="m-0 flex flex-col gap-1 text-sm">
				<div class="flex flex-wrap gap-x-6">
					<dt class="text-base-content/60">{m.delegatorLinkLastSync()}</dt>
					<dd class="m-0">{formatTime(link.lastReconcileAt)}</dd>
				</div>
			</dl>
			<LinkSyncButton />
		</div>
		{#if link.lastError}
			<div class="alert alert-warning text-sm">
				<i aria-hidden="true" class="ph-duotone ph-warning"></i>
				<span>{m.delegatorLinkLastError({ error: link.lastError })}</span>
			</div>
		{/if}
		<a
			class="btn btn-primary btn-sm self-start"
			href={link.remoteUrl}
			target="_blank"
			rel="noopener"
		>
			<i aria-hidden="true" class="ph-duotone ph-arrow-square-out"></i>
			{m.delegatorLinkOpen()}
		</a>
	</section>
{/if}
