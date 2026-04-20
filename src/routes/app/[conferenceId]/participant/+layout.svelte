<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';

	import { getCurrentUser } from '$lib/state/currentUser.svelte';

	let { children }: { children: Snippet } = $props();

	const conferenceUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: page.params.conferenceId },
				user: { id: (await getCurrentUser()).id ?? '' }
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
