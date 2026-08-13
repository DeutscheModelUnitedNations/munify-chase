<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import CommentThread from './CommentThread.svelte';
	import AmendmentList from './AmendmentList.svelte';
	import AmendmentComposer from './AmendmentComposer.svelte';
	import ClauseVotePanel from './ClauseVotePanel.svelte';
	import { isTeam, type ResolutionViewer } from './paperContext';
	import type { OperativeClause } from '@deutschemodelunitednations/munify-resolution-editor';

	interface Props {
		paperId: string;
		committeeId: string;
		selectedClauseId: string | null;
		selectedClauseIndex: number | null;
		operative: OperativeClause[];

		viewer: ResolutionViewer;
		submissionOpen: boolean;
		sponsoringOpen: boolean;
		minAmendmentSponsors: number;
		activeAmendmentId: string | null;
		simpleMajority: number;
		/** Shows clause vote controls (DRAFT/AMENDMENT/VOTING phases). */
		showVoteTab: boolean;
		/** When set, switches the panel to this tab (e.g. clicking an amendment/comment badge). */
		requestedTab?: 'amendments' | 'comments' | 'vote';
		/** True when there is at least one unresolved amendment review for the selected clause. */
		hasReview?: boolean;
		/** When set, immediately opens the review modal for this trigger amendment ID. */
		openTriggerId?: string | null;
		ondeselect?: () => void;
		onselectclause?: (clauseId: string | null) => void;
	}

	let {
		paperId,
		committeeId,
		selectedClauseId,
		selectedClauseIndex,
		operative,
		viewer,
		submissionOpen,
		sponsoringOpen,
		minAmendmentSponsors,
		activeAmendmentId,
		simpleMajority,
		showVoteTab,
		requestedTab,
		hasReview = false,
		openTriggerId = null,
		ondeselect,
		onselectclause
	}: Props = $props();

	type Tab = 'amendments' | 'comments' | 'vote';
	let tab = $state<Tab>('comments');

	$effect(() => {
		// selectedClauseId tracked so re-selecting a clause with a badge also switches tab
		void selectedClauseId;
		if (requestedTab) tab = requestedTab;
	});
	let composerOpen = $state(false);

	const team = $derived(isTeam(viewer));
	const canPropose = $derived(team || (!!viewer.committeeMemberId && submissionOpen));

	// Lightweight count queries for tab badges (graphcache dedupes with children).
	const amendments = await client.liveQuery.amendments({
		__args: { where: { paper: { id: { eq: paperId } } } },
		id: true,
		targetClauseId: true
	});
	const comments = await client.liveQuery.resolutionComments({
		__args: { where: { paper: { id: { eq: paperId } } } },
		id: true,
		clauseId: true
	});

	const amendmentCount = $derived(
		(amendments ?? []).filter((a) =>
			selectedClauseId ? a.targetClauseId === selectedClauseId : !a.targetClauseId
		).length
	);
	const commentCount = $derived(
		(comments ?? []).filter((c) => (c.clauseId ?? null) === selectedClauseId).length
	);

	const clauseLabel = $derived(
		selectedClauseId ? m.clauseN({ n: String((selectedClauseIndex ?? 0) + 1) }) : m.wholeDocument()
	);

	const activeAmendmentTargetClauseId = $derived(
		(amendments ?? []).find((a) => a.id === activeAmendmentId)?.targetClauseId ?? null
	);
	const showJumpToActive = $derived(
		activeAmendmentId !== null && activeAmendmentTargetClauseId !== selectedClauseId
	);

	$effect(() => {
		if (tab === 'vote' && !showVoteTab) tab = 'comments';
	});
</script>

<div class="bg-base-200 flex h-full w-full flex-col">
	<div class="border-base-300 flex items-center gap-2 border-b p-3">
		<div class="min-w-0 flex-1">
			<p class="text-base-content/60 text-xs">{m.selected()}</p>
			<p class="truncate font-semibold">{clauseLabel}</p>
		</div>
		{#if showJumpToActive && onselectclause}
			<button
				class="btn btn-primary btn-xs shrink-0 gap-1"
				onclick={() => {
					onselectclause!(activeAmendmentTargetClauseId);
					tab = 'amendments';
				}}
				title={m.jumpToActiveAmendment()}
			>
				<i class="fas fa-bolt"></i>
				{m.jumpToActiveAmendment()}
			</button>
		{/if}
		{#if ondeselect && selectedClauseId}
			<button
				class="btn btn-ghost btn-xs btn-circle shrink-0"
				onclick={ondeselect}
				aria-label={m.deselect()}
			>
				<i class="fas fa-xmark"></i>
			</button>
		{/if}
	</div>

	<div class="border-base-300 flex items-center border-b">
		<div role="tablist" class="tabs tabs-bordered flex-1 px-2 pt-2">
			<button
				role="tab"
				class="tab"
				class:tab-active={tab === 'amendments'}
				onclick={() => (tab = 'amendments')}
			>
				{m.amendments()}
				{#if amendmentCount}<span class="badge badge-xs ml-1">{amendmentCount}</span>{/if}
				{#if hasReview}<span class="badge badge-error badge-xs ml-1">!</span>{/if}
			</button>
			<button
				role="tab"
				class="tab"
				class:tab-active={tab === 'comments'}
				onclick={() => (tab = 'comments')}
			>
				{m.comments()}
				{#if commentCount}<span class="badge badge-xs ml-1">{commentCount}</span>{/if}
			</button>
			{#if showVoteTab}
				<button
					role="tab"
					class="tab"
					class:tab-active={tab === 'vote'}
					onclick={() => (tab = 'vote')}
				>
					{m.vote()}
				</button>
			{/if}
		</div>
		{#if tab === 'amendments' && canPropose}
			<button
				class="btn btn-primary btn-xs mr-2 shrink-0"
				title={m.proposeAmendment()}
				onclick={() => (composerOpen = true)}
			>
				<i class="fas fa-plus"></i>
				{m.proposeAmendment()}
			</button>
		{/if}
	</div>

	<div class="min-h-0 flex-1 overflow-y-auto p-3">
		{#if tab === 'amendments'}
			<AmendmentList
				{paperId}
				{committeeId}
				{selectedClauseId}
				{viewer}
				{sponsoringOpen}
				{minAmendmentSponsors}
				{activeAmendmentId}
				{openTriggerId}
			/>
		{:else if tab === 'comments'}
			<CommentThread {paperId} {selectedClauseId} {viewer} />
		{:else if tab === 'vote'}
			<ClauseVotePanel
				{paperId}
				{committeeId}
				{selectedClauseId}
				{viewer}
				{simpleMajority}
				{clauseLabel}
			/>
		{/if}
	</div>
</div>

<AmendmentComposer
	bind:open={composerOpen}
	{paperId}
	{committeeId}
	{selectedClauseId}
	{operative}
	{viewer}
	close={() => (composerOpen = false)}
/>
