<script lang="ts">
	import type { DocsTocEntry } from '#lib/docs/render';
	import { m } from '#lib/paraglide/messages';
	import { tocIndentClass } from './docsPage';

	interface Props {
		entries: DocsTocEntry[];
	}
	let { entries }: Props = $props();
</script>

<aside class="hidden w-56 shrink-0 xl:block">
	<nav class="sticky top-4 text-sm" aria-label={m.docsOnThisPage()}>
		<p class="mb-2 font-semibold">{m.docsOnThisPage()}</p>
		<ul class="flex flex-col gap-1">
			{#each entries as entry (entry.id)}
				<li class={tocIndentClass(entry)}>
					<a class="link link-hover opacity-80" href="#{entry.id}">{entry.text}</a>
				</li>
			{/each}
		</ul>
	</nav>
</aside>
