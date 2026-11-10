<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	interface Props {
		title: string;
		/** Classes of the modal box, which set its size. */
		class: string;
		titleClass?: string;
		children: Snippet;
	}

	let { title, class: className, titleClass = '', children }: Props = $props();
</script>

<div class="modal modal-open">
	<div
		class="modal-box bg-base-200 relative {className}"
		in:fly={{ y: 100, duration: 1000, easing: cubicOut }}
		out:fly={{ y: 100, duration: 1000, easing: cubicIn }}
	>
		<h2 class="w-full text-center text-4xl font-bold {titleClass}">{title}</h2>

		{@render children()}
	</div>
</div>
