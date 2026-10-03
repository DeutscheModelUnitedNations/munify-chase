<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';

	import { getCurrentUser } from '$lib/state/currentUser.svelte';

	let { children }: { children: Snippet } = $props();

	// Awaited as its own statement: an `await` nested inside the query's arguments resumes
	// without the component context on the server, so the query's exchanges (which read
	// `page.url`, see isLocalConferenceActive) would throw and 500 the page.
	const currentUser = await getCurrentUser();

	await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: { eq: page.params.conferenceId } },
				user: { id: { eq: currentUser.id ?? '' } }
			}
		},
		id: true,
		conferenceUserType: true,
		committeeMemberId: true,
		conferenceMemberId: true,
		committeeMember: {
			id: true,
			present: true,
			committeeId: true,
			representation: {
				id: true,
				name: true,
				alpha2Code: true,
				alpha3Code: true,
				type: true,
				faIcon: true
			}
		},
		conferenceMember: {
			id: true,
			representation: {
				id: true,
				name: true,
				alpha3Code: true,
				type: true,
				faIcon: true
			}
		}
	});
</script>

{@render children()}
