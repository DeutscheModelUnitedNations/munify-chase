<script lang="ts">
	import CommitteeGrid, { type ConferenceData } from '$lib/components/CommitteeGrid.svelte';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
	import {
		buildConferenceNavItems,
		roleBadgeClassFor,
		roleLabelFor
	} from '$lib/components/navbar/conferenceNavItems';
	import { client } from '$lib/api/rumbleClient/client';
	import { page } from '$app/state';

	import { getCurrentUser } from '$lib/state/currentUser.svelte';

	const currentUser = await getCurrentUser();
	const userId = currentUser.id ?? '';
	const userDisplayName =
		[currentUser.givenName, currentUser.familyName].filter(Boolean).join(' ').trim() ||
		currentUser.preferredUsername ||
		currentUser.email ||
		'';

	const conference = await client.liveQuery.conference({
		__args: { id: page.params.conferenceId! },
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
			stateOfDebate: true
		}
	});

	const conferenceUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: page.params.conferenceId },
				user: { id: userId }
			}
		},
		id: true,
		conferenceUserType: true
	});

	let currentUserRole = $derived(conferenceUsers?.[0]);
	let role = $derived(currentUserRole?.conferenceUserType);

	const isGlobalAdmin = await client.query.isGlobalAdmin();

	let menubarItems = $derived(
		buildConferenceNavItems({
			role,
			conferenceId: page.params.conferenceId!,
			activeRouteId: page.route.id,
			activePathname: page.url.pathname,
			isGlobalAdmin: !!isGlobalAdmin
		})
	);
</script>

<svelte:head>
	<title>{m.missionControl()} - MUNify CHASE</title>
</svelte:head>

<div class="navbar bg-base-100 shadow-sm">
	<h1 class=" ml-4 flex-1 text-3xl font-bold">{m.missionControl()}</h1>
	<div class="flex-none">
		<CurrentTime />
	</div>
	<div class="flex-none">
		<NavbarBurgerMenu
			items={menubarItems}
			user={{
				name: userDisplayName,
				email: currentUser.email ?? undefined,
				givenName: currentUser.givenName ?? undefined,
				familyName: currentUser.familyName ?? undefined
			}}
			roleLabel={roleLabelFor(role)}
			roleBadgeClass={roleBadgeClassFor(role)}
			conferenceTitle={conference?.title}
			conferenceId={page.params.conferenceId}
			committees={role === 'ADMIN' || role === 'TEAM' ? (conference?.committees ?? []) : []}
			dashboardHref="/app"
			signOutHref="/logout"
		/>
	</div>
</div>

{#if conference}
	<CommitteeGrid conference={conference as unknown as ConferenceData} environment="TEAM" />
{/if}
