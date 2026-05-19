<script lang="ts">
	import type { Snippet } from 'svelte';
	import { openExternal } from '$lib/platform';

	interface Props {
		href: string;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	}

	let { href, class: cls, children, ...rest }: Props = $props();
</script>

<!-- svelte-ignore a11y_invalid_attribute -->
<a
	href="#"
	class={cls}
	onclick={(e) => {
		e.preventDefault();
		openExternal(href);
	}}
	{...rest}
>
	{@render children?.()}
</a>
