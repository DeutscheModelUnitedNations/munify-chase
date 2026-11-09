<script lang="ts">
	import AiSpinner from '#lib/components/AiSpinner.svelte';
	import Flag from '#lib/components/Flag.svelte';
	import AiResultBadge from './AiResultBadge.svelte';
	import { representationName } from './sponsors';
	import { reviewTypeLabel, type ReviewItem } from './amendmentReview';

	interface Props {
		item: ReviewItem;
		/** The AI's verdict, null while there is none. */
		badge: { label: string; cls: string } | null;
		/** The AI queue is working on this item. */
		processing: boolean;
		onrerun: () => void;
	}

	let { item, badge, processing, onrerun }: Props = $props();

	const subject = $derived(item.subjectAmendment);
	const representation = $derived(subject?.proposer?.representation);
	const sponsorCount = $derived(subject?.sponsors?.length ?? 0);
</script>

<div class="flex items-center justify-between gap-2">
	<div class="flex items-center gap-2">
		<p class="font-mono text-sm font-semibold">
			{subject?.documentNumber ?? reviewTypeLabel(subject?.type)}
		</p>
		{#if badge}
			<AiResultBadge label={badge.label} cls={badge.cls} onclick={onrerun} />
		{:else if processing}
			<span class="badge badge-ghost badge-sm gap-1">
				<AiSpinner size="xs" />
				Analysing…
			</span>
		{/if}
	</div>
	<div class="flex items-center gap-2 text-xs text-base-content/60 shrink-0">
		{#if representation}
			<span class="flex items-center gap-1">
				<Flag {representation} size="xs" />
				{representationName(representation)}
			</span>
		{/if}
		{#if sponsorCount > 0}
			<span class="text-base-content/40">
				<i aria-hidden="true" class="ph-fill ph-users mr-0.5 text-[0.6rem]"></i>{sponsorCount}
			</span>
		{/if}
	</div>
</div>
