<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
	import GeneralTab from './GeneralTab.svelte';
	import UsersTab from './UsersTab.svelte';
	import CommitteesTab from './CommitteesTab.svelte';
	import DelegationsTab from './DelegationsTab.svelte';
	import NsaTab from './NsaTab.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import { page } from '$app/state';

	import { getCurrentUser } from '$lib/state/currentUser.svelte';

	const currentUser = getCurrentUser();

	const conference: any = await client.liveQuery.conference({
		__args: { id: page.params.conferenceId! },
		id: true,
		title: true,
		pressWebsite: true,
		hasModeratedCaucus: true,
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
				user: { id: currentUser?.sub ?? '' }
			}
		},
		id: true,
		conferenceUserType: true
	});

	let currentUserRole = $derived(conferenceUsers?.[0]);
	let isAdmin = $derived(currentUserRole?.conferenceUserType === 'ADMIN');
	let currentUserEmail = currentUser?.email;

	let activeTab = $state<'general' | 'users' | 'committees' | 'delegations' | 'nsa'>('general');

	const menubarItems = [
		{
			faIcon: 'fa-rocket-launch',
			title: m.missionControl(),
			href: '.'
		}
	];
</script>

<svelte:head>
	<title>{m.configuration()} - MUNify CHASE</title>
</svelte:head>

<div class="navbar bg-base-100 shadow-sm">
	<h1 class="ml-4 flex-1 text-3xl font-bold">{m.configuration()}</h1>
	<div class="flex-none">
		<NavbarBurgerMenu items={menubarItems} />
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
