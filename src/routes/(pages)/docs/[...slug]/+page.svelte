<script lang="ts">
	import { liveEmbeds } from '#lib/docs/liveEmbed';
	import { findCategory, flatDocsSlugs } from '#lib/docs/nav';
	import { m } from '#lib/paraglide/messages';
	import { getLocale } from '#lib/paraglide/runtime';
	import DocsCategoryIndex from '../DocsCategoryIndex.svelte';
	import DocsPager from '../DocsPager.svelte';
	import DocsToc from '../DocsToc.svelte';
	import { docDescription, docEditUrl, docNeighbours, docPageTitle, docToc } from '../docsPage';

	let { data } = $props();

	const category = $derived(data.kind === 'category' ? findCategory(data.slug) : undefined);
	const title = $derived(docPageTitle(data));
	const description = $derived(docDescription(data));
	const neighbours = $derived(docNeighbours(flatDocsSlugs(), data.slug));
	const editUrl = $derived(docEditUrl(data));
	const toc = $derived(docToc(data));
</script>

<svelte:head>
	<title>{title} - MUNify CHASE</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
</svelte:head>

<div class="flex gap-10">
	<article
		class="prose prose-headings:font-bold max-w-none min-w-0 flex-1"
		{@attach liveEmbeds(m.docsLiveClose())}
	>
		{#if data.kind === 'page'}
			{#if data.fallback}
				<div role="note" class="alert alert-soft alert-info not-prose mb-6">
					<i aria-hidden="true" class="ph-duotone ph-translate"></i>
					<span>{m.docsFallbackNotice({ locale: getLocale() })}</span>
				</div>
			{/if}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- rendered from our own markdown in docs/ -->
			{@html data.doc.html}
		{:else if category}
			<DocsCategoryIndex {category} titles={data.titles} />
		{/if}

		<DocsPager prev={neighbours.prev} next={neighbours.next} titles={data.titles} />

		{#if editUrl}
			<p class="not-prose mt-4 text-sm">
				<!-- eslint-disable svelte/no-navigation-without-resolve -- external GitHub link -->
				<a
					class="link link-hover opacity-70"
					href={editUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					<i aria-hidden="true" class="ph-duotone ph-note-pencil"></i>
					{m.docsEditPage()}
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			</p>
		{/if}
	</article>

	{#if toc.length > 0}
		<DocsToc entries={toc} />
	{/if}
</div>
