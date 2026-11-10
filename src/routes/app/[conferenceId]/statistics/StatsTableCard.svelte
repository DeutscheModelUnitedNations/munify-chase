<script lang="ts">
	import type { Snippet } from 'svelte';
	import BasicCard from '#lib/components/BasicCard.svelte';

	interface Props {
		title: string;
		/** The header row's cells */
		head: Snippet;
		/** The body rows */
		children: Snippet;
	}
	let { title, head, children }: Props = $props();
</script>

<BasicCard {title}>
	<div class="overflow-x-auto">
		<table class="table table-sm w-full">
			<thead>
				<tr>
					{@render head()}
				</tr>
			</thead>
			<tbody>
				{@render children()}
			</tbody>
		</table>
	</div>
</BasicCard>
