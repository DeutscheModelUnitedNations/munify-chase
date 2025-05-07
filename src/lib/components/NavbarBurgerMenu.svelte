<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
	import { m } from '$lib/paraglide/messages';
	import LanguageSwitcher from './LanguageSwitcher.svelte';

	interface Props {
		items: {
			faIcon: string;
			title: string;
			href: string;
		}[];
	}

	let { items }: Props = $props();

	let menuVisible = $state(false);
</script>

<button class="btn relative" onclick={() => (menuVisible = true)}>
	<i class="fa-duotone fa-bars"></i>
</button>

{#if menuVisible}
	<ul
		class="menu bg-base-100 rounded-box absolute top-5 right-5 z-50 min-w-52 shadow-md"
		in:fly={{ y: -10 }}
		out:fly={{ y: -10 }}
	>
		{#each items as { href, title, faIcon }}
			<li>
				<a {href}>
					<i class="fa-duotone w-6 text-center fa-{faIcon.replace('fa-', '')}"></i>
					{title}
				</a>
			</li>
		{/each}
		<!-- <div class="divider"></div> -->
		<div class="mt-4 flex w-full gap-1">
			<ThemeSwitcher />
			<LanguageSwitcher />
		</div>
	</ul>
{/if}

{#if menuVisible}
	<button
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
		type="button"
		class="fixed top-0 right-0 bottom-0 left-0 z-40 backdrop-brightness-50"
		aria-label="Close menu"
		onclick={() => (menuVisible = false)}
	></button>
{/if}
