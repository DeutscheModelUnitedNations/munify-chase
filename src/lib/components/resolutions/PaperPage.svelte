<script lang="ts">
	import { browser } from '$app/environment';
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import { onDestroy } from 'svelte';
	import toast from 'svelte-french-toast';

	import { ResolutionEditor } from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';
	import {
		englishPreamblePhrases,
		englishOperativePhrases
	} from '@deutschemodelunitednations/munify-resolution-editor/phrases';
	import { createPaperYjsClient, type PaperYjsClient } from '$lib/api/yjs/createPaperYjs.svelte';

	import SyncBadge from './SyncBadge.svelte';
	import ChairControlBar from './ChairControlBar.svelte';
	import ClauseContextPanel from './ClauseContextPanel.svelte';
	import CommitteePhaseToggles from './CommitteePhaseToggles.svelte';
	import SnapshotHistoryModal from './SnapshotHistoryModal.svelte';
	import ShareCodePanel from './ShareCodePanel.svelte';
	import SponsorPanel from './SponsorPanel.svelte';
	import {
		canEditPaper,
		isTeam,
		statusLabel,
		PAPER_STATUS_ORDER,
		toAmendmentOverlays,
		type PaperStatus,
		type ResolutionViewer
	} from './paperContext';

	interface Props {
		paperId: string;
		backHref: string;
	}

	let { paperId, backHref }: Props = $props();

	// ---- identity -----------------------------------------------------------
	const currentUser = await getCurrentUser();

	const conferenceUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				user: { id: currentUser.id ?? '' },
				conference: { committees: { resolutionPapers: { id: paperId } } }
			}
		},
		id: true,
		conferenceUserType: true,
		committeeMemberId: true
	});

	const viewer = $derived<ResolutionViewer>({
		userId: currentUser.id ?? '',
		conferenceUserId: conferenceUsers?.[0]?.id ?? '',
		type: (conferenceUsers?.[0]?.conferenceUserType ?? 'SPECTATOR') as ResolutionViewer['type'],
		committeeMemberId: conferenceUsers?.[0]?.committeeMemberId ?? null
	});

	// ---- paper + committee --------------------------------------------------
	// liveQuery returns a reactive proxy once awaited; args are stable per mount.
	const papers = await client.liveQuery.resolutionPapers({
		__args: { where: { id: paperId } },
		id: true,
		title: true,
		status: true,
		documentNumber: true,
		committee: { id: true },
		agendaItem: { title: true },
		creatorCommitteeMember: { id: true },
		editors: { id: true, conferenceUser: { id: true } }
	});
	const paper = $derived(papers?.[0]);

	const committees = await client.liveQuery.committees({
		__args: { where: { resolutionPapers: { id: paperId } } },
		id: true,
		simpleMajority: true,
		activeDraftResolutionId: true,
		activeAmendmentId: true,
		currentOperativeIndex: true,
		amendmentSubmissionOpen: true,
		amendmentSponsoringOpen: true,
		supportReevaluationOpen: true
	});
	const committee = $derived(committees?.[0]);

	// ---- amendments + votes (overlays / highlighting) -----------------------
	const amendmentRows = await client.liveQuery.amendments({
		__args: { where: { paper: { id: paperId } } },
		id: true,
		type: true,
		status: true,
		targetClauseId: true,
		targetOperativeIndex: true,
		targetPosition: true,
		newContent: true,
		proposer: { id: true, representation: { name: true } },
		sponsors: { id: true }
	});
	const clauseVotes = await client.liveQuery.operativeClauseVotes({
		__args: { where: { paper: { id: paperId } } },
		id: true,
		clauseId: true,
		vote: { id: true, outcome: true }
	});
	const comments = await client.liveQuery.resolutionComments({
		__args: { where: { paper: { id: paperId } } },
		id: true,
		clauseId: true
	});

	const status = $derived((paper?.status ?? 'WORKING_PAPER') as PaperStatus);
	const currentStatusIdx = $derived(PAPER_STATUS_ORDER.indexOf(status));
	const isDebatePhase = $derived(status === 'AMENDMENT_PHASE' || status === 'VOTING_PHASE');

	const amendmentOverlays = $derived(
		isDebatePhase ? toAmendmentOverlays(amendmentRows ?? []) : undefined
	);
	const rejectedClauseIds = $derived(
		(clauseVotes ?? []).filter((v) => v.vote?.outcome === 'REJECTED').map((v) => v.clauseId)
	);

	function amendmentCountFor(clauseId: string) {
		return (amendmentRows ?? []).filter((a) => a.targetClauseId === clauseId).length;
	}
	function commentCountFor(clauseId: string) {
		return (comments ?? []).filter((c) => c.clauseId === clauseId).length;
	}

	// ---- access -------------------------------------------------------------
	const isCreatorOrEditor = $derived(
		(paper?.creatorCommitteeMember?.id != null &&
			paper.creatorCommitteeMember.id === viewer.committeeMemberId) ||
			(paper?.editors ?? []).some((e) => e.conferenceUser?.id === viewer.conferenceUserId)
	);
	const canEdit = $derived(canEditPaper(status, viewer, { isCreatorOrEditor }));
	const team = $derived(isTeam(viewer));

	// ---- Y.js client --------------------------------------------------------
	let yClient = $state<PaperYjsClient | null>(null);
	$effect(() => {
		const presenceUser = {
			id: viewer.userId || 'anonymous',
			name:
				[currentUser.givenName, currentUser.familyName].filter(Boolean).join(' ').trim() ||
				currentUser.email ||
				'Anonymous',
			color: undefined
		};
		const created = createPaperYjsClient({ paperId, user: presenceUser });
		yClient = created;
		return () => void created.destroy();
	});
	onDestroy(() => void yClient?.destroy());

	const operative = $derived(yClient?.store.snapshot.operative ?? []);
	const operativeCount = $derived(operative.length);

	// ---- selection ----------------------------------------------------------
	let selectedClauseId = $state<string | null>(null);
	const selectedClauseIndex = $derived(
		selectedClauseId ? operative.findIndex((c) => c.id === selectedClauseId) : null
	);
	function selectClause(id: string) {
		selectedClauseId = selectedClauseId === id ? null : id;
	}

	// ---- actions ------------------------------------------------------------
	let historyOpen = $state(false);
	let detailsOpen = $state(false);
	let editingDocNum = $state(false);
	let docNumDraft = $state('');

	async function saveDocNum() {
		editingDocNum = false;
		const trimmed = docNumDraft.trim();
		if (!trimmed || trimmed === paper?.documentNumber) return;
		try {
			await client.mutate.updateResolutionPaper({
				__args: { id: paperId, documentNumber: trimmed },
				id: true
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to save document number');
		}
	}
	let submitting = $state(false);
	let submitConfirmOpen = $state(false);

	const isActiveDr = $derived(
		committees?.[0]?.activeDraftResolutionId != null &&
			committees?.[0]?.activeDraftResolutionId === papers?.[0]?.id
	);
	let togglingActiveDr = $state(false);
	async function toggleActiveDr() {
		const cId = committees?.[0]?.id;
		const pId = papers?.[0]?.id;
		if (!cId || !pId) return;
		togglingActiveDr = true;
		try {
			await client.mutate.setActiveDraftResolution({
				__args: { committeeId: cId, paperId: isActiveDr ? undefined : pId },
				id: true
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed');
		} finally {
			togglingActiveDr = false;
		}
	}

	async function submitPaper() {
		submitConfirmOpen = false;
		submitting = true;
		try {
			await client.mutate.updateResolutionPaper({
				__args: { id: paperId, status: 'SUBMITTED' },
				id: true
			});
			toast.success(m.paperSubmitted());
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to submit');
		} finally {
			submitting = false;
		}
	}
</script>

{#if paper && committee}
	<div class="flex h-[calc(100vh-4rem)] w-full flex-col">
		<!-- Single header bar: title, lifecycle chain + chair controls, actions.
		     Uses the page background (base-200) to stay distinct from the app nav. -->
		<header class="bg-base-200 flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
			<a class="btn btn-ghost btn-sm" href={backHref} aria-label={m.back()}>
				<i class="fas fa-arrow-left"></i>
			</a>
			<div class="min-w-0">
				{#if editingDocNum && team}
					<div class="flex items-center gap-1">
						<input
							class="input input-bordered input-sm w-36"
							type="text"
							bind:value={docNumDraft}
							onkeydown={(e) => {
								if (e.key === 'Enter') saveDocNum();
								if (e.key === 'Escape') (editingDocNum = false);
							}}
							onblur={saveDocNum}
							autofocus
						/>
					</div>
				{:else}
					<div class="flex items-center gap-1">
						<span class="truncate text-lg font-semibold">
							{paper.documentNumber || paper.title || m.workingPaper()}
						</span>
						{#if team && status === 'SUBMITTED'}
							<button
								class="btn btn-ghost btn-xs opacity-50 hover:opacity-100"
								title="Set document number"
								onclick={() => {
									docNumDraft = paper.documentNumber ?? '';
									editingDocNum = true;
								}}
							>
								<i class="fas fa-pen text-xs"></i>
							</button>
						{/if}
					</div>
				{/if}
				<div class="text-base-content/60 text-xs">{paper.agendaItem?.title ?? ''}</div>
			</div>

			{#if team}
				<ChairControlBar
					paper={{ id: paper.id, status }}
					committee={{
						id: committee.id,
						currentOperativeIndex: committee.currentOperativeIndex
					}}
					{operativeCount}
				/>
			{:else}
				<!-- Read-only lifecycle chain for participants -->
				<ul class="steps steps-horizontal text-xs">
					{#each PAPER_STATUS_ORDER as s, i (s)}
						<li class="step {i <= currentStatusIdx ? 'step-primary' : ''}">
							<span
								class:font-bold={i === currentStatusIdx}
								class:opacity-50={i > currentStatusIdx}
							>
								{statusLabel(s)}
							</span>
						</li>
					{/each}
				</ul>
			{/if}

			<div class="ml-auto flex items-center gap-2">
				<button
					class="btn btn-ghost btn-sm"
					onclick={() => (detailsOpen = !detailsOpen)}
					title={m.sponsors()}
				>
					<i class="fas fa-users-gear"></i>
				</button>
				{#if team}
					<div class="dropdown dropdown-end">
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<button tabindex="0" class="btn btn-ghost btn-sm" title="Committee settings">
							<i class="fas fa-gear"></i>
						</button>
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<div
							tabindex="0"
							class="dropdown-content bg-base-100 border-base-300 rounded-box z-50 mt-1 w-max border p-4 shadow-xl"
						>
							<CommitteePhaseToggles
								committeeId={committee.id}
								amendmentSubmissionOpen={committee.amendmentSubmissionOpen}
								amendmentSponsoringOpen={committee.amendmentSponsoringOpen}
								supportReevaluationOpen={committee.supportReevaluationOpen}
							/>
						</div>
					</div>
					<button
						class="btn btn-ghost btn-sm"
						onclick={() => (historyOpen = true)}
						title={m.documentHistory()}
					>
						<i class="fas fa-clock-rotate-left"></i>
					</button>
					<button
						class="btn btn-sm"
						class:btn-secondary={isActiveDr}
						class:btn-ghost={!isActiveDr}
						disabled={togglingActiveDr}
						onclick={toggleActiveDr}
						title={isActiveDr ? m.activeDraftResolution() : m.setActiveDr()}
					>
						<i class="fas fa-star"></i>
						{isActiveDr ? m.activeDraftResolution() : m.setActiveDr()}
					</button>
				{/if}
				{#if status === 'WORKING_PAPER' && (isCreatorOrEditor || team)}
					<button
						class="btn btn-primary btn-sm"
						disabled={submitting}
						onclick={() => (submitConfirmOpen = true)}
					>
						{m.submit()}
					</button>
				{/if}
			</div>
		</header>

		<!-- Body: editor + context panel -->
		<div class="flex min-h-0 flex-1">
			<div class="min-h-0 flex-1 overflow-auto">
				{#if browser && yClient}
					<div class="relative flex h-full w-full flex-col">
						<div class="pointer-events-none absolute top-2 right-2 z-10">
							<div class="pointer-events-auto">
								<SyncBadge
									connectionState={yClient.connectionState}
									persistenceLoaded={yClient.persistenceLoaded}
									wsSynced={yClient.wsSynced}
								/>
							</div>
						</div>
						<ResolutionEditor
							store={yClient.store}
							presence={yClient.presence}
							labels={englishLabels}
							preamblePhrases={englishPreamblePhrases}
							operativePhrases={englishOperativePhrases}
							editable={canEdit}
							amendments={amendmentOverlays}
							{rejectedClauseIds}
							clauseToolbar={clauseToolbarSnippet}
							clauseAnnotations={clauseAnnotationsSnippet}
						/>
					</div>
				{/if}
			</div>

			<aside class="hidden w-96 shrink-0 lg:block">
				<ClauseContextPanel
					{paperId}
					committeeId={committee.id}
					{selectedClauseId}
					{selectedClauseIndex}
					{operativeCount}
					{viewer}
					submissionOpen={committee.amendmentSubmissionOpen}
					sponsoringOpen={committee.amendmentSponsoringOpen}
					activeAmendmentId={committee.activeAmendmentId ?? null}
					simpleMajority={committee.simpleMajority}
					showVoteTab={status !== 'WORKING_PAPER' && status !== 'SUBMITTED'}
				/>
			</aside>
		</div>
	</div>

	<SnapshotHistoryModal bind:open={historyOpen} {paperId} close={() => (historyOpen = false)} />

	<!-- Submit confirmation modal -->
	{#if submitConfirmOpen}
		<div class="modal modal-open">
			<div class="modal-box">
				<h3 class="text-lg font-bold">{m.submitPaperConfirmTitle()}</h3>
				<p class="py-3">{m.submitPaperConfirmWarning()}</p>
				<div class="modal-action">
					<button class="btn btn-ghost" onclick={() => (submitConfirmOpen = false)}>
						{m.cancel()}
					</button>
					<button class="btn btn-primary" disabled={submitting} onclick={submitPaper}>
						{#if submitting}<i class="fas fa-spinner fa-spin"></i>{/if}
						{m.submit()}
					</button>
				</div>
			</div>
			<button
				class="modal-backdrop"
				aria-label={m.cancel()}
				onclick={() => (submitConfirmOpen = false)}
			></button>
		</div>
	{/if}

	<!-- Sponsors / share codes drawer -->
	{#if detailsOpen}
		<div class="modal modal-open">
			<div class="modal-box bg-base-200">
				<div class="mb-3 flex items-center justify-between">
					<h3 class="text-lg font-bold">{m.details()}</h3>
					<button
						class="btn btn-ghost btn-sm"
						onclick={() => (detailsOpen = false)}
						aria-label={m.close()}
					>
						<i class="fas fa-xmark"></i>
					</button>
				</div>
				<div class="space-y-4">
					<div>
						<h4 class="mb-1 font-semibold">{m.sponsors()}</h4>
						<SponsorPanel {paperId} committeeId={committee.id} paperStatus={status} {viewer} />
					</div>
					{#if isCreatorOrEditor || team}
						<div>
							<h4 class="mb-1 font-semibold">{m.shareCodes()}</h4>
							<ShareCodePanel {paperId} />
						</div>
					{/if}
				</div>
			</div>
			<button class="modal-backdrop" aria-label={m.close()} onclick={() => (detailsOpen = false)}
			></button>
		</div>
	{/if}
{:else}
	<div class="flex h-full w-full items-center justify-center">
		<i class="fas fa-spinner fa-spin text-3xl opacity-50"></i>
	</div>
{/if}

{#snippet clauseToolbarSnippet({ clause }: { clause: { id: string }; index: number })}
	<button
		class="btn btn-ghost btn-xs"
		class:btn-active={selectedClauseId === clause.id}
		title={m.selectClause()}
		onclick={() => selectClause(clause.id)}
	>
		<i class="fas fa-comments"></i>
	</button>
{/snippet}

{#snippet clauseAnnotationsSnippet({ clause }: { clause: { id: string }; index: number })}
	{@const ac = amendmentCountFor(clause.id)}
	{@const cc = commentCountFor(clause.id)}
	{#if ac || cc}
		<button
			class="flex items-center gap-2"
			onclick={() => selectClause(clause.id)}
			class:opacity-100={selectedClauseId === clause.id}
		>
			{#if ac}<span class="badge badge-xs badge-warning gap-1"
					><i class="fas fa-pen-nib"></i>{ac}</span
				>{/if}
			{#if cc}<span class="badge badge-xs gap-1"><i class="fas fa-comment"></i>{cc}</span>{/if}
		</button>
	{/if}
{/snippet}
