<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { DocsArticle } from '@deutschemodelunitednations/docs-kit/components';
	import { liveEmbeds } from '#lib/docs/liveEmbed';
	import { nav } from '#lib/docs/nav';
	import { m } from '#lib/paraglide/messages';
	import { getLocale } from '#lib/paraglide/runtime';

	let { data } = $props();

	const title = $derived(
		data.kind === 'page'
			? (data.doc.frontmatter.title ?? data.slug)
			: (nav.findCategory(data.slug)?.label() ?? data.slug)
	);
</script>

<svelte:head>
	<title>{title} - MUNify CHASE</title>
	{#if data.kind === 'page' && data.doc.frontmatter.description}
		<meta name="description" content={data.doc.frontmatter.description} />
	{/if}
</svelte:head>

<DocsArticle
	{nav}
	slug={data.slug}
	doc={data.kind === 'page' ? data.doc : undefined}
	titles={page.data.titles}
	href={(slug) => resolve('/(pages)/docs/[...slug]', { slug })}
	labels={{ onThisPage: m.docsOnThisPage(), editPage: m.docsEditPage() }}
	fallbackNotice={data.kind === 'page' && data.fallback
		? m.docsFallbackNotice({ locale: getLocale() })
		: undefined}
	editUrl={data.kind === 'page'
		? `https://github.com/DeutscheModelUnitedNations/munify-chase/edit/main/docs/${data.doc.locale}/${data.slug}.md`
		: undefined}
	attach={liveEmbeds(m.docsLiveClose())}
/>
