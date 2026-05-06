<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import EditPresenceEventModal from './EditPresenceEventModal.svelte';

	interface Props {
		conferenceId: string;
	}
	let { conferenceId }: Props = $props();

	const events = await client.liveQuery.nsaPresenceEvents({
		__args: {
			where: { conference: { id: conferenceId } },
			orderBy: { timestamp: 'desc' }
		},
		id: true,
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

	let editorOpen = $state(false);
	let editTarget = $state<any | null>(null);

	function openInsert() {
		editTarget = null;
		editorOpen = true;
	}

	function openEdit(ev: any) {
		editTarget = {
			id: ev.id,
			type: ev.type,
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

	function formatDateTime(ts: string | Date) {
		const d = ts instanceof Date ? ts : new Date(ts);
		return d.toLocaleString();
	}
</script>

<BasicCard>
	<div class="mb-3 flex items-center justify-between">
		<h2 class="text-xl font-bold">{m.nsaAttendanceTabHistory()}</h2>
		<button class="btn btn-primary btn-sm" onclick={openInsert}>
			<i class="fas fa-plus mr-1"></i>{m.insertPresenceEvent()}
		</button>
	</div>

	{#if (events ?? []).length === 0}
		<p class="text-base-content/60 py-4 text-center text-sm">{m.noEventsYet()}</p>
	{:else}
		<ul class="flex flex-col gap-1">
			{#each events ?? [] as ev (ev.id)}
				{@const rep = ev.conferenceUser?.conferenceMember?.representation}
				<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
					<i
						class="fas {ev.type === 'CHECK_IN'
							? 'fa-arrow-right-to-bracket text-success'
							: 'fa-arrow-right-from-bracket text-warning'} text-lg"
					></i>
					<span class="font-medium">
						{ev.conferenceUser?.name ?? ev.conferenceUser?.userEmail ?? m.unknown()}
					</span>
					{#if rep?.name}
						<span class="text-base-content/60 text-sm">{rep.name}</span>
					{/if}
					<span class="text-base-content/70">
						{ev.committee?.abbreviation ?? ev.committee?.name ?? '?'}
					</span>
					{#if ev.note}
						<span class="badge badge-outline badge-sm">{ev.note}</span>
					{/if}
					<span class="ml-auto text-sm">{formatDateTime(ev.timestamp)}</span>
					<button class="btn btn-ghost btn-sm" onclick={() => openEdit(ev)} aria-label={m.edit()}>
						<i class="fas fa-pen"></i>
					</button>
				</li>
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
