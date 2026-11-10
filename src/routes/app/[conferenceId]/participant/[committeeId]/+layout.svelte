<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { client } from '#lib/api/rumbleClient/client';
	import { getCurrentUser, getIsGlobalAdmin } from '#lib/state/currentUser.svelte';
	import { isLocalConferenceActive } from '#lib/state/localDemo.svelte';
	import ConferenceMenu from '../../ConferenceMenu.svelte';
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { registerCommands } from '#lib/commands/registry.svelte';

	let { children }: { children: Snippet } = $props();

	const currentUser = await getCurrentUser();
	const userId = currentUser?.id ?? '';

	const [conferenceUser] =
		(await client.liveQuery.conferenceUsers({
			__args: {
				where: {
					conference: { id: { eq: page.params.conferenceId } },
					user: { id: { eq: userId } }
				}
			},
			id: true,
			conferenceUserType: true
		})) ?? [];
	const role = $derived(conferenceUser?.conferenceUserType);
	const showBack = $derived(role !== 'DELEGATE');

	const isGlobalAdmin = await getIsGlobalAdmin();

	const committee = await client.liveQuery.committee({
		__args: { id: page.params.committeeId! },
		id: true,
		abbreviation: true,
		name: true,
		activeDraftResolutionId: true,
		conference: {
			id: true,
			title: true
		},
		activeAgendaItem: {
			id: true,
			title: true
		}
	});

	const committeeHref = $derived(
		resolve('/app/[conferenceId]/participant/[committeeId]', {
			conferenceId: page.params.conferenceId!,
			committeeId: page.params.committeeId!
		})
	);
	const papersHref = $derived(
		resolve('/app/[conferenceId]/participant/[committeeId]/papers', {
			conferenceId: page.params.conferenceId!,
			committeeId: page.params.committeeId!
		})
	);

	// The bottom dock, also reachable from the command palette
	registerCommands(() => [
		{
			id: 'navigation.participant.committee',
			title: m.committee,
			group: 'navigation',
			icon: 'users',
			visible: () => page.url.pathname.includes('/papers'),
			run: () => goto(committeeHref)
		},
		{
			id: 'navigation.participant.papers',
			title: m.resolutions,
			group: 'navigation',
			icon: 'file-text',
			visible: () => !isLocalConferenceActive() && !page.url.pathname.endsWith('/papers'),
			run: () => goto(papersHref)
		},
		{
			id: 'navigation.participant.active-draft',
			title: m.activeDraftResolution,
			group: 'navigation',
			icon: 'note-pencil',
			visible: () =>
				!isLocalConferenceActive() &&
				!!committee?.activeDraftResolutionId &&
				!page.url.pathname.includes(committee.activeDraftResolutionId),
			run: () =>
				goto(
					resolve('/app/[conferenceId]/participant/[committeeId]/papers/[paperId]', {
						conferenceId: page.params.conferenceId!,
						committeeId: page.params.committeeId!,
						paperId: committee!.activeDraftResolutionId!
					})
				)
		}
	]);
</script>

{#if committee}
	<!-- Top navbar -->
	<div class="navbar bg-base-100 shadow-sm">
		{#if showBack}
			<div class="flex-none">
				<a
					class="btn btn-ghost btn-sm"
					href={resolve('/app/[conferenceId]/participant', {
						conferenceId: page.params.conferenceId!
					})}
					aria-label={m.back()}
				>
					<i aria-hidden="true" class="ph-duotone ph-arrow-left"></i>
				</a>
			</div>
		{/if}
		<h1 class="ml-2 flex-1 text-lg font-bold">
			<span style="view-transition-name: committee-abbr-{committee.id};"
				>{committee.abbreviation}</span
			>
			— {committee.name}
		</h1>
		<div class="flex-none">
			<ConferenceMenu
				{role}
				conferenceId={page.params.conferenceId!}
				conferenceTitle={committee?.conference?.title}
				isGlobalAdmin={!!isGlobalAdmin}
				user={currentUser}
			/>
		</div>
	</div>

	<!-- Main content with bottom padding for nav -->
	<main id="main-content" tabindex="-1" class="pb-16">
		{@render children()}
	</main>

	<!-- Bottom dock navigation -->
	<div class="dock dock-md lg:dock-lg md:justify-center md:gap-4">
		<a
			href={resolve('/app/[conferenceId]/participant/[committeeId]', {
				conferenceId: page.params.conferenceId!,
				committeeId: page.params.committeeId!
			})}
			class:dock-active={!page.url.pathname.includes('/papers')}
		>
			<i aria-hidden="true" class="ph-duotone ph-users size-[1.2em]"></i>
			<span class="dock-label">{m.committee()}</span>
		</a>
		{#if !isLocalConferenceActive()}
			<a
				href={resolve('/app/[conferenceId]/participant/[committeeId]/papers', {
					conferenceId: page.params.conferenceId!,
					committeeId: page.params.committeeId!
				})}
				class:dock-active={page.url.pathname.includes('/papers') &&
					!page.url.pathname.includes(committee?.activeDraftResolutionId ?? '__none__')}
			>
				<i aria-hidden="true" class="ph-duotone ph-file-text size-[1.2em]"></i>
				<span class="dock-label">{m.resolutions()}</span>
			</a>
			{#if committee?.activeDraftResolutionId}
				<a
					href={resolve('/app/[conferenceId]/participant/[committeeId]/papers/[paperId]', {
						conferenceId: page.params.conferenceId!,
						committeeId: page.params.committeeId!,
						paperId: committee.activeDraftResolutionId
					})}
					class:dock-active={page.url.pathname.includes(committee.activeDraftResolutionId)}
				>
					<i aria-hidden="true" class="ph-duotone ph-note-pencil size-[1.2em]"></i>
					<span class="dock-label">{m.activeDraftResolution()}</span>
				</a>
			{/if}
		{/if}
	</div>
{/if}
