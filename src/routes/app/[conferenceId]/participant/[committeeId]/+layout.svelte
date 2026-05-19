<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const currentUser = await getCurrentUser();
	const [conferenceUser] =
		(await client.liveQuery.conferenceUsers({
			__args: {
				where: {
					conference: { id: page.params.conferenceId },
					user: { id: currentUser?.id ?? '' }
				}
			},
			id: true,
			conferenceUserType: true
		})) ?? [];
	const role = $derived(conferenceUser?.conferenceUserType);
	const showBack = $derived(role !== 'DELEGATE');

	const committee = await client.liveQuery.committee({
		__args: { id: page.params.committeeId! },
		id: true,
		abbreviation: true,
		name: true,
		resolutionHeadline: true,
		supportReEvaluationOpen: true,
		activeDraftResolutionId: true,
		conference: {
			id: true,
			title: true
			// TODO: resolutionFeatureEnabled not available in Rumble client yet
		},
		activeAgendaItem: {
			id: true,
			title: true
		}
	});

	let isPapersRoute = $derived(page.route.id?.includes('/papers') ?? false);
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
			<ThemeSwitcher />
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
			class={!isPapersRoute ? 'dock-active' : ''}
		>
			<i class="fa-duotone fa-users size-[1.2em]"></i>
			<span class="dock-label">{m.committee()}</span>
		</a>
		<!-- TODO: resolutionFeatureEnabled check removed - not available in Rumble client yet -->
		<a
			href={resolve('/app/[conferenceId]/participant/[committeeId]/papers', {
				conferenceId: page.params.conferenceId!,
				committeeId: page.params.committeeId!
			})}
			class={isPapersRoute ? 'dock-active' : ''}
		>
			<i class="fa-duotone fa-scroll size-[1.2em]"></i>
			<span class="dock-label">{m.papers()}</span>
		</a>
	</div>
{/if}
