<script lang="ts">
	import QRCode from 'qrcode';
	import CommitteeGrid, { type ConferenceData } from '$lib/components/CommitteeGrid.svelte';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { page } from '$app/state';

	// The Pi helper navigates Chromium to /kiosk?deviceId=<id>. There is no
	// human input on the appliance; the id is never typed.
	const deviceId = page.url.searchParams.get('deviceId');

	// Ensure the row exists. Idempotent; only the shared display account
	// (service_user) is allowed to register. Errors (e.g. revoked device) are
	// ignored — the live query below drives the on-screen state.
	if (deviceId) {
		try {
			await client.mutate.registerDisplayDevice({ __args: { id: deviceId }, id: true });
		} catch {
			// fall through to the live query / pairing screen
		}
	}

	const device = deviceId
		? await client.liveQuery.displayDevice({
				__args: { id: deviceId },
				id: true,
				name: true,
				revoked: true,
				conferenceId: true,
				committeeId: true,
				conference: {
					id: true,
					title: true,
					committees: {
						id: true,
						name: true,
						abbreviation: true,
						activeAgendaItem: {
							id: true,
							title: true
						},
						status: true,
						statusHeadline: true,
						statusUntil: true,
						stateOfDebate: true,
						lastResolutionAdoptionDate: true
					}
				}
			})
		: null;

	// Where an organizer assigns this device. Route groups like (launcher) do
	// not appear in the URL, so the path is /app/displays.
	const pairUrl = deviceId
		? `${page.url.origin}/app/displays?focus=${encodeURIComponent(deviceId)}`
		: '';
	const qrDataUrl = deviceId
		? await QRCode.toDataURL(pairUrl, { width: 480, margin: 1, errorCorrectionLevel: 'M' })
		: null;

	let assignedConference = $derived(
		device && !device.revoked && device.conference ? device.conference : null
	);

	let gridConference = $derived.by<ConferenceData | null>(() => {
		if (!assignedConference) return null;
		const committees = device?.committeeId
			? (assignedConference.committees ?? []).filter(
					(c: { id: string }) => c.id === device.committeeId
				)
			: (assignedConference.committees ?? []);
		return {
			id: assignedConference.id,
			committees
		} as unknown as ConferenceData;
	});
</script>

<svelte:head>
	<title>{m.displayKioskTitle()} - MUNify CHASE</title>
</svelte:head>

{#if !deviceId}
	<div class="bg-base-200 flex min-h-screen flex-col items-center justify-center gap-4 p-8">
		<i class="fa-duotone fa-display-slash text-base-content/40 text-7xl"></i>
		<h1 class="m-0 text-3xl font-bold">{m.displayKioskNotConfigured()}</h1>
	</div>
{:else if gridConference}
	<div class="bg-base-200 flex min-h-screen flex-col">
		<div class="navbar bg-base-100 shadow-sm">
			<h1 class="ml-4 flex-1 truncate text-3xl font-bold">
				{assignedConference?.title}
			</h1>
			<div class="flex-none pr-4">
				<CurrentTime />
			</div>
		</div>
		<CommitteeGrid conference={gridConference} environment="SPECTATOR" />
	</div>
{:else}
	<div class="bg-base-200 flex min-h-screen flex-col items-center justify-center gap-6 p-8">
		{#if device?.revoked}
			<i class="fa-duotone fa-ban text-error text-7xl"></i>
			<h1 class="m-0 text-3xl font-bold">{m.displayRevokedHeadline()}</h1>
			<p class="text-base-content/70 m-0 max-w-md text-center">{m.displayRevokedBody()}</p>
		{:else}
			<h1 class="m-0 text-3xl font-bold">{m.displayPairHeadline()}</h1>
			<p class="text-base-content/70 m-0 max-w-md text-center">{m.displayPairBody()}</p>
			{#if qrDataUrl}
				<img src={qrDataUrl} alt="QR" class="bg-base-100 size-[480px] rounded-2xl p-4 shadow-sm" />
			{/if}
		{/if}
		<div class="bg-base-100 rounded-box flex flex-col items-center gap-1 px-6 py-4 shadow-sm">
			<span class="text-base-content/50 text-xs font-bold uppercase tracking-widest">
				{m.displayDeviceId()}
			</span>
			<code class="text-2xl font-bold tracking-wider">{deviceId}</code>
		</div>
	</div>
{/if}
