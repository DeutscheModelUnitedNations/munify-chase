<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Modal from '../Modal.svelte';
	import ScrollingCountryList from './ScrollingCountryList.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import { latchWhileDisconnected } from '$lib/state/connection.svelte';

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
			currentMemberIndex: true,
			// Needed so updates.completeRollCallSession can resolve which committee to
			// clear when the close replays cross-tab / offline (no subscription).
			committeeId: true
		}
	});

	// Freeze the last-known index while the WS is confirmed disconnected, so a real
	// outage doesn't close the modal mid-roll-call — only a genuine session change does.
	const getCurrentIndex = latchWhileDisconnected(
		() => committee?.activeRollCallSession?.currentMemberIndex ?? null
	);
	let currentIndex = $derived(getCurrentIndex());
</script>

<Modal open={currentIndex !== null}>
	<h1 class="text-2xl font-bold">{m.rollCall()}</h1>
	{#if currentIndex !== null}
		<ScrollingCountryList {members} {currentIndex} />
	{/if}
</Modal>
