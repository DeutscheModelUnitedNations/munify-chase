<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		conferenceTitle?: string;
		conferenceId?: string;
	}

	let { conferenceTitle, conferenceId }: Props = $props();

	let loading = $state(false);

	async function download() {
		loading = true;
		if (!conferenceId) {
			loading = false;
			throw new Error('No conference ID provided');
		}

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

		// TODO the file downloads could be refactored into a helper function
		// TODO maybe a schema export just like with the endpoints would make sense?
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

		loading = false;
	}
</script>

<li>
	<button onclick={download} class="" aria-label="Download Delegator presence data">
		<i class="fa-duotone fa-download w-6 text-center"></i>
		{m.downloadPresenceData()}
	</button>
</li>
