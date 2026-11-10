<script lang="ts">
	import { client } from '#lib/api/rumbleClient/client';
	import { SvelteSet } from 'svelte/reactivity';
	import { classifyObsolescence, evaluateAndSuggestRewrite } from '#lib/ai/amendments';
	import { getAiPreference, preferenceToMode } from '#lib/ai/aiPreference.svelte';
	import AiSpinner from '#lib/components/AiSpinner.svelte';
	import ObsolescenceStep from './ObsolescenceStep.svelte';
	import RewriteStep from './RewriteStep.svelte';
	import ReviewTriggerSummary from './ReviewTriggerSummary.svelte';
	import {
		newAiTasks,
		parseOldMarkup,
		subjectInput,
		triggerInput,
		type AiTask,
		type ReviewAmendment,
		type ReviewItem
	} from './amendmentReview';

	interface Props {
		items: ReviewItem[];
		onclose: () => void;
	}

	let { items, onclose }: Props = $props();

	const trigger = $derived(items[0]?.triggerAmendment);

	const obsolescenceItems = $derived(items.filter((i) => i.phase === 'OBSOLESCENCE'));
	const rewriteItems = $derived(items.filter((i) => i.phase === 'REWRITE'));

	const allResolved = $derived(items.every((i) => i.phase === 'RESOLVED'));
	// Step 1 (Deletions) is active while any obsolescence items remain; then step 2 (Text adjustments).
	const currentStep = $derived(obsolescenceItems.length > 0 ? 1 : 2);

	// Separate sets per task type so an item processed for OBSOLESCENCE can still
	// be queued for REWRITE once it advances to that phase.
	const aiStartedObs = new SvelteSet<string>();
	const aiStartedRew = new SvelteSet<string>();
	let aiRunning = $state(false);
	let currentlyProcessingId = $state<string | null>(null);

	// Plain (non-reactive) FIFO queue — drained one task at a time.
	const aiQueue: AiTask[] = [];
	let draining = false;

	async function drainAiQueue(trig: ReviewAmendment) {
		if (draining) return;
		draining = true;
		aiRunning = true;
		for (let task = aiQueue.shift(); task; task = aiQueue.shift()) {
			if (task.type === 'obsolescence') await processObsolescence(task.item, trig);
			else await processRewrite(task.item, trig);
		}
		aiRunning = false;
		draining = false;
	}

	function markStarted(task: AiTask) {
		(task.type === 'obsolescence' ? aiStartedObs : aiStartedRew).add(task.item.id);
	}

	// Single effect watches item lists; new items are enqueued in display order.
	// aiStarted is a plain Set so mutations to it do not re-trigger this effect —
	// only changes to the item lists do.
	$effect(() => {
		if (!trigger) return;
		const newTasks = newAiTasks({
			obsolescenceItems,
			rewriteItems,
			startedObsolescence: aiStartedObs,
			startedRewrite: aiStartedRew
		});
		if (newTasks.length === 0) return;
		newTasks.forEach(markStarted);
		aiQueue.push(...newTasks);
		drainAiQueue(trigger);
	});

	function doneProcessing(itemId: string) {
		if (currentlyProcessingId === itemId) currentlyProcessingId = null;
	}

	async function processObsolescence(item: ReviewItem, trig: ReviewAmendment) {
		const pref = getAiPreference();
		if (pref === 'off') return;
		currentlyProcessingId = item.id;
		try {
			const result = await classifyObsolescence(
				triggerInput({ trigger: trig, item }),
				subjectInput({ item, withOldContent: true }),
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
			doneProcessing(item.id);
		}
	}

	async function processRewrite(item: ReviewItem, trig: ReviewAmendment) {
		const pref = getAiPreference();
		if (pref === 'off') return;
		currentlyProcessingId = item.id;
		try {
			const suggestion = await evaluateAndSuggestRewrite(
				triggerInput({ trigger: trig, item }),
				subjectInput({ item, withOldContent: false }),
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
			doneProcessing(item.id);
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
					<i aria-hidden="true" class="ph-fill ph-x"></i>
					Close
				</button>
			</div>
		</div>

		<!-- Step progress (non-interactive) -->
		<ul class="steps w-full text-xs">
			<li class="step step-primary">Obsolescence</li>
			<li class="step" class:step-primary={currentStep >= 2}>Text adjustments</li>
		</ul>

		{#if trigger && (triggerOldMarkup || trigger.newContent)}
			<ReviewTriggerSummary {trigger} oldMarkup={triggerOldMarkup} />
			<div class="border-base-300 border-t"></div>
		{/if}

		<!-- Step content -->
		{#if allResolved}
			<div class="py-6 text-center">
				<i aria-hidden="true" class="ph-fill ph-check-circle text-success text-2xl"></i>
				<p class="mt-2 font-semibold">All amendments reviewed</p>
				<button class="btn btn-primary mt-4 cursor-pointer" onclick={onclose}>Done</button>
			</div>
		{:else if currentStep === 1}
			{#if obsolescenceItems.length > 0}
				<ObsolescenceStep
					items={obsolescenceItems}
					{currentlyProcessingId}
					onadvance={() => {}}
					onrerunItem={rerunObsolescence}
				/>
			{/if}
		{:else}
			{#if rewriteItems.length > 0}
				<RewriteStep items={rewriteItems} {currentlyProcessingId} onrerunItem={rerunRewrite} />
			{:else}
				<div class="flex flex-col items-center gap-2 py-8 text-center">
					<i aria-hidden="true" class="ph-fill ph-check-circle text-success text-2xl"></i>
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
