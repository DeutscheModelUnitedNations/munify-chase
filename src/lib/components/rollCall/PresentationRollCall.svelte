<script lang="ts">
	import type { CommitteeTeamQuery$result } from '$houdini';
	import { m } from '$lib/paraglide/messages';
	import Modal from '../Modal.svelte';
	import ScrollingCountryList from './ScrollingCountryList.svelte';
	import { localDB } from '$lib/local-db/localDB';
	import { liveQuery } from 'dexie';

	interface Props {
		members: CommitteeTeamQuery$result['findFirstCommittee']['members'];
		committeeId: string;
	}

	let { members, committeeId }: Props = $props();

	let committeeSettingsQuery = liveQuery(() => localDB.committeeSettings.get(committeeId));
	let currentIndex = $derived($committeeSettingsQuery?.rollCall);
</script>

<Modal open={!!currentIndex || currentIndex === 0}>
	<h1 class="text-2xl font-bold">{m.rollCall()}</h1>
	{#if currentIndex || currentIndex === 0}
		<ScrollingCountryList {members} {currentIndex} />
	{/if}
</Modal>
