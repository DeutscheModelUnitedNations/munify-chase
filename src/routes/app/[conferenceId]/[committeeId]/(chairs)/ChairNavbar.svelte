<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import hotkeys from 'hotkeys-js';

	interface Props {
		title?: string;
		activeDraftResolutionId?: string | null;
		resolutionFeatureEnabled?: boolean;
	}

	let { title, activeDraftResolutionId, resolutionFeatureEnabled = true }: Props = $props();

	const conferenceId = $derived(page.params.conferenceId!);
	const committeeId = $derived(page.params.committeeId!);

	const dockItems = $derived([
		{
			icon: 'fa-gears',
			label: () => m.setup(),
			href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/setup', {
				conferenceId,
				committeeId
			}),
			key: 'setup'
		},
		{
			icon: 'fa-users',
			label: () => m.presence(),
			href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/presence', {
				conferenceId,
				committeeId
			}),
			key: 'presence'
		},
		{
			icon: 'fa-podium',
			label: () => m.speakersList(),
			href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/speakers-list', {
				conferenceId,
				committeeId
			}),
			key: 'speakers-list'
		},
		{
			icon: 'fa-box-ballot',
			label: () => m.voting(),
			href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/voting', {
				conferenceId,
				committeeId
			}),
			key: 'voting'
		},
		...(resolutionFeatureEnabled
			? [
					{
						icon: 'fa-scroll',
						label: () => m.resolutions(),
						href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions', {
							conferenceId,
							committeeId
						}),
						key: 'resolutions'
					}
				]
			: []),
		...(resolutionFeatureEnabled && activeDraftResolutionId
			? [
					{
						icon: 'fa-file-lines',
						label: () => m.activeDraftResolution(),
						href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions/[paperId]', {
							conferenceId,
							committeeId,
							paperId: activeDraftResolutionId
						}),
						key: activeDraftResolutionId
					}
				]
			: [])
	]);

	function isActive(key: string) {
		// If we're on the active DR's paper page, highlight the active DR tab, not the resolutions tab
		if (activeDraftResolutionId && page.params.paperId === activeDraftResolutionId) {
			return key === activeDraftResolutionId;
		}
		return page.route.id?.includes(key) ?? false;
	}

	$effect(() => {
		hotkeys('alt+1, alt+2, alt+3, alt+4, alt+5, alt+6', (event, handler) => {
			event.preventDefault();
			switch (handler.key) {
				case 'alt+1':
					goto(
						resolve('/app/[conferenceId]/[committeeId]/(chairs)/setup', {
							conferenceId,
							committeeId
						})
					);
					break;
				case 'alt+2':
					goto(
						resolve('/app/[conferenceId]/[committeeId]/(chairs)/presence', {
							conferenceId,
							committeeId
						})
					);
					break;
				case 'alt+3':
					goto(
						resolve('/app/[conferenceId]/[committeeId]/(chairs)/speakers-list', {
							conferenceId,
							committeeId
						})
					);
					break;
				case 'alt+4':
					goto(
						resolve('/app/[conferenceId]/[committeeId]/(chairs)/voting', {
							conferenceId,
							committeeId
						})
					);
					break;
				case 'alt+5':
					goto(
						resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions', {
							conferenceId,
							committeeId
						})
					);
					break;
				case 'alt+6':
					if (activeDraftResolutionId) {
						goto(
							resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions/[paperId]', {
								conferenceId,
								committeeId,
								paperId: activeDraftResolutionId
							})
						);
					}
					break;
			}
		});
	});
</script>

<!-- Slim top bar -->
<div class="navbar bg-base-100 sticky top-0 z-10 shadow-sm">
	<h1 class="ml-4 text-3xl font-bold">{title ?? ''}</h1>

	<div class="flex-1"></div>

	<div class="flex-none">
		<CurrentTime />
	</div>

	<div class="flex-none">
		<NavbarBurgerMenu
			items={[
				{
					faIcon: 'fa-rocket-launch',
					title: m.missionControl(),
					href: resolve('/app/[conferenceId]/mission-control', { conferenceId })
				}
			]}
		/>
	</div>
</div>

<!-- Bottom dock -->
<div class="dock dock-md lg:dock-lg md:justify-center md:gap-4">
	{#each dockItems as item, i (item.key)}
		<a href={item.href} class="group relative {isActive(item.key) ? 'dock-active' : ''}">
			<i class="fa-duotone {item.icon} size-[1.2em]"></i>
			<span class="dock-label">{item.label()}</span>
			<kbd
				class="kbd kbd-sm absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-base-100/80 px-2 py-1 z-10"
				>⌥{i + 1}</kbd
			>
		</a>
	{/each}
</div>
