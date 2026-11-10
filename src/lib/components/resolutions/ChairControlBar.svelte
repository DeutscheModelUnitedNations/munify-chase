<script lang="ts">
	import { errorMessage } from '#lib/helpers/errorMessage';
	import { m } from '#lib/paraglide/messages';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import { client } from '#lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import { PAPER_STATUS_ORDER, statusLabel, type PaperStatus } from './paperContext';
	import { advanceAction, resumeVoteOptions, stepBubble, stepKind } from './chairLifecycle';
	import { openVotingModal, resumeVotingModal } from '#lib/components/voting/votingModal';

	interface Props {
		paper: { id: string; status: PaperStatus; title: string };
		committee: {
			id: string;
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
		currentClauseId?: string | null;
		currentClauseLabel?: string;
		onStartClauseVote?: (clauseId: string, clauseLabel: string) => Promise<void>;
	}

	let { paper, committee, currentClauseId, currentClauseLabel, onStartClauseVote }: Props =
		$props();

	const currentIdx = $derived(PAPER_STATUS_ORDER.indexOf(paper.status));
	const nextStatus = $derived(PAPER_STATUS_ORDER[currentIdx + 1] as PaperStatus | undefined);

	let busy = $state(false);

	let amendmentPhaseModalOpen = $state(false);
	let finalConfirmOpen = $state(false);

	const ADVANCE: Record<ReturnType<typeof advanceAction>, () => unknown> = {
		none: () => undefined,
		askAmendmentSettings: () => (amendmentPhaseModalOpen = true),
		startVoting: async () => {
			await doAdvance();
			await setCurrentClause(0);
		},
		confirmFinal: () => (finalConfirmOpen = true),
		advance: () => doAdvance()
	};

	async function advance() {
		await ADVANCE[advanceAction(nextStatus)]();
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
			toast.error(errorMessage(err, 'Failed to advance'));
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
			toast.error(errorMessage(err, 'Failed to update settings'));
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
			toast.error(errorMessage(err, 'Failed'));
		}
	}

	let hoveredIdx = $state<number | null>(null);

	function goToStage(status: PaperStatus, index: number) {
		const kind = stepKind({ index, currentIdx });
		if (kind === 'next') advance();
		else if (kind === 'past') revertTarget = status;
	}

	function resumeVote() {
		const session = committee.activeVotingSession;
		if (session) resumeVotingModal(resumeVoteOptions({ session, fallbackName: paper.title }));
	}

	function startClauseVote() {
		onStartClauseVote!(currentClauseId!, currentClauseLabel ?? '');
	}

	function startVote() {
		openVotingModal({
			voteName: paper.title,
			voteType: 'ROLL_CALL',
			majority: 'ABSOLUTE',
			withAbstentions: true
		});
	}

	const inVotingPhase = () => paper.status === 'VOTING_PHASE';

	registerCommands(() => [
		{
			id: 'chair-paper.advance',
			title: (_inputs, options) =>
				nextStatus ? m.advanceToStatus({ status: statusLabel(nextStatus) }, options) : '',
			group: 'page',
			icon: 'skip-forward',
			visible: () => !!nextStatus,
			enabled: () => !busy,
			run: advance
		},
		{
			id: 'chair-paper.resume-vote',
			title: m.resumeVote,
			group: 'page',
			icon: 'arrow-clockwise',
			visible: () => inVotingPhase() && !!committee.activeVotingSession,
			run: resumeVote
		},
		{
			id: 'chair-paper.start-clause-vote',
			title: m.startClauseVote,
			context: () => currentClauseLabel ?? '',
			group: 'page',
			icon: 'check-square-offset',
			visible: () =>
				inVotingPhase() &&
				!committee.activeVotingSession &&
				!!currentClauseId &&
				!!onStartClauseVote,
			run: startClauseVote
		},
		{
			id: 'chair-paper.start-vote',
			title: m.startVote,
			group: 'page',
			icon: 'gavel',
			visible: () => inVotingPhase() && !committee.activeVotingSession,
			run: startVote
		}
	]);

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
			toast.error(errorMessage(err, 'Failed'));
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
	<ul class="steps steps-horizontal text-sm" data-tour="chair-paper.phases">
		{#each PAPER_STATUS_ORDER as status, i (status)}
			{@render lifecycleStep(status, i, stepKind({ index: i, currentIdx }))}
		{/each}
	</ul>

	{#if paper.status === 'VOTING_PHASE'}
		{@render voteActions()}
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
								__args: {
									committeeId: committee.id,
									amendmentSubmissionOpen: e.currentTarget.checked
								},
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
				<button class="btn btn-ghost" onclick={() => (amendmentPhaseModalOpen = false)}
					>{m.cancel()}</button
				>
				<button class="btn btn-outline" disabled={busy} onclick={advanceKeepSettings}
					>{m.amendmentPhaseSettingsChangeNothing()}</button
				>
				<button class="btn btn-primary" disabled={busy} onclick={advanceWithAutoAllow}>
					{#if busy}<i aria-hidden="true" class="ph-fill ph-spinner-gap animate-spin"></i>{/if}
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
					{#if busy}<i aria-hidden="true" class="ph-fill ph-spinner-gap animate-spin"></i>{/if}
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
				<button class="btn btn-ghost" onclick={() => (finalConfirmOpen = false)}
					>{m.cancel()}</button
				>
				<button
					class="btn btn-outline btn-success"
					disabled={busy}
					onclick={() => advanceToFinal(false)}
				>
					{#if busy}<i aria-hidden="true" class="ph-fill ph-spinner-gap animate-spin"></i>{/if}
					{m.finalizeWithoutConfetti()}
				</button>
				<button class="btn btn-success" disabled={busy} onclick={() => advanceToFinal(true)}>
					{#if busy}<i aria-hidden="true" class="ph-fill ph-spinner-gap animate-spin"></i>{/if}
					{m.finalizeWithConfetti()}
				</button>
			</div>
		</div>
		<button
			class="modal-backdrop"
			aria-label={m.cancel()}
			onclick={() => (finalConfirmOpen = false)}
		></button>
	</div>
{/if}

{#snippet lifecycleStep(status: PaperStatus, i: number, kind: ReturnType<typeof stepKind>)}
	{@const stageTitle =
		kind === 'next' ? m.advanceToStatus({ status: statusLabel(status) }) : m.progressToStage()}
	<li
		class="step relative {kind === 'next' || kind === 'future' ? '' : 'step-primary'}"
		data-content={stepBubble({ kind, index: i, hovered: hoveredIdx === i })}
	>
		{#if kind === 'next' || kind === 'past'}
			<button
				class="absolute inset-0 z-10 cursor-pointer"
				title={stageTitle}
				aria-label={stageTitle}
				disabled={busy}
				onmouseenter={() => (hoveredIdx = i)}
				onmouseleave={() => (hoveredIdx = null)}
				onfocus={() => (hoveredIdx = i)}
				onblur={() => (hoveredIdx = null)}
				onclick={() => goToStage(status, i)}
			></button>
		{/if}
		<span class:font-bold={kind === 'current'} class:opacity-50={i > currentIdx} title={undefined}>
			{statusLabel(status)}
		</span>
	</li>
{/snippet}

{#snippet voteActions()}
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2" data-tour="chair-paper.vote-actions">
		{#if committee.activeVotingSession}
			<button class="btn btn-sm btn-warning" title={m.resumeVote()} onclick={resumeVote}>
				<i aria-hidden="true" class="ph-fill ph-arrow-clockwise"></i>
				{m.resumeVote()}
			</button>
		{:else}
			{#if currentClauseId && onStartClauseVote}
				<button
					class="btn btn-sm btn-secondary"
					title={m.startClauseVote()}
					onclick={startClauseVote}
				>
					<i aria-hidden="true" class="ph-fill ph-check-square-offset"></i>
					{m.startClauseVote()}
				</button>
			{/if}
			<button class="btn btn-sm btn-success" title={m.startVote()} onclick={startVote}>
				<i aria-hidden="true" class="ph-fill ph-gavel"></i>
				{m.startVote()}
			</button>
		{/if}
	</div>
{/snippet}
