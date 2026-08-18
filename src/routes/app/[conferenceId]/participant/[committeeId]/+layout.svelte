<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import { isLocalConferenceActive } from '$lib/state/localDemo.svelte';
	import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
	import {
		buildConferenceNavItems,
		roleBadgeClassFor,
		roleLabelFor
	} from '$lib/components/navbar/conferenceNavItems';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const currentUser = await getCurrentUser();
	const userId = currentUser?.id ?? '';
	const userDisplayName =
		[currentUser?.givenName, currentUser?.familyName].filter(Boolean).join(' ').trim() ||
		currentUser?.preferredUsername ||
		currentUser?.email ||
		'';

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

	const isGlobalAdmin = await client.query.isGlobalAdmin();

	const menubarItems = $derived(
		buildConferenceNavItems({
			role,
			conferenceId: page.params.conferenceId!,
			activeRouteId: page.route.id,
			activePathname: page.url.pathname,
			isGlobalAdmin: !!isGlobalAdmin
		})
	);

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
					<i class="fa-duotone fa-arrow-left"></i>
				</a>
			</div>
		{/if}
		<h1 class="ml-2 flex-1 text-lg font-bold">{committee.abbreviation} — {committee.name}</h1>
		<div class="flex-none">
			<NavbarBurgerMenu
				items={menubarItems}
				user={{
					name: userDisplayName,
					email: currentUser?.email ?? undefined,
					givenName: currentUser?.givenName ?? undefined,
					familyName: currentUser?.familyName ?? undefined
				}}
				roleLabel={roleLabelFor(role)}
				roleBadgeClass={roleBadgeClassFor(role)}
				conferenceTitle={committee?.conference?.title}
				conferenceId={page.params.conferenceId}
				dashboardHref="/app"
				signOutHref="/logout"
			/>
		</div>
	</div>

	<!-- Main content with bottom padding for nav -->
	<div class="pb-16">
		{@render children()}
	</div>

	<!-- Bottom dock navigation -->
	<div class="dock dock-md lg:dock-lg md:justify-center md:gap-4">
		<a
			href={resolve('/app/[conferenceId]/participant/[committeeId]', {
				conferenceId: page.params.conferenceId!,
				committeeId: page.params.committeeId!
			})}
			class:dock-active={!page.url.pathname.includes('/papers')}
		>
			<i class="fa-duotone fa-users size-[1.2em]"></i>
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
				<i class="fa-duotone fa-file-lines size-[1.2em]"></i>
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
					<i class="fa-duotone fa-file-pen size-[1.2em]"></i>
					<span class="dock-label">{m.activeDraftResolution()}</span>
				</a>
			{/if}
		{/if}
	</div>
{/if}
