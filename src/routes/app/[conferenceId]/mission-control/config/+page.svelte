<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import ConferenceMenu from '../../ConferenceMenu.svelte';
	import ConfigTabPanel, { type ConfigTab } from './ConfigTabPanel.svelte';
	import { client } from '#lib/api/rumbleClient/client';
	import { page } from '$app/state';
	import { isLocalConferenceActive } from '#lib/state/localDemo.svelte';

	import { getCurrentUser, getIsGlobalAdmin } from '#lib/state/currentUser.svelte';

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
		logoSvg: true,
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
					icon: true
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
					icon: true
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
					icon: true
				}
			}
		},
		representations: {
			id: true,
			name: true,
			alpha2Code: true,
			alpha3Code: true,
			type: true,
			icon: true
		},
		members: {
			id: true,
			representation: {
				id: true,
				name: true,
				alpha3Code: true,
				type: true,
				icon: true
			}
		},
		requestTypes: {
			id: true,
			name: true,
			icon: true,
			priority: true,
			enabled: true,
			delegatesOnly: true,
			showOnPresentation: true
		}
	});

	const conferenceUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: { eq: page.params.conferenceId } },
				user: { id: { eq: currentUser?.id ?? '' } }
			}
		},
		id: true,
		conferenceUserType: true
	});

	const isGlobalAdmin = await getIsGlobalAdmin();

	let currentUserRole = $derived(conferenceUsers?.[0]);
	let isAdmin = $derived(isGlobalAdmin || currentUserRole?.conferenceUserType === 'ADMIN');
	let role = $derived(currentUserRole?.conferenceUserType);
	let currentUserEmail = currentUser?.email ?? undefined;

	let activeTab = $state<ConfigTab>('general');

	const configTabs: { id: ConfigTab; title: () => string; icon: string }[] = [
		{ id: 'general', title: m.general, icon: 'sliders-horizontal' },
		{ id: 'users', title: m.users, icon: 'users' },
		{ id: 'committees', title: m.committees, icon: 'bank' },
		{ id: 'delegations', title: m.delegations, icon: 'flag' },
		{ id: 'nsa', title: m.nonStateActors, icon: 'users-three' },
		{ id: 'requestTypes', title: m.requestTypes, icon: 'hand' }
	];

	// Not offered in the offline demo: other users make no sense on one device, and
	// requests are not part of the demo, so request types would not be kept
	const isTabAvailable = (tabId: string) =>
		!isLocalConferenceActive() || (tabId !== 'users' && tabId !== 'requestTypes');

	// Same as clicking the tab
	registerCommands(() =>
		configTabs.map((tab) => ({
			id: `configuration.tab.${tab.id}`,
			title: m.commandShowTab,
			context: tab.title,
			group: 'page' as const,
			icon: tab.icon,
			visible: () => isAdmin && !!conference && activeTab !== tab.id && isTabAvailable(tab.id),
			run: () => (activeTab = tab.id)
		}))
	);
</script>

<svelte:head>
	<title>{m.configuration()} - MUNify CHASE</title>
</svelte:head>

<div class="navbar bg-base-100 shadow-sm">
	<h1 class="ml-4 flex-1 text-3xl font-bold">{m.configuration()}</h1>
	<div class="flex-none">
		<ConferenceMenu
			{role}
			conferenceId={page.params.conferenceId!}
			conferenceTitle={conference?.title}
			committees={conference?.committees}
			isGlobalAdmin={!!isGlobalAdmin}
			user={currentUser}
		/>
	</div>
</div>

<div class="flex h-full w-full items-start justify-center p-6">
	<div class="flex w-full max-w-screen-lg flex-col gap-6">
		{#if !isAdmin}
			<div class="alert alert-error">
				<i aria-hidden="true" class="ph-fill ph-warning"></i>
				<span>{m.notAuthorized()}</span>
			</div>
		{:else if conference}
			<h2 class="text-xl font-semibold">{conference.title}</h2>

			<div role="tablist" class="tabs tabs-border">
				{#each configTabs.filter((tab) => isTabAvailable(tab.id)) as tab (tab.id)}
					<button
						role="tab"
						class="tab"
						class:tab-active={activeTab === tab.id}
						onclick={() => (activeTab = tab.id)}
					>
						{tab.title()}
					</button>
				{/each}
			</div>

			<ConfigTabPanel tab={isTabAvailable(activeTab) ? activeTab : undefined} {conference} {currentUserEmail} />
		{:else}
			<div class="flex items-center justify-center">
				<span class="loading loading-spinner loading-lg"></span>
			</div>
		{/if}
	</div>
</div>
