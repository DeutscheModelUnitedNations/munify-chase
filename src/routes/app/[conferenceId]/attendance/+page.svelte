<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import Tabs from '$lib/components/Tabs.svelte';
	import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
	import {
		buildConferenceNavItems,
		roleBadgeClassFor,
		roleLabelFor
	} from '$lib/components/navbar/conferenceNavItems';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import ByCommitteeTab from './ByCommitteeTab.svelte';
	import ByNsaTab from './ByNsaTab.svelte';
	import NotCheckedInTab from './NotCheckedInTab.svelte';
	import HistoryTab from './HistoryTab.svelte';
	import StatsTab from './StatsTab.svelte';

	const conferenceId = page.params.conferenceId!;
	const currentUser = await getCurrentUser();
	const userId = currentUser.id ?? '';
	const userDisplayName =
		[currentUser.givenName, currentUser.familyName].filter(Boolean).join(' ').trim() ||
		currentUser.preferredUsername ||
		currentUser.email ||
		'';

	const conferenceMeta = await client.query.conference({
		__args: { id: conferenceId },
		title: true
	});

	const conferenceUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: conferenceId },
				user: { id: userId }
			}
		},
		id: true,
		conferenceUserType: true
	});

	const isGlobalAdmin = await client.query.isGlobalAdmin();

	let role = $derived(conferenceUsers?.[0]?.conferenceUserType);
	let allowed = $derived(isGlobalAdmin || role === 'ADMIN' || role === 'TEAM');

	type TabId = 'BY_COMMITTEE' | 'BY_NSA' | 'NOT_CHECKED_IN' | 'HISTORY' | 'STATS';
	let activeTab = $state<TabId>('NOT_CHECKED_IN');

	const tabs: { id: TabId; label: string; faIcon: string }[] = [
		{ id: 'NOT_CHECKED_IN', label: m.nsaAttendanceTabNotCheckedIn(), faIcon: 'fa-user-clock' },
		{ id: 'BY_COMMITTEE', label: m.nsaAttendanceTabByCommittee(), faIcon: 'fa-building-columns' },
		{ id: 'BY_NSA', label: m.nsaAttendanceTabByNsa(), faIcon: 'fa-people-group' },
		{ id: 'HISTORY', label: m.nsaAttendanceTabHistory(), faIcon: 'fa-clock-rotate-left' },
		{ id: 'STATS', label: m.nsaAttendanceTabStats(), faIcon: 'fa-chart-column' }
	];

	let menubarItems = $derived(
		buildConferenceNavItems({
			role,
			conferenceId,
			activeRouteId: page.route.id,
			activePathname: page.url.pathname,
			isGlobalAdmin: !!isGlobalAdmin
		})
	);
</script>

<svelte:head>
	<title>{m.attendance()} - MUNify CHASE</title>
</svelte:head>

{#if allowed}
	<div class="flex h-full w-full flex-col">
		<div class="navbar bg-base-100 shadow-sm">
			<h1 class="ml-4 flex-1 text-3xl font-bold">{m.attendance()}</h1>
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
					conferenceTitle={conferenceMeta?.title}
					dashboardHref="/app"
					signOutHref="/logout"
				/>
			</div>
		</div>

		<div class="mx-auto flex w-full max-w-screen-xl flex-col gap-4 p-6">
			<Tabs {tabs} {activeTab} onTabChange={(t) => (activeTab = t)} />

			{#if activeTab === 'BY_COMMITTEE'}
				<ByCommitteeTab {conferenceId} />
			{:else if activeTab === 'BY_NSA'}
				<ByNsaTab {conferenceId} />
			{:else if activeTab === 'NOT_CHECKED_IN'}
				<NotCheckedInTab {conferenceId} />
			{:else if activeTab === 'HISTORY'}
				<HistoryTab {conferenceId} />
			{:else if activeTab === 'STATS'}
				<StatsTab {conferenceId} conferenceTitle={conferenceMeta?.title ?? undefined} />
			{/if}
		</div>
	</div>
{:else}
	<div class="flex h-full w-full items-center justify-center p-6">
		<p class="text-base-content/60">{m.notAuthorized()}</p>
	</div>
{/if}
