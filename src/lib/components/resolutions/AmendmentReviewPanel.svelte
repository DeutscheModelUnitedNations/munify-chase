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

	const obsolescenceItems = $derived(items.filter((i) => i.phase === 'OBSOLESCENCE'));
	const rewriteItems = $derived(items.filter((i) => i.phase === 'REWRITE'));

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

	// Single effect watches item lists; new items are enqueued in display order.
	// aiStarted is a plain Set so mutations to it do not re-trigger this effect —
	// only changes to the item lists do.
	$effect(() => {
		if (!trigger) return;
		const trig = trigger;

		const newObs = obsolescenceItems.filter((i) => i.aiObsolete == null && !aiStartedObs.has(i.id));
		const newRew = rewriteItems.filter(
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

		aiQueue.push(...newTasks);
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
				{#if trigger.newContent}
					<div>
						<p class="text-base-content/40 mb-1 text-xs uppercase tracking-wide">
							{triggerOldMarkup ? 'Accepted change' : 'New text'}
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
