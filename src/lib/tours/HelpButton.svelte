<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';
	import Kbd from '$lib/components/Kbd.svelte';
	import { formatHotkey } from '$lib/helpers/hotkey';
	import { registerCommands } from '$lib/commands/registry.svelte';
	import { commandPalette, PALETTE_SHORTCUT } from '$lib/commands/palette.svelte';
	import { routeHelp } from './routeHelp';

	const help = $derived(page.route.id ? routeHelp[page.route.id] : undefined);
	const manualHref = $derived(resolve('/(pages)/docs/[...slug]', { slug: help?.docs ?? '' }));

	async function takeTour() {
		if (!help?.tour) return;
		// Close the dropdown so it doesn't sit on top of the first highlighted element
		(document.activeElement as HTMLElement | null)?.blur();
		// driver.js and its styles load only when a tour actually starts
		const [{ startTour }, tour] = await Promise.all([import('./runTour'), help.tour()]);
		startTour(tour);
	}

	function openCommands() {
		(document.activeElement as HTMLElement | null)?.blur();
		commandPalette.open = true;
	}

	registerCommands(() => [
		{
			id: 'global.tour',
			title: m.tourStart,
			group: 'global',
			icon: 'route',
			visible: () => !!help?.tour,
			run: takeTour
		},
		{
			id: 'global.manual',
			title: help ? m.helpManualForPage : m.helpManual,
			group: 'global',
			icon: 'book',
			run: () => window.open(manualHref, '_blank', 'noopener')
		}
	]);
</script>

<div class="dropdown dropdown-end">
	<button
		type="button"
		class="btn btn-ghost btn-circle btn-sm tooltip tooltip-left"
		aria-label={m.help()}
		data-tip={m.helpButtonTooltip({ shortcut: formatHotkey(PALETTE_SHORTCUT) })}
	>
		<i class="fa-duotone fa-circle-question text-lg"></i>
	</button>
	<ul class="dropdown-content menu bg-base-100 rounded-box z-50 mt-2 w-64 p-2 shadow-md">
		<li>
			<button type="button" onclick={openCommands}>
				<i class="fa-duotone fa-magnifying-glass w-5 text-center"></i>
				<span class="flex-1">{m.commandPaletteTitle()}</span>
				<Kbd hotkey={PALETTE_SHORTCUT} size="sm" />
			</button>
		</li>
		{#if help?.tour}
			<li>
				<button type="button" onclick={takeTour}>
					<i class="fa-duotone fa-route w-5 text-center"></i>
					{m.tourStart()}
				</button>
			</li>
		{/if}
		<li>
			<a href={manualHref} target="_blank" rel="noopener noreferrer">
				<i class="fa-duotone fa-book w-5 text-center"></i>
				<span class="flex-1">{help ? m.helpManualForPage() : m.helpManual()}</span>
				<i class="fa-solid fa-arrow-up-right text-base-content/50 text-xs" aria-hidden="true"></i>
			</a>
		</li>
	</ul>
</div>
