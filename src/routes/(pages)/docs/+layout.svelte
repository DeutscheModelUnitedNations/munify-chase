<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { DocsShell } from '@deutschemodelunitednations/docs-kit/components';
	import { nav } from '#lib/docs/nav';
	import { m } from '#lib/paraglide/messages';

	let { data, children } = $props();

	const current = $derived((page.params.slug ?? '').replace(/\/+$/, ''));
</script>

<DocsShell
	{nav}
	titles={data.titles}
	{current}
	href={(slug) => resolve('/(pages)/docs/[...slug]', { slug })}
	labels={{
		menu: m.docsMenu(),
		close: m.close(),
		navigation: m.homeDocsTitle(),
		overview: m.docsOverview()
	}}
>
	{@render children()}
</DocsShell>
