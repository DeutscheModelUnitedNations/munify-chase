<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import {
		isTeam,
		amendmentStatusLabel,
		amendmentStatusBadgeClass,
		amendmentTypeLabel,
		type AmendmentType,
		type AmendmentStatus,
		type ResolutionViewer
	} from './paperContext';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { openVotingModal, type VotingResult } from '$lib/components/voting/votingModal';
	import AmendmentSponsorPanel from './AmendmentSponsorPanel.svelte';
	import AmendmentReviewPanel from './AmendmentReviewPanel.svelte';
	import AiSpinner from '$lib/components/AiSpinner.svelte';
	import AiIcon from '$lib/components/AiIcon.svelte';
	import { slide } from 'svelte/transition';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import { rankAmendmentsByImpact } from '$lib/ai/amendments';
	import { getAiPreference, preferenceToMode } from '$lib/ai/aiPreference.svelte';

	interface Props {
		paperId: string;
		committeeId: string;
		selectedClauseId: string | null;
		viewer: ResolutionViewer;
		sponsoringOpen: boolean;
		minAmendmentSponsors: number;
		activeAmendmentId: string | null;
		/** When set, immediately opens the review modal for this trigger amendment ID. */
		openTriggerId?: string | null;
	}

	let {
		paperId,
		committeeId,
		selectedClauseId,
		viewer,
		sponsoringOpen,
		minAmendmentSponsors,
		activeAmendmentId,
		openTriggerId = null
	}: Props = $props();

	const allReviewItems = $derived(
		await client.liveQuery.amendmentReviewItems({
			__args: { where: { paper: { id: paperId } } },
			id: true,
			phase: true,
			aiObsolete: true,
			aiRewriteSuggestion: true,
			triggerAmendment: {
				id: true,
				documentNumber: true,
				type: true,
				newContent: true,
				oldContent: true,
				targetClauseId: true,
				targetOperativeIndex: true,
				proposer: {
					id: true,
					representation: {
						name: true,
						alpha2Code: true,
						alpha3Code: true,
						faIcon: true,
						type: true
					}
				},
				sponsors: { id: true }
			},
			subjectAmendment: {
				id: true,
				documentNumber: true,
				type: true,
				status: true,
				newContent: true,
				oldContent: true,
				targetClauseId: true,
				targetOperativeIndex: true,
				proposer: {
					id: true,
					representation: {
						name: true,
						alpha2Code: true,
						alpha3Code: true,
						faIcon: true,
						type: true
					}
				},
				sponsors: { id: true }
			}
		})
	);

	// Group unresolved review items by trigger, scoped to the currently visible clause tab.
	const pendingReviewGroups = $derived.by(() => {
		const pending = (allReviewItems ?? []).filter(
			(r: {
				phase?: string | null;
				subjectAmendment?: { status?: string | null; type?: string | null } | null;
			}) =>
				r.phase !== 'RESOLVED' &&
				r.subjectAmendment?.status === 'SUBMITTED' &&
				r.subjectAmendment?.type === 'ALTER_TEXT'
		);
		const map = new SvelteMap<string, typeof pending>();
		for (const item of pending) {
			const key = item.triggerAmendment?.id ?? '';
			if (!key) continue;
			// Only surface the banner on the clause the trigger amendment targeted.
			if ((item.triggerAmendment?.targetClauseId ?? null) !== selectedClauseId) continue;
			// Subject must target the same clause as the trigger — guards against stale data.
			if ((item.subjectAmendment?.targetClauseId ?? null) !== selectedClauseId) continue;
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(item);
		}
		return [...map.entries()].map(([triggerId, items]) => ({
			triggerId,
			items,
			trigger: items[0]?.triggerAmendment
		}));
	});

	let activeTrigger = $state<string | null>(null);
	const activeGroup = $derived(
		activeTrigger ? (pendingReviewGroups.find((g) => g.triggerId === activeTrigger) ?? null) : null
	);

	$effect(() => {
		if (openTriggerId != null) activeTrigger = openTriggerId;
	});

	// After accepting an amendment, auto-open the review panel once the server
	// delivers the new review items via subscription.
	let pendingAutoOpenFor = $state<string | null>(null);
	$effect(() => {
		if (!pendingAutoOpenFor) return;
		const group = pendingReviewGroups.find((g) => g.triggerId === pendingAutoOpenFor);
		if (group) {
			activeTrigger = pendingAutoOpenFor;
			pendingAutoOpenFor = null;
		}
	});

	const amendments = $derived(
		await client.liveQuery.amendments({
			__args: { where: { paper: { id: paperId } }, orderBy: { createdAt: 'asc' } },
			id: true,
			type: true,
			status: true,
			targetClauseId: true,
			targetOperativeIndex: true,
			newContent: true,
			targetPosition: true,
			documentNumber: true,
			createdAt: true,
			proposer: {
				id: true,
				representation: { name: true, alpha2Code: true, alpha3Code: true, faIcon: true, type: true }
			},
			sponsors: { id: true, amendmentId: true, committeeMember: { id: true } }
		})
	);

	// Clause-targeted amendments when a clause is selected; ADD amendments
	// (which target a position, not a clause) surface at the document level.
	const PROCESSED: AmendmentStatus[] = ['CONSENSUS_ADOPTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'];
	const isProcessed = (a: { status?: string | null }) =>
		PROCESSED.includes(a.status as AmendmentStatus);
	// PENDING = not yet submitted to chairs; always sort to absolute bottom.
	const isPending = (a: { status?: string | null }) => a.status === 'PENDING';
	// Sort weight: 0 = active/submitted, 1 = processed, 2 = pending draft
	function sortTier(a: { status?: string | null }): number {
		if (isPending(a)) return 2;
		if (isProcessed(a)) return 1;
		return 0;
	}

	// Type-based priority: DELETE first (renders others obsolete), then ALTER_TEXT,
	// then ADD, then ALTER_POSITION.
	function typePriority(type: string | null | undefined): number {
		switch (type) {
			case 'DELETE':
				return 0;
			case 'ALTER_TEXT':
				return 1;
			case 'ADD':
				return 2;
			case 'ALTER_POSITION':
				return 3;
			default:
				return 4;
		}
	}

	// AI-assigned impact ranks for ALTER_TEXT amendments. Populated on demand.
	let aiSortOrder = $state(new Map<string, number>());
	let aiSortBusy = $state(false);

	const scoped = $derived.by(() => {
		const list = amendments ?? [];
		const filtered = selectedClauseId
			? list.filter((a) => a.targetClauseId === selectedClauseId)
			: list.filter((a) => !a.targetClauseId);
		return filtered.slice().sort((a, b) => {
			const tierDiff = sortTier(a) - sortTier(b);
			if (tierDiff !== 0) return tierDiff;
			// Within processed or within pending: preserve submission order.
			if (isProcessed(a) || isPending(a)) return 0;
			// Active/submitted: type priority first.
			const typeDiff = typePriority(a.type) - typePriority(b.type);
			if (typeDiff !== 0) return typeDiff;
			// Within ALTER_TEXT: AI impact rank if available.
			if (a.type === 'ALTER_TEXT' && aiSortOrder.size > 0) {
				const aRank = aiSortOrder.get(a.id) ?? Infinity;
				const bRank = aiSortOrder.get(b.id) ?? Infinity;
				if (aRank !== bRank) return aRank - bRank;
			}
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		});
	});

	const unprocessedAlterText = $derived(
		scoped.filter((a) => a.status === 'SUBMITTED' && a.type === 'ALTER_TEXT')
	);

	async function sortByImpact() {
		if (aiSortBusy || unprocessedAlterText.length < 2) return;
		const pref = getAiPreference();
		if (pref === 'off') return;
		aiSortBusy = true;
		try {
			const ranked = await rankAmendmentsByImpact(unprocessedAlterText, preferenceToMode(pref));
			const map = new SvelteMap<string, number>();
			ranked.forEach((id, i) => map.set(id, i));
			aiSortOrder = map;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'AI sort failed');
		} finally {
			aiSortBusy = false;
		}
	}

	const myMemberId = $derived(viewer.committeeMemberId ?? null);
	const team = $derived(isTeam(viewer));

	let expandedSponsors = $state(new Set<string>());
	function toggleSponsors(id: string) {
		const next = new SvelteSet(expandedSponsors);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		expandedSponsors = next;
	}

	let busyId = $state<string | null>(null);

	async function run(id: string, fn: () => Promise<unknown>, successMsg?: string) {
		busyId = id;
		try {
			await fn();
			if (successMsg) toast.success(successMsg);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Action failed');
		} finally {
			busyId = null;
		}
	}

	const submit = (id: string) =>
		run(
			id,
			() => client.mutate.submitAmendment({ __args: { id }, id: true }),
			m.amendmentSubmitted()
		);
	const withdraw = (id: string) => run(id, () => client.mutate.deleteAmendment({ __args: { id } }));
	const accept = async (id: string, consensus: boolean) => {
		await run(
			id,
			() => client.mutate.acceptAmendment({ __args: { id, consensus }, id: true }),
			m.amendmentApplied()
		);
		// Watch for review items arriving via subscription and auto-open the panel.
		pendingAutoOpenFor = id;
	};
	const reject = (id: string) =>
		run(id, () => client.mutate.rejectAmendment({ __args: { id }, id: true }));
	// Select activeAmendmentId + the activeAmendment relation so the mutation
	// response (and the optimistic layer) update the cached Committee entity
	// directly, rather than relying on the subscription to eventually push it.
	const activeAmendmentSelection = {
		id: true,
		activeAmendmentId: true,
		activeAmendment: {
			id: true,
			type: true,
			documentNumber: true,
			targetClauseId: true,
			targetOperativeIndex: true,
			targetPosition: true,
			newContent: true
		}
	} as const;
	const present = (id: string) =>
		run(id, () =>
			client.mutate.setActiveAmendment({
				__args: { committeeId, amendmentId: id },
				...activeAmendmentSelection
			})
		);
	const unpresent = () =>
		run('unpresent', () =>
			client.mutate.setActiveAmendment({
				__args: { committeeId },
				...activeAmendmentSelection
			})
		);

	type AmendmentRow = (typeof scoped)[number];

	// Vote on an amendment: present it (so it shows on the beamer), run a
	// show-of-hands vote, then open an outcome modal that summarises the pending
	// change and lets the chair apply or reject it (pre-selected by the result,
	// but overridable). The split-button's dropdown skips the vote entirely.
	let voteOutcome = $state<{ amendment: AmendmentRow; result: VotingResult } | null>(null);

	async function startAmendmentVote(a: AmendmentRow) {
		await present(a.id);
		const typeLabel = amendmentTypeLabel(a.type as AmendmentType);
		const voteName = a.documentNumber ? `${a.documentNumber} – ${typeLabel}` : typeLabel;
		const result = await openVotingModal({
			voteName,
			voteType: 'SHOW_OF_HANDS',
			majority: 'SIMPLE',
			withAbstentions: true
		});
		if (result.cancelled) {
			await unpresent();
			return;
		}
		// Keep the amendment on the beamer while the chair reviews the outcome.
		voteOutcome = { amendment: a, result };
	}

	async function applyVoteOutcome() {
		const vo = voteOutcome;
		if (!vo) return;
		voteOutcome = null;
		await accept(vo.amendment.id, false);
		await unpresent();
	}

	async function rejectVoteOutcome() {
		const vo = voteOutcome;
		if (!vo) return;
		voteOutcome = null;
		await reject(vo.amendment.id);
		await unpresent();
	}

	function cancelVoteOutcome() {
		voteOutcome = null;
		unpresent();
	}

	// A short, human-readable summary of what applying the amendment will do.
	function changeSummary(a: AmendmentRow): { headline: string; body?: string | null } {
		const opNum = a.targetOperativeIndex != null ? a.targetOperativeIndex + 1 : null;
		const clauseRef = opNum != null ? ` – ${m.operativeClausePresentation()} ${opNum}` : '';
		switch (a.type) {
			case 'DELETE':
				return { headline: `${m.deleteClausePresentation()}${clauseRef}` };
			case 'ALTER_TEXT':
				return { headline: `${m.alterClausePresentation()}${clauseRef}`, body: a.newContent };
			case 'ADD':
				return {
					headline: `${m.addClausePresentation()} – ${m.insertAfterPresentation({ index: (a.targetPosition ?? 0) + 1 })}`,
					body: a.newContent
				};
			case 'ALTER_POSITION':
				return {
					headline: `${m.moveClausePresentation()} – ${m.moveToPositionPresentation({ position: (a.targetPosition ?? 0) + 1 })}`
				};
			default:
				return { headline: amendmentTypeLabel(a.type as AmendmentType) };
		}
	}

	// Chair decisions (accept / adopt-by-consensus / reject) are confirmed via a
	// modal before they take effect, since they immediately alter the document.
	type DecisionKind = 'accept' | 'consensus' | 'reject';
	let pendingDecision = $state<{ kind: DecisionKind; amendmentId: string } | null>(null);

	const decisionMessage = (kind: DecisionKind) =>
		kind === 'accept'
			? m.confirmAcceptAmendment()
			: kind === 'consensus'
				? m.confirmAdoptByConsensus()
				: m.confirmRejectAmendment();

	function closeDecision() {
		pendingDecision = null;
	}

	async function confirmDecision() {
		const decision = pendingDecision;
		if (!decision) return;
		pendingDecision = null;
		if (decision.kind === 'accept') await accept(decision.amendmentId, false);
		else if (decision.kind === 'consensus') await accept(decision.amendmentId, true);
		else await reject(decision.amendmentId);
	}
</script>

<div class="flex h-full flex-col gap-3">
	<!-- Review banners — shown whenever accepted amendments left unresolved siblings -->
	{#if team && pendingReviewGroups.length > 0}
		<div class="flex flex-col gap-1.5">
			{#each pendingReviewGroups as group (group.triggerId)}
				<button
					class="bg-warning/15 border-warning/40 text-warning-content flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm hover:brightness-95 active:brightness-90"
					onclick={() => (activeTrigger = group.triggerId)}
				>
					<i class="fas fa-triangle-exclamation text-warning shrink-0"></i>
					<span class="flex-1">
						<span class="font-semibold">
							{group.items.length} amendment{group.items.length > 1 ? 's' : ''} need{group.items
								.length === 1
								? 's'
								: ''} review
						</span>
						after accepting
						<span class="font-mono">{group.trigger?.documentNumber ?? 'amendment'}</span>
					</span>
					<i class="fas fa-chevron-right text-warning/60 shrink-0 text-xs"></i>
				</button>
			{/each}
		</div>
	{/if}

	{#if !scoped.length}
		<p class="text-base-content/50 py-6 text-center text-sm">
			{selectedClauseId ? m.noAmendmentsForClause() : m.noDocumentAmendments()}
		</p>
	{:else}
		{#if team && unprocessedAlterText.length > 1}
			<div class="flex justify-end">
				<button
					class="btn btn-xs {aiSortOrder.size > 0 ? 'btn-primary' : 'btn-ghost'}"
					disabled={aiSortBusy}
					onclick={sortByImpact}
				>
					{#if aiSortBusy}
						<AiSpinner size="xs" />
					{:else if aiSortOrder.size > 0}
						<AiIcon size="xs" />
					{:else}
						<i class="fas fa-wand-magic-sparkles"></i>
					{/if}
					Sort by impact
				</button>
			</div>
		{/if}
		<div class="flex-1 space-y-3 overflow-y-auto">
			{#each scoped as a (a.id)}
				{@const mine = a.proposer?.id === myMemberId}
				{@const isActive = a.id === activeAmendmentId}
				{@const sponsorsExpanded = expandedSponsors.has(a.id)}
				{@const sponsorCount = a.sponsors?.length ?? 0}
				{@const canSubmit = sponsorCount >= minAmendmentSponsors}
				<div
					class="bg-base-100 rounded-lg p-3"
					class:ring-2={isActive}
					class:ring-inset={isActive}
					class:ring-primary={isActive}
				>
					<div class="flex items-center justify-between gap-2">
						<div class="flex items-center gap-1.5">
							<span class="flex items-center gap-1.5 font-mono text-sm font-semibold">
								{#if a.type === 'ADD'}
									<i class="fas fa-plus"></i>
								{:else if a.type === 'DELETE'}
									<i class="fas fa-trash"></i>
								{:else if a.type === 'ALTER_TEXT'}
									<i class="fas fa-pen"></i>
								{:else if a.type === 'ALTER_POSITION'}
									<i class="fas fa-arrows-up-down"></i>
								{/if}
								{#if a.documentNumber}
									{a.documentNumber}
								{/if}
							</span>
						</div>
						<span class="badge badge-sm {amendmentStatusBadgeClass(a.status as AmendmentStatus)}">
							{amendmentStatusLabel(a.status as AmendmentStatus)}
						</span>
					</div>
					<div class="text-base-content/70 mt-2 flex items-center gap-2 text-xs">
						<Flag representation={a.proposer?.representation} size="xs" />
						<span
							>{getTranslatedCountryNameFromAlpha3Code(a.proposer?.representation?.alpha3Code) ??
								a.proposer?.representation?.name ??
								m.unknown()}</span
						>
						<span class="text-base-content/40">·</span>
						<button
							class="btn btn-xs btn-ghost -my-1 -ml-1 gap-1"
							class:text-warning={!canSubmit && a.status === 'PENDING'}
							onclick={() => toggleSponsors(a.id)}
						>
							{m.sponsorsCount({
								current: String(sponsorCount),
								needed: String(minAmendmentSponsors)
							})}
							<i
								class="fas fa-chevron-down text-[0.6rem] transition-transform duration-200"
								class:rotate-180={sponsorsExpanded}
							></i>
						</button>
					</div>
					{#if sponsorsExpanded}
						<div transition:slide={{ duration: 200 }}>
							<AmendmentSponsorPanel
								amendmentId={a.id}
								{committeeId}
								{sponsoringOpen}
								{viewer}
								proposerMemberId={a.proposer?.id}
								amendmentStatus={a.status}
							/>
						</div>
					{/if}

					{#if a.newContent}
						<p
							class="bg-base-200 mt-2 rounded p-2 font-mono text-xs whitespace-pre-wrap opacity-80"
						>
							{a.newContent}
						</p>
					{/if}

					<div class="mt-3 flex flex-wrap gap-1.5">
						{#if mine && a.status === 'PENDING'}
							<div
								class="tooltip tooltip-top"
								data-tip={canSubmit
									? undefined
									: m.sponsorsNeededToSubmit({
											current: String(sponsorCount),
											needed: String(minAmendmentSponsors)
										})}
							>
								<button
									class="btn btn-xs btn-primary"
									disabled={busyId === a.id || !canSubmit}
									onclick={() => submit(a.id)}>{m.submit()}</button
								>
							</div>
							<button
								class="btn btn-xs btn-ghost"
								disabled={busyId === a.id}
								onclick={() => withdraw(a.id)}>{m.withdraw()}</button
							>
						{/if}

						{#if team && (a.status === 'SUBMITTED' || a.status === 'PENDING')}
							{#if isActive}
								<button
									class="btn btn-xs btn-primary"
									disabled={busyId === a.id || busyId === 'unpresent'}
									onclick={() => unpresent()}>{m.stopPresenting()}</button
								>
							{:else}
								<button
									class="btn btn-xs btn-ghost"
									disabled={busyId === a.id || a.status === 'PENDING'}
									onclick={() => present(a.id)}
								>
									<i class="fa-solid fa-eye"></i>
									{m.present()}
								</button>
							{/if}
							<div class="join ml-auto">
								<button
									class="btn btn-xs btn-primary join-item"
									disabled={busyId === a.id || busyId === 'unpresent' || a.status === 'PENDING'}
									onclick={() => startAmendmentVote(a)}
								>
									<i class="fas fa-person-booth"></i>
									{m.startVote()}
								</button>
								<div class="dropdown dropdown-end join-item flex">
									<button
										tabindex="0"
										class="btn btn-xs btn-primary join-item px-1.5"
										aria-label={m.decideManually()}
										title={m.decideManually()}
									>
										<i class="fas fa-chevron-down"></i>
									</button>
									<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
									<ul
										tabindex="0"
										class="dropdown-content menu bg-base-100 border-base-300 rounded-box z-50 mt-1 w-48 border p-1 shadow-xl"
									>
										<li>
											<button
												class="text-success"
												disabled={busyId === a.id}
												onclick={() => (pendingDecision = { kind: 'consensus', amendmentId: a.id })}
											>
												<i class="fas fa-handshake"></i>
												{m.adoptByConsensus()}
											</button>
										</li>
										<li>
											<button
												class="text-success"
												disabled={busyId === a.id}
												onclick={() => (pendingDecision = { kind: 'accept', amendmentId: a.id })}
											>
												<i class="fas fa-check"></i>
												{m.accept()}
											</button>
										</li>
										<li>
											<button
												class="text-error"
												disabled={busyId === a.id}
												onclick={() => (pendingDecision = { kind: 'reject', amendmentId: a.id })}
											>
												<i class="fas fa-xmark"></i>
												{m.reject()}
											</button>
										</li>
									</ul>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

{#if pendingDecision}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="text-lg font-bold">{m.confirm()}</h3>
			<p class="py-3">{decisionMessage(pendingDecision.kind)}</p>
			<div class="modal-action">
				<button class="btn btn-ghost" onclick={closeDecision}>{m.cancel()}</button>
				<button
					class="btn {pendingDecision.kind === 'reject' ? 'btn-error' : 'btn-success'}"
					onclick={confirmDecision}>{m.confirm()}</button
				>
			</div>
		</div>
		<button class="modal-backdrop" aria-label={m.cancel()} onclick={closeDecision}></button>
	</div>
{/if}

{#if voteOutcome}
	{@const adopted = voteOutcome.result.outcome === 'ADOPTED'}
	{@const summary = changeSummary(voteOutcome.amendment)}
	<div class="modal modal-open">
		<div class="modal-box">
			<div class="flex items-center justify-between gap-2">
				<h3 class="text-lg font-bold">{m.voteResult()}</h3>
				<span class="badge {adopted ? 'badge-success' : 'badge-error'}">
					{adopted ? m.amendmentStatusAccepted() : m.amendmentStatusRejected()}
				</span>
			</div>

			<div class="text-base-content/70 mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
				<span
					><i class="fas fa-check text-success"></i>
					{voteOutcome.result.votesFor}
					{m.votesFor()}</span
				>
				<span
					><i class="fas fa-xmark text-error"></i>
					{voteOutcome.result.votesAgainst}
					{m.votesAgainst()}</span
				>
				<span
					><i class="fas fa-minus"></i> {voteOutcome.result.votesAbstain} {m.votesAbstain()}</span
				>
			</div>

			<div class="bg-base-200 mt-4 rounded-lg p-3">
				<p class="text-base-content/60 text-xs">{m.proposedAmendmentPresentation()}</p>
				<p class="mt-1 font-semibold">{summary.headline}</p>
				{#if summary.body}
					<p class="bg-base-100 mt-2 rounded p-2 font-mono text-xs whitespace-pre-wrap">
						{summary.body}
					</p>
				{/if}
			</div>

			<div class="modal-action">
				<button class="btn btn-ghost" onclick={cancelVoteOutcome}>{m.cancel()}</button>
				<button class="btn btn-error" class:btn-outline={adopted} onclick={rejectVoteOutcome}
					>{m.reject()}</button
				>
				<button class="btn btn-success" class:btn-outline={!adopted} onclick={applyVoteOutcome}
					>{m.applyAmendment()}</button
				>
			</div>
		</div>
		<button class="modal-backdrop" aria-label={m.cancel()} onclick={cancelVoteOutcome}></button>
	</div>
{/if}

{#if activeGroup}
	<AmendmentReviewPanel items={activeGroup.items} onclose={() => (activeTrigger = null)} />
{/if}
