<script lang="ts">
	import { errorMessage } from '#lib/helpers/errorMessage';
	import { m } from '#lib/paraglide/messages';
	import { client } from '#lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import { isTeam, type ResolutionViewer } from './paperContext';
	import { openVotingModal, type VotingResult } from '#lib/components/voting/votingModal';
	import AmendmentReviewPanel from './AmendmentReviewPanel.svelte';
	import AmendmentCard from './AmendmentCard.svelte';
	import AmendmentVoteOutcome from './AmendmentVoteOutcome.svelte';
	import AmendmentDecisionConfirm from './AmendmentDecisionConfirm.svelte';
	import AiSpinner from '#lib/components/AiSpinner.svelte';
	import AiIcon from '#lib/components/AiIcon.svelte';
	import { rankAmendmentsByImpact } from '#lib/ai/amendments';
	import { getAiPreference, preferenceToMode } from '#lib/ai/aiPreference.svelte';
	import {
		amendmentVoteName,
		canRankByImpact,
		changeSummary,
		groupPendingReviews,
		rankMap,
		scopeAmendments,
		type DecisionKind
	} from './amendmentListState';

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

	const allReviewItems = await client.liveQuery.amendmentReviewItems({
		__args: { where: { paper: { id: { eq: paperId } } } },
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
					icon: true,
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
					icon: true,
					type: true
				}
			},
			sponsors: { id: true }
		}
	});

	// Group unresolved review items by trigger, scoped to the currently visible clause tab.
	const pendingReviewGroups = $derived(
		groupPendingReviews({ items: allReviewItems, clauseId: selectedClauseId })
	);

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

	const amendments = await client.liveQuery.amendments({
		__args: { where: { paper: { id: { eq: paperId } } }, orderBy: { createdAt: 'asc' } },
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
			representation: { name: true, alpha2Code: true, alpha3Code: true, icon: true, type: true }
		},
		sponsors: { id: true, amendmentId: true, committeeMember: { id: true } }
	});

	// AI-assigned impact ranks for ALTER_TEXT amendments. Populated on demand.
	let aiSortOrder = $state(new Map<string, number>());
	let aiSortBusy = $state(false);

	// Clause-targeted amendments when a clause is selected; ADD amendments
	// (which target a position, not a clause) surface at the document level.
	const scoped = $derived(
		scopeAmendments({ amendments, clauseId: selectedClauseId, ranks: aiSortOrder })
	);

	const unprocessedAlterText = $derived(
		scoped.filter((a) => a.status === 'SUBMITTED' && a.type === 'ALTER_TEXT')
	);

	async function sortByImpact() {
		const pref = getAiPreference();
		const ready = canRankByImpact({
			busy: aiSortBusy,
			candidates: unprocessedAlterText.length,
			preference: pref
		});
		if (!ready) return;
		aiSortBusy = true;
		try {
			const ranked = await rankAmendmentsByImpact(unprocessedAlterText, preferenceToMode(pref));
			aiSortOrder = rankMap(ranked);
		} catch (err) {
			toast.error(errorMessage(err, 'AI sort failed'));
		} finally {
			aiSortBusy = false;
		}
	}

	const myMemberId = $derived(viewer.committeeMemberId ?? null);
	const team = $derived(isTeam(viewer));

	let busyId = $state<string | null>(null);

	async function run(id: string, fn: () => Promise<unknown>, successMsg?: string) {
		busyId = id;
		try {
			await fn();
			if (successMsg) toast.success(successMsg);
		} catch (err) {
			toast.error(errorMessage(err, 'Action failed'));
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
		const result = await openVotingModal({
			voteName: amendmentVoteName(a),
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

	// Chair decisions (accept / adopt-by-consensus / reject) are confirmed via a
	// modal before they take effect, since they immediately alter the document.
	let pendingDecision = $state<{ kind: DecisionKind; amendmentId: string } | null>(null);

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

<!-- Review banners — shown whenever accepted amendments left unresolved siblings -->
{#snippet reviewBanners()}
	<div class="flex flex-col gap-1.5">
		{#each pendingReviewGroups as group (group.triggerId)}
			<button
				class="bg-warning/15 border-warning/40 text-warning-content flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm hover:brightness-95 active:brightness-90"
				onclick={() => (activeTrigger = group.triggerId)}
			>
				<i aria-hidden="true" class="ph-fill ph-warning text-warning shrink-0"></i>
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
				<i aria-hidden="true" class="ph-fill ph-caret-right text-warning/60 shrink-0 text-xs"></i>
			</button>
		{/each}
	</div>
{/snippet}

{#snippet impactSortButton()}
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
				<i aria-hidden="true" class="ph-fill ph-magic-wand"></i>
			{/if}
			Sort by impact
		</button>
	</div>
{/snippet}

<div class="flex h-full flex-col gap-3">
	{#if team && pendingReviewGroups.length > 0}
		{@render reviewBanners()}
	{/if}

	{#if !scoped.length}
		<p class="text-base-content/50 py-6 text-center text-sm">
			{selectedClauseId ? m.noAmendmentsForClause() : m.noDocumentAmendments()}
		</p>
	{:else}
		{#if team && unprocessedAlterText.length > 1}
			{@render impactSortButton()}
		{/if}
		<div class="flex-1 space-y-3 overflow-y-auto">
			{#each scoped as a (a.id)}
				<AmendmentCard
					amendment={a}
					{committeeId}
					{viewer}
					{team}
					{myMemberId}
					{sponsoringOpen}
					{minAmendmentSponsors}
					active={a.id === activeAmendmentId}
					{busyId}
					onsubmit={() => submit(a.id)}
					onwithdraw={() => withdraw(a.id)}
					onpresent={() => present(a.id)}
					onunpresent={() => unpresent()}
					onvote={() => startAmendmentVote(a)}
					ondecide={(kind) => (pendingDecision = { kind, amendmentId: a.id })}
				/>
			{/each}
		</div>
	{/if}
</div>

{#if pendingDecision}
	<AmendmentDecisionConfirm
		kind={pendingDecision.kind}
		onconfirm={confirmDecision}
		onclose={closeDecision}
	/>
{/if}

{#if voteOutcome}
	<AmendmentVoteOutcome
		result={voteOutcome.result}
		summary={changeSummary(voteOutcome.amendment)}
		onapply={applyVoteOutcome}
		onreject={rejectVoteOutcome}
		oncancel={cancelVoteOutcome}
	/>
{/if}

{#if activeGroup}
	<AmendmentReviewPanel items={activeGroup.items} onclose={() => (activeTrigger = null)} />
{/if}
