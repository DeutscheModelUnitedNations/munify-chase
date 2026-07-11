<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import NsaScannerDrawer from './NsaScannerDrawer.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	interface Props {
		conferenceId: string;
		committeeId: string;
	}

	let { conferenceId, committeeId }: Props = $props();

	let drawerOpen = $state(false);

	// All presence events in the conference, newest first. We subscribe to the
	// auto-generated query (which supports live updates) and derive the latest
	// event per user client-side.
	const allEvents = $derived(
		await client.liveQuery.presenceEvents({
			__args: {
				where: { committee: { conference: { id: conferenceId } }, type: 'NSA_SCAN' },
				orderBy: { timestamp: 'desc' }
			},
			id: true,
			present: true,
			committeeId: true,
			timestamp: true,
			conferenceUser: {
				id: true,
				userEmail: true,
				name: true,
				conferenceMember: {
					representation: { name: true, faIcon: true }
				}
			}
		})
	);

	type PresenceEvent = NonNullable<typeof allEvents>[number];

	let presentHere = $derived.by(() => {
		const seen = new SvelteSet<string>();
		const out: PresenceEvent[] = [];
		for (const e of allEvents ?? []) {
			const uid = e.conferenceUser?.id;
			if (!uid || seen.has(uid)) continue;
			seen.add(uid);
			if (e.present && e.committeeId === committeeId) out.push(e);
		}
		return out.sort((a, b) => {
			const aName =
				a.conferenceUser?.name ?? a.conferenceUser?.conferenceMember?.representation?.name ?? '';
			const bName =
				b.conferenceUser?.name ?? b.conferenceUser?.conferenceMember?.representation?.name ?? '';
			return aName.localeCompare(bName);
		});
	});

	function formatSince(ts: string | Date) {
		const d = ts instanceof Date ? ts : new Date(ts);
		return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
	}
</script>

<BasicCard title={m.nsaAttendance()}>
	<div class="flex flex-col gap-3">
		<button class="btn btn-primary btn-xl" onclick={() => (drawerOpen = true)}>
			<i class="fas fa-qrcode mr-2"></i>
			{m.scanNsaPerson()}
		</button>

		{#if presentHere.length > 0}
			<ul class="flex flex-col gap-1">
				{#each presentHere as event (event.id)}
					{@const rep = event.conferenceUser?.conferenceMember?.representation}
					<li
						class="hover:bg-base-200 card flex w-full flex-row items-center gap-4 p-2 transition-all duration-300"
					>
						{#if rep?.faIcon}
							<i class="fas {rep.faIcon} text-xl"></i>
						{:else}
							<i class="fas fa-user-tag text-xl"></i>
						{/if}
						<div class="flex flex-1 flex-col">
							<h3 class="text-lg">
								{event.conferenceUser?.name ??
									rep?.name ??
									event.conferenceUser?.userEmail ??
									m.unknown()}
							</h3>
							{#if rep?.name && event.conferenceUser?.name}
								<span class="text-base-content/60 text-sm">{rep.name}</span>
							{/if}
						</div>
						<span class="text-base-content/60 text-sm">
							{m.checkedInSince({ time: formatSince(event.timestamp) })}
						</span>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-base-content/60 py-4 text-center text-sm">{m.noNsasInCommittee()}</p>
		{/if}
	</div>
</BasicCard>

<NsaScannerDrawer bind:open={drawerOpen} {committeeId} />
