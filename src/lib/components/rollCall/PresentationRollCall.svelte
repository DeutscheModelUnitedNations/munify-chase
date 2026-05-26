<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Modal from '../Modal.svelte';
	import ScrollingCountryList from './ScrollingCountryList.svelte';
	import { client } from '$lib/api/rumbleClient/client';

	interface Props {
		members: Array<{
			id: string;
			present: boolean;
			representation?: {
				name?: string | null;
				alpha2Code?: string | null;
				alpha3Code?: string | null;
				faIcon?: string | null;
				type?: string | null;
			} | null;
		}>;
		committeeId: string;
	}

	let { members, committeeId }: Props = $props();

	const activeSessions = await client.liveQuery.rollCallSessions({
		__args: {
			where: { committeeId, completedAt: { isNull: true } },
			orderBy: { createdAt: 'desc' }
		},
		id: true,
		currentMemberIndex: true
	});

	let currentIndex = $derived(activeSessions?.at(0)?.currentMemberIndex ?? null);
</script>

<Modal open={currentIndex !== null}>
	<h1 class="text-2xl font-bold">{m.rollCall()}</h1>
	{#if currentIndex !== null}
		<ScrollingCountryList {members} {currentIndex} />
	{/if}
</Modal>
