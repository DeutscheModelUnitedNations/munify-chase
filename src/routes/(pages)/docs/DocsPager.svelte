<script lang="ts">
	import { resolve } from '$app/paths';
	import { docTitleFor, type DocsTitles } from './docsPage';

	interface Props {
		prev: string | undefined;
		next: string | undefined;
		titles: DocsTitles;
	}
	let { prev, next, titles }: Props = $props();

	function docHref(slug: string) {
		return resolve('/(pages)/docs/[...slug]', { slug });
	}
</script>

<div class="not-prose border-base-300 mt-12 flex flex-wrap justify-between gap-4 border-t pt-6">
	{#if prev}
		<a href={docHref(prev)} class="btn btn-ghost">
			<i aria-hidden="true" class="ph-duotone ph-arrow-left"></i>
			{docTitleFor(titles, prev)}
		</a>
	{:else}
		<span></span>
	{/if}
	{#if next}
		<a href={docHref(next)} class="btn btn-ghost">
			{docTitleFor(titles, next)}
			<i aria-hidden="true" class="ph-duotone ph-arrow-right"></i>
		</a>
	{/if}
</div>
