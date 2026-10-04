<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { liveEmbeds } from '$lib/docs/liveEmbed';
	import { findCategory, flatDocsSlugs } from '$lib/docs/nav';
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';

	let { data } = $props();

	const category = $derived(data.kind === 'category' ? findCategory(data.slug) : undefined);
	const title = $derived(
		data.kind === 'page'
			? (data.doc.frontmatter.title ?? data.slug)
			: (category?.label() ?? data.slug)
	);

	const neighbours = $derived.by(() => {
		const slugs = flatDocsSlugs();
		const index = slugs.indexOf(data.slug);
		return { prev: slugs[index - 1], next: slugs[index + 1] };
	});

	function docHref(slug: string) {
		return resolve('/(pages)/docs/[...slug]', { slug });
	}

	function titleFor(slug: string) {
		return page.data.titles[slug] ?? findCategory(slug)?.label() ?? slug;
	}

	const editUrl = $derived(
		data.kind === 'page'
			? `https://github.com/DeutscheModelUnitedNations/munify-chase/edit/main/docs/${data.doc.locale}/${data.slug}.md`
			: undefined
	);
</script>

<svelte:head>
	<title>{title} - MUNify CHASE</title>
	{#if data.kind === 'page' && data.doc.frontmatter.description}
		<meta name="description" content={data.doc.frontmatter.description} />
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
					<i class="fa-duotone fa-language"></i>
					<span>{m.docsFallbackNotice({ locale: getLocale() })}</span>
				</div>
			{/if}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- rendered from our own markdown in docs/ -->
			{@html data.doc.html}
		{:else if category}
			<h1>{category.label()}</h1>
			<p class="lead">{category.description()}</p>
			<div class="not-prose grid gap-3 sm:grid-cols-2">
				{#each category.items as item (item)}
					<a href={docHref(item)} class="card card-border bg-base-100 hover:bg-base-200 p-4">
						<span class="font-semibold">{titleFor(item)}</span>
					</a>
				{/each}
			</div>
		{/if}

		<div class="not-prose border-base-300 mt-12 flex flex-wrap justify-between gap-4 border-t pt-6">
			{#if neighbours.prev}
				<a href={docHref(neighbours.prev)} class="btn btn-ghost">
					<i class="fa-duotone fa-arrow-left"></i>
					{titleFor(neighbours.prev)}
				</a>
			{:else}
				<span></span>
			{/if}
			{#if neighbours.next}
				<a href={docHref(neighbours.next)} class="btn btn-ghost">
					{titleFor(neighbours.next)}
					<i class="fa-duotone fa-arrow-right"></i>
				</a>
			{/if}
		</div>

		{#if editUrl}
			<p class="not-prose mt-4 text-sm">
				<!-- eslint-disable svelte/no-navigation-without-resolve -- external GitHub link -->
				<a
					class="link link-hover opacity-70"
					href={editUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					<i class="fa-duotone fa-pen-to-square"></i>
					{m.docsEditPage()}
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			</p>
		{/if}
	</article>

	{#if data.kind === 'page' && data.doc.toc.length > 1}
		<aside class="hidden w-56 shrink-0 xl:block">
			<nav class="sticky top-4 text-sm" aria-label={m.docsOnThisPage()}>
				<p class="mb-2 font-semibold">{m.docsOnThisPage()}</p>
				<ul class="flex flex-col gap-1">
					{#each data.doc.toc as entry (entry.id)}
						<li class={entry.depth === 3 ? 'pl-3' : ''}>
							<a class="link link-hover opacity-80" href="#{entry.id}">{entry.text}</a>
						</li>
					{/each}
				</ul>
			</nav>
		</aside>
	{/if}
</div>
