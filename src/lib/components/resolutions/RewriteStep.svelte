<script lang="ts">
	import { client } from '#lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import RewriteItem from './RewriteItem.svelte';
	import type { ReviewItem } from './amendmentReview';
	import { errorMessage } from './sponsors';

	interface Props {
		items: ReviewItem[];
		/** ID of the item the AI queue is currently working on. */
		currentlyProcessingId?: string | null;
		onrerunItem?: (itemId: string) => void;
	}

	let { items, currentlyProcessingId = null, onrerunItem }: Props = $props();

	let busy = $state(false);

	/** Resolves an item, keeping the proposed text unless `verdictRewrite` replaces it. */
	async function resolve(item: ReviewItem, verdictRewrite?: string) {
		busy = true;
		try {
			await client.mutate.updateAmendmentReviewItem({
				__args: {
					reviewItemId: item.id,
					phase: 'RESOLVED',
					...(verdictRewrite === undefined ? {} : { verdictRewrite })
				}
			});
		} catch (err) {
			toast.error(errorMessage(err, 'Action failed'));
		} finally {
			busy = false;
		}
	}
</script>

<div class="flex flex-col gap-4">
	{#if items.length === 0}
		<div class="text-base-content/50 py-4 text-center text-sm">
			<i aria-hidden="true" class="ph-fill ph-check-circle text-success mr-1"></i>
			All text adjustments reviewed
		</div>
	{:else}
		<div class="flex flex-col gap-3">
			{#each items as item (item.id)}
				<RewriteItem
					{item}
					{busy}
					processing={currentlyProcessingId === item.id}
					onrerun={() => onrerunItem?.(item.id)}
					onresolve={(verdictRewrite) => resolve(item, verdictRewrite)}
				/>
			{/each}
		</div>
	{/if}
</div>
