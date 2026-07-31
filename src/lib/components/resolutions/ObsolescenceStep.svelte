<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import AiSpinner from '$lib/components/AiSpinner.svelte';
	import AiResultBadge from './AiResultBadge.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { OperativeParagraphPreview } from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';

	interface ReviewItem {
		id: string;
		aiObsolete: boolean | null | undefined;
		triggerAmendment: { newContent: string | null | undefined } | null | undefined;
		subjectAmendment:
			| {
					documentNumber: string | null | undefined;
					type: string | null | undefined;
					status: string | null | undefined;
					newContent: string | null | undefined;
					targetOperativeIndex: number | null | undefined;
					proposer:
						| {
								representation:
									| {
											name: string | null | undefined;
											alpha2Code: string | null | undefined;
											alpha3Code: string | null | undefined;
											faIcon: string | null | undefined;
											type: string | null | undefined;
									  }
									| null
									| undefined;
						  }
						| null
						| undefined;
					sponsors: Array<{ id: string }> | null | undefined;
			  }
			| null
			| undefined;
	}

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
			toast.error(err instanceof Error ? err.message : 'Action failed');
		} finally {
			busy = false;
		}
	}

	function obsoleteBadge(obsolete: boolean | null | undefined) {
		if (obsolete == null) return null;
		if (obsolete) return { label: 'Possibly obsolete', cls: 'badge-warning' };
		return { label: 'No issue', cls: 'badge-success' };
	}

	function typeLabel(type: string | null | undefined) {
		if (type === 'ALTER_TEXT') return 'Alter text';
		if (type === 'DELETE') return 'Delete';
		if (type === 'ADD') return 'Add';
		if (type === 'ALTER_POSITION') return 'Move';
		return type ?? '';
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
				{@const badge = obsoleteBadge(item.aiObsolete)}
				{@const oldMarkup = item.triggerAmendment?.newContent ?? undefined}
				<div
					class="flex flex-col gap-2 rounded-lg px-2 py-2 {decisions[item.id]
						? 'bg-error/40 ring-2 ring-error/60'
						: ''}"
				>
					<div class="flex items-center justify-between gap-2">
						<div class="flex items-center gap-2">
							<p class="font-mono text-sm font-semibold">
								{item.subjectAmendment?.documentNumber ?? typeLabel(item.subjectAmendment?.type)}
							</p>
							{#if badge}
								<AiResultBadge
									label={badge.label}
									cls={badge.cls}
									onclick={() => onrerunItem?.(item.id)}
								/>
							{:else if currentlyProcessingId === item.id}
								<span class="badge badge-ghost badge-sm gap-1">
									<AiSpinner size="xs" />
									Analysing…
								</span>
							{/if}
						</div>
						<div class="flex items-center gap-2 text-xs text-base-content/60 shrink-0">
							{#if item.subjectAmendment?.proposer?.representation}
								<span class="flex items-center gap-1">
									<Flag representation={item.subjectAmendment.proposer.representation} size="xs" />
									{getTranslatedCountryNameFromAlpha3Code(
										item.subjectAmendment.proposer.representation.alpha3Code
									) ?? item.subjectAmendment.proposer.representation.name}
								</span>
							{/if}
							{#if (item.subjectAmendment?.sponsors?.length ?? 0) > 0}
								<span class="text-base-content/40">
									<i class="fas fa-users mr-0.5 text-[0.6rem]"></i>{item.subjectAmendment?.sponsors
										?.length}
								</span>
							{/if}
						</div>
					</div>

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
