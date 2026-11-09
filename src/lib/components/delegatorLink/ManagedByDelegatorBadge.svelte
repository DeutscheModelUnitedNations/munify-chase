<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { client } from '#lib/api/rumbleClient/client';
	import { delegatorUrl, fetchActiveDelegatorLink } from '#lib/api/delegatorLink';

	/**
	 * Says that a conference comes from the linked MUNify DELEGATOR, where its committees, roles and
	 * people are changed, and leads there. Nothing for a conference of this instance's own.
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
		class="badge badge-ghost gap-1"
		href={delegatorUrl({ remoteUrl: link.remoteUrl, conferenceId })}
		target="_blank"
		rel="noopener"
		title={m.managedByDelegatorHint()}
	>
		<i class="ph-fill ph-link"></i>
		{m.managedByDelegator()}
	</a>
{/if}
