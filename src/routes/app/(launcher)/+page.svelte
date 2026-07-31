<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { resolve } from '$app/paths';
	import Footer from '$lib/components/Footer.svelte';
	import DeleteConferenceModal from '$lib/components/DeleteConferenceModal.svelte';
	import AvatarMenu from '$lib/components/launcher/AvatarMenu.svelte';
	import ConferenceHeroCard from '$lib/components/launcher/ConferenceHeroCard.svelte';
	import AdminConferenceRow from '$lib/components/launcher/AdminConferenceRow.svelte';
	import EmptyLauncher from '$lib/components/launcher/EmptyLauncher.svelte';
	import { badgeFor, deriveStatus } from '$lib/helpers/launcher';
	import type { LauncherConference } from '$lib/components/launcher/types';
	import { client } from '$lib/api/rumbleClient/client';
	import type { ConferenceusertypeEnum } from '$lib/api/rumbleClient/client';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';

	const user = await getCurrentUser();

	const conferenceUserData = await client.liveQuery.conferenceUsers({
		__args: { where: { user: { id: user.id } } },
		id: true,
		conferenceUserType: true,
		committeeMemberId: true,
		committeeMember: {
			id: true,
			committeeId: true,
			committee: {
				id: true,
				abbreviation: true
			},
			representation: {
				id: true,
				type: true,
				name: true,
				alpha2Code: true,
				alpha3Code: true,
				faIcon: true
			}
		},
		conferenceMember: {
			id: true,
			representation: {
				id: true,
				type: true,
				name: true,
				alpha2Code: true,
				alpha3Code: true,
				faIcon: true
			}
		},
		conference: {
			id: true,
			title: true,
			location: true,
			startDate: true,
			endDate: true,
			committees: {
				id: true,
				abbreviation: true
			}
		}
	});

	const isGlobalAdmin = await client.query.isGlobalAdmin();

	const allConferences = await client.liveQuery.conferences({
		id: true,
		title: true,
		location: true,
		startDate: true,
		endDate: true,
		committees: {
			id: true,
			abbreviation: true
		}
	});

	let searchQuery = $state('');
	let deleteModalOpen = $state(false);
	let deleteTarget = $state<{ id: string; title: string } | null>(null);

	function getUrl(
		type: ConferenceusertypeEnum,
		id: string,
		committeeMember?: { committeeId: string } | null
	): string {
		if (type === 'ADMIN' || type === 'TEAM') {
			return `/app/${id}/mission-control`;
		}
		if (type === 'DELEGATE' && committeeMember?.committeeId) {
			return `/app/${id}/participant/${committeeMember.committeeId}`;
		}
		return `/app/${id}/participant`;
	}

	function buildRoleDetail(
		type: ConferenceusertypeEnum,
		representationName: string | null | undefined,
		committeeAbbreviation: string | null | undefined
	): string | null {
		if (type === 'DELEGATE' || type === 'NON_STATE_ACTOR') {
			return [representationName, committeeAbbreviation].filter(Boolean).join(' · ') || null;
		}
		if (type === 'TEAM') {
			return committeeAbbreviation || null;
		}
		return null;
	}

	function toIsoDate(d: Date | string | null | undefined): string | null {
		if (!d) return null;
		if (typeof d === 'string') return d;
		return d.toISOString().slice(0, 10);
	}

	let userConferences = $derived<LauncherConference[]>(
		(conferenceUserData ?? []).map((cu): LauncherConference => {
			const rep = cu.conferenceMember?.representation ?? cu.committeeMember?.representation;
			return {
				id: cu.conference.id,
				title: cu.conference.title,
				location: cu.conference.location,
				startDate: toIsoDate(cu.conference.startDate),
				endDate: toIsoDate(cu.conference.endDate),
				committees: cu.conference.committees ?? [],
				role: badgeFor(cu.conferenceUserType),
				roleDetail: buildRoleDetail(
					cu.conferenceUserType,
					rep?.name,
					cu.committeeMember?.committee?.abbreviation
				),
				representation: rep,
				href: getUrl(cu.conferenceUserType, cu.conference.id, cu.committeeMember),
				committeeId: cu.committeeMember?.committeeId ?? null
			};
		})
	);

	let adminConferences = $derived<LauncherConference[]>(
		(allConferences ?? []).map((c): LauncherConference => ({
			id: c.id,
			title: c.title,
			location: c.location,
			startDate: toIsoDate(c.startDate),
			endDate: toIsoDate(c.endDate),
			committees: c.committees ?? [],
			role: 'ADMIN' as const,
			roleDetail: null,
			representation: null,
			href: `/app/${c.id}/mission-control`
		}))
	);

	let filteredAdminConferences = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return adminConferences;
		return adminConferences.filter(
			(c) => c.title.toLowerCase().includes(q) || (c.location ?? '').toLowerCase().includes(q)
		);
	});

	let groupedAdmin = $derived.by(() => {
		const now = new Date();
		const groups: {
			active: LauncherConference[];
			upcoming: LauncherConference[];
			past: LauncherConference[];
		} = {
			active: [],
			upcoming: [],
			past: []
		};
		for (const c of filteredAdminConferences) {
			groups[deriveStatus(c, now)].push(c);
		}
		const dateAsc = (a: LauncherConference, b: LauncherConference) =>
			new Date(a.endDate ?? 0).getTime() - new Date(b.endDate ?? 0).getTime();
		const startAsc = (a: LauncherConference, b: LauncherConference) =>
			new Date(a.startDate ?? 0).getTime() - new Date(b.startDate ?? 0).getTime();
		const endDesc = (a: LauncherConference, b: LauncherConference) =>
			new Date(b.endDate ?? 0).getTime() - new Date(a.endDate ?? 0).getTime();
		groups.active.sort(dateAsc);
		groups.upcoming.sort(startAsc);
		groups.past.sort(endDesc);
		return groups;
	});

	let h1 = $derived.by(() => {
		if (isGlobalAdmin) return m.launcherTitleAll();
		if (userConferences.length === 1) return m.launcherTitleOne();
		return m.launcherTitleMany();
	});

	let firstName = $derived(user.givenName ?? '');

	function openDelete(target: { id: string; title: string }) {
		deleteTarget = target;
		deleteModalOpen = true;
	}

	const sections = $derived([
		{ key: 'active' as const, items: groupedAdmin.active, label: m.launcherStatusActive() },
		{ key: 'upcoming' as const, items: groupedAdmin.upcoming, label: m.launcherStatusUpcoming() },
		{ key: 'past' as const, items: groupedAdmin.past, label: m.launcherStatusPast() }
	]);
</script>

<svelte:head>
	<title>{m.launcher()} - MUNify CHASE</title>
</svelte:head>

<div class="bg-base-200 flex min-h-screen flex-col">
	<div class="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
		<header class="mb-6 flex flex-col gap-4">
			<div class="flex items-center justify-between gap-3">
				<div class="inline-flex items-center gap-2 text-base font-bold tracking-tight">
					<span
						class="bg-base-100 text-primary grid size-8 place-items-center rounded-lg text-base shadow-sm"
					>
						<i class="fa-duotone fa-podium"></i>
					</span>
					<span>MUNify <span class="text-primary">CHASE</span></span>
				</div>
				<AvatarMenu givenName={user.givenName} familyName={user.familyName} email={user.email} />
			</div>

			<div>
				<p class="text-base-content/60 m-0 text-sm">
					{#if isGlobalAdmin}
						{m.launcherGreetingAdmin()}
					{:else}
						{m.launcherGreetingUser()}{firstName ? `, ${firstName}` : ''}
					{/if}
				</p>
				<h1 class="m-0 mt-0.5 text-3xl font-bold tracking-tight sm:text-4xl">{h1}</h1>
			</div>

			{#if isGlobalAdmin}
				<label class="input w-full">
					<i class="fa-duotone fa-magnifying-glass opacity-60"></i>
					<input
						type="search"
						aria-label={m.launcherSearchPlaceholder()}
						placeholder={m.launcherSearchPlaceholder()}
						bind:value={searchQuery}
					/>
				</label>
			{/if}
		</header>

		{#if isGlobalAdmin}
			{#if adminConferences.length === 0}
				<EmptyLauncher />
			{:else if filteredAdminConferences.length === 0}
				<div class="flex flex-col items-center gap-2 px-4 py-12 text-center">
					<h2 class="m-0 text-xl font-bold">{m.launcherNoSearchResultsHeadline()}</h2>
					<p class="text-base-content/70 m-0 text-sm">{m.launcherNoSearchResultsBody()}</p>
				</div>
			{:else}
				<div class="flex flex-col gap-6">
					{#each sections as section (section.key)}
						{#if section.items.length > 0}
							<section class:opacity-85={section.key === 'past'}>
								<div
									class="text-base-content/55 mb-3 flex items-baseline gap-2 text-xs font-bold uppercase tracking-widest"
								>
									<span>{section.label}</span>
									<span
										class="bg-base-content/10 text-base-content/70 rounded-full px-2 py-0.5 text-xs font-semibold tracking-normal"
									>
										{section.items.length}
									</span>
								</div>
								<div class="card bg-base-100 p-0 shadow-sm">
									{#each section.items as c, i (c.id)}
										<div class:is-first={i === 0} class:is-last={i === section.items.length - 1}>
											<AdminConferenceRow conference={c} onDelete={openDelete} />
										</div>
									{/each}
								</div>
							</section>
						{/if}
					{/each}
				</div>
			{/if}
		{:else if userConferences.length === 0}
			<EmptyLauncher />
		{:else}
			<div class="mx-auto flex w-full max-w-xl flex-col gap-4">
				{#each userConferences as c (c.id)}
					<ConferenceHeroCard conference={c} />
				{/each}
			</div>
		{/if}

		{#if isGlobalAdmin}
			<footer
				class="from-base-200 sticky bottom-0 mt-8 flex flex-col gap-2 bg-gradient-to-b from-35% to-transparent py-4 [&>.btn]:w-full"
				style="background: linear-gradient(180deg, transparent 0%, var(--color-base-200) 35%);"
			>
				<a class="btn btn-primary btn-lg" href={resolve('/app/(launcher)/import')}>
					<i class="fa-solid fa-plus"></i>
					{m.createConference()}
				</a>
				<a class="btn btn-ghost btn-sm" href={resolve('/app/(launcher)/import')}>
					<i class="fa-duotone fa-file-arrow-up"></i>
					{m.launcherImportDelegator()}
				</a>
			</footer>
		{:else}
			<footer class="mt-8 flex justify-center pt-6">
				<a class="btn btn-ghost btn-sm" href={resolve('/app/(launcher)/import')}>
					<i class="fa-solid fa-plus"></i>
					{m.createConference()}
				</a>
			</footer>
			<Footer />
		{/if}
	</div>

	{#if isGlobalAdmin}
		<Footer />
	{/if}
</div>

{#if deleteTarget}
	<DeleteConferenceModal
		bind:open={deleteModalOpen}
		conferenceId={deleteTarget.id}
		conferenceName={deleteTarget.title}
	/>
{/if}

<style>
	/* Round only the first/last row of each grouped admin section so the ellipsis
	   dropdown can escape (no overflow:hidden on the container). */
	.is-first :global(> div) {
		border-top-left-radius: var(--radius-box);
		border-top-right-radius: var(--radius-box);
	}
	.is-last :global(> div) {
		border-bottom-left-radius: var(--radius-box);
		border-bottom-right-radius: var(--radius-box);
		border-bottom: none;
	}
</style>
