<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import { PAPER_STATUS_ORDER, statusLabel, type PaperStatus } from './paperContext';

	interface Props {
		paper: { id: string; status: PaperStatus };
		committee: {
			id: string;
			currentOperativeIndex: number;
		};
		operativeCount: number;
	}

	let { paper, committee, operativeCount }: Props = $props();

	const currentIdx = $derived(PAPER_STATUS_ORDER.indexOf(paper.status));
	const nextStatus = $derived(PAPER_STATUS_ORDER[currentIdx + 1] as PaperStatus | undefined);

	let busy = $state(false);

	async function advance() {
		if (!nextStatus) return;
		busy = true;
		try {
			await client.mutate.updateResolutionPaper({
				__args: { id: paper.id, status: nextStatus },
				id: true
			});
			toast.success(m.statusChangedTo({ status: statusLabel(nextStatus) }));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to advance');
		} finally {
			busy = false;
		}
	}

	async function setCurrentClause(index: number) {
		try {
			await client.mutate.setCommitteeResolutionToggles({
				__args: { committeeId: committee.id, currentOperativeIndex: index },
				id: true
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed');
		}
	}

	const showClausePointer = $derived(
		paper.status === 'AMENDMENT_PHASE' || paper.status === 'VOTING_PHASE'
	);

	// Earlier stages can be reverted to. Re-entering SUBMITTED runs the
	// server-side submission flow (only valid from a working paper), so it is
	// never a backward target.
	function canRevertTo(status: PaperStatus, index: number) {
		return index < currentIdx && status !== 'SUBMITTED';
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
				id: true
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
					title={i < currentIdx && status === 'SUBMITTED' ? m.cannotRevertToSubmitted() : undefined}
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
</div>

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
