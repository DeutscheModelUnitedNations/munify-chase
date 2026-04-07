<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';

	let { data, children }: { data: { user: { sub: string } }; children: Snippet } = $props();

	const conferenceUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: page.params.conferenceId },
				user: { id: data.user.sub }
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

	setContext('participantIdentity', conferenceUsers);
</script>

{@render children()}
