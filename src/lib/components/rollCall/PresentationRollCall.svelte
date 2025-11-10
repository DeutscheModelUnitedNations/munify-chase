<script lang="ts">
import { liveQuery } from "dexie";
import type { CommitteeTeamQuery$result } from "$houdini";
import { localDB } from "$lib/local-db/localDB";
import { m } from "$lib/paraglide/messages";
import Modal from "../Modal.svelte";
import ScrollingCountryList from "./ScrollingCountryList.svelte";

interface Props {
  members: CommitteeTeamQuery$result["findFirstCommittee"]["members"];
  committeeId: string;
}

const { members, committeeId }: Props = $props();

const committeeSettingsQuery = liveQuery(() =>
  localDB.committeeSettings.get(committeeId),
);
const currentIndex = $derived($committeeSettingsQuery?.rollCall);
</script>

<Modal open={!!currentIndex || currentIndex === 0}>
	<h1 class="text-2xl font-bold">{m.rollCall()}</h1>
	{#if currentIndex || currentIndex === 0}
		<ScrollingCountryList {members} {currentIndex} />
	{/if}
</Modal>
