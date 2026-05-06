<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import Tabs from '$lib/components/Tabs.svelte';
	import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import ByCommitteeTab from './ByCommitteeTab.svelte';
	import ByNsaTab from './ByNsaTab.svelte';
	import NotCheckedInTab from './NotCheckedInTab.svelte';
	import HistoryTab from './HistoryTab.svelte';
	import StatsTab from './StatsTab.svelte';

	const conferenceId = page.params.conferenceId!;
	const userId = (await getCurrentUser()).id ?? '';

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

	let role = $derived(conferenceUsers?.[0]?.conferenceUserType);
	let allowed = $derived(role === 'ADMIN' || role === 'TEAM');

	type TabId = 'BY_COMMITTEE' | 'BY_NSA' | 'NOT_CHECKED_IN' | 'HISTORY' | 'STATS';
	let activeTab = $state<TabId>('BY_COMMITTEE');

	const tabs: { id: TabId; label: string; faIcon: string }[] = [
		{ id: 'BY_COMMITTEE', label: m.nsaAttendanceTabByCommittee(), faIcon: 'fa-building-columns' },
		{ id: 'BY_NSA', label: m.nsaAttendanceTabByNsa(), faIcon: 'fa-people-group' },
		{ id: 'NOT_CHECKED_IN', label: m.nsaAttendanceTabNotCheckedIn(), faIcon: 'fa-user-clock' },
		{ id: 'HISTORY', label: m.nsaAttendanceTabHistory(), faIcon: 'fa-clock-rotate-left' },
		{ id: 'STATS', label: m.nsaAttendanceTabStats(), faIcon: 'fa-chart-column' }
	];

	const menubarItems = [
		{
			faIcon: 'fa-rocket-launch',
			title: m.missionControl(),
			href: '../mission-control'
		}
	];
</script>

<svelte:head>
	<title>{m.nsaAttendance()} - MUNify CHASE</title>
</svelte:head>

{#if allowed}
	<div class="flex h-full w-full flex-col">
		<div class="navbar bg-base-100 shadow-sm">
			<h1 class="ml-4 flex-1 text-3xl font-bold">{m.nsaAttendance()}</h1>
			<div class="flex-none">
				<NavbarBurgerMenu items={menubarItems} />
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
				<StatsTab {conferenceId} />
			{/if}
		</div>
	</div>
{:else}
	<div class="flex h-full w-full items-center justify-center p-6">
		<p class="text-base-content/60">{m.notAuthorized()}</p>
	</div>
{/if}
