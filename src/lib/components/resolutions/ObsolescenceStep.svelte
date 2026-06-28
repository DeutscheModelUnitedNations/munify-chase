<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import AiSpinner from '$lib/components/AiSpinner.svelte';
	import AiIcon from '$lib/components/AiIcon.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';

	interface ReviewItem {
		id: string;
		aiObsolete: boolean | null | undefined;
		aiObsoleteReason: string | null | undefined;
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
		/** Amendments targeting the same or earlier clause as the accepted change. */
		items: ReviewItem[];
		/** Amendments targeting a later clause — unlikely to be affected. Shown collapsed. */
		laterItems?: ReviewItem[];
		/** ID of the item the AI queue is currently working on. */
		currentlyProcessingId?: string | null;
		onadvance: () => void;
	}

	let { items, laterItems = [], currentlyProcessingId = null, onadvance }: Props = $props();

	const allItems = $derived([...items, ...laterItems]);

	// Chair's explicit checkbox overrides. Undefined = fall back to AI recommendation.
	let userDecisions = $state<Record<string, boolean>>({});

	// Merge AI recommendations with explicit overrides.
	const decisions = $derived.by(() =>
		Object.fromEntries(
			allItems.map((item) => [
				item.id,
				item.id in userDecisions ? userDecisions[item.id] : (item.aiObsolete ?? false)
			])
		)
	);

	// Auto-expand the later-clause section if AI finds a hit.
	// null = follow AI recommendation; true/false = user has explicitly toggled.
	let laterExpandedOverride = $state<boolean | null>(null);
	const laterAiHasHit = $derived(laterItems.some((i) => i.aiObsolete === true));
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

	let busy = $state(false);
	let reasonExpanded = $state(new Set<string>());

	const obsoleteCount = $derived(Object.values(decisions).filter(Boolean).length);

	async function confirm() {
		busy = true;
		try {
			await Promise.all(
				allItems.map((item) =>
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
		<div class="flex flex-col gap-2">
			{#each items as item (item.id)}
				{@const badge = obsoleteBadge(item.aiObsolete)}
				<label class="bg-base-200 flex cursor-pointer items-start gap-3 rounded-lg p-3">
					<input
						type="checkbox"
						class="checkbox checkbox-error mt-0.5"
						checked={decisions[item.id]}
						onchange={(e) => {
							userDecisions[item.id] = e.currentTarget.checked;
						}}
						disabled={busy}
					/>
					<div class="flex min-w-0 flex-1 flex-col gap-1">
						<div class="flex items-center justify-between gap-2">
							<div class="flex items-center gap-2">
								<span class="font-mono text-sm font-semibold">
									{item.subjectAmendment?.documentNumber ?? typeLabel(item.subjectAmendment?.type)}
								</span>
								{#if badge}
									<span class="badge badge-sm {badge.cls}">
										<AiIcon />{badge.label}
									</span>
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
						{#if item.subjectAmendment?.newContent}
							<p class="text-base-content/60 font-mono text-xs whitespace-pre-wrap">
								{item.subjectAmendment.newContent}
							</p>
						{/if}
						{#if item.aiObsoleteReason}
							{#if item.aiObsolete === true}
								<p class="text-warning/80 flex items-center gap-1 text-xs italic">
									<AiIcon />{item.aiObsoleteReason}
								</p>
							{:else}
								<button
									class="text-base-content/40 hover:text-base-content/70 flex cursor-pointer items-center gap-1 text-xs"
									onclick={() => {
										const next = new Set(reasonExpanded);
										if (next.has(item.id)) next.delete(item.id);
										else next.add(item.id);
										reasonExpanded = next;
									}}
								>
									<AiIcon />
									<i
										class="fas fa-chevron-{reasonExpanded.has(item.id)
											? 'down'
											: 'right'} text-[0.55rem]"
									></i>
									AI reasoning
								</button>
								{#if reasonExpanded.has(item.id)}
									<p class="text-base-content/50 flex items-center gap-1 text-xs italic">
										{item.aiObsoleteReason}
									</p>
								{/if}
							{/if}
						{/if}
					</div>
				</label>
			{/each}
		</div>
	{:else if laterItems.length === 0}
		<p class="text-base-content/40 py-2 text-center text-sm">No amendments to check.</p>
	{/if}

	<!-- Later-clause amendments (collapsed unless AI finds a hit) -->
	{#if laterItems.length > 0}
		<div class="border-base-300 rounded-lg border">
			<div class="flex w-full items-center justify-between px-3 py-2.5 text-sm">
				<button
					class="flex flex-1 cursor-pointer items-center gap-2 text-left font-medium"
					onclick={() => (laterExpandedOverride = !laterExpanded)}
				>
					<i class="fas fa-chevron-{laterExpanded ? 'down' : 'right'} text-xs opacity-60"></i>
					Later clauses ({laterItems.length})
					{#if laterItems.some((i) => i.aiObsolete === true)}
						<span class="badge badge-error badge-sm"><AiIcon />hit</span>
					{:else if laterItems.every((i) => i.aiObsolete != null)}
						<span class="badge badge-success badge-sm"><AiIcon />all fine</span>
					{:else if laterItems.some((i) => i.id === currentlyProcessingId)}
						<AiSpinner size="xs" />
					{/if}
				</button>
				<span class="text-base-content/40 text-xs">unlikely to be affected</span>
			</div>
			{#if laterExpanded}
				<div class="border-base-300 flex flex-col gap-2 border-t p-3">
					{#each sortedLaterItems as item (item.id)}
						{@const badge = obsoleteBadge(item.aiObsolete)}
						{@const clauseIdx = item.subjectAmendment?.targetOperativeIndex}
						<label class="bg-base-200 flex cursor-pointer items-start gap-3 rounded-lg p-3">
							<input
								type="checkbox"
								class="checkbox checkbox-error mt-0.5"
								checked={decisions[item.id]}
								onchange={(e) => {
									userDecisions[item.id] = e.currentTarget.checked;
								}}
								disabled={busy}
							/>
							<div class="flex min-w-0 flex-1 flex-col gap-1">
								<div class="flex items-center justify-between gap-2">
									<div class="flex items-center gap-2">
										<span class="font-mono text-sm font-semibold">
											{item.subjectAmendment?.documentNumber ??
												typeLabel(item.subjectAmendment?.type)}
										</span>
										{#if clauseIdx != null}
											<span class="badge badge-outline badge-sm">Clause {clauseIdx + 1}</span>
										{/if}
										{#if badge}
											<span class="badge badge-sm {badge.cls}">
												<AiIcon />{badge.label}
											</span>
										{:else if item.aiObsolete == null && currentlyProcessingId === item.id}
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
								{#if item.subjectAmendment?.newContent}
									<p class="text-base-content/60 font-mono text-xs whitespace-pre-wrap">
										{item.subjectAmendment.newContent}
									</p>
								{/if}
								{#if item.aiObsoleteReason && item.aiObsolete === true}
									<p class="text-warning/80 flex items-center gap-1 text-xs italic">
										<AiIcon />{item.aiObsoleteReason}
									</p>
								{/if}
							</div>
						</label>
					{/each}
				</div>
			{/if}
		</div>
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
