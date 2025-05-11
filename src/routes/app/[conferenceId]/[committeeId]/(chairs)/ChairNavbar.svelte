<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import DevPlaceholder from '$lib/components/DevPlaceholder.svelte';
	import JoinedButtons, { type Button } from '$lib/components/JoinedButtons.svelte';
	import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import hotkeys from 'hotkeys-js';

	interface Props {
		title?: string;
	}

	let { title }: Props = $props();

	const buttons: Button[] = $derived([
		{
			faIcon: 'fa-gears',
			label: m.setup(),
			href: './setup',
			shortcut: '⌥ 1',
			active: page.route.id?.endsWith('setup')
		},
		{
			faIcon: 'fa-users',
			label: m.presence(),
			href: './presence',
			shortcut: '⌥ 2',
			active: page.route.id?.endsWith('presence')
		},
		{
			faIcon: 'fa-podium',
			label: m.speakersList(),
			href: './speakers-list',
			shortcut: '⌥ 3',
			active: page.route.id?.endsWith('speakers-list')
		}
	]);

	$effect(() => {
		hotkeys('alt+1, alt+2, alt+3', (event, handler) => {
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
			}
		});
	});
</script>

<div class="navbar bg-base-100 sticky top-0 z-10 shadow-sm">
	<h1 class=" ml-4 text-3xl font-bold">{title ?? ''}</h1>

	<JoinedButtons {buttons} />

	<div class="flex-none">
		<CurrentTime />
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
