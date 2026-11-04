<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { client } from '#lib/api/rumbleClient/client';
	import { delegatorUrl, fetchActiveDelegatorLink } from '#lib/api/delegatorLink';

	/**
	 * For an NSA of a conference from the linked MUNify DELEGATOR: the way to the digital nametag
	 * there, which chairs scan to check them in.
	 */
	let { conferenceId }: { conferenceId: string } = $props();

	const [link, conference] = $derived(
		await Promise.all([
			fetchActiveDelegatorLink(),
			client.liveQuery.conference({ __args: { id: conferenceId }, managedByDelegator: true })
		])
	);
</script>

{#if link && conference?.managedByDelegator}
	<a
		class="btn btn-primary btn-sm"
		href={delegatorUrl({ remoteUrl: link.remoteUrl, conferenceId, path: '/registration-mode' })}
		target="_blank"
		rel="noopener"
	>
		<i class="fas fa-id-badge"></i>
		{m.showMyNametag()}
	</a>
{/if}
