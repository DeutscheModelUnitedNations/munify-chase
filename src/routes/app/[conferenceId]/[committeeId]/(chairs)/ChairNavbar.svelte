<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import hotkeys from 'hotkeys-js';

	interface Props {
		title?: string;
		activeDraftResolutionId?: string | null;
	}

	let { title, activeDraftResolutionId }: Props = $props();

	const basePath = $derived(`/app/${page.params.conferenceId}/${page.params.committeeId}`);

	const dockItems = $derived([
		{ icon: 'fa-gears', label: () => m.setup(), href: `${basePath}/setup`, key: 'setup' },
		{ icon: 'fa-users', label: () => m.presence(), href: `${basePath}/presence`, key: 'presence' },
		{
			icon: 'fa-podium',
			label: () => m.speakersList(),
			href: `${basePath}/speakers-list`,
			key: 'speakers-list'
		},
		{
			icon: 'fa-box-ballot',
			label: () => m.voting(),
			href: `${basePath}/voting`,
			key: 'voting'
		},
		{
			icon: 'fa-scroll',
			label: () => m.resolutions(),
			href: `${basePath}/resolutions`,
			key: 'resolutions'
		},
		...(activeDraftResolutionId
			? [
					{
						icon: 'fa-file-lines',
						label: () => m.activeDraftResolution(),
						href: `${basePath}/resolutions/${activeDraftResolutionId}`,
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
					goto(`${basePath}/setup`);
					break;
				case 'alt+2':
					goto(`${basePath}/presence`);
					break;
				case 'alt+3':
					goto(`${basePath}/speakers-list`);
					break;
				case 'alt+4':
					goto(`${basePath}/voting`);
					break;
				case 'alt+5':
					goto(`${basePath}/resolutions`);
					break;
				case 'alt+6':
					if (activeDraftResolutionId) {
						goto(`${basePath}/resolutions/${activeDraftResolutionId}`);
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
		<ThemeSwitcher />
	</div>

	<div class="flex-none">
		<NavbarBurgerMenu
			items={[
				{
					faIcon: 'fa-rocket-launch',
					title: m.missionControl(),
					href: `/app/${page.params.conferenceId}/${page.params.committeeId}/mission-control`
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
