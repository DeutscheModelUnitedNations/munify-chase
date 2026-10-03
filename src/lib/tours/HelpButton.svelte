<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';
	import { routeHelp } from './routeHelp';
	import { startTour } from './runTour';

	const help = $derived(page.route.id ? routeHelp[page.route.id] : undefined);

	async function takeTour() {
		if (!help?.tour) return;
		// Close the dropdown so it doesn't sit on top of the first highlighted element
		(document.activeElement as HTMLElement | null)?.blur();
		startTour(await help.tour());
	}
</script>

<div class="dropdown dropdown-end">
	<button
		type="button"
		class="btn btn-ghost btn-circle btn-sm"
		aria-label={m.help()}
		title={m.help()}
		data-tour="help-button"
	>
		<i class="fa-duotone fa-circle-question text-lg"></i>
	</button>
	<ul class="dropdown-content menu bg-base-100 rounded-box z-50 mt-2 w-60 p-2 shadow-md">
		{#if help?.tour}
			<li>
				<button type="button" onclick={takeTour}>
					<i class="fa-duotone fa-route w-5 text-center"></i>
					{m.tourStart()}
				</button>
			</li>
		{/if}
		<li>
			<a
				href={resolve('/(pages)/docs/[...slug]', { slug: help?.docs ?? '' })}
				target="_blank"
				rel="noopener noreferrer"
			>
				<i class="fa-duotone fa-book w-5 text-center"></i>
				<span class="flex-1">{help ? m.helpManualForPage() : m.helpManual()}</span>
				<i class="fa-solid fa-arrow-up-right text-base-content/50 text-xs" aria-hidden="true"></i>
			</a>
		</li>
	</ul>
</div>
