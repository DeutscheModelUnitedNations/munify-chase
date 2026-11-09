<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { GridItem } from 'svelte-grid-extended';
	import CurrentSpeaker from '#lib/components/speakersList/CurrentSpeaker.svelte';
	import SpeakersQueue from '#lib/components/speakersList/PresentationSpeakersQueue.svelte';

	interface Props {
		gridProps: ComponentProps<GridItem>;
		id: string;
		list: ComponentProps<typeof CurrentSpeaker>['speakersList'];
		resizeFn?: () => void;
	}
	let { gridProps, id, list, resizeFn = $bindable() }: Props = $props();
</script>

<GridItem {...gridProps} class="card bg-base-100 gap-8 overflow-hidden p-4" {id}>
	<CurrentSpeaker speakersList={list} />
	<SpeakersQueue rawSpeakers={list?.speakers} closed={list?.isClosed} bind:resizeFn />
</GridItem>
