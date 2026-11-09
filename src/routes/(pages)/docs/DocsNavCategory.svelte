<script lang="ts">
	import { resolve } from '$app/paths';
	import type { DocsNavCategory } from '#lib/docs/nav';
	import { m } from '#lib/paraglide/messages';
	import { categoryOpen, menuActiveClass, pageLabel, type DocsTitles } from './docsPage';

	interface Props {
		category: DocsNavCategory;
		current: string;
		titles: DocsTitles;
	}
	let { category, current, titles }: Props = $props();

	function docHref(slug: string) {
		return resolve('/(pages)/docs/[...slug]', { slug });
	}
</script>

<li>
	<details open={categoryOpen(current, category.slug)}>
		<summary>{category.label()}</summary>
		<ul>
			<li>
				<a href={docHref(category.slug)} class={menuActiveClass(current, category.slug)}>
					{m.docsOverview()}
				</a>
			</li>
			{#each category.items as item (item)}
				<li>
					<a href={docHref(item)} class={menuActiveClass(current, item)}>
						{pageLabel(titles, item)}
					</a>
				</li>
			{/each}
		</ul>
	</details>
</li>
