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

	// Drive the modal from `committee.activeRollCallSession` — the single source of
	// truth defined in the schema. Open iff the committee references a session;
	// close when that reference goes null.
	const committee = await client.liveQuery.committee({
		__args: { id: committeeId },
		id: true,
		activeRollCallSession: {
			id: true,
			currentMemberIndex: true
		}
	});

	let currentIndex = $derived(committee?.activeRollCallSession?.currentMemberIndex ?? null);
</script>

<Modal open={currentIndex !== null}>
	<h1 class="text-2xl font-bold">{m.rollCall()}</h1>
	{#if currentIndex !== null}
		<ScrollingCountryList {members} {currentIndex} />
	{/if}
</Modal>
