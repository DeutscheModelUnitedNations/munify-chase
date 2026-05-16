<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		conferenceTitle?: string;
		conferenceId?: string;
	}

	let { conferenceTitle, conferenceId }: Props = $props();

	let isDownloading = $state(false);

	async function download() {
		if (!conferenceId) {
			throw new Error('No conference ID provided');
		}

		isDownloading = true;
		try {
			const result = await client.query.committeeMembers({
				__args: { where: { representation: { conferenceId } } },
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
					faIcon: true,
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
		} finally {
			isDownloading = false;
		}
	}
</script>

<button
	class="btn btn-sm btn-ghost gap-2"
	onclick={download}
	disabled={isDownloading || !conferenceId}
	aria-label={m.exportAttendanceData()}
>
	{#if isDownloading}
		<span class="loading loading-spinner loading-xs"></span>
	{:else}
		<i class="fa-duotone fa-download"></i>
	{/if}
	<span class="hidden sm:inline">{m.exportAttendanceData()}</span>
</button>
