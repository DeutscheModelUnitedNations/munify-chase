<script lang="ts">
	import { browser } from '$app/environment';
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import { onDestroy } from 'svelte';
	import toast from 'svelte-french-toast';

	import {
		ResolutionEditor,
		ResolutionPreview,
		type ResolutionHeaderData
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';
	import {
		englishPreamblePhrases,
		englishOperativePhrases
	} from '@deutschemodelunitednations/munify-resolution-editor/phrases';
	import { svgToDataUrl } from '$lib/utils/svgToDataUrl';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
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
	import { nanoid } from '$lib/helpers/nanoid';
	import { launchClauseVote } from './resolutionVotes';
	import { openVotingModal, resumeVotingModal } from '$lib/components/voting/votingModal';

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
		updatedAt: true,
		committee: { id: true },
		agendaItem: { title: true },
		creatorCommitteeMember: {
			id: true,
			representation: { id: true, name: true, alpha3Code: true }
		},
		sponsors: {
			id: true,
			committeeMember: {
				representation: { id: true, name: true, alpha3Code: true }
			}
		},
		editors: { id: true, conferenceUser: { id: true } }
	});
	const paper = $derived(papers?.[0]);

	const committees = await client.liveQuery.committees({
		__args: { where: { resolutionPapers: { id: paperId } } },
		id: true,
		name: true,
		abbreviation: true,
		simpleMajority: true,
		activeDraftResolutionId: true,
		activeAmendmentId: true,
		currentOperativeIndex: true,
		amendmentSubmissionOpen: true,
		amendmentSponsoringOpen: true,
		supportReevaluationOpen: true,
		conference: { title: true, logoSvg: true },
		activeVotingSession: {
			id: true,
			mode: true,
			voteName: true,
			majority: true,
			withAbstentions: true
		}
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
		proposer: { id: true, representation: { id: true, name: true } },
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
	const showVoteTab = $derived(status !== 'WORKING_PAPER' && status !== 'SUBMITTED');
	// Lookup map for clause vote records (for inline vote button + outcome badge).
	const clauseVoteMap = $derived(
		new Map((clauseVotes ?? []).map((v) => [v.clauseId, v]))
	);

	function amendmentCountFor(clauseId: string) {
		return (amendmentRows ?? []).filter((a) => a.targetClauseId === clauseId).length;
	}
	function commentCountFor(clauseId: string) {
		return (comments ?? []).filter((c) => c.clauseId === clauseId).length;
	}

	// ---- header data (for paper preview / export) ---------------------------
	const headerData = $derived<ResolutionHeaderData>({
		conferenceTitle: committee?.conference?.title ?? undefined,
		conferenceEmblem: svgToDataUrl(committee?.conference?.logoSvg),
		committeeAbbreviation: committee?.abbreviation ?? undefined,
		committeeFullName: committee?.name ?? undefined,
		documentNumber: paper?.documentNumber ?? undefined,
		topic: paper?.agendaItem?.title ?? undefined,
		authoringDelegation:
			getTranslatedCountryNameFromAlpha3Code(
				paper?.creatorCommitteeMember?.representation?.alpha3Code
			) ??
			paper?.creatorCommitteeMember?.representation?.name ??
			undefined,
		sponsoringDelegations: (paper?.sponsors ?? []).map(
			(s) =>
				getTranslatedCountryNameFromAlpha3Code(s.committeeMember?.representation?.alpha3Code) ??
				s.committeeMember?.representation?.name ??
				''
		),
		lastEdited: paper?.updatedAt ?? undefined
	});

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

	// Seed committeeName in the Y.js doc once IDB has loaded and the field is blank.
	$effect(() => {
		if (!yClient?.persistenceLoaded) return;
		if (yClient.store.snapshot.committeeName) return;
		const name = committee?.name ?? committee?.abbreviation;
		if (name) yClient.store.setCommitteeName(name);
	});

	// ---- selection ----------------------------------------------------------
	let selectedClauseId = $state<string | null>(null);
	const selectedClauseIndex = $derived(
		selectedClauseId ? operative.findIndex((c) => c.id === selectedClauseId) : null
	);
	function selectClause(id: string) {
		selectedClauseId = selectedClauseId === id ? null : id;
	}

	// Svelte action: adds a highlight outline to the OperativeClauseEditor's root
	// element by traversing from the clauseAnnotations injection point.
	function highlightClause(
		node: HTMLElement,
		params: { selected: boolean; current: boolean; clauseId: string }
	) {
		// node is inside the library's "absolute -left-2 -top-2" wrapper div, whose
		// next sibling is the OperativeClauseEditor root element.
		const clauseEl = node.parentElement?.nextElementSibling as HTMLElement | null;
		if (!clauseEl) return;

		// Needs to be positioned so the side handle can use absolute placement.
		clauseEl.style.position = 'relative';

		// Slim arrow handle injected into the right side of the clause card.
		// Positioned right: -1rem so it sits exactly in the fieldset's 1rem padding —
		// never outside the scroll container.
		let currentClauseId = params.clauseId;
		const handle = document.createElement('button');
		handle.type = 'button';
		handle.className = 'clause-side-handle';
		handle.setAttribute('aria-label', 'Open in panel');
		handle.innerHTML = '<i class="fas fa-chevron-right"></i>';
		handle.addEventListener('click', (e) => {
			e.stopPropagation();
			selectClause(currentClauseId);
		});
		clauseEl.append(handle);

		function apply(p: typeof params) {
			currentClauseId = p.clauseId;
			clauseEl!.classList.toggle('clause-is-selected', p.selected);
			clauseEl!.classList.toggle('clause-is-current', p.current);
			handle.classList.toggle('is-selected', p.selected);
		}

		apply(params);
		return {
			update: apply,
			destroy() {
				handle.remove();
				clauseEl!.classList.remove('clause-is-selected', 'clause-is-current');
			}
		};
	}

	// ---- inline clause vote -------------------------------------------------
	// Clause to link once the committee's activeVotingSession appears (set before
	// opening the modal so the $effect fires as soon as ShowOfHandsVotingChair
	// creates the session — avoids creating the DB session before config is done).
	let pendingLinkClauseId = $state<string | null>(null);
	let pendingLinkSessionId = $state<string | null>(null);

	$effect(() => {
		const sessionId = committee?.activeVotingSession?.id;
		const clauseId = pendingLinkClauseId;
		// Only link when a NEW session appears (not one that was already active).
		if (!sessionId || !clauseId || sessionId === pendingLinkSessionId) return;
		pendingLinkClauseId = null;
		client.mutate
			.linkOperativeClauseVote({
				__args: { id: nanoid(), paperId, clauseId, votingSessionId: sessionId },
				id: true
			})
			.catch(() => {});
	});

	let suggestRemoveClauseId = $state<string | null>(null);

	async function startClauseVote(clauseId: string, clauseLabel: string) {
		// Capture the current session ID so the $effect ignores it (only fires for new ones).
		pendingLinkSessionId = committee?.activeVotingSession?.id ?? null;
		pendingLinkClauseId = clauseId;
		const result = await openVotingModal({
			voteName: clauseLabel,
			voteType: 'SHOW_OF_HANDS',
			majority: 'SIMPLE',
			withAbstentions: true
		});
		// Clear if vote was cancelled before starting (session never appeared).
		pendingLinkClauseId = null;
		pendingLinkSessionId = null;
		if (!result.cancelled && result.outcome === 'REJECTED') {
			suggestRemoveClauseId = clauseId;
		}
	}

	async function resumeClauseVote() {
		const active = committee?.activeVotingSession;
		if (!active) return;
		await resumeVotingModal({
			voteType: (active.mode ?? 'SHOW_OF_HANDS') as 'SHOW_OF_HANDS' | 'ROLL_CALL',
			voteName: active.voteName ?? '',
			majority: (active.majority ?? 'SIMPLE') as 'SIMPLE' | 'ABSOLUTE' | 'TWO_THIRDS',
			withAbstentions: active.withAbstentions ?? true
		});
	}

	// ---- actions ------------------------------------------------------------
	function stored<T>(key: string, fallback: T): T {
		if (!browser) return fallback;
		try {
			const v = localStorage.getItem(key);
			return v !== null ? (JSON.parse(v) as T) : fallback;
		} catch {
			return fallback;
		}
	}

	let historyOpen = $state(false);
	let detailsOpen = $state(false);
	let previewOpen = $state(stored('chase:paper:previewOpen', true));

	// ---- panel resize -------------------------------------------------------

	let previewWidth = $state(stored('chase:paper:previewWidth', 608));
	let contextWidth = $state(stored('chase:paper:contextWidth', 384));
	let dragging = $state<'preview' | 'context' | null>(null);

	$effect(() => { localStorage.setItem('chase:paper:previewOpen', JSON.stringify(previewOpen)); });
	$effect(() => { localStorage.setItem('chase:paper:previewWidth', JSON.stringify(previewWidth)); });
	$effect(() => { localStorage.setItem('chase:paper:contextWidth', JSON.stringify(contextWidth)); });

	function startDrag(handle: 'preview' | 'context') {
		dragging = handle;
	}

	function onDragMove(e: PointerEvent) {
		if (!dragging) return;
		const body = (e.currentTarget as HTMLElement).closest('.panel-body') as HTMLElement;
		if (!body) return;
		const rect = body.getBoundingClientRect();
		const MIN = 200;
		if (dragging === 'preview') {
			previewWidth = Math.max(MIN, Math.min(e.clientX - rect.left, rect.width - contextWidth - MIN * 2));
		} else {
			contextWidth = Math.max(MIN, Math.min(rect.right - e.clientX, rect.width - previewWidth - MIN * 2));
		}
	}

	function stopDrag() {
		dragging = null;
	}
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
				id: true,
				activeDraftResolutionId: true
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

{#snippet noHeader()}{/snippet}

{#if paper && committee}
	<div class="flex h-[calc(100vh-8rem)] w-full flex-col overflow-hidden">
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
					paper={{ id: paper.id, status, title: paper.documentNumber ?? paper.title ?? '' }}
					committee={{
						id: committee.id,
						currentOperativeIndex: committee.currentOperativeIndex,
						amendmentSubmissionOpen: committee.amendmentSubmissionOpen,
						amendmentSponsoringOpen: committee.amendmentSponsoringOpen,
						supportReevaluationOpen: committee.supportReevaluationOpen,
						activeVotingSession: committee.activeVotingSession ?? null
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
				{#if yClient}
					<SyncBadge
						connectionState={yClient.connectionState}
						persistenceLoaded={yClient.persistenceLoaded}
						wsSynced={yClient.wsSynced}
					/>
				{/if}
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

		<!-- Body: preview panel + editor + context panel -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			role="region"
			class="panel-body flex min-h-0 flex-1"
			class:cursor-col-resize={dragging !== null}
			class:select-none={dragging !== null}
			onpointermove={onDragMove}
			onpointerup={stopDrag}
			onpointerleave={stopDrag}
		>
			<!-- Left: collapsible document preview (hidden on FINAL) -->
			{#if status !== 'FINAL'}
				{#if previewOpen}
					<aside
						class="hidden shrink-0 flex-col overflow-hidden lg:flex"
						style="width: {previewWidth}px;"
					>
						<div class="border-base-300 flex items-center justify-between border-b px-3 py-2">
							<span class="text-sm font-semibold">
								<i class="fa-solid fa-eye mr-1.5"></i>{m.resolutionPreview()}
							</span>
							<button
								class="btn btn-ghost btn-xs"
								title={m.resolutionHidePreview()}
								onclick={() => (previewOpen = false)}
							>
								<i class="fas fa-chevron-left"></i>
							</button>
						</div>
						{#if browser && yClient}
							<div class="min-h-0 flex-1 overflow-auto p-4">
								<ResolutionPreview
									resolution={yClient.store.snapshot}
									{headerData}
									labels={englishLabels}
									amendments={amendmentOverlays}
									{rejectedClauseIds}
								/>
							</div>
						{/if}
					</aside>
					<!-- Drag handle: preview / editor -->
					<div
						role="separator"
						aria-label="Resize preview panel"
						aria-orientation="vertical"
						class="drag-handle group hidden w-3 shrink-0 cursor-col-resize items-stretch justify-center lg:flex"
						onpointerdown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); startDrag('preview'); }}
					><div class="bg-base-300 w-px group-hover:w-1 group-hover:bg-primary/40 group-active:bg-primary/60 transition-all"></div></div>
				{:else}
					<div class="hidden shrink-0 flex-col items-center pt-2 lg:flex">
						<button
							class="btn btn-ghost btn-xs"
							title={m.resolutionShowPreview()}
							onclick={() => (previewOpen = true)}
						>
							<i class="fas fa-chevron-right"></i>
						</button>
					</div>
				{/if}
			{/if}

			<!-- Center: editor -->
			<div class="min-h-0 flex-1 overflow-auto">
				{#if browser && yClient}
					<div class="editor-no-internal-preview flex h-full w-full flex-col">
						<ResolutionEditor
							store={yClient.store}
							presence={yClient.presence}
							labels={englishLabels}
							preamblePhrases={englishPreamblePhrases}
							operativePhrases={englishOperativePhrases}
							editable={canEdit}
							amendments={amendmentOverlays}
							{rejectedClauseIds}
							{headerData}
							previewHeader={noHeader}
							clauseToolbar={clauseToolbarSnippet}
							clauseAnnotations={clauseAnnotationsSnippet}
						/>
					</div>
				{/if}
			</div>

			<!-- Drag handle + right context panel: hidden on FINAL -->
			{#if status !== 'FINAL'}
				<div
					role="separator"
					aria-label="Resize context panel"
					aria-orientation="vertical"
					class="drag-handle group hidden w-3 shrink-0 cursor-col-resize items-stretch justify-center lg:flex"
					onpointerdown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); startDrag('context'); }}
				><div class="bg-base-300 w-px group-hover:w-1 group-hover:bg-primary/40 group-active:bg-primary/60 transition-all"></div></div>

				<aside
					class="hidden shrink-0 overflow-hidden lg:flex lg:flex-col"
					style="width: {contextWidth}px;"
				>
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
						showVoteTab={false}
						ondeselect={() => (selectedClauseId = null)}
					/>
				</aside>
			{/if}
		</div>
	</div>

	<SnapshotHistoryModal bind:open={historyOpen} {paperId} close={() => (historyOpen = false)} />

	<!-- Remove-clause suggestion after a rejected clause vote -->
	{#if suggestRemoveClauseId}
		{@const clauseToRemove = suggestRemoveClauseId}
		<div class="modal modal-open">
			<div class="modal-box">
				<h3 class="mb-1 text-lg font-bold">
					<span class="badge badge-error mr-2">{m.rejected()}</span>
				</h3>
				<p class="py-3">{m.rejectedClauseRemoveSuggestion()}</p>
				<div class="modal-action">
					<button class="btn btn-ghost" onclick={() => (suggestRemoveClauseId = null)}>
						{m.keepClause()}
					</button>
					<button
						class="btn btn-error"
						onclick={() => {
							yClient?.store.deleteOperativeClause(clauseToRemove);
							suggestRemoveClauseId = null;
						}}
					>
						<i class="fas fa-trash"></i>
						{m.removeClause()}
					</button>
				</div>
			</div>
			<button
				class="modal-backdrop"
				aria-label={m.keepClause()}
				onclick={() => (suggestRemoveClauseId = null)}
			></button>
		</div>
	{/if}

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

{#snippet clauseToolbarSnippet({ clause, index }: { clause: { id: string }; index: number })}
	{@const clauseLabel = m.clauseN({ n: String(index + 1) })}
	{@const existingVote = clauseVoteMap.get(clause.id)}
	<div class="mb-10 -mt-1 flex items-center justify-end gap-2">
		{#if showVoteTab && team && index === committee.currentOperativeIndex}
			{@const inProgress = !!committee.activeVotingSession && !!existingVote?.vote && existingVote.vote.outcome == null}
			{#if inProgress}
				<button class="btn btn-sm btn-warning gap-2" onclick={resumeClauseVote}>
					<i class="fas fa-rotate-right"></i>
					{m.resumeVote()}
				</button>
			{:else}
				<button
					class="btn btn-sm gap-2"
					class:btn-secondary={!existingVote?.vote}
					class:btn-ghost={!!existingVote?.vote}
					onclick={() => startClauseVote(clause.id, clauseLabel)}
				>
					<i class="fas fa-person-booth"></i>
					{existingVote?.vote ? m.restartVote() : m.startClauseVote()}
				</button>
			{/if}
		{/if}
	</div>
{/snippet}

{#snippet clauseAnnotationsSnippet({ clause, index }: { clause: { id: string }; index: number })}
	{@const ac = amendmentCountFor(clause.id)}
	{@const cc = commentCountFor(clause.id)}
	{@const outcome = clauseVoteMap.get(clause.id)?.vote?.outcome}
	{@const isCurrent = index === committee?.currentOperativeIndex}
	<div use:highlightClause={{ selected: selectedClauseId === clause.id, current: isCurrent, clauseId: clause.id }}>
		{#if isCurrent || ac || cc || outcome}
			<button
				class="flex items-center gap-2"
				onclick={() => selectClause(clause.id)}
				class:opacity-100={selectedClauseId === clause.id}
			>
				{#if isCurrent}
					<span class="badge badge-xs badge-secondary gap-1">
						<i class="fas fa-caret-right"></i>{m.currentClause()}
					</span>
				{/if}
				{#if outcome}
					<span class="badge badge-xs gap-1 {outcome === 'ADOPTED' ? 'badge-success' : 'badge-error'}">
						{outcome === 'ADOPTED' ? m.adopted() : m.rejected()}
					</span>
				{/if}
				{#if ac}<span class="badge badge-xs badge-warning gap-1"
						><i class="fas fa-pen-nib"></i>{ac}</span
					>{/if}
				{#if cc}<span class="badge badge-xs gap-1"><i class="fas fa-comment"></i>{cc}</span>{/if}
			</button>
		{/if}
	</div>
{/snippet}

<style>
	/* Hide the built-in preview section inside ResolutionEditor — we render
	   our own preview panel to the left instead. */
	.editor-no-internal-preview :global(.border-t.border-base-300.pt-6) {
		display: none;
	}

	/* Slim selection handle on the right edge of each operative clause card.
	   Uses right: -2rem so it sits in the fieldset's 2rem right padding — within the
	   scroll container and never causing horizontal overflow. */
	:global(.clause-side-handle) {
		position: absolute;
		right: -2rem;
		top: 0;
		bottom: 0;
		width: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		background: var(--color-base-300);
		border-radius: 0 var(--radius-box) var(--radius-box) 0;
		font-size: 0.5rem;
		color: var(--color-base-content);
		opacity: 0.4;
		transition: opacity 0.15s, background-color 0.15s;
		border: none;
	}
	:global(.clause-side-handle:hover) {
		opacity: 0.9;
	}
	:global(.clause-side-handle.is-selected) {
		background: var(--color-primary);
		color: var(--color-primary-content);
		opacity: 1;
	}

	/* Highlight ring on the selected operative clause card. */
	:global(.clause-is-selected) {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	/* Left accent bar on the currently active clause. */
	:global(.clause-is-current) {
		border-left: 3px solid var(--color-secondary) !important;
	}

	/* Strip the fieldset chrome so the editor blends into the panel. */
	.editor-no-internal-preview :global(fieldset) {
		border: none;
		border-radius: 0;
		background: transparent;
		padding: 1rem 3rem 1rem 1rem;
	}
	.editor-no-internal-preview :global(fieldset > legend) {
		display: none;
	}
</style>
