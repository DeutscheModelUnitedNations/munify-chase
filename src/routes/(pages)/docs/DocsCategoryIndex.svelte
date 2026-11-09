<script lang="ts">
	import { resolve } from '$app/paths';
	import type { DocsNavCategory } from '#lib/docs/nav';
	import { docTitleFor, type DocsTitles } from './docsPage';

	interface Props {
		category: DocsNavCategory;
		titles: DocsTitles;
	}
	let { category, titles }: Props = $props();

	function docHref(slug: string) {
		return resolve('/(pages)/docs/[...slug]', { slug });
	}
</script>

<h1>{category.label()}</h1>
<p class="lead">{category.description()}</p>
<div class="not-prose grid gap-3 sm:grid-cols-2">
	{#each category.items as item (item)}
		<a href={docHref(item)} class="card card-border bg-base-100 hover:bg-base-200 p-4">
			<span class="font-semibold">{docTitleFor(titles, item)}</span>
		</a>
	{/each}
</div>
