<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { classifyObsolescence, evaluateAndSuggestRewrite } from '$lib/ai/amendments';
	import { getAiPreference, preferenceToMode } from '$lib/ai/aiPreference.svelte';
	import AiSpinner from '$lib/components/AiSpinner.svelte';
	import ObsolescenceStep from './ObsolescenceStep.svelte';
	import RewriteStep from './RewriteStep.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import {
		OperativeParagraphPreview,
		serializeClause
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';

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
		aiObsolete: boolean | null | undefined;
		aiRewriteSuggestion: string | null | undefined;
		triggerAmendment:
			| {
					id: string;
					documentNumber: string | null | undefined;
					type: string | null | undefined;
					newContent: string | null | undefined;
					oldContent: string | null | undefined;
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
					oldContent: string | null | undefined;
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

	const obsolescenceItems = $derived(items.filter((i) => i.phase === 'OBSOLESCENCE'));
	const rewriteItems = $derived(items.filter((i) => i.phase === 'REWRITE'));

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

	const allResolved = $derived(items.every((i) => i.phase === 'RESOLVED'));
	// Step 1 (Deletions) is active while any obsolescence items remain; then step 2 (Text adjustments).
	const currentStep = $derived(obsolescenceItems.length > 0 ? 1 : 2);

	// Separate sets per task type so an item processed for OBSOLESCENCE can still
	// be queued for REWRITE once it advances to that phase.
	const aiStartedObs = new Set<string>();
	const aiStartedRew = new Set<string>();
	let aiRunning = $state(false);
	let currentlyProcessingId = $state<string | null>(null);

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

	// Single effect watches item lists; new items are enqueued in display order
	// (same-clause first, later-clause sorted ascending). aiStarted is a plain Set so
	// mutations to it do not re-trigger this effect — only changes to the item lists do.
	//
	// When subscription updates deliver items out of order (e.g. later-clause items
	// arrive before same-clause items), we re-sort the pending portion of the queue so
	// same-clause items always run before later-clause items regardless of arrival order.
	$effect(() => {
		if (!trigger) return;
		const trig = trigger;

		const byClause = (a: ReviewItem, b: ReviewItem) =>
			(a.subjectAmendment?.targetOperativeIndex ?? Infinity) -
			(b.subjectAmendment?.targetOperativeIndex ?? Infinity);

		const obsOrdered = [...sameClauseObsolescence, ...[...laterClauseObsolescence].sort(byClause)];
		const rewOrdered = [...sameClauseRewrite, ...[...laterClauseRewrite].sort(byClause)];

		const newObs = obsOrdered.filter((i) => i.aiObsolete == null && !aiStartedObs.has(i.id));
		const newRew = rewOrdered.filter(
			(i) => i.aiRewriteSuggestion === null && !aiStartedRew.has(i.id)
		);
		const newTasks: AiTask[] = [
			...newObs.map((i) => ({ type: 'obsolescence' as const, item: i })),
			...newRew.map((i) => ({ type: 'rewrite' as const, item: i }))
		];
		if (newTasks.length === 0) return;
		for (const t of newTasks) {
			if (t.type === 'obsolescence') aiStartedObs.add(t.item.id);
			else aiStartedRew.add(t.item.id);
		}

		// Pull any pending (not yet dequeued) tasks out of the queue, merge with new
		// tasks, then re-sort everything in canonical display order before pushing back.
		// This corrects cases where later-clause items were queued earlier because they
		// arrived via subscription before same-clause items.
		const obsIndexMap = new Map(obsOrdered.map((item, idx) => [item.id, idx]));
		const rewIndexMap = new Map(rewOrdered.map((item, idx) => [item.id, idx]));
		const pending = aiQueue.splice(0);
		const combined = [...pending, ...newTasks];
		combined.sort((a, b) => {
			const aIsObs = a.type === 'obsolescence';
			const bIsObs = b.type === 'obsolescence';
			if (aIsObs !== bIsObs) return aIsObs ? -1 : 1;
			const idxA = aIsObs
				? (obsIndexMap.get(a.item.id) ?? Infinity)
				: (rewIndexMap.get(a.item.id) ?? Infinity);
			const idxB = bIsObs
				? (obsIndexMap.get(b.item.id) ?? Infinity)
				: (rewIndexMap.get(b.item.id) ?? Infinity);
			return idxA - idxB;
		});
		aiQueue.push(...combined);
		drainAiQueue(trig);
	});

	async function processObsolescence(item: ReviewItem, trig: NonNullable<typeof trigger>) {
		const pref = getAiPreference();
		if (pref === 'off') return;
		currentlyProcessingId = item.id;
		try {
			const result = await classifyObsolescence(
				{
					id: trig.id,
					documentNumber: trig.documentNumber,
					newContent: trig.newContent,
					targetOperativeIndex: trig.targetOperativeIndex,
					oldContent: item.triggerAmendment?.oldContent
				},
				{
					id: item.id,
					documentNumber: item.subjectAmendment?.documentNumber,
					newContent: item.subjectAmendment?.newContent,
					oldContent: item.subjectAmendment?.oldContent,
					targetOperativeIndex: item.subjectAmendment?.targetOperativeIndex
				},
				preferenceToMode(pref)
			);
			if (!result) return;
			await client.mutate.updateAmendmentReviewItem({
				__args: {
					reviewItemId: result.id,
					aiObsolete: result.obsolete,
					aiObsoleteReason: null
				}
			});
		} catch (err) {
			console.error('[AI] Obsolescence classification failed:', err);
		} finally {
			if (currentlyProcessingId === item.id) currentlyProcessingId = null;
		}
	}

	async function processRewrite(item: ReviewItem, trig: NonNullable<typeof trigger>) {
		const pref = getAiPreference();
		if (pref === 'off') return;
		currentlyProcessingId = item.id;
		try {
			const suggestion = await evaluateAndSuggestRewrite(
				{
					id: trig.id,
					documentNumber: trig.documentNumber,
					newContent: trig.newContent,
					targetOperativeIndex: trig.targetOperativeIndex,
					oldContent: item.triggerAmendment?.oldContent
				},
				{
					id: item.id,
					documentNumber: item.subjectAmendment?.documentNumber,
					newContent: item.subjectAmendment?.newContent,
					targetOperativeIndex: item.subjectAmendment?.targetOperativeIndex
				},
				preferenceToMode(pref)
			);
			await client.mutate.updateAmendmentReviewItem({
				__args: {
					reviewItemId: item.id,
					aiRewriteSuggestion: suggestion,
					aiRewriteReason: null
				}
			});
		} catch (err) {
			console.error('[AI] Rewrite evaluation failed:', err);
		} finally {
			if (currentlyProcessingId === item.id) currentlyProcessingId = null;
		}
	}

	async function rerunObsolescence(itemId: string) {
		if (!trigger) return;
		aiStartedObs.delete(itemId);
		currentlyProcessingId = itemId;
		await client.mutate.updateAmendmentReviewItem({
			__args: { reviewItemId: itemId, aiObsolete: null, aiObsoleteReason: null }
		});
		// subscription delivers null → $effect re-queues automatically
	}

	async function rerunRewrite(itemId: string) {
		if (!trigger) return;
		aiStartedRew.delete(itemId);
		currentlyProcessingId = itemId;
		await client.mutate.updateAmendmentReviewItem({
			__args: { reviewItemId: itemId, aiRewriteSuggestion: null, aiRewriteReason: null }
		});
		// subscription delivers null → $effect re-queues automatically
	}

	function opClauseRef(idx: number | null | undefined) {
		return idx != null ? ` – Clause ${idx + 1}` : '';
	}

	function parseOldMarkup(raw: string | null | undefined): string | undefined {
		if (!raw) return undefined;
		try {
			return serializeClause(JSON.parse(raw));
		} catch {
			return undefined;
		}
	}

	// Old clause text from any review item (all share the same trigger clause snapshot).
	const triggerOldMarkup = $derived(parseOldMarkup(items[0]?.triggerAmendment?.oldContent));
</script>

<div class="modal modal-open">
	<div class="modal-box flex max-w-2xl flex-col gap-5">
		<!-- Header -->
		<div class="flex items-center justify-between gap-4">
			<h3 class="text-base font-bold">
				Review after accepting
				{trigger?.documentNumber ?? 'amendment'}
			</h3>
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

		<!-- Step progress (non-interactive) -->
		<ul class="steps w-full text-xs">
			<li class="step step-primary">Deletions</li>
			<li class="step" class:step-primary={currentStep >= 2}>Text adjustments</li>
		</ul>

		<!-- Diff view — no wrapper boxes; OperativeParagraphPreview supplies its own card -->
		{#if trigger && (triggerOldMarkup || trigger.newContent)}
			<div class="flex flex-col gap-3">
				<div class="flex items-center gap-2 text-xs text-base-content/50">
					{#if trigger.type === 'ALTER_TEXT'}
						<i class="fas fa-pen opacity-60"></i>
					{/if}
					{#if trigger.documentNumber}
						<span class="font-mono font-semibold">{trigger.documentNumber}</span>
					{/if}
					{#if trigger.targetOperativeIndex != null}
						<span>· Clause {trigger.targetOperativeIndex + 1}</span>
					{/if}
					{#if trigger.proposer?.representation}
						<span class="ml-auto flex items-center gap-1">
							<Flag representation={trigger.proposer.representation} size="xs" />
							{getTranslatedCountryNameFromAlpha3Code(trigger.proposer.representation.alpha3Code) ??
								trigger.proposer.representation.name}
						</span>
					{/if}
				</div>
				{#if triggerOldMarkup}
					<div>
						<p class="text-base-content/40 mb-1 text-xs uppercase tracking-wide">Before</p>
						<div class="rounded-lg bg-white p-3">
							<OperativeParagraphPreview
								markup={triggerOldMarkup}
								operativeNumber={(trigger.targetOperativeIndex ?? 0) + 1}
								labels={englishLabels}
							/>
						</div>
					</div>
				{/if}
				{#if trigger.newContent}
					<div>
						<p class="text-base-content/40 mb-1 text-xs uppercase tracking-wide">
							{triggerOldMarkup ? 'After' : 'New text'}
						</p>
						<div class="rounded-lg bg-white p-3">
							<OperativeParagraphPreview
								markup={trigger.newContent}
								oldMarkup={triggerOldMarkup}
								showDiff={!!triggerOldMarkup}
								operativeNumber={(trigger.targetOperativeIndex ?? 0) + 1}
								labels={englishLabels}
							/>
						</div>
					</div>
				{/if}
			</div>
			<div class="border-base-300 border-t"></div>
		{/if}

		<!-- Step content -->
		{#if allResolved}
			<div class="py-6 text-center">
				<i class="fas fa-circle-check text-success text-2xl"></i>
				<p class="mt-2 font-semibold">All amendments reviewed</p>
				<button class="btn btn-primary mt-4 cursor-pointer" onclick={onclose}>Done</button>
			</div>
		{:else if currentStep === 1}
			{#if obsolescenceItems.length > 0}
				<ObsolescenceStep
					items={sameClauseObsolescence}
					laterItems={laterClauseObsolescence}
					{currentlyProcessingId}
					onadvance={() => {}}
					onrerunItem={rerunObsolescence}
				/>
			{/if}
		{:else}
			{#if rewriteItems.length > 0}
				<RewriteStep
					items={sameClauseRewrite}
					laterItems={laterClauseRewrite}
					{currentlyProcessingId}
					onrerunItem={rerunRewrite}
				/>
			{:else}
				<div class="flex flex-col items-center gap-2 py-8 text-center">
					<i class="fas fa-circle-check text-success text-2xl"></i>
					<p class="font-semibold">No text adjustments needed</p>
					<p class="text-base-content/50 max-w-xs text-sm">
						All surviving amendments were marked clean — nothing needs rewording.
					</p>
					<button class="btn btn-primary mt-2 cursor-pointer" onclick={onclose}>Done</button>
				</div>
			{/if}
		{/if}
	</div>
	<button class="modal-backdrop cursor-pointer" aria-label="Close review" onclick={onclose}
	></button>
</div>
