<script lang="ts">
	import { ResolutionEditor } from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';
	import {
		englishPreamblePhrases,
		englishOperativePhrases
	} from '@deutschemodelunitednations/munify-resolution-editor/phrases';
	import type {
		PresenceUser,
		AmendmentOverlay,
		OperativeClause
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import { createPaperYjsClient, type PaperYjsClient } from '$lib/api/yjs/createPaperYjs.svelte';
	import { onDestroy, type Snippet } from 'svelte';
	import SyncBadge from './SyncBadge.svelte';

	interface Props {
		paperId: string;
		user: PresenceUser;
		editable?: boolean;
		amendments?: AmendmentOverlay[];
		rejectedClauseIds?: string[];
		onAmendmentClick?: (amendmentId: string) => void;
		/** Rendered inside each operative clause's toolbar (e.g. select/comment). */
		clauseToolbar?: Snippet<[{ clause: OperativeClause; index: number }]>;
		/** Rendered next to each operative clause (e.g. amendment/comment count badges). */
		clauseAnnotations?: Snippet<[{ clause: OperativeClause; index: number }]>;
	}

	let {
		paperId,
		user,
		editable = true,
		amendments,
		rejectedClauseIds,
		onAmendmentClick,
		clauseToolbar,
		clauseAnnotations
	}: Props = $props();

	// One client per mount; recreated if paperId changes.
	let client = $state<PaperYjsClient | null>(null);

	$effect(() => {
		const current = createPaperYjsClient({ paperId, user });
		client = current;
		return () => {
			void current.destroy();
		};
	});

	onDestroy(() => {
		void client?.destroy();
	});
</script>

{#if client}
	<div class="relative flex h-full w-full flex-col">
		<div class="pointer-events-none absolute top-2 right-2 z-10">
			<div class="pointer-events-auto">
				<SyncBadge
					connectionState={client.connectionState}
					persistenceLoaded={client.persistenceLoaded}
					wsSynced={client.wsSynced}
				/>
			</div>
		</div>
		<ResolutionEditor
			store={client.store}
			presence={client.presence}
			labels={englishLabels}
			preamblePhrases={englishPreamblePhrases}
			operativePhrases={englishOperativePhrases}
			{editable}
			{amendments}
			{rejectedClauseIds}
			{onAmendmentClick}
			{clauseToolbar}
			{clauseAnnotations}
		/>
	</div>
{/if}
