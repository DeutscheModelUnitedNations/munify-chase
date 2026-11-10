<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { client } from '#lib/api/rumbleClient/client';
	import { delegatorUrl, fetchActiveDelegatorLink } from '#lib/api/delegatorLink';
	import { getIsGlobalAdmin } from '#lib/state/currentUser.svelte';
	import LinkSyncButton from './LinkSyncButton.svelte';

	/**
	 * Above a synced conference's people: they come from the linked MUNify DELEGATOR (the team at
	 * once, participants once the assignment is released) and are changed there. Global admins can
	 * ask for a sync right here, where missing people are noticed.
	 */
	let { conferenceId }: { conferenceId: string } = $props();

	const [link, conference, isGlobalAdmin] = $derived(
		await Promise.all([
			fetchActiveDelegatorLink(),
			client.liveQuery.conference({ __args: { id: conferenceId }, managedByDelegator: true }),
			getIsGlobalAdmin()
		])
	);
</script>

{#if link && conference?.managedByDelegator}
	<div class="alert alert-info mb-4 flex flex-wrap items-center gap-3 text-sm" role="note">
		<i aria-hidden="true" class="ph-duotone ph-link"></i>
		<span class="flex-1">{m.delegatorLinkPeopleNotice()}</span>
		<div class="flex flex-wrap gap-2">
			<a
				class="btn btn-sm btn-ghost"
				href={delegatorUrl({ remoteUrl: link.remoteUrl, conferenceId })}
				target="_blank"
				rel="noopener"
			>
				<i aria-hidden="true" class="ph-duotone ph-arrow-square-out"></i>
				{m.delegatorLinkOpen()}
			</a>
			{#if isGlobalAdmin}
				<LinkSyncButton />
			{/if}
		</div>
	</div>
{/if}
