<script lang="ts">
	import QRCode from 'qrcode';
	import CommitteeGrid, { type ConferenceData } from '$lib/components/CommitteeGrid.svelte';
	import CommitteePresentation from '$lib/components/presentation/CommitteePresentation.svelte';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { getLocale, setLocale, locales } from '$lib/paraglide/runtime';

	// The Pi helper navigates Chromium to /kiosk?deviceId=<id>. There is no
	// human input on the appliance; the id is never typed.
	const deviceId = page.url.searchParams.get('deviceId');

	// Ensure the row exists. Idempotent; only a device-flow (kiosk) session is
	// allowed to register. Errors (e.g. revoked device) are ignored — the live
	// query below drives the on-screen state.
	//
	// Client-only: `client.mutate.*` is a SvelteKit remote-function `command`,
	// which throws if invoked during SSR of a GET request (this page load).
	if (browser && deviceId) {
		try {
			await client.mutate.registerDisplayDevice({ __args: { id: deviceId }, id: true });
		} catch {
			// fall through to the live query / pairing screen
		}
	}

	// The filtered *plural* query, not the by-id singular field: the singular
	// field is non-nullable and throws "not found" when the row doesn't exist
	// — true both for a brand-new device before registration (registration
	// above only runs client-side, so the very first SSR pass always predates
	// it) and for a device an admin deletes from /app/displays later. That
	// second case matters for a *live* push, not just the initial load: a
	// GraphQL error on a subscription push gets thrown inside the client's
	// map() transform and never reaches Svelte's update() callback (nothing
	// downstream catches it), so the page would keep showing whatever it last
	// rendered forever instead of reacting to the deletion. A list result has
	// no such failure mode — deletion just makes it resolve to `[]`, same as
	// "not registered yet" — so both cases fall out of one unexceptional query.
	//
	// A single never-reassigned `const` matters here: `client.liveQuery.*`
	// returns a Proxy wired to Svelte's createSubscriber — reading a property
	// on it (e.g. in the $deriveds below) subscribes to live updates pushed
	// via the server's pubsub. Reassigning a separate $state variable instead
	// broke that — the page stopped picking up admin changes (committee,
	// locale, timezone) without a manual reload.
	const devices = deviceId
		? await client.liveQuery.displayDevices({
				__args: { where: { id: deviceId } },
				id: true,
				name: true,
				revoked: true,
				conferenceId: true,
				committeeId: true,
				locale: true,
				timezone: true,
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
		: [];

	// Reading `devices[0]` inside $derived still goes through the Proxy's
	// getter (indexed access included), so this stays reactive to live
	// pushes exactly like reading a property directly would.
	let device = $derived(devices[0] ?? null);

	// Kiosk has no UI to pick a language — apply whatever the organizer
	// assigned in /app/displays. setLocale() writes the paraglide cookie and
	// reloads, so this self-corrects within one extra reload; $effect only
	// runs client-side (never during SSR), so no `browser` guard is needed.
	$effect(() => {
		const deviceLocale = device?.locale;
		if (
			deviceLocale &&
			(locales as readonly string[]).includes(deviceLocale) &&
			deviceLocale !== getLocale()
		) {
			setLocale(deviceLocale as (typeof locales)[number]);
		}
	});

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

	// A single assigned committee switches the kiosk to that committee's full
	// CommitteePresentation view (the same one a chair would open on a
	// projector) instead of the multi-committee overview grid below.
	let presentationCommitteeId = $derived(
		assignedConference && device?.committeeId ? device.committeeId : null
	);

	let gridConference = $derived.by<ConferenceData | null>(() => {
		if (!assignedConference || presentationCommitteeId) return null;
		return {
			id: assignedConference.id,
			committees: assignedConference.committees ?? []
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
{:else if presentationCommitteeId}
	<!-- Force a remount on committee change: CommitteePresentation's live query
	     binds to its committeeId prop only once at mount (a single, never-
	     reassigned `client.liveQuery.*` const — see the note on `device`
	     above), so switching the assignment to a different committee needs a
	     fresh instance rather than an in-place prop update. -->
	{#key presentationCommitteeId}
		<CommitteePresentation committeeId={presentationCommitteeId} />
	{/key}
{:else if gridConference}
	<div class="bg-base-200 flex min-h-screen flex-col">
		<div class="navbar bg-base-100 shadow-sm">
			<h1 class="ml-4 flex-1 truncate text-3xl font-bold">
				{assignedConference?.title}
			</h1>
			<div class="flex-none pr-4">
				<CurrentTime timezone={device?.timezone} />
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
			{#if pairUrl}
				<div class="flex flex-col items-center gap-1">
					<span class="text-base-content/50 text-xs font-bold uppercase tracking-widest">
						{m.displayPairUrl()}
					</span>
					<code class="text-base-content/80 text-sm break-all">{pairUrl}</code>
				</div>
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

<style>
	/* The kiosk appliance has no pointer input at all (module.nix disables
	   every libinput device), but the cage/wlroots compositor still renders
	   a default cursor sprite regardless — that's a compositor-level
	   limitation with no reliable fix at that layer (see the open cage
	   issues on this), so it's suppressed here instead, the one place we
	   have full control over every pixel shown. :global so it reaches
	   <html>/<body>, outside this component's own markup; scoped to this
	   route only (removed automatically when it unmounts) so a normal
	   browser session elsewhere in the app keeps its cursor. The Pi's own
	   generated pages (loading/reconnecting/pairing screens shown before
	   Chromium ever reaches this route) set the same `cursor:none` inline
	   — see chase-kiosk-helper.py. */
	:global(html),
	:global(body) {
		cursor: none;
	}
</style>
