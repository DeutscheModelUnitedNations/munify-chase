<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import { PAPER_STATUS_ORDER, statusLabel, type PaperStatus } from './paperContext';
	import { openVotingModal, resumeVotingModal } from '$lib/components/voting/votingModal';

	interface Props {
		paper: { id: string; status: PaperStatus; title: string };
		committee: {
			id: string;
			currentOperativeIndex: number;
			amendmentSubmissionOpen: boolean;
			amendmentSponsoringOpen: boolean;
			supportReevaluationOpen: boolean;
			activeVotingSession: {
				id: string;
				mode: string;
				voteName?: string | null;
				majority?: string | null;
				withAbstentions?: boolean | null;
			} | null;
		};
		operativeCount: number;
	}

	let { paper, committee, operativeCount }: Props = $props();

	const currentIdx = $derived(PAPER_STATUS_ORDER.indexOf(paper.status));
	const nextStatus = $derived(PAPER_STATUS_ORDER[currentIdx + 1] as PaperStatus | undefined);

	let busy = $state(false);

	let amendmentPhaseModalOpen = $state(false);
	let finalConfirmOpen = $state(false);

	async function advance() {
		if (!nextStatus) return;
		if (nextStatus === 'AMENDMENT_PHASE') {
			amendmentPhaseModalOpen = true;
			return;
		}
		if (nextStatus === 'VOTING_PHASE') {
			await doAdvance();
			openVotingModal({ voteName: paper.title, voteType: 'ROLL_CALL', majority: 'ABSOLUTE', withAbstentions: true });
			return;
		}
		if (nextStatus === 'FINAL') {
			finalConfirmOpen = true;
			return;
		}
		await doAdvance();
	}

	async function doAdvance(deployConfetti = false) {
		if (!nextStatus) return;
		// Capture before the await — $derived updates once the mutation response arrives,
		// so nextStatus would be undefined by the time the toast fires.
		const advancingTo = nextStatus;
		busy = true;
		try {
			await client.mutate.updateResolutionPaper({
				__args: { id: paper.id, status: advancingTo, deployConfetti },
				id: true,
				status: true
			});
			toast.success(m.statusChangedTo({ status: statusLabel(advancingTo) }));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to advance');
		} finally {
			busy = false;
		}
	}

	async function advanceToFinal(withConfetti: boolean) {
		finalConfirmOpen = false;
		await doAdvance(withConfetti);
	}

	async function advanceWithAutoAllow() {
		amendmentPhaseModalOpen = false;
		busy = true;
		try {
			await client.mutate.setCommitteeResolutionToggles({
				__args: {
					committeeId: committee.id,
					amendmentSubmissionOpen: true,
					amendmentSponsoringOpen: true,
					supportReevaluationOpen: true
				},
				id: true
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to update settings');
		} finally {
			busy = false;
		}
		await doAdvance();
	}

	async function advanceKeepSettings() {
		amendmentPhaseModalOpen = false;
		await doAdvance();
	}

	async function setCurrentClause(index: number) {
		try {
			await client.mutate.setCommitteeResolutionToggles({
				__args: { committeeId: committee.id, currentOperativeIndex: index },
				id: true,
				currentOperativeIndex: true
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed');
		}
	}

	const showClausePointer = $derived(
		paper.status === 'AMENDMENT_PHASE' || paper.status === 'VOTING_PHASE'
	);

	function canRevertTo(status: PaperStatus, index: number) {
		return index < currentIdx;
	}
	// A step's bubble is interactive when it is the immediate next stage
	// (advance) or a revertable earlier stage.
	function isClickable(status: PaperStatus, index: number) {
		return index === currentIdx + 1 || canRevertTo(status, index);
	}

	let hoveredIdx = $state<number | null>(null);

	// The next stage's bubble shows the play icon in place of its number; a
	// revertable earlier bubble shows it on hover. Otherwise the step number.
	function circleContent(status: PaperStatus, index: number) {
		if (index === currentIdx + 1) return '▶';
		if (canRevertTo(status, index) && hoveredIdx === index) return '▶';
		return String(index + 1);
	}

	function goToStage(status: PaperStatus, index: number) {
		if (index === currentIdx + 1) advance();
		else if (canRevertTo(status, index)) revertTarget = status;
	}

	let revertTarget = $state<PaperStatus | null>(null);
	async function confirmRevert() {
		if (!revertTarget) return;
		busy = true;
		try {
			await client.mutate.updateResolutionPaper({
				__args: { id: paper.id, status: revertTarget },
				id: true,
				status: true
			});
			toast.success(m.statusChangedTo({ status: statusLabel(revertTarget) }));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed');
		} finally {
			busy = false;
			revertTarget = null;
		}
	}
</script>

<!-- Inline chair controls; meant to live inside the page header (no own bar). -->
<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
	<!-- Lifecycle chain: current highlighted. The next stage's bubble becomes a
	     play button (advance); revertable earlier bubbles show a play icon on
	     hover and move back through a confirm. -->
	<ul class="steps steps-horizontal text-sm">
		{#each PAPER_STATUS_ORDER as status, i (status)}
			{@const clickable = isClickable(status, i)}
			<li
				class="step relative {i <= currentIdx ? 'step-primary' : ''}"
				data-content={circleContent(status, i)}
			>
				{#if clickable}
					<button
						class="absolute inset-0 z-10 cursor-pointer"
						title={i === currentIdx + 1
							? m.advanceToStatus({ status: statusLabel(status) })
							: m.progressToStage()}
						aria-label={i === currentIdx + 1
							? m.advanceToStatus({ status: statusLabel(status) })
							: m.progressToStage()}
						disabled={busy}
						onmouseenter={() => (hoveredIdx = i)}
						onmouseleave={() => (hoveredIdx = null)}
						onfocus={() => (hoveredIdx = i)}
						onblur={() => (hoveredIdx = null)}
						onclick={() => goToStage(status, i)}
					></button>
				{/if}
				<span
					class:font-bold={i === currentIdx}
					class:opacity-50={i > currentIdx}
					title={undefined}
				>
					{statusLabel(status)}
				</span>
			</li>
		{/each}
	</ul>

	{#if showClausePointer}
		<div class="flex items-center gap-1">
			<span class="text-base-content/60 text-xs">{m.currentClause()}</span>
			<button
				class="btn btn-xs btn-ghost"
				disabled={committee.currentOperativeIndex <= 0}
				aria-label="previous clause"
				onclick={() => setCurrentClause(Math.max(0, committee.currentOperativeIndex - 1))}
			>
				<i class="fas fa-chevron-left"></i>
			</button>
			<span class="text-sm font-semibold">
				{Math.min(
					committee.currentOperativeIndex + 1,
					Math.max(operativeCount, 1)
				)}/{operativeCount}
			</span>
			<button
				class="btn btn-xs btn-ghost"
				disabled={committee.currentOperativeIndex >= operativeCount - 1}
				aria-label="next clause"
				onclick={() =>
					setCurrentClause(Math.min(operativeCount - 1, committee.currentOperativeIndex + 1))}
			>
				<i class="fas fa-chevron-right"></i>
			</button>
		</div>
	{/if}

	{#if paper.status === 'VOTING_PHASE'}
		{@const active = committee.activeVotingSession}
		<button
			class="btn btn-sm {active ? 'btn-warning' : 'btn-success'}"
			title={active ? m.resumeVote() : m.startVote()}
			onclick={() => {
				if (active) {
					resumeVotingModal({
						voteType: active.mode as 'SHOW_OF_HANDS' | 'ROLL_CALL',
						voteName: active.voteName ?? paper.title,
						majority: (active.majority ?? 'ABSOLUTE') as 'SIMPLE' | 'ABSOLUTE' | 'TWO_THIRDS',
						withAbstentions: active.withAbstentions ?? true
					});
				} else {
					openVotingModal({ voteName: paper.title, voteType: 'ROLL_CALL', majority: 'ABSOLUTE', withAbstentions: true });
				}
			}}
		>
			<i class="fas {active ? 'fa-rotate-right' : 'fa-person-booth'}"></i>
			{active ? m.resumeVote() : m.startVote()}
		</button>
	{/if}
</div>

{#if amendmentPhaseModalOpen}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="text-lg font-bold">{m.amendmentPhaseSettingsTitle()}</h3>
			<p class="py-3">{m.amendmentPhaseSettingsDescription()}</p>
			<div class="flex flex-wrap gap-x-6 gap-y-2 pb-4">
				<label class="label cursor-pointer gap-2 py-0">
					<input
						type="checkbox"
						class="toggle toggle-primary"
						checked={committee.amendmentSubmissionOpen}
						onchange={(e) =>
							client.mutate.setCommitteeResolutionToggles({
								__args: { committeeId: committee.id, amendmentSubmissionOpen: e.currentTarget.checked },
								id: true
							})}
					/>
					<span class="label-text text-sm">{m.amendmentSubmission()}</span>
				</label>
				<label class="label cursor-pointer gap-2 py-0">
					<input
						type="checkbox"
						class="toggle toggle-primary"
						checked={committee.amendmentSponsoringOpen}
						onchange={(e) =>
							client.mutate.setCommitteeResolutionToggles({
								__args: {
									committeeId: committee.id,
									amendmentSponsoringOpen: e.currentTarget.checked
								},
								id: true
							})}
					/>
					<span class="label-text text-sm">{m.amendmentSponsoring()}</span>
				</label>
				<label class="label cursor-pointer gap-2 py-0">
					<input
						type="checkbox"
						class="toggle toggle-primary"
						checked={committee.supportReevaluationOpen}
						onchange={(e) =>
							client.mutate.setCommitteeResolutionToggles({
								__args: {
									committeeId: committee.id,
									supportReevaluationOpen: e.currentTarget.checked
								},
								id: true
							})}
					/>
					<span class="label-text text-sm">{m.supportReevaluation()}</span>
				</label>
			</div>
			<div class="modal-action">
				<button
					class="btn btn-ghost"
					onclick={() => (amendmentPhaseModalOpen = false)}
				>{m.cancel()}</button>
				<button
					class="btn btn-outline"
					disabled={busy}
					onclick={advanceKeepSettings}
				>{m.amendmentPhaseSettingsChangeNothing()}</button>
				<button
					class="btn btn-primary"
					disabled={busy}
					onclick={advanceWithAutoAllow}
				>
					{#if busy}<i class="fas fa-spinner fa-spin"></i>{/if}
					{m.amendmentPhaseSettingsAutoAllow()}
				</button>
			</div>
		</div>
		<button
			class="modal-backdrop"
			aria-label={m.cancel()}
			onclick={() => (amendmentPhaseModalOpen = false)}
		></button>
	</div>
{/if}

{#if revertTarget}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="text-lg font-bold">{m.moveBackTitle()}</h3>
			<p class="py-3">{m.revertStatusWarning({ status: statusLabel(revertTarget) })}</p>
			<div class="modal-action">
				<button class="btn btn-ghost" onclick={() => (revertTarget = null)}>{m.cancel()}</button>
				<button class="btn btn-warning" disabled={busy} onclick={confirmRevert}>
					{#if busy}<i class="fas fa-spinner fa-spin"></i>{/if}
					{m.confirm()}
				</button>
			</div>
		</div>
		<button class="modal-backdrop" aria-label={m.cancel()} onclick={() => (revertTarget = null)}
		></button>
	</div>
{/if}

{#if finalConfirmOpen}
	<div class="modal modal-open">
		<div class="modal-box text-center">
			<div class="mb-3 text-4xl">🎉</div>
			<h3 class="text-lg font-bold">{m.finalizeResolutionTitle()}</h3>
			<p class="py-3">{m.finalizeResolutionDescription()}</p>
			<p class="text-base-content/60 pb-4 text-sm">{m.finalizeConfettiPrompt()}</p>
			<div class="modal-action flex-col gap-2 sm:flex-row">
				<button class="btn btn-ghost" onclick={() => (finalConfirmOpen = false)}>{m.cancel()}</button>
				<button class="btn btn-outline btn-success" disabled={busy} onclick={() => advanceToFinal(false)}>
					{#if busy}<i class="fas fa-spinner fa-spin"></i>{/if}
					{m.finalizeWithoutConfetti()}
				</button>
				<button class="btn btn-success" disabled={busy} onclick={() => advanceToFinal(true)}>
					{#if busy}<i class="fas fa-spinner fa-spin"></i>{/if}
					{m.finalizeWithConfetti()}
				</button>
			</div>
		</div>
		<button class="modal-backdrop" aria-label={m.cancel()} onclick={() => (finalConfirmOpen = false)}></button>
	</div>
{/if}
