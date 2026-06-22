<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
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

	interface Props {
		paperId: string;
		committeeId: string;
		selectedClauseId: string | null;
		viewer: ResolutionViewer;
		sponsoringOpen: boolean;
		activeAmendmentId: string | null;
	}

	let {
		paperId,
		committeeId,
		selectedClauseId,
		viewer,
		sponsoringOpen,
		activeAmendmentId
	}: Props = $props();

	const amendments = await client.liveQuery.amendments({
		__args: { where: { paper: { id: paperId } }, orderBy: { createdAt: 'asc' } },
		id: true,
		type: true,
		status: true,
		targetClauseId: true,
		targetOperativeIndex: true,
		newContent: true,
		targetPosition: true,
		documentNumber: true,
		proposer: { id: true, representation: { name: true, alpha2Code: true, alpha3Code: true, faIcon: true, type: true } },
		sponsors: { id: true, committeeMember: { id: true } }
	});

	// Clause-targeted amendments when a clause is selected; ADD amendments
	// (which target a position, not a clause) surface at the document level.
	const PROCESSED: AmendmentStatus[] = ['CONSENSUS_ADOPTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'];
	const isProcessed = (a: { status?: string | null }) =>
		PROCESSED.includes(a.status as AmendmentStatus);

	const scoped = $derived.by(() => {
		const list = amendments ?? [];
		const filtered = selectedClauseId
			? list.filter((a) => a.targetClauseId === selectedClauseId)
			: list.filter((a) => !a.targetClauseId);
		return filtered.slice().sort((a, b) => Number(isProcessed(a)) - Number(isProcessed(b)));
	});

	const myMemberId = $derived(viewer.committeeMemberId ?? null);
	const team = $derived(isTeam(viewer));

	function mySponsorRow(a: (typeof scoped)[number]) {
		return a.sponsors?.find((s) => s.committeeMember?.id === myMemberId);
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
	const accept = (id: string, consensus: boolean) =>
		run(
			id,
			() => client.mutate.acceptAmendment({ __args: { id, consensus }, id: true }),
			m.amendmentApplied()
		);
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

	const sponsor = (id: string) =>
		run(id, () =>
			client.mutate.addAmendmentSponsor({ __args: { id: nanoid(), amendmentId: id }, id: true })
		);
	const unsponsor = (sponsorId: string, amendmentId: string) =>
		run(amendmentId, () => client.mutate.removeAmendmentSponsor({ __args: { id: sponsorId } }));

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
	{#if !scoped.length}
		<p class="text-base-content/50 py-6 text-center text-sm">
			{selectedClauseId ? m.noAmendmentsForClause() : m.noDocumentAmendments()}
		</p>
	{:else}
		<div class="flex-1 space-y-3 overflow-y-auto">
			{#each scoped as a (a.id)}
				{@const mine = a.proposer?.id === myMemberId}
				{@const myRow = mySponsorRow(a)}
				{@const isActive = a.id === activeAmendmentId}
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
						<span>{getTranslatedCountryNameFromAlpha3Code(a.proposer?.representation?.alpha3Code) ?? a.proposer?.representation?.name ?? m.unknown()}</span>
						<span class="text-base-content/40">·</span>
						<span>{a.sponsors?.length ?? 0} {m.sponsors()}</span>
					</div>
					{#if a.newContent}
						<p class="bg-base-200 mt-2 rounded p-2 font-mono text-xs whitespace-pre-wrap opacity-80">{a.newContent}</p>
					{/if}

					<div class="mt-3 flex flex-wrap gap-1.5">
						{#if mine && a.status === 'PENDING'}
							<button
								class="btn btn-xs btn-primary"
								disabled={busyId === a.id}
								onclick={() => submit(a.id)}>{m.submit()}</button
							>
							<button
								class="btn btn-xs btn-ghost"
								disabled={busyId === a.id}
								onclick={() => withdraw(a.id)}>{m.withdraw()}</button
							>
						{/if}

						{#if !mine && !team && myMemberId && sponsoringOpen && a.status !== 'REJECTED' && a.status !== 'WITHDRAWN'}
							{#if myRow}
								<button
									class="btn btn-xs btn-ghost"
									disabled={busyId === a.id}
									onclick={() => unsponsor(myRow.id, a.id)}>{m.removeSponsorship()}</button
								>
							{:else}
								<button
									class="btn btn-xs btn-outline"
									disabled={busyId === a.id}
									onclick={() => sponsor(a.id)}>{m.sponsorAmendment()}</button
								>
							{/if}
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
									disabled={busyId === a.id}
									onclick={() => present(a.id)}>{m.present()}</button
								>
							{/if}
							<div class="join ml-auto">
								<button
									class="btn btn-xs btn-primary join-item"
									disabled={busyId === a.id || busyId === 'unpresent'}
									onclick={() => startAmendmentVote(a)}
								>
									<i class="fas fa-person-booth"></i>
									{m.startVote()}
								</button>
								<div class="dropdown dropdown-end join-item flex">
									<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
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
				<span><i class="fas fa-check text-success"></i> {voteOutcome.result.votesFor} {m.votesFor()}</span>
				<span><i class="fas fa-xmark text-error"></i> {voteOutcome.result.votesAgainst} {m.votesAgainst()}</span>
				<span><i class="fas fa-minus"></i> {voteOutcome.result.votesAbstain} {m.votesAbstain()}</span>
			</div>

			<div class="bg-base-200 mt-4 rounded-lg p-3">
				<p class="text-base-content/60 text-xs">{m.proposedAmendmentPresentation()}</p>
				<p class="mt-1 font-semibold">{summary.headline}</p>
				{#if summary.body}
					<p class="bg-base-100 mt-2 rounded p-2 font-mono text-xs whitespace-pre-wrap">{summary.body}</p>
				{/if}
			</div>

			<div class="modal-action">
				<button class="btn btn-ghost" onclick={cancelVoteOutcome}>{m.cancel()}</button>
				<button
					class="btn btn-error"
					class:btn-outline={adopted}
					onclick={rejectVoteOutcome}>{m.reject()}</button
				>
				<button
					class="btn btn-success"
					class:btn-outline={!adopted}
					onclick={applyVoteOutcome}>{m.applyAmendment()}</button
				>
			</div>
		</div>
		<button class="modal-backdrop" aria-label={m.cancel()} onclick={cancelVoteOutcome}></button>
	</div>
{/if}
