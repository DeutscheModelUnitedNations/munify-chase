<script lang="ts">
	import { onDestroy } from 'svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import { ResolutionPreview } from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';
	import { createPaperYjsClient, type PaperYjsClient } from '$lib/api/yjs/createPaperYjs.svelte';
	import { toAmendmentOverlays } from './paperContext';

	interface Props {
		paperId: string;
		/** When set, the matching operative clause is visually marked as active. */
		currentOperativeIndex?: number;
		showAmendments?: boolean;
	}

	let { paperId, currentOperativeIndex, showAmendments = false }: Props = $props();

	let yClient = $state<PaperYjsClient | null>(null);
	$effect(() => {
		// Read-only presentation viewer; presence is anonymous.
		const created = createPaperYjsClient({
			paperId,
			user: { id: 'presentation', name: 'Presentation', color: undefined }
		});
		yClient = created;
		return () => void created.destroy();
	});
	onDestroy(() => void yClient?.destroy());

	const resolution = $derived(yClient?.store.snapshot ?? null);

	const amendmentRows = await client.liveQuery.amendments({
		__args: { where: { paper: { id: paperId } } },
		id: true,
		type: true,
		status: true,
		targetClauseId: true,
		targetOperativeIndex: true,
		targetPosition: true,
		newContent: true,
		proposer: { representation: { name: true } },
		sponsors: { id: true }
	});
	const clauseVotes = await client.liveQuery.operativeClauseVotes({
		__args: { where: { paper: { id: paperId } } },
		id: true,
		clauseId: true,
		vote: { id: true, outcome: true }
	});

	const overlays = $derived(showAmendments ? toAmendmentOverlays(amendmentRows) : undefined);
	const rejectedClauseIds = $derived(
		(clauseVotes ?? []).filter((v) => v.vote?.outcome === 'REJECTED').map((v) => v.clauseId)
	);

	const activeClauseId = $derived(
		resolution && currentOperativeIndex != null
			? (resolution.operative[currentOperativeIndex]?.id ?? null)
			: null
	);
</script>

{#if resolution}
	<div class="h-full w-full overflow-auto p-8 [&_.active-clause]:bg-warning/10">
		<ResolutionPreview
			{resolution}
			labels={englishLabels}
			amendments={overlays}
			{rejectedClauseIds}
		>
			{#snippet afterOperativeClause({ clause })}
				{#if clause.id === activeClauseId}
					<div class="badge badge-warning badge-sm gap-1">
						<i class="fas fa-gavel"></i>
					</div>
				{/if}
			{/snippet}
		</ResolutionPreview>
	</div>
{/if}
