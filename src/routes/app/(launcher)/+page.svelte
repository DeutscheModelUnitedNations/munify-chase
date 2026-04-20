<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Footer from '$lib/components/Footer.svelte';
	import DeleteConferenceModal from '$lib/components/DeleteConferenceModal.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import type { ConferenceusertypeEnum } from '$lib/api/rumbleClient/client';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';

	const user = await getCurrentUser();
	const conferenceUsers = await client.liveQuery.conferenceUsers({
		__args: { where: { user: { id: user.id } } },
		id: true,
		conferenceUserType: true,
		committeeMemberId: true,
		committeeMember: {
			id: true,
			committeeId: true
		},
		conference: {
			id: true,
			title: true
		}
	});

	const conferences = await client.liveQuery.conferences({
		id: true,
		title: true
	});

	let isGlobalAdmin = await client.query.isGlobalAdmin();
	let manageMode = $state(false);
	let deleteModalOpen = $state(false);
	let deleteTarget = $state<{ id: string; title: string } | null>(null);

	const getType = (type: ConferenceusertypeEnum) => {
		switch (type) {
			case 'ADMIN':
				return m.admin();
			case 'TEAM':
				return m.teamMember();
			case 'SPECTATOR':
				return m.spectator();
			case 'DELEGATE':
				return m.delegate();
			case 'NON_STATE_ACTOR':
				return m.nonStateActor();
			default:
				return '';
		}
	};

	const getUrl = (
		type: ConferenceusertypeEnum,
		id: string,
		committeeMember?: { committeeId: string } | null
	) => {
		if (['ADMIN', 'TEAM'].includes(type)) {
			return `/app/${id}/mission-control`;
		} else if (type === 'DELEGATE' && committeeMember?.committeeId) {
			return `/app/${id}/participant/${committeeMember.committeeId}`;
		} else {
			return `/app/${id}/participant`;
		}
	};
</script>

<svelte:head>
	<title>{m.launcher()} - MUNify CHASE</title>
</svelte:head>

<div class="navbar bg-base-100 relative shadow-sm">
	<div class="flex-none">
		<a class="btn btn-ghost" href="/logout">
			<i class="fa-duotone fa-arrow-left mr-2"></i>
			{m.logout()}
		</a>
	</div>
	<div class="flex-1"></div>
	<div class="flex-none">
		<a class="btn btn-ghost" href="./app/import">
			{m.createConference()}
			<i class="fa-duotone fa-plus mr-2"></i>
		</a>
	</div>
</div>

<div class="bg-base-200 h-full w-full">
	<div class="flex h-full flex-col items-center gap-10 p-10">
		<div class="flex flex-col items-center">
			<i class="fa-duotone fa-podium mb-4 text-7xl"></i>
			<h3 class="text-center text-2xl">MUNify</h3>
			<h3 class="text-center text-5xl font-bold">CHASE</h3>
			<p class="mt-4 text-center text-lg">
				{m.launcherWelcome({ name: user.givenName! })}
			</p>
		</div>
		<div class="card bg-base-100 w-full max-w-2xl shadow-sm">
			<div class="card-body">
				<h2 class="text-center text-4xl font-bold">Launcher</h2>
				<p class="text-center text-lg">
					{m.launcherDescription()}
				</p>
				<div class="mt-6 flex flex-col items-center gap-2">
					{#if conferenceUsers.length === 0}
						<div class="alert alert-warning shadow-sm">
							<i class="fas fa-exclamation-triangle"></i>
							{m.launcherNoConferences()}
						</div>
					{:else}
						{#each conferenceUsers as c}
							{@const conf = c.conference}
							<a
								href={getUrl(c.conferenceUserType, c.conference.id, c.committeeMember)}
								class="btn btn-lg w-full max-w-xs shadow-xs"
							>
								<i class="fa-duotone fa-rocket-launch mr-2"></i>
								<div>
									{conf.title}
									<span class="ml-2 text-xs font-normal">{getType(c.conferenceUserType)}</span>
								</div>
							</a>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>

	{#if isGlobalAdmin}
		<div class="flex flex-col items-center gap-4 pb-10">
			<button
				class="btn btn-ghost btn-sm gap-2"
				class:btn-active={manageMode}
				onclick={() => (manageMode = !manageMode)}
			>
				<i class="fa-duotone fa-trash-can"></i>
				{m.manageConferences()}
			</button>

			{#if manageMode}
				<div class="card bg-base-100 w-full max-w-2xl shadow-sm">
					<div class="card-body">
						<div class="flex flex-col gap-2">
							{#each conferences as conf}
								<div class="flex items-center justify-between rounded-lg bg-base-200 px-4 py-2">
									<span class="font-medium">{conf.title}</span>
									<button
										class="btn btn-error btn-sm btn-ghost"
										aria-label={m.deleteConference()}
										onclick={() => {
											deleteTarget = { id: conf.id, title: conf.title };
											deleteModalOpen = true;
										}}
									>
										<i class="fa-duotone fa-trash-can"></i>
									</button>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<Footer />
</div>

{#if deleteTarget}
	<DeleteConferenceModal
		bind:open={deleteModalOpen}
		conferenceId={deleteTarget.id}
		conferenceName={deleteTarget.title}
	/>
{/if}
