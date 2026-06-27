<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import AiSpinner from '$lib/components/AiSpinner.svelte';
	import AiIcon from '$lib/components/AiIcon.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';

	interface ReviewItem {
		id: string;
		aiRewriteSuggestion: string | null | undefined;
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
	}

	let { items, laterItems = [] }: Props = $props();

	let busy = $state(false);
	let editMode = $state<Record<string, boolean>>({});
	let edits = $state<Record<string, string | undefined>>({});

	let laterExpandedOverride = $state<boolean | null>(null);
	const laterAiHasHit = $derived(
		laterItems.some(
			(i) =>
				i.aiRewriteSuggestion !== null &&
				i.aiRewriteSuggestion !== undefined &&
				i.aiRewriteSuggestion !== ''
		)
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
			await client.mutate.skipReviewItem({ __args: { reviewItemId: item.id } });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Action failed');
		} finally {
			busy = false;
		}
	}

	async function acceptAiForItem(item: ReviewItem) {
		busy = true;
		try {
			await client.mutate.resolveRewrite({
				__args: {
					reviewItemId: item.id,
					newContent: item.aiRewriteSuggestion ?? '',
					aiSuggestionApplied: true
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
			await client.mutate.resolveRewrite({
				__args: { reviewItemId: item.id, newContent: content, aiSuggestionApplied: false }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Action failed');
		} finally {
			busy = false;
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
				{@const aiNeedsRewrite = aiEvaluated && item.aiRewriteSuggestion !== ''}
				{@const aiSuggestion = aiNeedsRewrite ? (item.aiRewriteSuggestion ?? '') : ''}
				{@const isEditing = editMode[item.id] ?? false}

				<div class="bg-base-200 flex flex-col gap-2 rounded-lg p-3">
					<div class="flex items-center justify-between gap-2">
						<p class="font-mono text-sm font-semibold">
							{item.subjectAmendment?.documentNumber ?? typeLabel(item.subjectAmendment?.type)}
						</p>
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
						<p class="text-base-content/50 mb-1 text-xs uppercase tracking-wide">Current text</p>
						<p class="bg-base-100 rounded p-2 font-mono text-xs whitespace-pre-wrap">
							{originalContent}
						</p>
					</div>

					{#if !aiEvaluated}
						<div class="flex items-center gap-2 text-xs opacity-60">
							<AiSpinner size="xs" />
							Evaluating…
						</div>
					{:else if aiNeedsRewrite && !isEditing}
						<div>
							<p
								class="text-base-content/50 mb-1 flex items-center gap-1 text-xs uppercase tracking-wide"
							>
								<AiIcon />
								<i class="fas fa-wand-magic-sparkles text-primary"></i>
								AI suggestion
							</p>
							<p
								class="bg-primary/10 border-primary/20 rounded border p-2 font-mono text-xs whitespace-pre-wrap"
							>
								{aiSuggestion}
							</p>
						</div>
					{/if}

					{#if isEditing}
						<textarea
							class="textarea textarea-bordered w-full font-mono text-xs"
							rows="3"
							value={(edits[item.id] ?? aiSuggestion) || originalContent}
							oninput={(e) => {
								edits[item.id] = (e.currentTarget as HTMLTextAreaElement).value;
							}}
						></textarea>
					{/if}

					<div class="flex flex-wrap items-center justify-end gap-2">
						<!-- Pen toggle -->
						<button
							class="btn btn-ghost btn-sm cursor-pointer"
							class:btn-active={isEditing}
							disabled={busy || !aiEvaluated}
							onclick={() => {
								if (isEditing) {
									editMode[item.id] = false;
								} else {
									if (!edits[item.id]) edits[item.id] = aiSuggestion || originalContent;
									editMode[item.id] = true;
								}
							}}
							title={isEditing ? 'Close editor' : 'Edit manually'}
						>
							<i class="fas fa-pen text-xs"></i>
						</button>

						{#if isEditing}
							<button
								class="btn btn-primary btn-sm cursor-pointer"
								disabled={busy}
								onclick={() => confirmEditForItem(item)}
							>
								{#if busy}<AiSpinner size="xs" />{/if}
								Save
							</button>
						{:else if aiNeedsRewrite}
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
				</div>
			{/each}
		</div>
	{/if}

	<!-- Later-clause amendments -->
	{#if laterItems.length > 0}
		<div class="border-base-300 rounded-lg border">
			<button
				class="flex w-full cursor-pointer items-center justify-between px-3 py-2.5 text-sm"
				onclick={() => (laterExpandedOverride = !laterExpanded)}
			>
				<span class="flex items-center gap-2 font-medium">
					<i class="fas fa-chevron-{laterExpanded ? 'down' : 'right'} text-xs opacity-60"></i>
					Later clauses ({laterItems.length})
					{#if laterItems.some((i) => i.aiRewriteSuggestion !== null && i.aiRewriteSuggestion !== undefined && i.aiRewriteSuggestion !== '')}
						<span class="badge badge-warning badge-sm"><AiIcon />needs review</span>
					{:else if laterItems.every((i) => i.aiRewriteSuggestion !== null && i.aiRewriteSuggestion !== undefined)}
						<span class="badge badge-success badge-sm"><AiIcon />all fine</span>
					{/if}
				</span>
				<span class="text-base-content/40 text-xs">unlikely to be affected</span>
			</button>

			{#if laterExpanded}
				<div class="border-base-300 flex flex-col gap-3 border-t p-3">
					{#each sortedLaterItems as item (item.id)}
						{@const clauseIdx = item.subjectAmendment?.targetOperativeIndex}
						{@const laterOriginal = item.subjectAmendment?.newContent ?? ''}
						{@const laterAiEvaluated =
							item.aiRewriteSuggestion !== null && item.aiRewriteSuggestion !== undefined}
						{@const laterNeedsRewrite = laterAiEvaluated && item.aiRewriteSuggestion !== ''}
						{@const laterSuggestion = laterNeedsRewrite ? (item.aiRewriteSuggestion ?? '') : ''}
						{@const isEditing = editMode[item.id] ?? false}

						<div class="bg-base-100 border-base-300 flex flex-col gap-2 rounded-lg border p-3">
							<div class="flex items-center justify-between gap-2">
								<div class="flex items-center gap-2">
									<p class="font-mono text-sm font-semibold">
										{item.subjectAmendment?.documentNumber ??
											typeLabel(item.subjectAmendment?.type)}
									</p>
									{#if clauseIdx != null}
										<span class="badge badge-outline badge-sm">Clause {clauseIdx + 1}</span>
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
									Current text
								</p>
								<p class="bg-base-200 rounded p-2 font-mono text-xs whitespace-pre-wrap">
									{laterOriginal}
								</p>
							</div>

							{#if !laterAiEvaluated}
								<div class="flex items-center gap-2 text-xs opacity-60">
									<AiSpinner size="xs" />
									Evaluating…
								</div>
							{:else if laterNeedsRewrite && !isEditing}
								<div>
									<p
										class="text-base-content/50 mb-1 flex items-center gap-1 text-xs uppercase tracking-wide"
									>
										<i class="fas fa-wand-magic-sparkles text-primary"></i>
										AI suggestion
									</p>
									<p
										class="bg-primary/10 border-primary/20 rounded border p-2 font-mono text-xs whitespace-pre-wrap"
									>
										{laterSuggestion}
									</p>
								</div>
							{/if}

							{#if isEditing}
								<textarea
									class="textarea textarea-bordered w-full font-mono text-xs"
									rows="3"
									value={(edits[item.id] ?? laterSuggestion) || laterOriginal}
									oninput={(e) => {
										edits[item.id] = (e.currentTarget as HTMLTextAreaElement).value;
									}}
								></textarea>
							{/if}

							<div class="flex flex-wrap items-center justify-end gap-2">
								<button
									class="btn btn-ghost btn-sm cursor-pointer"
									class:btn-active={isEditing}
									disabled={busy || !laterAiEvaluated}
									onclick={() => {
										if (isEditing) {
											editMode[item.id] = false;
										} else {
											if (!edits[item.id]) edits[item.id] = laterSuggestion || laterOriginal;
											editMode[item.id] = true;
										}
									}}
									title={isEditing ? 'Close editor' : 'Edit manually'}
								>
									<i class="fas fa-pen text-xs"></i>
								</button>

								{#if isEditing}
									<button
										class="btn btn-primary btn-sm cursor-pointer"
										disabled={busy}
										onclick={() => confirmEditForItem(item)}
									>
										{#if busy}<AiSpinner size="xs" />{/if}
										Save
									</button>
								{:else if laterNeedsRewrite}
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
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
