<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { classifyObsolescence, evaluateAndSuggestRewrite } from '$lib/ai/amendments';
	import { SvelteSet } from 'svelte/reactivity';
	import AiSpinner from '$lib/components/AiSpinner.svelte';
	import ObsolescenceStep from './ObsolescenceStep.svelte';
	import RewriteStep from './RewriteStep.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';

	interface Representation {
		name: string | null | undefined;
		alpha2Code: string | null | undefined;
		alpha3Code: string | null | undefined;
		faIcon: string | null | undefined;
		type: string | null | undefined;
	}

	interface ReviewItem {
		id: string;
		phase: string | null | undefined;
		resolved: boolean | null | undefined;
		aiObsolete: boolean | null | undefined;
		aiObsoleteReason: string | null | undefined;
		aiRewriteSuggestion: string | null | undefined;
		triggerClauseOldContent: string | null | undefined;
		triggerAmendment:
			| {
					id: string;
					documentNumber: string | null | undefined;
					type: string | null | undefined;
					newContent: string | null | undefined;
					targetOperativeIndex: number | null | undefined;
					proposer:
						| { id: string; representation: Representation | null | undefined }
						| null
						| undefined;
					sponsors: Array<{ id: string }> | null | undefined;
			  }
			| null
			| undefined;
		subjectAmendment:
			| {
					id: string;
					documentNumber: string | null | undefined;
					type: string | null | undefined;
					status: string | null | undefined;
					newContent: string | null | undefined;
					targetOperativeIndex: number | null | undefined;
					proposer:
						| { id: string; representation: Representation | null | undefined }
						| null
						| undefined;
					sponsors: Array<{ id: string }> | null | undefined;
			  }
			| null
			| undefined;
	}

	interface Props {
		items: ReviewItem[];
		onclose: () => void;
	}

	let { items, onclose }: Props = $props();

	const trigger = $derived(items[0]?.triggerAmendment);
	const triggerClauseIdx = $derived(trigger?.targetOperativeIndex);

	const obsolescenceItems = $derived(
		items.filter((i) => i.phase === 'OBSOLESCENCE' && !i.resolved)
	);
	const rewriteItems = $derived(items.filter((i) => i.phase === 'REWRITE' && !i.resolved));

	// Split by clause: same-or-earlier clause vs strictly later clause.
	// Amendments targeting later clauses are very unlikely to need changes — show them
	// collapsed and only auto-expand when the AI finds a hit.
	// Only amendments for the same clause or later clauses are shown.
	// Earlier-clause amendments cannot be affected by a change to a later clause.
	const sameClauseObsolescence = $derived(
		obsolescenceItems.filter(
			(i) =>
				triggerClauseIdx == null ||
				i.subjectAmendment?.targetOperativeIndex == null ||
				i.subjectAmendment.targetOperativeIndex === triggerClauseIdx
		)
	);
	const laterClauseObsolescence = $derived(
		obsolescenceItems.filter(
			(i) =>
				triggerClauseIdx != null &&
				i.subjectAmendment?.targetOperativeIndex != null &&
				i.subjectAmendment.targetOperativeIndex > triggerClauseIdx
		)
	);
	const sameClauseRewrite = $derived(
		rewriteItems.filter(
			(i) =>
				triggerClauseIdx == null ||
				i.subjectAmendment?.targetOperativeIndex == null ||
				i.subjectAmendment.targetOperativeIndex === triggerClauseIdx
		)
	);
	const laterClauseRewrite = $derived(
		rewriteItems.filter(
			(i) =>
				triggerClauseIdx != null &&
				i.subjectAmendment?.targetOperativeIndex != null &&
				i.subjectAmendment.targetOperativeIndex > triggerClauseIdx
		)
	);

	const totalItems = $derived(items.length);
	const resolvedItems = $derived(items.filter((i) => i.resolved).length);
	const allResolved = $derived(resolvedItems === totalItems);

	let activeTab = $state<'OBSOLESCENCE' | 'REWRITE'>('OBSOLESCENCE');

	const obsCount = $derived(obsolescenceItems.length);
	const rewriteCount = $derived(rewriteItems.length);

	// Track which item IDs we've enqueued to avoid re-adding on reactive re-runs.
	const aiStarted = new SvelteSet<string>();
	let aiRunning = $state(false);

	// Plain (non-reactive) FIFO queue — drained one task at a time.
	type AiTask = { type: 'obsolescence' | 'rewrite'; item: ReviewItem };
	const aiQueue: AiTask[] = [];
	let draining = false;

	async function drainAiQueue(trig: NonNullable<typeof trigger>) {
		if (draining) return;
		draining = true;
		aiRunning = true;
		while (aiQueue.length > 0) {
			const task = aiQueue.shift()!;
			if (task.type === 'obsolescence') await processObsolescence(task.item, trig);
			else await processRewrite(task.item, trig);
		}
		aiRunning = false;
		draining = false;
	}

	// Single effect watches both lists; new items are enqueued and the drain starts.
	$effect(() => {
		if (!trigger) return;
		const trig = trigger;

		const newObs = obsolescenceItems.filter((i) => i.aiObsolete == null && !aiStarted.has(i.id));
		const newRew = rewriteItems.filter(
			(i) => i.aiRewriteSuggestion === null && !aiStarted.has(i.id)
		);
		const newTasks: AiTask[] = [
			...newObs.map((i) => ({ type: 'obsolescence' as const, item: i })),
			...newRew.map((i) => ({ type: 'rewrite' as const, item: i }))
		];
		if (newTasks.length === 0) return;
		for (const t of newTasks) aiStarted.add(t.item.id);
		aiQueue.push(...newTasks);
		drainAiQueue(trig);
	});

	async function processObsolescence(item: ReviewItem, trig: NonNullable<typeof trigger>) {
		try {
			const result = await classifyObsolescence(
				{
					id: trig.id,
					documentNumber: trig.documentNumber,
					newContent: trig.newContent,
					targetOperativeIndex: trig.targetOperativeIndex,
					oldContent: item.triggerClauseOldContent
				},
				{
					id: item.id,
					documentNumber: item.subjectAmendment?.documentNumber,
					newContent: item.subjectAmendment?.newContent,
					targetOperativeIndex: item.subjectAmendment?.targetOperativeIndex
				}
			);
			if (!result) return;
			await client.mutate.updateReviewItemAiOutput({
				__args: {
					reviewItemId: result.id,
					aiObsolete: result.obsolete,
					aiObsoleteReason: result.reason
				}
			});
		} catch (err) {
			console.error('[AI] Obsolescence classification failed:', err);
		}
	}

	async function processRewrite(item: ReviewItem, trig: NonNullable<typeof trigger>) {
		try {
			const result = await evaluateAndSuggestRewrite(
				{
					id: trig.id,
					documentNumber: trig.documentNumber,
					newContent: trig.newContent,
					targetOperativeIndex: trig.targetOperativeIndex,
					oldContent: item.triggerClauseOldContent
				},
				{
					id: item.id,
					documentNumber: item.subjectAmendment?.documentNumber,
					newContent: item.subjectAmendment?.newContent,
					targetOperativeIndex: item.subjectAmendment?.targetOperativeIndex
				}
			);
			await client.mutate.updateReviewItemAiOutput({
				__args: {
					reviewItemId: item.id,
					aiRewriteSuggestion: result.suggestion
				}
			});
		} catch (err) {
			console.error('[AI] Rewrite evaluation failed:', err);
		}
	}

	function opClauseRef(idx: number | null | undefined) {
		return idx != null ? ` – Clause ${idx + 1}` : '';
	}
</script>

<div class="modal modal-open">
	<div class="modal-box flex max-w-2xl flex-col gap-4">
		<!-- Header -->
		<div class="flex items-start justify-between gap-4">
			<div>
				<h3 class="text-base font-bold">
					Review after accepting
					{trigger?.documentNumber ?? 'amendment'}
				</h3>
				<p class="text-base-content/60 text-sm">
					{#if trigger?.type === 'ALTER_TEXT'}
						Text of clause{opClauseRef(trigger.targetOperativeIndex)} was changed
					{/if}
				</p>
			</div>
			<div class="flex items-center gap-2">
				{#if aiRunning}
					<AiSpinner size="sm" />
				{/if}
				<button class="btn btn-ghost btn-sm cursor-pointer" onclick={onclose}>
					<i class="fas fa-xmark"></i>
					Close
				</button>
			</div>
		</div>

		<!-- Trigger amendment metadata -->
		{#if trigger}
			<div class="bg-base-200 rounded-lg p-3 flex flex-col gap-2">
				<div class="flex items-center justify-between gap-2">
					<div class="flex items-center gap-2">
						{#if trigger.type === 'ADD'}
							<i class="fas fa-plus text-xs opacity-60"></i>
						{:else if trigger.type === 'DELETE'}
							<i class="fas fa-trash text-xs opacity-60"></i>
						{:else if trigger.type === 'ALTER_TEXT'}
							<i class="fas fa-pen text-xs opacity-60"></i>
						{:else if trigger.type === 'ALTER_POSITION'}
							<i class="fas fa-arrows-up-down text-xs opacity-60"></i>
						{/if}
						{#if trigger.documentNumber}
							<span class="font-mono text-sm font-semibold">{trigger.documentNumber}</span>
						{/if}
						{#if trigger.targetOperativeIndex != null}
							<span class="text-base-content/50 text-xs"
								>Clause {trigger.targetOperativeIndex + 1}</span
							>
						{/if}
					</div>
					<div class="flex items-center gap-2 text-xs text-base-content/60 shrink-0">
						{#if trigger.proposer?.representation}
							<span class="flex items-center gap-1.5">
								<Flag representation={trigger.proposer.representation} size="xs" />
								{getTranslatedCountryNameFromAlpha3Code(
									trigger.proposer.representation.alpha3Code
								) ?? trigger.proposer.representation.name}
							</span>
						{/if}
						{#if (trigger.sponsors?.length ?? 0) > 0}
							<span class="text-base-content/40">
								<i class="fas fa-users mr-0.5 text-[0.6rem]"></i>{trigger.sponsors?.length}
							</span>
						{/if}
					</div>
				</div>
				{#if trigger.newContent}
					<div>
						<p class="text-base-content/50 mb-1 text-xs uppercase tracking-wide">New text</p>
						<p class="font-mono text-xs whitespace-pre-wrap opacity-80">{trigger.newContent}</p>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Progress -->
		<div class="flex items-center gap-1 text-xs text-base-content/40">
			<span class="ml-auto">{resolvedItems}/{totalItems} resolved</span>
		</div>

		<!-- Tabs -->
		<div role="tablist" class="tabs tabs-bordered -mt-2">
			<button
				role="tab"
				class="tab"
				class:tab-active={activeTab === 'OBSOLESCENCE'}
				onclick={() => (activeTab = 'OBSOLESCENCE')}
			>
				<i class="fas fa-trash-can mr-1.5 text-xs"></i>
				Deletions
				{#if obsCount > 0}
					<span class="badge badge-sm ml-1.5">{obsCount}</span>
				{/if}
			</button>
			<button
				role="tab"
				class="tab"
				class:tab-active={activeTab === 'REWRITE'}
				onclick={() => (activeTab = 'REWRITE')}
			>
				<i class="fas fa-pen-to-square mr-1.5 text-xs"></i>
				Text adjustments
				{#if rewriteCount > 0}
					<span class="badge badge-sm ml-1.5">{rewriteCount}</span>
				{/if}
			</button>
		</div>

		<!-- Tab content -->
		{#if allResolved}
			<div class="py-4 text-center">
				<i class="fas fa-circle-check text-success text-2xl"></i>
				<p class="mt-2 font-semibold">All amendments reviewed</p>
				<button class="btn btn-primary mt-4 cursor-pointer" onclick={onclose}>Done</button>
			</div>
		{:else if activeTab === 'OBSOLESCENCE'}
			{#if obsolescenceItems.length > 0}
				<ObsolescenceStep
					items={sameClauseObsolescence}
					laterItems={laterClauseObsolescence}
					onadvance={() => {}}
				/>
			{:else}
				<div class="flex flex-col items-center gap-2 py-8 text-center">
					<i class="fas fa-circle-check text-success text-2xl"></i>
					<p class="font-semibold">No obsolescence check needed</p>
					<p class="text-base-content/50 max-w-xs text-sm">
						No other submitted amendments target the same clause — nothing risks becoming outdated
						by this change.
					</p>
				</div>
			{/if}
		{:else if activeTab === 'REWRITE'}
			{#if rewriteItems.length > 0}
				<RewriteStep items={sameClauseRewrite} laterItems={laterClauseRewrite} />
			{:else}
				<div class="flex flex-col items-center gap-2 py-8 text-center">
					<i class="fas fa-pen-slash text-base-content/30 text-2xl"></i>
					<p class="font-semibold">No text adjustments to review</p>
					<p class="text-base-content/50 max-w-xs text-sm">
						All obsolescence decisions have been recorded. Any surviving amendments will appear here
						once the Deletions tab is resolved.
					</p>
				</div>
			{/if}
		{/if}
	</div>
	<button class="modal-backdrop cursor-pointer" aria-label="Close review" onclick={onclose}
	></button>
</div>
