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
		onadvance: () => void;
	}

	let { items, laterItems = [], onadvance }: Props = $props();

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

	const obsoleteCount = $derived(Object.values(decisions).filter(Boolean).length);
	const aiReady = $derived(allItems.length === 0 || allItems.some((i) => i.aiObsolete != null));

	async function confirm() {
		busy = true;
		try {
			await Promise.all(
				allItems.map((item) =>
					client.mutate.resolveObsolescence({
						__args: { reviewItemId: item.id, obsolete: decisions[item.id] ?? false }
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
			{#if !aiReady}
				<span class="badge badge-ghost badge-sm ml-1 gap-1">
					<AiSpinner size="xs" />
					AI analysing…
				</span>
			{/if}
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
	{:else if laterItems.length === 0}
		<p class="text-base-content/40 py-2 text-center text-sm">No amendments to check.</p>
	{/if}

	<!-- Later-clause amendments (collapsed unless AI finds a hit) -->
	{#if laterItems.length > 0}
		<div class="border-base-300 rounded-lg border">
			<button
				class="flex w-full cursor-pointer items-center justify-between px-3 py-2.5 text-sm"
				onclick={() => (laterExpandedOverride = !laterExpanded)}
			>
				<span class="flex items-center gap-2 font-medium">
					<i class="fas fa-chevron-{laterExpanded ? 'down' : 'right'} text-xs opacity-60"></i>
					Later clauses ({laterItems.length})
					{#if laterItems.some((i) => i.aiObsolete === true)}
						<span class="badge badge-error badge-sm"><AiIcon />hit</span>
					{:else if laterItems.every((i) => i.aiObsolete != null)}
						<span class="badge badge-success badge-sm"><AiIcon />all fine</span>
					{/if}
				</span>
				<span class="text-base-content/40 text-xs">unlikely to be affected</span>
			</button>
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
										{:else if item.aiObsolete == null}
											<span class="badge badge-ghost badge-sm gap-1">
												<AiSpinner size="xs" />
												analysing…
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
			{obsoleteCount > 0
				? `Remove ${obsoleteCount} amendment${obsoleteCount > 1 ? 's' : ''} and continue`
				: 'None are obsolete — continue'}
		</button>
	</div>
</div>
