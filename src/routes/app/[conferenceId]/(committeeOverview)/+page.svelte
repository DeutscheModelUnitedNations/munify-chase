<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { client } from '$lib/api/rumbleClient/client';
	import CommitteeGrid, { type ConferenceData } from '$lib/components/CommitteeGrid.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { CombinedError } from '@urql/core';

	// A mistyped/stale/deleted conference id must not crash the whole page —
	// the generic by-id query throws a RumbleErrorSafe (findFirst-required)
	// when nothing matches. Same try/catch-around-a-single-const pattern as
	// /kiosk, but only that specific "not found" error is shown as the
	// message below instead of a 500 — a transport/auth failure isn't a
	// missing conference and should surface as a real error instead of being
	// silently swallowed.
	const conference = await (async () => {
		try {
			return await client.liveQuery.conference({
				__args: { id: page.params.conferenceId! },
				id: true,
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
					statusUntil: true
				}
			});
		} catch (err) {
			console.error('Failed to load conference', err);
			const isNotFound =
				err instanceof CombinedError &&
				err.graphQLErrors.some((e) => e.message === 'Value not found but required (findFirst)');
			if (!isNotFound) {
				throw err;
			}
			return null;
		}
	})();
</script>

<div class="navbar bg-base-100 shadow-sm">
	<h1 class=" ml-4 flex-1 text-3xl font-bold">{m.committeeOverview()}</h1>
	<div class="flex-none">
		<CurrentTime />
	</div>
	<div class="flex-none">
		<ThemeSwitcher />
		<a
			class="btn btn-ghost btn-square"
			href={resolve('/app/(launcher)')}
			aria-label="Go back to app"
		>
			<i class="fa-duotone fa-home"></i>
		</a>
	</div>
</div>

{#if conference}
	<CommitteeGrid conference={conference as unknown as ConferenceData} />
{:else}
	<div
		class="bg-base-200 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 p-8"
	>
		<i class="fa-duotone fa-circle-question text-base-content/40 text-7xl"></i>
		<h1 class="m-0 text-3xl font-bold">{m.conferenceNotFoundHeadline()}</h1>
		<p class="text-base-content/70 m-0 max-w-md text-center">{m.conferenceNotFoundBody()}</p>
		<a class="btn btn-primary" href={resolve('/app/(launcher)')}>{m.conferenceNotFoundBackLink()}</a
		>
	</div>
{/if}
