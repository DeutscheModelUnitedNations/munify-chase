<script lang="ts">
	import type { ComponentProps, Snippet } from 'svelte';
	import ConferenceMenu from './ConferenceMenu.svelte';

	interface Props extends ComponentProps<typeof ConferenceMenu> {
		/** The page's heading */
		title: string;
		/** Extra items shown between the heading and the conference menu */
		children?: Snippet;
	}

	let { title, children, ...menu }: Props = $props();
</script>

<div class="navbar bg-base-100 shadow-sm">
	<h1 class="ml-4 flex-1 text-3xl font-bold">{title}</h1>
	{#if children}
		<div class="flex-none">
			{@render children()}
		</div>
	{/if}
	<div class="flex-none">
		<ConferenceMenu {...menu} />
	</div>
</div>
