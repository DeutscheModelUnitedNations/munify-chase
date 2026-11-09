<script lang="ts">
	import { client } from '#lib/api/rumbleClient/client';
	import { m } from '#lib/paraglide/messages';
	import toast from 'svelte-french-toast';
	import { withBackendMessage } from '#lib/utils/toast';

	interface Props {
		conferenceTitle?: string;
		conferenceId?: string;
	}

	let { conferenceTitle, conferenceId }: Props = $props();

	let isDownloading = $state(false);

	// a linked DELEGATOR reads the presence itself; the file is only a fallback then
	const managed = $derived(
		conferenceId
			? (await client.query.conference({ __args: { id: conferenceId }, managedByDelegator: true }))
					.managedByDelegator
			: false
	);

	async function download() {
		if (!conferenceId) {
			console.warn('Cannot export presence data without conferenceId');
			return;
		}

		isDownloading = true;
		try {
			const result = await client.query.committeeMembers({
				__args: { where: { representation: { conferenceId: { eq: conferenceId } } } },
				id: true,
				committeeId: true,
				users: {
					id: true,
					userEmail: true
				},
				representation: {
					id: true,
					alpha3Code: true,
					alpha2Code: true,
					icon: true,
					type: true,
					name: true
				},
				presenceChangedTimestamps: {
					id: true,
					presentSetTo: true,
					timestamp: true
				}
			});

			const blob = new Blob([JSON.stringify(result, null, 2)], {
				type: 'application/json'
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${conferenceTitle || 'conference'}-presence-export.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error('Failed to export presence data', err);
			toast.error(withBackendMessage(m.saveError(), err));
		} finally {
			isDownloading = false;
		}
	}
</script>

{#snippet button()}
	<button
		class="btn btn-sm btn-ghost gap-2"
		onclick={download}
		disabled={isDownloading || !conferenceId}
		aria-label={m.exportAttendanceData()}
	>
		{#if isDownloading}
			<span class="loading loading-spinner loading-xs"></span>
		{:else}
			<i aria-hidden="true" class="ph-duotone ph-download-simple"></i>
		{/if}
		<span class="hidden sm:inline">{m.exportAttendanceData()}</span>
	</button>
{/snippet}

{#if managed}
	<details>
		<summary class="cursor-pointer text-sm">{m.presenceExportLinkedFallback()}</summary>
		<div class="mt-2">{@render button()}</div>
	</details>
{:else}
	{@render button()}
{/if}
