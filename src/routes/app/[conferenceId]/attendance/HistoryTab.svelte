<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import EditPresenceEventModal from './EditPresenceEventModal.svelte';

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

	function formatDateTime(ts: string | Date) {
		const d = ts instanceof Date ? ts : new Date(ts);
		return d.toLocaleString();
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
				<i class="fas fa-plus mr-1"></i>{m.insertPresenceEvent()}
			</button>
		</div>
	</div>

	{#if visibleEvents.length === 0}
		<p class="text-base-content/60 py-4 text-center text-sm">{m.noEventsYet()}</p>
	{:else}
		<ul class="flex flex-col gap-1">
			{#each visibleEvents as ev (ev.id)}
				{@const rep = ev.conferenceUser?.conferenceMember?.representation}
				<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
					<i
						class="fas {ev.present
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
