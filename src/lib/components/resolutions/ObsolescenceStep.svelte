<script lang="ts">
	import { errorMessage } from '#lib/helpers/errorMessage';
	import { client } from '#lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import AiSpinner from '#lib/components/AiSpinner.svelte';
	import { OperativeParagraphPreview } from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';
	import ReviewItemHeader from './ReviewItemHeader.svelte';
	import { obsoleteBadge, type ReviewItem } from './amendmentReview';

	interface Props {
		items: ReviewItem[];
		/** ID of the item the AI queue is currently working on. */
		currentlyProcessingId?: string | null;
		onadvance: () => void;
		onrerunItem?: (itemId: string) => void;
	}

	let { items, currentlyProcessingId = null, onadvance, onrerunItem }: Props = $props();

	// Chair's explicit checkbox overrides. Undefined = fall back to AI recommendation.
	let userDecisions = $state<Record<string, boolean>>({});

	// Merge AI recommendations with explicit overrides.
	const decisions = $derived.by(() =>
		Object.fromEntries(
			items.map((item) => [
				item.id,
				item.id in userDecisions ? userDecisions[item.id] : (item.aiObsolete ?? false)
			])
		)
	);

	let busy = $state(false);

	async function confirm() {
		busy = true;
		try {
			await Promise.all(
				items.map((item) =>
					client.mutate.updateAmendmentReviewItem({
						__args: {
							reviewItemId: item.id,
							phase: decisions[item.id] ? 'RESOLVED' : 'REWRITE',
							verdictObsolete: decisions[item.id] ?? false
						}
					})
				)
			);
			onadvance();
		} catch (err) {
			toast.error(errorMessage(err, 'Action failed'));
		} finally {
			busy = false;
		}
	}
</script>

<div class="flex flex-col gap-4">
	<div>
		<p class="text-base-content/70 text-sm">
			Which of the following amendments are now obsolete because of this change?
		</p>
	</div>

	<!-- Same-clause (or clause-unknown) amendments -->
	{#if items.length > 0}
		<div class="flex flex-col gap-3">
			{#each items as item (item.id)}
				{@const oldMarkup = item.triggerAmendment?.newContent ?? undefined}
				<div
					class="flex flex-col gap-2 rounded-lg px-2 py-2 {decisions[item.id]
						? 'bg-error/40 ring-2 ring-error/60'
						: ''}"
				>
					<ReviewItemHeader
						{item}
						badge={obsoleteBadge(item.aiObsolete)}
						processing={currentlyProcessingId === item.id}
						onrerun={() => onrerunItem?.(item.id)}
					/>

					{#if item.subjectAmendment?.newContent}
						<div>
							<p class="text-base-content/50 mb-1 text-xs uppercase tracking-wide">Proposed text</p>
							<div class="rounded-lg bg-white p-3">
								<OperativeParagraphPreview
									markup={item.subjectAmendment.newContent}
									{oldMarkup}
									showDiff={!!oldMarkup}
									operativeNumber={(item.subjectAmendment?.targetOperativeIndex ?? 0) + 1}
									labels={englishLabels}
								/>
							</div>
						</div>
					{/if}

					<label class="flex cursor-pointer items-center gap-2 pt-1">
						<input
							type="checkbox"
							class="checkbox checkbox-error checkbox-sm"
							checked={decisions[item.id]}
							onchange={(e) => {
								userDecisions[item.id] = e.currentTarget.checked;
							}}
							disabled={busy}
						/>
						<span class="text-sm">Mark as obsolete</span>
					</label>
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-base-content/40 py-2 text-center text-sm">No amendments to check.</p>
	{/if}

	<div class="flex justify-end gap-2 pt-2">
		<button class="btn btn-primary" disabled={busy} onclick={confirm}>
			{#if busy}
				<AiSpinner size="sm" />
			{/if}
			Commit
		</button>
	</div>
</div>
