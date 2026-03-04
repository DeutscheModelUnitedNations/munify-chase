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
	}

	let { title }: Props = $props();

	const dockItems = [
		{ icon: 'fa-gears', label: () => m.setup(), href: './setup', key: 'setup' },
		{ icon: 'fa-users', label: () => m.presence(), href: './presence', key: 'presence' },
		{
			icon: 'fa-podium',
			label: () => m.speakersList(),
			href: './speakers-list',
			key: 'speakers-list'
		},
		{ icon: 'fa-box-ballot', label: () => m.voting(), href: './voting', key: 'voting' },
		{ icon: 'fa-scroll', label: () => m.resolutions(), href: './resolutions', key: 'resolutions' }
	];

	function isActive(key: string) {
		return page.route.id?.includes(key) ?? false;
	}

	$effect(() => {
		hotkeys('alt+1, alt+2, alt+3, alt+4, alt+5', (event, handler) => {
			event.preventDefault();
			switch (handler.key) {
				case 'alt+1':
					goto('./setup');
					break;
				case 'alt+2':
					goto('./presence');
					break;
				case 'alt+3':
					goto('./speakers-list');
					break;
				case 'alt+4':
					goto('./voting');
					break;
				case 'alt+5':
					goto('./resolutions');
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
					href: '../mission-control'
				}
			]}
		/>
	</div>
</div>

<!-- Bottom dock -->
<div class="dock dock-md lg:dock-lg md:justify-center md:gap-4">
	{#each dockItems as item (item.key)}
		<a href={item.href} class={isActive(item.key) ? 'dock-active' : ''}>
			<i class="fa-duotone {item.icon} size-[1.2em]"></i>
			<span class="dock-label">{item.label()}</span>
		</a>
	{/each}
</div>
