<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { GridItem } from 'svelte-grid-extended';
	import PresentationResolutionPreview from '#lib/components/resolutions/PresentationResolutionPreview.svelte';
	import PresentationRequests from '#lib/components/requests/PresentationRequests.svelte';

	type PreviewProps = ComponentProps<typeof PresentationResolutionPreview>;

	interface Props {
		/** Where the layout puts the tiles, none when it leaves them out */
		layout: {
			resolutionPreview?: ComponentProps<GridItem>;
			requests?: ComponentProps<GridItem>;
		};
		/** The draft resolution on the projector, if any */
		activePaperId: string | null;
		resolutionFontSize: number;
		/** What the preview highlights, see resolutionPreviewState */
		preview: Omit<PreviewProps, 'paperId' | 'resolutionFontSize'>;
		requests: ComponentProps<typeof PresentationRequests>['requests'];
	}

	let { layout, activePaperId, resolutionFontSize, preview, requests }: Props = $props();
</script>

{#if layout.resolutionPreview && activePaperId}
	{@const gridProps = layout.resolutionPreview}
	<GridItem {...gridProps} class="card bg-base-100 overflow-auto p-4" id="resolution-preview">
		<PresentationResolutionPreview paperId={activePaperId} {resolutionFontSize} {...preview} />
	</GridItem>
{/if}
{#if layout.requests}
	{@const gridProps = layout.requests}
	<GridItem {...gridProps} class="card bg-base-100 overflow-hidden p-4" id="requests">
		<PresentationRequests {requests} />
	</GridItem>
{/if}
