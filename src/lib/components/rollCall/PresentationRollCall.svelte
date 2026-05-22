<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Modal from '../Modal.svelte';
	import ScrollingCountryList from './ScrollingCountryList.svelte';
	import { localDB } from '$lib/local-db/localDB';
	import { liveQuery } from 'dexie';

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

	let committeeSettingsQuery = liveQuery(() => localDB.committeeSettings.get(committeeId));
	let currentIndex = $derived($committeeSettingsQuery?.rollCall);
	let pendingIds = $derived($committeeSettingsQuery?.rollCallPending ?? []);
</script>

<Modal open={!!currentIndex || currentIndex === 0}>
	<h1 class="text-2xl font-bold">{m.rollCall()}</h1>
	{#if currentIndex || currentIndex === 0}
		<ScrollingCountryList {members} {currentIndex} {pendingIds} />
	{/if}
</Modal>
