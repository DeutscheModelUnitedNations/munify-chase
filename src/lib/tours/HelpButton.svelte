<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { m } from '#lib/paraglide/messages';
	import Kbd from '#lib/components/Kbd.svelte';
	import { formatHotkey } from '#lib/helpers/hotkey';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import { commandPalette, PALETTE_SHORTCUT } from '#lib/commands/palette.svelte';
	import { HelpMenu } from '@deutschemodelunitednations/docs-kit/components';
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

<HelpMenu
	{manualHref}
	labels={{
		help: m.help(),
		manual: help ? m.helpManualForPage() : m.helpManual(),
		tour: m.tourStart()
	}}
	onTour={help?.tour ? takeTour : undefined}
	tooltip={m.helpButtonTooltip({ shortcut: formatHotkey(PALETTE_SHORTCUT) })}
>
	{#snippet items({ close })}
		<li>
			<button
				type="button"
				onclick={() => {
					close();
					commandPalette.open = true;
				}}
			>
				<i class="fa-duotone fa-magnifying-glass w-5 text-center"></i>
				<span class="flex-1">{m.commandPaletteTitle()}</span>
				<Kbd hotkey={PALETTE_SHORTCUT} size="sm" />
			</button>
		</li>
	{/snippet}
</HelpMenu>
