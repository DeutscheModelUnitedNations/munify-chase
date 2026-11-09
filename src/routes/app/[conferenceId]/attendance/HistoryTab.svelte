<script lang="ts">
	import { client } from '#lib/api/rumbleClient/client';
	import { m } from '#lib/paraglide/messages';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import EditPresenceEventModal from './EditPresenceEventModal.svelte';
	import HistoryEventRow from './HistoryEventRow.svelte';

	interface Props {
		conferenceId: string;
	}
	let { conferenceId }: Props = $props();

	const events = await client.liveQuery.presenceEvents({
		__args: {
			where: { committee: { conference: { id: { eq: conferenceId } } } },
			orderBy: { timestamp: 'desc' }
		},
		id: true,
		present: true,
		type: true,
		timestamp: true,
		committeeId: true,
		conferenceUserId: true,
		note: true,
		conferenceUser: {
			id: true,
			userEmail: true,
			name: true,
			conferenceMember: { representation: { name: true } }
		},
		committee: { id: true, name: true, abbreviation: true }
	});

	let nsaScanOnly = $state(false);
	let hideCheckOut = $state(true);
	let visibleEvents = $derived(
		(events ?? [])
			.filter((e) => !nsaScanOnly || e.type === 'NSA_SCAN')
			.filter((e) => !hideCheckOut || e.present)
	);

	type PresenceEvent = NonNullable<typeof events>[number];
	type EditTarget = {
		id: string;
		present: boolean;
		committeeId: string;
		conferenceUserId: string;
		timestamp: string | Date;
		note?: string | null;
	};

	let editorOpen = $state(false);
	let editTarget = $state<EditTarget | null>(null);

	function openInsert() {
		editTarget = null;
		editorOpen = true;
	}

	function openEdit(ev: PresenceEvent) {
		editTarget = {
			id: ev.id,
			present: ev.present,
			committeeId: ev.committeeId,
			conferenceUserId: ev.conferenceUserId,
			timestamp: ev.timestamp,
			note: ev.note
		};
		editorOpen = true;
	}

	function closeEditor() {
		editorOpen = false;
		editTarget = null;
	}
</script>

<BasicCard>
	<div class="mb-3 flex items-center justify-between gap-2">
		<h2 class="text-xl font-bold">{m.nsaAttendanceTabHistory()}</h2>
		<div class="flex items-center gap-2">
			<label class="label cursor-pointer gap-1 text-sm">
				<input type="checkbox" class="toggle toggle-sm" bind:checked={nsaScanOnly} />
				{m.nsaScanOnly()}
			</label>
			<label class="label cursor-pointer gap-1 text-sm">
				<input type="checkbox" class="toggle toggle-sm" bind:checked={hideCheckOut} />
				{m.hideCheckOut()}
			</label>
			<button class="btn btn-primary btn-sm" onclick={openInsert}>
				<i aria-hidden="true" class="ph-fill ph-plus mr-1"></i>{m.insertPresenceEvent()}
			</button>
		</div>
	</div>

	{#if visibleEvents.length === 0}
		<p class="text-base-content/60 py-4 text-center text-sm">{m.noEventsYet()}</p>
	{:else}
		<ul class="flex flex-col gap-1">
			{#each visibleEvents as ev (ev.id)}
				<HistoryEventRow event={ev} onEdit={() => openEdit(ev)} />
			{/each}
		</ul>
	{/if}
</BasicCard>

{#if editorOpen}
	<EditPresenceEventModal
		bind:open={editorOpen}
		{conferenceId}
		event={editTarget}
		onClose={closeEditor}
	/>
{/if}
