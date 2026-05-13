<script lang="ts">
	interface Props {
		eyebrow: string;
		title: string;
		subtitle?: string;
		accent?: boolean;
	}

	let { eyebrow, title, subtitle, accent = false }: Props = $props();
</script>

<header class="mb-7">
	<div
		class="text-xs font-semibold tracking-widest uppercase {accent
			? 'text-accent-content'
			: 'text-primary'}"
	>
		{eyebrow}
	</div>
	<h1 class="mt-1 mb-2 text-4xl leading-tight font-bold">{title}</h1>
	{#if subtitle}
		<p class="text-base-content/70 m-0 max-w-prose text-lg">{subtitle}</p>
	{/if}
</header>
