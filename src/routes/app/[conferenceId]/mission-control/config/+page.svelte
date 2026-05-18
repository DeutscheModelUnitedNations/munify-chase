<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
	import {
		buildConferenceNavItems,
		roleBadgeClassFor,
		roleLabelFor
	} from '$lib/components/navbar/conferenceNavItems';
	import GeneralTab from './GeneralTab.svelte';
	import UsersTab from './UsersTab.svelte';
	import CommitteesTab from './CommitteesTab.svelte';
	import DelegationsTab from './DelegationsTab.svelte';
	import NsaTab from './NsaTab.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import { page } from '$app/state';

	import { getCurrentUser } from '$lib/state/currentUser.svelte';

	const currentUser = await getCurrentUser();

	const conference = await client.liveQuery.conference({
		__args: { id: page.params.conferenceId! },
		id: true,
		title: true,
		pressWebsite: true,
		location: true,
		startDate: true,
		endDate: true,
		hasModeratedCaucus: true,
		resolutionFeatureEnabled: true,
		committees: {
			id: true,
			name: true,
			abbreviation: true,
			members: {
				id: true,
				representation: {
					id: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					type: true,
					faIcon: true
				}
			}
		},
		users: {
			id: true,
			userEmail: true,
			name: true,
			conferenceUserType: true,
			user: {
				givenName: true,
				familyName: true
			},
			committeeMember: {
				id: true,
				representation: {
					id: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					faIcon: true
				},
				committee: {
					id: true,
					name: true,
					abbreviation: true
				}
			},
			conferenceMember: {
				id: true,
				representation: {
					id: true,
					name: true,
					alpha3Code: true,
					type: true,
					faIcon: true
				}
			}
		},
		representations: {
			id: true,
			name: true,
			alpha2Code: true,
			alpha3Code: true,
			type: true,
			faIcon: true
		},
		members: {
			id: true,
			representation: {
				id: true,
				name: true,
				alpha3Code: true,
				type: true,
				faIcon: true
			}
		}
	});

	const conferenceUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: page.params.conferenceId },
				user: { id: currentUser?.id ?? '' }
			}
		},
		id: true,
		conferenceUserType: true
	});

	const isGlobalAdmin = await client.query.isGlobalAdmin();

	let currentUserRole = $derived(conferenceUsers?.[0]);
	let isAdmin = $derived(isGlobalAdmin || currentUserRole?.conferenceUserType === 'ADMIN');
	let role = $derived(currentUserRole?.conferenceUserType);
	let currentUserEmail = currentUser?.email ?? undefined;
	const userDisplayName =
		[currentUser?.givenName, currentUser?.familyName].filter(Boolean).join(' ').trim() ||
		currentUser?.preferredUsername ||
		currentUser?.email ||
		'';

	let activeTab = $state<'general' | 'users' | 'committees' | 'delegations' | 'nsa'>('general');

	let menubarItems = $derived(
		buildConferenceNavItems({
			role,
			conferenceId: page.params.conferenceId!,
			activeRouteId: page.route.id,
			activePathname: page.url.pathname
		})
	);
</script>

<svelte:head>
	<title>{m.configuration()} - MUNify CHASE</title>
</svelte:head>

<div class="navbar bg-base-100 shadow-sm">
	<h1 class="ml-4 flex-1 text-3xl font-bold">{m.configuration()}</h1>
	<div class="flex-none">
		<NavbarBurgerMenu
			items={menubarItems}
			user={{
				name: userDisplayName,
				email: currentUserEmail,
				givenName: currentUser?.givenName ?? undefined,
				familyName: currentUser?.familyName ?? undefined
			}}
			roleLabel={roleLabelFor(role)}
			roleBadgeClass={roleBadgeClassFor(role)}
			conferenceTitle={conference?.title}
			dashboardHref="/app"
			signOutHref="/logout"
		/>
	</div>
</div>

<div class="flex h-full w-full items-start justify-center p-6">
	<div class="flex w-full max-w-screen-lg flex-col gap-6">
		{#if !isAdmin}
			<div class="alert alert-error">
				<i class="fas fa-exclamation-triangle"></i>
				<span>{m.notAuthorized()}</span>
			</div>
		{:else if conference}
			<h2 class="text-xl font-semibold">{conference.title}</h2>

			<div role="tablist" class="tabs tabs-border">
				<button
					role="tab"
					class="tab"
					class:tab-active={activeTab === 'general'}
					onclick={() => (activeTab = 'general')}
				>
					{m.general()}
				</button>
				<button
					role="tab"
					class="tab"
					class:tab-active={activeTab === 'users'}
					onclick={() => (activeTab = 'users')}
				>
					{m.users()}
				</button>
				<button
					role="tab"
					class="tab"
					class:tab-active={activeTab === 'committees'}
					onclick={() => (activeTab = 'committees')}
				>
					{m.committees()}
				</button>
				<button
					role="tab"
					class="tab"
					class:tab-active={activeTab === 'delegations'}
					onclick={() => (activeTab = 'delegations')}
				>
					{m.delegations()}
				</button>
				<button
					role="tab"
					class="tab"
					class:tab-active={activeTab === 'nsa'}
					onclick={() => (activeTab = 'nsa')}
				>
					{m.nonStateActors()}
				</button>
			</div>

			{#if activeTab === 'general'}
				<GeneralTab {conference} />
			{:else if activeTab === 'users'}
				<UsersTab {conference} {currentUserEmail} />
			{:else if activeTab === 'committees'}
				<CommitteesTab conferenceId={conference.id} committees={conference.committees ?? []} />
			{:else if activeTab === 'delegations'}
				<DelegationsTab
					conferenceId={conference.id}
					representations={conference.representations ?? []}
					committees={conference.committees ?? []}
				/>
			{:else if activeTab === 'nsa'}
				<NsaTab conferenceId={conference.id} representations={conference.representations ?? []} />
			{/if}
		{:else}
			<div class="flex items-center justify-center">
				<span class="loading loading-spinner loading-lg"></span>
			</div>
		{/if}
	</div>
</div>
