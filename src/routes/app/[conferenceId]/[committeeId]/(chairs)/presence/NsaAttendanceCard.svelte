<script lang="ts">
	import { client } from '#lib/api/rumbleClient/client';
	import { m } from '#lib/paraglide/messages';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import NsaScannerDrawer from './NsaScannerDrawer.svelte';
	import { presentInCommittee } from './nsaAttendance';

	interface Props {
		conferenceId: string;
		committeeId: string;
	}

	let { conferenceId, committeeId }: Props = $props();

	let drawerOpen = $state(false);

	// All presence events in the conference, newest first. We subscribe to the
	// auto-generated query (which supports live updates) and derive the latest
	// event per user client-side.
	const allEvents = await client.liveQuery.presenceEvents({
		__args: {
			where: { committee: { conference: { id: { eq: conferenceId } } }, type: 'NSA_SCAN' },
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
				representation: { name: true, icon: true }
			}
		}
	});

	let presentHere = $derived(presentInCommittee(allEvents ?? [], committeeId));

	function openScanner() {
		drawerOpen = true;
	}

	registerCommands(() => [
		{
			id: 'presence.scan-nsa',
			title: m.scanNsaPerson,
			group: 'page',
			icon: 'qr-code',
			run: openScanner
		}
	]);

	function formatSince(ts: string | Date) {
		const d = ts instanceof Date ? ts : new Date(ts);
		return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
	}
</script>

<BasicCard title={m.nsaAttendance()} data-tour="presence.nsa">
	<div class="flex flex-col gap-3">
		<button class="btn btn-primary btn-xl" onclick={openScanner}>
			<i aria-hidden="true" class="ph-fill ph-qr-code mr-2"></i>
			{m.scanNsaPerson()}
		</button>

		{#if presentHere.length > 0}
			<ul class="flex flex-col gap-1">
				{#each presentHere as event (event.id)}
					{@const rep = event.conferenceUser?.conferenceMember?.representation}
					<li
						class="hover:bg-base-200 card flex w-full flex-row items-center gap-4 p-2 transition-all duration-300"
					>
						{#if rep?.icon}
							<i aria-hidden="true" class="ph-fill ph-{rep.icon} text-xl"></i>
						{:else}
							<i aria-hidden="true" class="ph-fill ph-identification-badge text-xl"></i>
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

<NsaScannerDrawer bind:open={drawerOpen} {conferenceId} {committeeId} />
