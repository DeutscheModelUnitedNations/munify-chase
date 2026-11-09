<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { resolve } from '$app/paths';
	import Footer from '#lib/components/Footer.svelte';
	import DeleteConferenceModal from '#lib/components/DeleteConferenceModal.svelte';
	import AvatarMenu from '#lib/components/launcher/AvatarMenu.svelte';
	import ConferenceHeroCard from '#lib/components/launcher/ConferenceHeroCard.svelte';
	import EmptyLauncher from '#lib/components/launcher/EmptyLauncher.svelte';
	import DelegatorLinkCard from '#lib/components/launcher/DelegatorLinkCard.svelte';
	import { client } from '#lib/api/rumbleClient/client';
	import AdminConferenceList from './AdminConferenceList.svelte';
	import LauncherFooter from './LauncherFooter.svelte';
	import {
		greetingSuffix,
		launcherHeadingKind,
		toAdminConference,
		toUserConference
	} from './launcherConferences';
	import { getCurrentUser, getIsGlobalAdmin } from '#lib/state/currentUser.svelte';

	const user = await getCurrentUser();

	const conferenceUserData = await client.liveQuery.conferenceUsers({
		__args: { where: { user: { id: { eq: user.id } } } },
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
				icon: true
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
				icon: true
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

	const isGlobalAdmin = await getIsGlobalAdmin();

	// While linked to a DELEGATOR, conferences come from there (`docs/plans/delegator-link.md`)
	const activeLinks = await client.liveQuery.instanceLinks({
		id: true,
		remoteUrl: true
	});
	const delegatorUrl = $derived((activeLinks ?? []).at(0)?.remoteUrl);

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

	let userConferences = $derived((conferenceUserData ?? []).map(toUserConference));
	let adminConferences = $derived((allConferences ?? []).map(toAdminConference));

	const headings = {
		all: m.launcherTitleAll,
		one: m.launcherTitleOne,
		many: m.launcherTitleMany
	};
	let h1 = $derived(headings[launcherHeadingKind(!!isGlobalAdmin, userConferences.length)]());

	let greeting = $derived(
		isGlobalAdmin
			? m.launcherGreetingAdmin()
			: `${m.launcherGreetingUser()}${greetingSuffix(user.givenName)}`
	);

	function openDelete(target: { id: string; title: string }) {
		deleteTarget = target;
		deleteModalOpen = true;
	}
</script>

<svelte:head>
	<title>{m.launcher()} - MUNify CHASE</title>
</svelte:head>

<!-- Same ground, header and content width as the public pages (see (pages)/Navbar.svelte) -->
<div class="bg-base-100 flex min-h-screen flex-col">
	<header
		class="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-x-8 px-4 py-7 md:px-12"
	>
		<a class="text-xl leading-none" href={resolve('/(pages)')}>
			<span class="font-light">MUNify</span> <span class="font-bold">CHASE</span>
		</a>
		<AvatarMenu givenName={user.givenName} familyName={user.familyName} email={user.email} />
	</header>

	<main
		id="main-content"
		tabindex="-1"
		class="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 pb-6 md:px-12"
	>
		<header class="mb-6 flex flex-col gap-4">
			<div>
				<p class="text-base-content/60 m-0 text-sm">{greeting}</p>
				<h1 class="m-0 mt-0.5 text-3xl font-bold tracking-tight sm:text-4xl">{h1}</h1>
			</div>

			{#if isGlobalAdmin}
				<label class="input w-full">
					<i aria-hidden="true" class="ph-duotone ph-magnifying-glass opacity-60"></i>
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
			<DelegatorLinkCard />
			<AdminConferenceList conferences={adminConferences} {searchQuery} onDelete={openDelete} />
		{:else if userConferences.length === 0}
			<EmptyLauncher />
		{:else}
			<div class="mx-auto flex w-full max-w-xl flex-col gap-4">
				{#each userConferences as c (c.id)}
					<ConferenceHeroCard conference={c} />
				{/each}
			</div>
		{/if}

		<LauncherFooter {delegatorUrl} isGlobalAdmin={!!isGlobalAdmin} />
	</main>

	<Footer />
</div>

{#if deleteTarget}
	<DeleteConferenceModal
		bind:open={deleteModalOpen}
		conferenceId={deleteTarget.id}
		conferenceName={deleteTarget.title}
	/>
{/if}
