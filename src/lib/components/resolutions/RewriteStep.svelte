<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import AiSpinner from '$lib/components/AiSpinner.svelte';
	import AiIcon from '$lib/components/AiIcon.svelte';
	import AiResultBadge from './AiResultBadge.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import ThreeWayDiffPreview from './ThreeWayDiffPreview.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import {
		OperativeParagraphPreview,
		serializeClause
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';
	import { SvelteSet } from 'svelte/reactivity';

	interface ReviewItem {
		id: string;
		aiRewriteSuggestion: string | null | undefined;
		triggerAmendment: { newContent: string | null | undefined; oldContent: string | null | undefined } | null | undefined;
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
		/** Same-clause amendments — shown as a flat list. */
		items: ReviewItem[];
		/** Later-clause amendments — shown collapsed, auto-expanded on hit. */
		laterItems?: ReviewItem[];
		/** ID of the item the AI queue is currently working on. */
		currentlyProcessingId?: string | null;
		onrerunItem?: (itemId: string) => void;
	}

	let { items, laterItems = [], currentlyProcessingId = null, onrerunItem }: Props = $props();

	let busy = $state(false);
	let editMode = $state<Record<string, boolean>>({});
	let edits = $state<Record<string, string | undefined>>({});

	let laterExpandedOverride = $state<boolean | null>(null);
	const laterAiHasHit = $derived(
		laterItems.some((i) => i.aiRewriteSuggestion !== null && i.aiRewriteSuggestion !== undefined)
	);
	const laterExpanded = $derived(
		laterExpandedOverride !== null ? laterExpandedOverride : laterAiHasHit
	);
	const sortedLaterItems = $derived(
		[...laterItems].sort(
			(a, b) =>
				(a.subjectAmendment?.targetOperativeIndex ?? Infinity) -
				(b.subjectAmendment?.targetOperativeIndex ?? Infinity)
		)
	);

	async function keepOriginalForItem(item: ReviewItem) {
		busy = true;
		try {
			await client.mutate.updateAmendmentReviewItem({
				__args: { reviewItemId: item.id, phase: 'RESOLVED' }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Action failed');
		} finally {
			busy = false;
		}
	}

	async function acceptAiForItem(item: ReviewItem) {
		busy = true;
		try {
			await client.mutate.updateAmendmentReviewItem({
				__args: {
					reviewItemId: item.id,
					phase: 'RESOLVED',
					verdictRewrite: item.aiRewriteSuggestion ?? ''
				}
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Action failed');
		} finally {
			busy = false;
		}
	}

	async function confirmEditForItem(item: ReviewItem) {
		const content = edits[item.id] ?? item.subjectAmendment?.newContent ?? '';
		busy = true;
		try {
			await client.mutate.updateAmendmentReviewItem({
				__args: { reviewItemId: item.id, phase: 'RESOLVED', verdictRewrite: content }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Action failed');
		} finally {
			busy = false;
		}
	}

	async function commitAllLater() {
		busy = true;
		try {
			await Promise.all(
				laterItems.map((item) => {
					const suggestion = item.aiRewriteSuggestion;
					const hasSuggestion =
						suggestion !== null && suggestion !== undefined && suggestion !== '';
					return client.mutate.updateAmendmentReviewItem({
						__args: {
							reviewItemId: item.id,
							phase: 'RESOLVED',
							...(hasSuggestion ? { verdictRewrite: suggestion } : {})
						}
					});
				})
			);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Action failed');
		} finally {
			busy = false;
		}
	}

	function parseOldMarkup(triggerClauseOldContent: string | null | undefined): string | undefined {
		if (!triggerClauseOldContent) return undefined;
		try {
			return serializeClause(JSON.parse(triggerClauseOldContent));
		} catch {
			return undefined;
		}
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
	{#if items.length === 0 && laterItems.length === 0}
		<div class="text-base-content/50 py-4 text-center text-sm">
			<i class="fas fa-circle-check text-success mr-1"></i>
			All text adjustments reviewed
		</div>
	{/if}

	{#if items.length === 0 && laterItems.length > 0}
		<div class="flex flex-col items-center gap-2 py-6 text-center">
			<i class="fas fa-layer-group text-base-content/30 text-2xl"></i>
			<p class="font-semibold">No amendments for this clause</p>
			<p class="text-base-content/50 max-w-xs text-sm">
				The accepted change targets this clause, but there are no other amendments here to adjust.
				Check the later clauses section below.
			</p>
		</div>
	{/if}

	{#if items.length > 0}
		<div class="flex flex-col gap-3">
			{#each items as item (item.id)}
				{@const originalContent = item.subjectAmendment?.newContent ?? ''}
				{@const aiEvaluated =
					item.aiRewriteSuggestion !== null && item.aiRewriteSuggestion !== undefined}
				{@const aiSuggestion = item.aiRewriteSuggestion ?? ''}
				{@const isEditing = editMode[item.id] ?? false}
				{@const oldMarkup = parseOldMarkup(item.triggerAmendment?.oldContent)}

				<div class="flex flex-col gap-2 py-2">
					<div class="flex items-center justify-between gap-2">
						<div class="flex items-center gap-2">
							<p class="font-mono text-sm font-semibold">
								{item.subjectAmendment?.documentNumber ?? typeLabel(item.subjectAmendment?.type)}
							</p>
							{#if aiEvaluated}
								<AiResultBadge
									label="Adjustment suggested"
									cls="badge-warning"
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

					<div>
						<p class="text-base-content/50 mb-1 text-xs uppercase tracking-wide">
							Proposed text
						</p>
						<div class="rounded-lg bg-white p-3">
							<OperativeParagraphPreview
								markup={originalContent}
								{oldMarkup}
								showDiff={!!oldMarkup}
								operativeNumber={(item.subjectAmendment?.targetOperativeIndex ?? 0) + 1}
								labels={englishLabels}
							/>
						</div>
					</div>

					{#if aiEvaluated && !isEditing}
						<div>
							<p
								class="text-base-content/50 mb-1 flex items-center gap-1 text-xs uppercase tracking-wide"
							>
								<AiIcon />
								<i class="fas fa-wand-magic-sparkles text-primary"></i>
								AI revision
							</p>
							<div class="rounded-lg bg-white p-3 flex flex-col gap-2">
								{#if item.triggerAmendment?.newContent && oldMarkup}
									<ThreeWayDiffPreview
										originalMarkup={oldMarkup}
										triggerMarkup={item.triggerAmendment.newContent}
										aiMarkup={aiSuggestion}
										operativeNumber={(item.subjectAmendment?.targetOperativeIndex ?? 0) + 1}
									/>
									<div class="flex items-center gap-3 text-xs text-gray-400 pt-1 border-t border-gray-100">
										<span class="flex items-center gap-1">
											<span class="bg-warning/40 inline-block size-2 rounded-sm"></span>
											Accepted amendment
										</span>
										<span class="flex items-center gap-1">
											<span class="bg-success/60 inline-block size-2 rounded-sm"></span>
											AI adjustment
										</span>
									</div>
								{:else}
									<OperativeParagraphPreview
										markup={aiSuggestion}
										oldMarkup={item.triggerAmendment?.newContent ?? originalContent}
										showDiff={true}
										operativeNumber={(item.subjectAmendment?.targetOperativeIndex ?? 0) + 1}
										labels={englishLabels}
									/>
								{/if}
							</div>
						</div>
					{/if}

					{#if isEditing}
						{@const currentEditValue = (edits[item.id] ?? aiSuggestion) || originalContent}
						<textarea
							class="textarea textarea-bordered w-full font-mono text-xs"
							rows="3"
							value={currentEditValue}
							oninput={(e) => {
								edits[item.id] = (e.currentTarget as HTMLTextAreaElement).value;
							}}
						></textarea>
						<div>
							<p class="text-base-content/50 mb-1 text-xs uppercase tracking-wide">Preview</p>
							<div class="rounded-lg bg-white p-3">
								<OperativeParagraphPreview
									markup={currentEditValue}
									oldMarkup={originalContent}
									showDiff={true}
									operativeNumber={(item.subjectAmendment?.targetOperativeIndex ?? 0) + 1}
									labels={englishLabels}
								/>
							</div>
						</div>
						<div class="flex items-center justify-end gap-2">
							<button
								class="btn btn-ghost btn-sm cursor-pointer"
								disabled={busy}
								onclick={() => {
									editMode[item.id] = false;
								}}
							>
								Cancel
							</button>
							<button
								class="btn btn-primary btn-sm cursor-pointer"
								disabled={busy}
								onclick={() => confirmEditForItem(item)}
							>
								{#if busy}<AiSpinner size="xs" />{/if}
								Commit
							</button>
						</div>
					{:else}
						<div class="flex flex-wrap items-center justify-end gap-2">
							<button
								class="btn btn-ghost btn-sm cursor-pointer"
								disabled={busy || !aiEvaluated}
								onclick={() => {
									if (!edits[item.id]) edits[item.id] = aiSuggestion || originalContent;
									editMode[item.id] = true;
								}}
								title="Edit manually"
							>
								<i class="fas fa-pen text-xs"></i>
							</button>
							{#if aiEvaluated}
								<button
									class="btn btn-ghost btn-sm cursor-pointer"
									disabled={busy}
									onclick={() => keepOriginalForItem(item)}
								>
									Keep original
								</button>
								<button
									class="btn btn-primary btn-sm cursor-pointer"
									disabled={busy}
									onclick={() => acceptAiForItem(item)}
								>
									{#if busy}<AiSpinner size="xs" />{/if}
									<i class="fas fa-wand-magic-sparkles"></i>
									Accept AI
								</button>
							{:else if aiEvaluated}
								<button
									class="btn btn-success btn-sm cursor-pointer"
									disabled={busy}
									onclick={() => keepOriginalForItem(item)}
								>
									{#if busy}<AiSpinner size="xs" />{/if}
									<i class="fas fa-check"></i>
									Confirm
								</button>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<!-- Later-clause amendments -->
	{#if laterItems.length > 0}
		<div class="border-base-300 rounded-lg border">
			<div class="flex w-full items-center justify-between px-3 py-2.5 text-sm">
				<button
					class="flex flex-1 cursor-pointer items-center gap-2 text-left font-medium"
					onclick={() => (laterExpandedOverride = !laterExpanded)}
				>
					<i class="fas fa-chevron-{laterExpanded ? 'down' : 'right'} text-xs opacity-60"></i>
					Later clauses ({laterItems.length})
					{#if laterItems.some((i) => i.aiRewriteSuggestion !== null && i.aiRewriteSuggestion !== undefined)}
						<span class="badge badge-warning badge-sm"><AiIcon />needs review</span>
					{:else if laterItems.some((i) => i.id === currentlyProcessingId)}
						<AiSpinner size="xs" />
					{/if}
				</button>
				<button class="btn btn-xs btn-success" disabled={busy} onclick={commitAllLater}>
					Confirm all
				</button>
			</div>

			{#if laterExpanded}
				<div class="border-base-300 flex flex-col gap-3 border-t p-3">
					{#each sortedLaterItems as item (item.id)}
						{@const clauseIdx = item.subjectAmendment?.targetOperativeIndex}
						{@const laterOriginal = item.subjectAmendment?.newContent ?? ''}
						{@const laterAiEvaluated =
							item.aiRewriteSuggestion !== null && item.aiRewriteSuggestion !== undefined}
						{@const laterSuggestion = item.aiRewriteSuggestion ?? ''}
						{@const isEditing = editMode[item.id] ?? false}
						{@const laterOldMarkup = parseOldMarkup(item.triggerAmendment?.oldContent)}

						<div class="flex flex-col gap-2 py-2">
							<div class="flex items-center justify-between gap-2">
								<div class="flex items-center gap-2">
									<p class="font-mono text-sm font-semibold">
										{item.subjectAmendment?.documentNumber ??
											typeLabel(item.subjectAmendment?.type)}
									</p>
									{#if clauseIdx != null}
										<span class="badge badge-outline badge-sm">Clause {clauseIdx + 1}</span>
									{/if}
									{#if laterAiEvaluated}
										<AiResultBadge
											label="Adjustment suggested"
											cls="badge-warning"
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
											<Flag
												representation={item.subjectAmendment.proposer.representation}
												size="xs"
											/>
											{getTranslatedCountryNameFromAlpha3Code(
												item.subjectAmendment.proposer.representation.alpha3Code
											) ?? item.subjectAmendment.proposer.representation.name}
										</span>
									{/if}
									{#if (item.subjectAmendment?.sponsors?.length ?? 0) > 0}
										<span class="text-base-content/40">
											<i class="fas fa-users mr-0.5 text-[0.6rem]"></i>{item.subjectAmendment
												?.sponsors?.length}
										</span>
									{/if}
								</div>
							</div>

							<div>
								<p class="text-base-content/50 mb-1 text-xs uppercase tracking-wide">
									Proposed text
								</p>
								<div class="rounded-lg bg-white p-3">
									<OperativeParagraphPreview
										markup={laterOriginal}
										oldMarkup={laterOldMarkup}
										showDiff={!!laterOldMarkup}
										operativeNumber={(clauseIdx ?? 0) + 1}
										labels={englishLabels}
									/>
								</div>
							</div>

							{#if laterAiEvaluated && !isEditing}
								<div>
									<p
										class="text-base-content/50 mb-1 flex items-center gap-1 text-xs uppercase tracking-wide"
									>
										<AiIcon />
										<i class="fas fa-wand-magic-sparkles text-primary"></i>
										AI revision
									</p>
									<div class="rounded-lg bg-white p-3 flex flex-col gap-2">
										{#if item.triggerAmendment?.newContent && laterOldMarkup}
											<ThreeWayDiffPreview
												originalMarkup={laterOldMarkup}
												triggerMarkup={item.triggerAmendment.newContent}
												aiMarkup={laterSuggestion}
												operativeNumber={(clauseIdx ?? 0) + 1}
											/>
											<div class="flex items-center gap-3 text-xs text-gray-400 pt-1 border-t border-gray-100">
												<span class="flex items-center gap-1">
													<span class="bg-warning/40 inline-block size-2 rounded-sm"></span>
													Accepted amendment
												</span>
												<span class="flex items-center gap-1">
													<span class="bg-success/60 inline-block size-2 rounded-sm"></span>
													AI adjustment
												</span>
											</div>
										{:else}
											<OperativeParagraphPreview
												markup={laterSuggestion}
												oldMarkup={item.triggerAmendment?.newContent ?? laterOriginal}
												showDiff={true}
												operativeNumber={(clauseIdx ?? 0) + 1}
												labels={englishLabels}
											/>
										{/if}
									</div>
								</div>
							{/if}

							{#if isEditing}
								{@const currentEditValue = (edits[item.id] ?? laterSuggestion) || laterOriginal}
								<textarea
									class="textarea textarea-bordered w-full font-mono text-xs"
									rows="3"
									value={currentEditValue}
									oninput={(e) => {
										edits[item.id] = (e.currentTarget as HTMLTextAreaElement).value;
									}}
								></textarea>
								<div>
									<p class="text-base-content/50 mb-1 text-xs uppercase tracking-wide">Preview</p>
									<div class="rounded-lg bg-white p-3">
										<OperativeParagraphPreview
											markup={currentEditValue}
											oldMarkup={laterOriginal}
											showDiff={true}
											operativeNumber={(clauseIdx ?? 0) + 1}
											labels={englishLabels}
										/>
									</div>
								</div>
								<div class="flex items-center justify-end gap-2">
									<button
										class="btn btn-ghost btn-sm cursor-pointer"
										disabled={busy}
										onclick={() => {
											editMode[item.id] = false;
										}}
									>
										Cancel
									</button>
									<button
										class="btn btn-primary btn-sm cursor-pointer"
										disabled={busy}
										onclick={() => confirmEditForItem(item)}
									>
										{#if busy}<AiSpinner size="xs" />{/if}
										Commit
									</button>
								</div>
							{:else}
								<div class="flex flex-wrap items-center justify-end gap-2">
									<button
										class="btn btn-ghost btn-sm cursor-pointer"
										disabled={busy || !laterAiEvaluated}
										onclick={() => {
											if (!edits[item.id]) edits[item.id] = laterSuggestion || laterOriginal;
											editMode[item.id] = true;
										}}
										title="Edit manually"
									>
										<i class="fas fa-pen text-xs"></i>
									</button>
									{#if laterAiEvaluated}
										<button
											class="btn btn-ghost btn-sm cursor-pointer"
											disabled={busy}
											onclick={() => keepOriginalForItem(item)}
										>
											Keep original
										</button>
										<button
											class="btn btn-primary btn-sm cursor-pointer"
											disabled={busy}
											onclick={() => acceptAiForItem(item)}
										>
											{#if busy}<AiSpinner size="xs" />{/if}
											<i class="fas fa-wand-magic-sparkles"></i>
											Accept AI
										</button>
									{:else if laterAiEvaluated}
										<button
											class="btn btn-success btn-sm cursor-pointer"
											disabled={busy}
											onclick={() => keepOriginalForItem(item)}
										>
											{#if busy}<AiSpinner size="xs" />{/if}
											<i class="fas fa-check"></i>
											Confirm
										</button>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
