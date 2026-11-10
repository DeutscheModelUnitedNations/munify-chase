<script lang="ts">
	import { errorMessage } from '#lib/helpers/errorMessage';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { m } from '#lib/paraglide/messages';
	import { client } from '#lib/api/rumbleClient/client';
	import { urqlClient } from '#lib/api/client';
	import { getCurrentUser } from '#lib/state/currentUser.svelte';
	import { getCachedAccessToken } from '#lib/platform/oidc';
	import { onDestroy, tick, untrack } from 'svelte';
	import { fly } from 'svelte/transition';
	import toast from 'svelte-french-toast';

	import {
		ResolutionEditor,
		ResolutionPreview
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';
	import {
		englishPreamblePhrases,
		englishOperativePhrases
	} from '@deutschemodelunitednations/munify-resolution-editor/phrases';
	import { createPaperYjsClient, type PaperYjsClient } from '#lib/api/yjs/createPaperYjs.svelte';
	import { resolutionHeaderData } from './resolutionHeader';
	import {
		activeDrBlocker as activeDrBlockerOf,
		clauseRejected,
		clauseVoteToLink,
		committeeNameToSeed,
		countByClause,
		debatableAmendmentCounts,
		docNumberToSave,
		formatModelId,
		hasClauseBadges,
		openReviews,
		rejectedClauseIdsOf,
		presenceMetaOf,
		presenceUserOf,
		setCurrentButtonState
	} from './paperPageState';
	import { dodgeOnHover } from '../dodgeOnHover';
	import { fetchClauseVoteOutcomes, fetchOverlayAmendments } from './paperOverlays';
	import PresenceIndicator from './PresenceIndicator.svelte';
	import ClausePresenceBadges from './ClausePresenceBadges.svelte';

	import SyncBadge from './SyncBadge.svelte';
	import DelegatorOriginBadge from './DelegatorOriginBadge.svelte';
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
	import { nanoid } from '#lib/helpers/nanoid';
	import { workingPaperName } from '#lib/helpers/paperName';
	import { openVotingModal } from '#lib/components/voting/votingModal';
	import { downloadResolutionTypst, downloadResolutionPdf } from '#lib/utils/resolutionExport';
	import { getEngine, unloadEngine } from '#lib/ai/model';
	import { assessAiCapability } from '#lib/ai/assess';
	import {
		initAiPreference,
		getAiOnboarded,
		getAiPreference,
		getLocalModelTier,
		setAiPreference,
		type AiPreference
	} from '#lib/ai/aiPreference.svelte';
	import AiOnboardingModal from './AiOnboardingModal.svelte';
	import { registerCommands } from '#lib/commands/registry.svelte';

	interface Props {
		paperId: string;
		backHref: string;
	}

	let { paperId, backHref }: Props = $props();

	// Restore AI preference from localStorage immediately so any code that reads
	// getAiPreference() before the team-gated effect fires sees the correct value.
	initAiPreference();

	// ---- identity -----------------------------------------------------------
	const currentUser = await getCurrentUser();

	const conferenceUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				user: { id: { eq: currentUser.id ?? '' } },
				conference: { committees: { resolutionPapers: { id: { eq: paperId } } } }
			}
		},
		id: true,
		conferenceUserType: true,
		committeeMemberId: true,
		committeeMember: {
			representation: {
				name: true,
				alpha2Code: true,
				alpha3Code: true
			}
		}
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
		__args: { where: { id: { eq: paperId } } },
		id: true,
		title: true,
		status: true,
		documentNumber: true,
		updatedAt: true,
		delegatorVersion: true,
		detachedAt: true,
		committee: { id: true },
		agendaItem: { id: true, title: true },
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
	type Paper = NonNullable<typeof paper>;

	const committees = await client.liveQuery.committees({
		__args: { where: { resolutionPapers: { id: { eq: paperId } } } },
		id: true,
		name: true,
		abbreviation: true,
		totalPresent: true,
		simpleMajority: true,
		twoThirdsMajority: true,
		activeDraftResolutionId: true,
		activeAgendaItemId: true,
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
	type Committee = NonNullable<typeof committee>;

	// ---- amendments + votes (overlays / highlighting) -----------------------
	const amendmentRows = await fetchOverlayAmendments(paperId);
	const clauseVotes = await fetchClauseVoteOutcomes(paperId);
	const comments = await client.liveQuery.resolutionComments({
		__args: { where: { paper: { id: { eq: paperId } } } },
		id: true,
		clauseId: true
	});
	const reviewItemsForBadges = await client.liveQuery.amendmentReviewItems({
		__args: { where: { paper: { id: { eq: paperId } } } },
		id: true,
		phase: true,
		triggerAmendment: { id: true, targetClauseId: true }
	});

	const status = $derived((paper?.status ?? 'WORKING_PAPER') as PaperStatus);
	const currentStatusIdx = $derived(PAPER_STATUS_ORDER.indexOf(status));
	const isDebatePhase = $derived(status === 'AMENDMENT_PHASE' || status === 'VOTING_PHASE');
	const minAmendmentSponsors = $derived(Math.ceil((committee?.totalPresent ?? 0) * 0.1));

	const amendmentOverlays = $derived(
		isDebatePhase ? toAmendmentOverlays(amendmentRows ?? []) : undefined
	);
	const rejectedClauseIds = $derived(rejectedClauseIdsOf(clauseVotes ?? []));
	const _showVoteTab = $derived(status !== 'WORKING_PAPER' && status !== 'SUBMITTED');
	// Lookup map for clause vote records (for inline vote button + outcome badge).
	const clauseVoteMap = $derived(new Map((clauseVotes ?? []).map((v) => [v.clauseId, v])));

	const amendmentCountMap = $derived(
		debatableAmendmentCounts({
			amendments: amendmentRows ?? [],
			minSponsors: minAmendmentSponsors
		})
	);
	const commentCountMap = $derived(countByClause((comments ?? []).map((c) => c.clauseId)));
	const reviews = $derived(openReviews(reviewItemsForBadges ?? []));
	const reviewClauseIds = $derived(reviews.clauseIds);
	// Maps clauseId → first unresolved trigger amendment ID for direct modal opening.
	const reviewTriggerForClause = $derived(reviews.triggerByClause);
	let pendingOpenTriggerId = $state<string | null>(null);

	function amendmentCountFor(clauseId: string) {
		return amendmentCountMap.get(clauseId) ?? 0;
	}
	function commentCountFor(clauseId: string) {
		return commentCountMap.get(clauseId) ?? 0;
	}

	// ---- header data (for paper preview / export) ---------------------------
	const headerData = $derived(resolutionHeaderData({ committee, paper }));

	// ---- access -------------------------------------------------------------

	// If the paper disappears from the live query (e.g. sponsorship removed and
	// the user had no other access), navigate back to the overview.
	// We debounce by one microtask tick so that a transient undefined caused by
	// a GraphQL subscription reconnect (which briefly returns no data before
	// rehydrating from the server) does not trigger a spurious navigation that
	// would destroy any offline Y.js edits still in the IndexedDB buffer.
	let paperEverLoaded = false;
	let navigateAwayTimer: ReturnType<typeof setTimeout> | null = null;
	$effect(() => {
		if (paper) {
			paperEverLoaded = true;
			if (navigateAwayTimer !== null) {
				clearTimeout(navigateAwayTimer);
				navigateAwayTimer = null;
			}
		} else if (paperEverLoaded) {
			// Wait a short moment before navigating: a genuine access revocation
			// persists, while a transient reconnect gap resolves within a tick.
			navigateAwayTimer = setTimeout(() => {
				navigateAwayTimer = null;
				// eslint-disable-next-line svelte/no-navigation-without-resolve -- backHref is a pre-resolved prop
				if (!paper) goto(backHref);
			}, 3000);
		}
	});

	const isCreator = $derived(
		paper?.creatorCommitteeMember?.id != null &&
			paper.creatorCommitteeMember.id === viewer.committeeMemberId
	);
	const isCreatorOrEditor = $derived(
		isCreator ||
			(paper?.editors ?? []).some((e) => e.conferenceUser?.id === viewer.conferenceUserId)
	);
	const canEdit = $derived(canEditPaper(status, viewer, { isCreatorOrEditor }));
	const team = $derived(isTeam(viewer));

	// ---- AI model preload (chairs only) -------------------------------------
	let aiDownloadProgress = $state<number | null>(null);
	let aiDisabledReason = $state<string | null>(null);
	let aiModelId = $state<string | null>(null);
	let aiReady = $state(false);
	let aiOnboardingOpen = $state(false);
	let aiHasBackend = $state(false);
	let aiNotifDodging = $state(false);

	function startLocalEngine() {
		assessAiCapability(getLocalModelTier()).then((assessment) => {
			if (!assessment.supported) {
				aiDisabledReason = assessment.reason;
				setTimeout(() => (aiDisabledReason = null), 6000);
				return;
			}
			aiModelId = assessment.modelId ?? null;
			getEngine();
			const cleanup = () => {
				window.removeEventListener('webllm-progress', progressHandler);
				window.removeEventListener('webllm-error', errorHandler);
			};
			const progressHandler = (e: Event) => {
				const { progress } = (e as CustomEvent<{ progress: number; text: string }>).detail;
				if (progress < 1) {
					aiDownloadProgress = Math.max(aiDownloadProgress ?? 0, progress);
				} else {
					aiDownloadProgress = null;
					aiReady = true;
					setTimeout(() => (aiReady = false), 5000);
					cleanup();
				}
			};
			const errorHandler = (e: Event) => {
				const { message, retrying } = (e as CustomEvent<{ message: string; retrying?: boolean }>)
					.detail;
				aiDownloadProgress = null;
				aiDisabledReason = message;
				if (!retrying) {
					console.error('[AI engine load failed]', message);
					setTimeout(() => (aiDisabledReason = null), 8000);
					cleanup();
				}
			};
			window.addEventListener('webllm-progress', progressHandler);
			window.addEventListener('webllm-error', errorHandler);
		});
	}

	async function applyAiPreference(mode: AiPreference, modelTier: number | null = null) {
		const tierChanged = modelTier !== getLocalModelTier();
		setAiPreference(mode, modelTier);
		if (mode === 'local') {
			if (tierChanged) await unloadEngine();
			startLocalEngine();
		}
	}

	$effect(() => {
		if (!team) return;
		// Always refresh backend availability so re-opening AI settings later
		// reflects the server's current configuration, not just the state at
		// first-visit onboarding time. Uses the raw urql client with
		// network-only to skip the persisted offline cache, which would
		// otherwise keep serving a stale (e.g. previously-false) result.
		urqlClient
			.query('{ hasAiProviders }', {}, { requestPolicy: 'network-only' })
			.toPromise()
			.then((result) => {
				aiHasBackend = result.data?.hasAiProviders ?? false;
			})
			.catch(() => {
				aiHasBackend = false;
			});
		if (getAiOnboarded()) {
			if (getAiPreference() === 'local') startLocalEngine();
			return;
		}
		// First visit — show the onboarding modal
		aiOnboardingOpen = true;
	});

	// ---- Y.js client --------------------------------------------------------
	let yClient = $state<PaperYjsClient | null>(null);
	$effect(() => {
		// Only paperId is tracked: the client is recreated when the user navigates
		// to a different paper. Everything else (identity, meta) is session-stable
		// and is read once at connect time without creating reactive dependencies.
		const pid = paperId;
		const created = untrack(() =>
			createPaperYjsClient({
				paperId: pid,
				user: presenceUserOf(currentUser),
				meta: presenceMetaOf(conferenceUsers?.[0]),
				token: () => getCachedAccessToken()
			})
		);
		yClient = created;
		return () => void created.destroy();
	});
	onDestroy(() => void yClient?.destroy());

	const operative = $derived(yClient?.store.snapshot.operative ?? []);

	// Seed committeeName in the Y.js doc once IDB has loaded and the field is blank.
	$effect(() => {
		const name = committeeNameToSeed({
			persistenceLoaded: !!yClient?.persistenceLoaded,
			documentName: yClient?.store.snapshot.committeeName,
			committee
		});
		if (name) yClient?.store.setCommitteeName(name);
	});

	// ---- selection ----------------------------------------------------------
	let selectedClauseId = $state<string | null>(null);
	let requestedTab = $state<'amendments' | 'comments' | 'vote' | undefined>(undefined);
	const selectedClauseIndex = $derived(
		selectedClauseId ? operative.findIndex((c) => c.id === selectedClauseId) : null
	);
	function selectClause(id: string) {
		selectedClauseId = selectedClauseId === id ? null : id;
		requestedTab = undefined;
	}
	function selectClauseWithTab(id: string, tab: 'amendments' | 'comments' | 'vote') {
		selectedClauseId = id;
		requestedTab = tab;
	}
	async function selectClauseAndOpenReview(clauseId: string) {
		selectClauseWithTab(clauseId, 'amendments');
		const triggerId = reviewTriggerForClause.get(clauseId);
		if (!triggerId) return;
		pendingOpenTriggerId = triggerId;
		await tick();
		pendingOpenTriggerId = null;
	}

	// Svelte action: adds a highlight outline to the OperativeClauseEditor's root
	// element by traversing from the clauseAnnotations injection point.
	function highlightClause(
		node: HTMLElement,
		params: {
			selected: boolean;
			current: boolean;
			clauseId: string;
			commentCount: number;
			amendmentCount: number;
			showSetCurrentBtn: boolean;
			isCurrentClause: boolean;
			isNextClause: boolean;
			onSetCurrentNext?: () => void;
			onSetCurrentOutOfOrder?: () => void;
		}
	) {
		// node is inside the library's "absolute -left-2 -top-2" wrapper div, whose
		// next sibling is the OperativeClauseEditor root element.
		const clauseEl = node.parentElement?.nextElementSibling as HTMLElement | null;
		if (!clauseEl) return;

		// Needs to be positioned so the side handle can use absolute placement.
		clauseEl.style.position = 'relative';

		let currentClauseId = params.clauseId;
		const handle = document.createElement('button');
		handle.type = 'button';
		handle.className = 'clause-side-handle';
		handle.setAttribute('aria-label', 'Open clause panel');
		handle.addEventListener('click', (e) => {
			e.stopPropagation();
			selectClause(currentClauseId);
		});
		clauseEl.append(handle);

		// Absolutely positioned at bottom of clause — does not affect card height.
		const setCurrentBtn = document.createElement('button');
		setCurrentBtn.type = 'button';
		setCurrentBtn.className = 'clause-set-current-btn';
		clauseEl.append(setCurrentBtn);

		function renderHandle(_cc: number, _ac: number) {
			return '<i aria-hidden="true" class="ph-fill ph-caret-right"></i>';
		}

		const BUTTON_LOOKS = {
			next: {
				className:
					'clause-set-current-btn clause-set-current-btn--next btn btn-xs btn-success gap-1',
				html: () => `<i aria-hidden="true" class="ph-fill ph-play"></i>${m.setAsCurrentClause()}`
			},
			other: {
				className:
					'clause-set-current-btn clause-set-current-btn--other btn btn-xs btn-ghost gap-1',
				html: () => '<i aria-hidden="true" class="ph-fill ph-play"></i>'
			}
		};
		let lastBtnState: ReturnType<typeof setCurrentButtonState> | null = null;

		function applyBtnState(p: typeof params) {
			const state = setCurrentButtonState(p);

			// Always keep the callbacks fresh so closures don't go stale.
			setCurrentBtn.onclick = () =>
				state === 'next' ? p.onSetCurrentNext?.() : p.onSetCurrentOutOfOrder?.();

			if (state === lastBtnState) return;
			lastBtnState = state;
			setCurrentBtn.style.display = state === 'hidden' ? 'none' : '';
			if (state === 'hidden') return;
			setCurrentBtn.className = BUTTON_LOOKS[state].className;
			setCurrentBtn.innerHTML = BUTTON_LOOKS[state].html();
		}

		function apply(p: typeof params) {
			currentClauseId = p.clauseId;
			handle.innerHTML = renderHandle(p.commentCount, p.amendmentCount);
			clauseEl!.classList.toggle('clause-is-selected', p.selected);
			clauseEl!.classList.toggle('clause-is-current', p.current);
			handle.classList.toggle('is-selected', p.selected);
			applyBtnState(p);
		}

		apply(params);
		return {
			update: apply,
			destroy() {
				handle.remove();
				setCurrentBtn.remove();
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
		// Only link when a NEW session appears (not one that was already active).
		const link = clauseVoteToLink({
			sessionId: committee?.activeVotingSession?.id,
			clauseId: pendingLinkClauseId,
			ignoredSessionId: pendingLinkSessionId
		});
		if (!link) return;
		pendingLinkClauseId = null;
		client.mutate
			.linkOperativeClauseVote({
				__args: { id: nanoid(), paperId, clauseId: link.clauseId, votingSessionId: link.sessionId },
				id: true
			})
			.catch(() => {});
	});

	let suggestRemoveClauseId = $state<string | null>(null);
	const activeSessionId = $derived(committee?.activeVotingSession?.id ?? null);
	let outOfOrderClauseIndex = $state<number | null>(null);

	async function setCurrentClause(index: number) {
		if (!committee) return;
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

	async function startClauseVote(clauseId: string, clauseLabel: string) {
		// Capture the current session ID so the $effect ignores it (only fires for new ones).
		pendingLinkSessionId = activeSessionId;
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
		if (clauseRejected(result)) suggestRemoveClauseId = clauseId;
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
	let shareOpen = $state(false);
	let presenceOpen = $state(false);
	let previewOpen = $state(stored('chase:paper:previewOpen', true));

	// ---- panel resize -------------------------------------------------------

	let previewWidth = $state(stored('chase:paper:previewWidth', 608));
	let contextWidth = $state(stored('chase:paper:contextWidth', 384));
	let dragging = $state<'preview' | 'context' | null>(null);

	$effect(() => {
		localStorage.setItem('chase:paper:previewOpen', JSON.stringify(previewOpen));
	});
	$effect(() => {
		localStorage.setItem('chase:paper:previewWidth', JSON.stringify(previewWidth));
	});
	$effect(() => {
		localStorage.setItem('chase:paper:contextWidth', JSON.stringify(contextWidth));
	});

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
			previewWidth = Math.max(
				MIN,
				Math.min(e.clientX - rect.left, rect.width - contextWidth - MIN * 2)
			);
		} else {
			contextWidth = Math.max(
				MIN,
				Math.min(rect.right - e.clientX, rect.width - previewWidth - MIN * 2)
			);
		}
	}

	function stopDrag() {
		dragging = null;
	}
	let editingDocNum = $state(false);
	let docNumDraft = $state('');

	async function saveDocNum() {
		editingDocNum = false;
		const documentNumber = docNumberToSave({ draft: docNumDraft, current: paper?.documentNumber });
		if (!documentNumber) return;
		try {
			await client.mutate.updateResolutionPaper({
				__args: { id: paperId, documentNumber },
				id: true
			});
		} catch (err) {
			toast.error(errorMessage(err, 'Failed to save document number'));
		}
	}
	let submitting = $state(false);
	let submitConfirmOpen = $state(false);

	const isActiveDr = $derived(
		committees?.[0]?.activeDraftResolutionId != null &&
			committees?.[0]?.activeDraftResolutionId === papers?.[0]?.id
	);
	let togglingActiveDr = $state(false);
	// Toggling unsets the active paper or makes this one active.
	const nextActiveDrId = $derived(isActiveDr ? undefined : paper?.id);

	// Mirrors the server rules of setActiveDraftResolution, so the chair sees why a paper
	// can't become active instead of only getting an error after clicking
	const activeDrBlocker = $derived(
		activeDrBlockerOf({
			isActiveDr,
			paperStatus: paper?.status,
			paperAgendaItemId: paper?.agendaItem?.id,
			activeAgendaItemId: committee?.activeAgendaItemId
		})
	);
	async function toggleActiveDr() {
		if (!committee || !paper) return;
		togglingActiveDr = true;
		try {
			await client.mutate.setActiveDraftResolution({
				__args: { committeeId: committee.id, paperId: nextActiveDrId },
				id: true,
				activeDraftResolutionId: true
			});
		} catch (err) {
			toast.error(errorMessage(err, 'Failed'));
		} finally {
			togglingActiveDr = false;
		}
	}

	function startEditingDocNum() {
		docNumDraft = paper?.documentNumber ?? '';
		editingDocNum = true;
	}
	function openAiSettings() {
		aiOnboardingOpen = true;
	}
	function openHistory() {
		historyOpen = true;
	}

	// Chair-only header actions
	registerCommands(() => [
		{
			id: 'paper.chair.active-dr',
			title: isActiveDr ? m.commandUnsetActiveDr : m.commandSetActiveDr,
			group: 'page',
			icon: 'star',
			visible: () => team,
			enabled: () => !togglingActiveDr && !activeDrBlocker,
			run: toggleActiveDr
		},
		{
			id: 'paper.chair.document-number',
			title: m.commandSetDocumentNumber,
			group: 'page',
			icon: 'pen',
			visible: () => team && status === 'SUBMITTED' && !editingDocNum,
			run: startEditingDocNum
		},
		{
			id: 'paper.chair.history',
			title: m.documentHistory,
			group: 'page',
			icon: 'clock-counter-clockwise',
			visible: () => team,
			run: openHistory
		},
		{
			id: 'paper.chair.ai-settings',
			title: m.aiOnboardingOpenSettings,
			group: 'page',
			icon: 'robot',
			visible: () => team,
			run: openAiSettings
		}
	]);

	let isExportingPdf = $state(false);
	async function exportPdf() {
		const snapshot = yClient?.store.snapshot;
		if (!snapshot || isExportingPdf) return;
		isExportingPdf = true;
		try {
			await toast.promise(downloadResolutionPdf(snapshot, headerData, paper?.documentNumber), {
				loading: m.exportPdfLoading(),
				success: m.exportPdfSuccess(),
				error: m.exportPdfError()
			});
		} finally {
			isExportingPdf = false;
		}
	}

	function openSubmitConfirm() {
		submitConfirmOpen = true;
	}
	function openShareCodes() {
		shareOpen = true;
	}
	function toggleSponsors() {
		detailsOpen = !detailsOpen;
	}
	function showPreview() {
		previewOpen = true;
	}
	function hidePreview() {
		previewOpen = false;
	}

	// The side panels only exist on wide screens (lg)
	const isWideScreen = () => browser && window.matchMedia('(min-width: 1024px)').matches;

	// Participant header actions. Chairs see the same buttons with their own controls, these
	// commands only cover the participant view.
	registerCommands(() => [
		{
			id: 'paper.participant.submit',
			title: m.commandSubmitPaper,
			group: 'page',
			icon: 'paper-plane-tilt',
			visible: () => !team && status === 'WORKING_PAPER' && isCreator,
			enabled: () => !submitting,
			run: openSubmitConfirm
		},
		{
			id: 'paper.participant.share-codes',
			title: m.shareCodes,
			group: 'page',
			icon: 'share-network',
			visible: () => !team && status === 'WORKING_PAPER' && isCreator,
			run: openShareCodes
		},
		{
			id: 'paper.participant.sponsors',
			title: m.sponsors,
			group: 'page',
			icon: 'user-gear',
			visible: () => !team,
			run: toggleSponsors
		},
		{
			id: 'paper.participant.preview',
			title: previewOpen ? m.resolutionHidePreview : m.resolutionShowPreview,
			group: 'page',
			icon: 'eye',
			visible: () => !team && status !== 'FINAL' && isWideScreen(),
			run: previewOpen ? hidePreview : showPreview
		}
	]);

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
			toast.error(errorMessage(err, 'Failed to submit'));
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
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- backHref is a pre-resolved prop -->
			<a class="btn btn-ghost btn-sm" href={backHref} aria-label={m.back()}>
				<i aria-hidden="true" class="ph-fill ph-arrow-left"></i>
			</a>
			{@render paperTitle(paper)}

			{@render lifecycle(paper, committee)}

			{@render headerActions(paper, committee)}
		</header>

		<!-- Locked-paper notice: shown to creators/editors while the paper is in SUBMITTED stage -->
		{#if !team && status === 'SUBMITTED' && isCreatorOrEditor}
			<div
				role="status"
				class="bg-warning/10 border-warning/30 flex items-center gap-2 border-b px-4 py-2 text-sm"
			>
				<i aria-hidden="true" class="ph-fill ph-lock text-warning shrink-0"></i>
				<span>{m.paperLockedAfterSubmission()}</span>
			</div>
		{/if}

		<!-- Body: preview panel + editor + context panel -->
		<div
			role="region"
			class="panel-body flex min-h-0 flex-1"
			class:cursor-col-resize={dragging !== null}
			class:select-none={dragging !== null}
			onpointermove={onDragMove}
			onpointerup={stopDrag}
			onpointerleave={stopDrag}
		>
			{#if status !== 'FINAL'}
				{@render previewPanel()}
			{/if}

			<!-- Center: preview (FINAL) or editor -->
			{@render centerPanel()}

			<!-- Drag handle + right context panel: hidden on FINAL -->
			{#if status !== 'FINAL'}
				{@render contextPanel(committee)}
			{/if}
		</div>
	</div>

	<SnapshotHistoryModal bind:open={historyOpen} {paperId} close={() => (historyOpen = false)} />

	{@render dialogs(committee)}

	<AiOnboardingModal
		bind:open={aiOnboardingOpen}
		hasBackend={aiHasBackend}
		savedPreference={getAiOnboarded() ? getAiPreference() : null}
		initialModelTier={getLocalModelTier()}
		onConfirm={applyAiPreference}
	/>

	<!-- AI model status (chairs only) -->
	{@render aiStatus()}
{:else}
	<div class="flex h-full w-full items-center justify-center">
		<i aria-hidden="true" class="ph-fill ph-spinner-gap animate-spin text-3xl opacity-50"></i>
	</div>
{/if}

{#snippet paperTitle(paper: Paper)}
	<div class="min-w-0">
		{#if editingDocNum && team}
			<div class="flex items-center gap-1">
				<!-- svelte-ignore a11y_autofocus -->
				<input
					class="input input-bordered input-sm w-36"
					type="text"
					bind:value={docNumDraft}
					onkeydown={(e) => {
						if (e.key === 'Enter') saveDocNum();
						if (e.key === 'Escape') editingDocNum = false;
					}}
					onblur={saveDocNum}
					autofocus
					aria-label={m.documentNumber()}
				/>
			</div>
		{:else}
			<div class="flex items-center gap-1">
				<span
					class="truncate text-lg font-semibold"
					style="view-transition-name: paper-title-{paper.id};"
				>
					{paper.documentNumber || paper.title || workingPaperName(paperId)}
				</span>
				{#if team && status === 'SUBMITTED'}
					<button
						class="btn btn-ghost btn-xs opacity-50 hover:opacity-100"
						title="Set document number"
						onclick={startEditingDocNum}
					>
						<i aria-hidden="true" class="ph-fill ph-pen text-xs"></i>
					</button>
				{/if}
			</div>
		{/if}
		<div class="text-base-content/60 text-xs">{paper.agendaItem?.title ?? ''}</div>
	</div>
{/snippet}

{#snippet lifecycle(paper: Paper, committee: Committee)}
	{#if team}
		<ChairControlBar
			paper={{ id: paper.id, status, title: paper.documentNumber ?? paper.title ?? '' }}
			committee={{
				id: committee.id,
				amendmentSubmissionOpen: committee.amendmentSubmissionOpen,
				amendmentSponsoringOpen: committee.amendmentSponsoringOpen,
				supportReevaluationOpen: committee.supportReevaluationOpen,
				activeVotingSession: committee.activeVotingSession ?? null
			}}
			currentClauseId={operative[committee.currentOperativeIndex]?.id ?? null}
			currentClauseLabel={m.clauseN({ n: String(committee.currentOperativeIndex + 1) })}
			onStartClauseVote={startClauseVote}
		/>
	{:else}
		<!-- Read-only lifecycle chain for participants -->
		<ul class="steps steps-horizontal text-xs" data-tour="paper.lifecycle">
			{#each PAPER_STATUS_ORDER as s, i (s)}
				<li class="step {i <= currentStatusIdx ? 'step-primary' : ''}">
					<span class:font-bold={i === currentStatusIdx} class:opacity-50={i > currentStatusIdx}>
						{statusLabel(s)}
					</span>
				</li>
			{/each}
		</ul>
	{/if}
{/snippet}

{#snippet headerActions(paper: Paper, committee: Committee)}
	<div class="ml-auto flex items-center gap-2">
		{@render exportButtons(paper)}
		{#if yClient && yClient.remotePresences.length > 0}
			<button
				class="btn btn-ghost btn-sm gap-1.5"
				onclick={() => (presenceOpen = true)}
				title="Co-editors"
			>
				<i aria-hidden="true" class="ph-fill ph-users"></i>
				{yClient.remotePresences.length}
			</button>
		{/if}
		<DelegatorOriginBadge
			delegatorVersion={paper?.delegatorVersion}
			detached={paper?.detachedAt != null}
		/>
		{#if yClient}
			<SyncBadge
				connectionState={yClient.connectionState}
				persistenceLoaded={yClient.persistenceLoaded}
				wsSynced={yClient.wsSynced}
			/>
		{/if}
		{#if status === 'WORKING_PAPER' && (isCreator || team)}
			<button
				class="btn btn-ghost btn-sm"
				data-tour={team ? 'chair-paper.share' : 'paper.share'}
				onclick={openShareCodes}
				title={m.shareCodes()}
			>
				<i aria-hidden="true" class="ph-fill ph-share-network"></i>
				{m.shareCodes()}
			</button>
		{/if}
		<button
			class="btn btn-ghost btn-sm"
			data-tour={team ? 'chair-paper.sponsors' : 'paper.sponsors'}
			onclick={toggleSponsors}
			title={m.sponsors()}
		>
			<i aria-hidden="true" class="ph-fill ph-user-gear"></i>
			{m.sponsors()}
		</button>
		{#if team}
			{@render chairActions(committee)}
		{/if}
		{#if status === 'WORKING_PAPER' && (isCreator || team)}
			<button
				class="btn btn-primary btn-sm"
				data-tour={team ? undefined : 'paper.submit'}
				disabled={submitting}
				onclick={openSubmitConfirm}
			>
				<i aria-hidden="true" class="ph-fill ph-paper-plane-tilt"></i>
				{m.submit()}
			</button>
		{/if}
	</div>
{/snippet}

{#snippet exportButtons(paper: Paper)}
	<button
		type="button"
		class="btn btn-ghost btn-sm"
		title={m.downloadTypst()}
		aria-label={m.downloadTypst()}
		disabled={!yClient?.store.snapshot}
		onclick={() =>
			yClient?.store.snapshot &&
			downloadResolutionTypst(yClient.store.snapshot, headerData, paper?.documentNumber)}
	>
		<i aria-hidden="true" class="ph-fill ph-file-code"></i>
	</button>
	<button
		type="button"
		class="btn btn-ghost btn-sm"
		title={m.downloadPdf()}
		aria-label={m.downloadPdf()}
		disabled={!yClient?.store.snapshot || isExportingPdf}
		onclick={exportPdf}
	>
		{#if isExportingPdf}
			<span class="loading loading-spinner loading-xs"></span>
		{:else}
			<i aria-hidden="true" class="ph-fill ph-file-pdf"></i>
		{/if}
	</button>
{/snippet}

{#snippet chairActions(committee: Committee)}
	<div class="dropdown dropdown-end">
		<button tabindex="0" class="btn btn-ghost btn-sm" title="Committee settings">
			<i aria-hidden="true" class="ph-fill ph-gear"></i>
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
		data-tour="chair-paper.ai"
		onclick={openAiSettings}
		title={m.aiOnboardingOpenSettings()}
	>
		<i aria-hidden="true" class="ph-fill ph-robot"></i>
	</button>
	<button
		class="btn btn-ghost btn-sm"
		data-tour="chair-paper.history"
		onclick={openHistory}
		title={m.documentHistory()}
	>
		<i aria-hidden="true" class="ph-fill ph-clock-counter-clockwise"></i>
	</button>
	<button
		class="btn btn-sm"
		class:btn-secondary={isActiveDr}
		class:btn-ghost={!isActiveDr}
		disabled={togglingActiveDr || !!activeDrBlocker}
		onclick={toggleActiveDr}
		title={activeDrBlocker ?? (isActiveDr ? m.activeDraftResolution() : m.setActiveDr())}
	>
		<i aria-hidden="true" class="ph-fill ph-star"></i>
		{isActiveDr ? m.activeDraftResolution() : m.setActiveDr()}
	</button>
{/snippet}

<!-- Left: collapsible document preview (hidden on FINAL) -->
{#snippet previewPanel()}
	{#if previewOpen}
		<aside
			class="hidden shrink-0 flex-col overflow-hidden lg:flex"
			style="width: {previewWidth}px;"
			data-tour={team ? undefined : 'paper.preview'}
		>
			<div class="border-base-300 flex items-center justify-between border-b px-3 py-2">
				<span class="text-sm font-semibold">
					<i aria-hidden="true" class="ph-fill ph-eye mr-1.5"></i>{m.resolutionPreview()}
				</span>
				<button
					class="btn btn-ghost btn-xs"
					title={m.resolutionHidePreview()}
					onclick={hidePreview}
				>
					<i aria-hidden="true" class="ph-fill ph-caret-left"></i>
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
			onpointerdown={(e) => {
				e.preventDefault();
				e.currentTarget.setPointerCapture(e.pointerId);
				startDrag('preview');
			}}
		>
			<div
				class="bg-base-300 w-px group-hover:w-1 group-hover:bg-primary/40 group-active:bg-primary/60 transition-all"
			></div>
		</div>
	{:else}
		<div class="hidden shrink-0 flex-col items-center pt-2 lg:flex">
			<button class="btn btn-ghost btn-xs" title={m.resolutionShowPreview()} onclick={showPreview}>
				<i aria-hidden="true" class="ph-fill ph-caret-right"></i>
			</button>
		</div>
	{/if}
{/snippet}

{#snippet centerPanel()}
	<div class="min-h-0 flex-1 overflow-auto" data-tour={team ? undefined : 'paper.editor'}>
		{#if browser && yClient}
			{#if status === 'FINAL'}
				<div class="min-h-0 flex-1 overflow-auto p-4">
					<ResolutionPreview
						resolution={yClient.store.snapshot}
						{headerData}
						labels={englishLabels}
						amendments={amendmentOverlays}
						{rejectedClauseIds}
					/>
				</div>
			{:else}
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
						clauseAnnotations={clauseAnnotationsSnippet}
						preambleAnnotations={preambleAnnotationsSnippet}
					/>
				</div>
			{/if}
		{/if}
	</div>
{/snippet}

{#snippet contextPanel(committee: Committee)}
	<div
		role="separator"
		aria-label="Resize context panel"
		aria-orientation="vertical"
		class="drag-handle group hidden w-3 shrink-0 cursor-col-resize items-stretch justify-center lg:flex"
		onpointerdown={(e) => {
			e.preventDefault();
			e.currentTarget.setPointerCapture(e.pointerId);
			startDrag('context');
		}}
	>
		<div
			class="bg-base-300 w-px group-hover:w-1 group-hover:bg-primary/40 group-active:bg-primary/60 transition-all"
		></div>
	</div>

	<aside
		class="hidden shrink-0 overflow-hidden lg:flex lg:flex-col"
		style="width: {contextWidth}px;"
		data-tour={team ? 'chair-paper.amendments' : 'paper.context'}
	>
		<ClauseContextPanel
			{paperId}
			committeeId={committee.id}
			{selectedClauseId}
			{selectedClauseIndex}
			{operative}
			{viewer}
			submissionOpen={committee.amendmentSubmissionOpen}
			sponsoringOpen={committee.amendmentSponsoringOpen}
			{minAmendmentSponsors}
			activeAmendmentId={committee.activeAmendmentId ?? null}
			simpleMajority={committee.simpleMajority}
			showVoteTab={false}
			{requestedTab}
			hasReview={selectedClauseId != null && reviewClauseIds.has(selectedClauseId)}
			openTriggerId={pendingOpenTriggerId}
			ondeselect={() => (selectedClauseId = null)}
			onselectclause={(id) => (selectedClauseId = id)}
		/>
	</aside>
{/snippet}

{#snippet dialogs(committee: Committee)}
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
						<i aria-hidden="true" class="ph-fill ph-trash"></i>
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

	<!-- Out-of-order clause selection confirmation -->
	{#if outOfOrderClauseIndex !== null}
		{@const clauseIdx = outOfOrderClauseIndex}
		<div class="modal modal-open">
			<div class="modal-box">
				<h3 class="text-lg font-bold">{m.selectOutOfOrderTitle()}</h3>
				<p class="py-3">{m.selectOutOfOrderDescription()}</p>
				<div class="modal-action">
					<button class="btn btn-ghost" onclick={() => (outOfOrderClauseIndex = null)}>
						{m.cancel()}
					</button>
					<button
						class="btn btn-warning"
						onclick={async () => {
							const idx = clauseIdx;
							outOfOrderClauseIndex = null;
							await setCurrentClause(idx);
						}}
					>
						<i aria-hidden="true" class="ph-fill ph-play"></i>
						{m.selectOutOfOrderConfirm()}
					</button>
				</div>
			</div>
			<button
				class="modal-backdrop"
				aria-label={m.cancel()}
				onclick={() => (outOfOrderClauseIndex = null)}
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
						{#if submitting}<i aria-hidden="true" class="ph-fill ph-spinner-gap animate-spin"
							></i>{/if}
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

	<!-- Share codes modal (working paper stage only) -->
	{#if shareOpen}
		<div class="modal modal-open">
			<div class="modal-box bg-base-200">
				<div class="mb-3 flex items-center justify-between">
					<h3 class="text-lg font-bold">{m.shareCodes()}</h3>
					<button
						class="btn btn-ghost btn-sm"
						onclick={() => (shareOpen = false)}
						aria-label={m.close()}
					>
						<i aria-hidden="true" class="ph-fill ph-x"></i>
					</button>
				</div>
				<div class="px-4">
					<ShareCodePanel {paperId} />
				</div>
			</div>
			<button class="modal-backdrop" aria-label={m.close()} onclick={() => (shareOpen = false)}
			></button>
		</div>
	{/if}

	<!-- Co-editors modal -->
	{#if presenceOpen && yClient}
		<div class="modal modal-open">
			<div class="modal-box">
				<div class="mb-3 flex items-center justify-between">
					<h3 class="text-lg font-bold">
						<i aria-hidden="true" class="ph-fill ph-users mr-2"></i>Co-editors
					</h3>
					<button
						class="btn btn-ghost btn-sm"
						onclick={() => (presenceOpen = false)}
						aria-label={m.close()}
					>
						<i aria-hidden="true" class="ph-fill ph-x"></i>
					</button>
				</div>
				<div class="px-1">
					<PresenceIndicator remotePresences={yClient.remotePresences} {viewer} />
				</div>
			</div>
			<button class="modal-backdrop" aria-label={m.close()} onclick={() => (presenceOpen = false)}
			></button>
		</div>
	{/if}

	<!-- Sponsors drawer -->
	{#if detailsOpen}
		<div class="modal modal-open">
			<div class="modal-box bg-base-200">
				<div class="mb-3 flex items-center justify-between">
					<h3 class="text-lg font-bold">{m.sponsors()}</h3>
					<button
						class="btn btn-ghost btn-sm"
						onclick={() => (detailsOpen = false)}
						aria-label={m.close()}
					>
						<i aria-hidden="true" class="ph-fill ph-x"></i>
					</button>
				</div>
				<div class="space-y-4 px-4">
					<div>
						<SponsorPanel {paperId} committeeId={committee.id} paperStatus={status} {viewer} />
					</div>
				</div>
			</div>
			<button class="modal-backdrop" aria-label={m.close()} onclick={() => (detailsOpen = false)}
			></button>
		</div>
	{/if}
{/snippet}

{#snippet aiStatus()}
	{#if aiDownloadProgress !== null || aiReady || aiDisabledReason !== null}
		<div
			{@attach dodgeOnHover((near) => (aiNotifDodging = near))}
			transition:fly={{ x: 80, duration: 250, opacity: 0 }}
			class="pointer-events-none fixed bottom-4 right-4 z-50 transition-all duration-300 ease-out {aiNotifDodging
				? 'translate-y-2 scale-95 opacity-0'
				: 'translate-y-0 scale-100 opacity-100'}"
		>
			{#if aiDownloadProgress !== null}
				<div
					class="flex w-56 flex-col gap-1.5 rounded-xl border border-base-300 bg-base-100 p-3 shadow-lg"
				>
					<div class="flex items-center justify-between text-xs font-medium">
						<span>Preparing AI model</span>
						<span class="tabular-nums opacity-60">{Math.round(aiDownloadProgress * 100)}%</span>
					</div>
					<progress class="progress progress-primary w-full" value={aiDownloadProgress} max={1}
					></progress>
					{#if aiModelId}
						<p class="text-xs opacity-40 truncate">{formatModelId(aiModelId)}</p>
					{/if}
				</div>
			{:else if aiReady}
				<div
					class="flex w-56 items-center gap-2 rounded-xl border border-base-300 bg-base-100 p-3 shadow-lg text-xs"
				>
					<i aria-hidden="true" class="ph-fill ph-check-circle text-success shrink-0"></i>
					<div class="min-w-0">
						<p class="font-medium">AI model ready</p>
						{#if aiModelId}
							<p class="opacity-40 truncate">{formatModelId(aiModelId)}</p>
						{/if}
					</div>
				</div>
			{:else if aiDisabledReason !== null}
				<div
					class="flex w-56 items-start gap-2 rounded-xl border border-base-300 bg-base-100 p-3 shadow-lg text-xs"
				>
					<i aria-hidden="true" class="ph-fill ph-cpu opacity-40 mt-0.5 shrink-0"></i>
					<div>
						<p class="font-medium">AI features unavailable</p>
						<p class="opacity-50 mt-0.5">{aiDisabledReason}</p>
					</div>
				</div>
			{/if}
		</div>
	{/if}
{/snippet}

{#snippet preambleAnnotationsSnippet({ clause }: { clause: { id: string } })}
	{#if yClient}
		<ClausePresenceBadges
			clauseId={clause.id}
			presence={yClient.presence}
			remotePresences={yClient.remotePresences}
			{viewer}
		/>
	{/if}
{/snippet}

{#snippet clauseAnnotationsSnippet({ clause, index }: { clause: { id: string }; index: number })}
	{@const isCurrent = index === committee?.currentOperativeIndex}
	{@const isNext = index === (committee?.currentOperativeIndex ?? -1) + 1}
	<div
		use:highlightClause={{
			selected: selectedClauseId === clause.id,
			current: isCurrent && isDebatePhase,
			clauseId: clause.id,
			commentCount: commentCountFor(clause.id),
			amendmentCount: amendmentCountFor(clause.id),
			showSetCurrentBtn: team && isDebatePhase,
			isCurrentClause: isCurrent,
			isNextClause: isNext,
			onSetCurrentNext: () => setCurrentClause(index),
			onSetCurrentOutOfOrder: () => (outOfOrderClauseIndex = index)
		}}
	>
		<div class="flex flex-col gap-0.5">
			{#if yClient}
				<ClausePresenceBadges
					clauseId={clause.id}
					presence={yClient.presence}
					remotePresences={yClient.remotePresences}
					{viewer}
				/>
			{/if}
			{@render clauseBadges(clause.id, isCurrent && isDebatePhase)}
		</div>
	</div>
{/snippet}

{#snippet clauseBadges(clauseId: string, current: boolean)}
	{@const amendmentCount = amendmentCountFor(clauseId)}
	{@const commentCount = commentCountFor(clauseId)}
	{@const outcome = clauseVoteMap.get(clauseId)?.vote?.outcome}
	{@const hasReview = reviewClauseIds.has(clauseId)}
	{#if hasClauseBadges({ current, amendmentCount, commentCount, outcome, hasReview })}
		<div class="flex items-center gap-1" class:opacity-100={selectedClauseId === clauseId}>
			{#if current}
				<button class="btn btn-xs btn-secondary gap-1" onclick={() => selectClause(clauseId)}>
					<i aria-hidden="true" class="ph-fill ph-caret-right"></i>{m.currentClause()}
				</button>
			{/if}
			{#if outcome}
				<button
					class="btn btn-xs gap-1 {outcome === 'ADOPTED' ? 'btn-success' : 'btn-error'}"
					onclick={() => selectClause(clauseId)}
				>
					{outcome === 'ADOPTED' ? m.adopted() : m.rejected()}
				</button>
			{/if}
			{@render amendmentBadge(clauseId, amendmentCount, hasReview)}
			{#if commentCount}
				<button class="btn btn-xs gap-1" onclick={() => selectClauseWithTab(clauseId, 'comments')}>
					<i aria-hidden="true" class="ph-fill ph-chat"></i>{commentCount}
				</button>
			{/if}
		</div>
	{/if}
{/snippet}

{#snippet amendmentBadge(clauseId: string, amendmentCount: number, hasReview: boolean)}
	{#if amendmentCount}
		<button
			class="btn btn-xs btn-warning gap-1 relative"
			onclick={() =>
				hasReview
					? selectClauseAndOpenReview(clauseId)
					: selectClauseWithTab(clauseId, 'amendments')}
		>
			<i aria-hidden="true" class="ph-fill ph-pen-nib"></i>{amendmentCount}
			{#if hasReview}<span class="badge badge-error badge-xs absolute -right-1 -top-1">!</span>{/if}
		</button>
	{:else if hasReview}
		<button
			class="btn btn-xs btn-error gap-1"
			aria-label={m.goToReview()}
			onclick={() => selectClauseAndOpenReview(clauseId)}
		>
			<i aria-hidden="true" class="ph-fill ph-warning"></i>
		</button>
	{/if}
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
		right: -2.5rem;
		top: 0;
		bottom: 0;
		width: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		background: var(--color-base-300);
		border-radius: 0 var(--radius-box) var(--radius-box) 0;
		font-size: 0.9rem;
		color: var(--color-base-content);
		opacity: 0.6;
		transition:
			opacity 0.15s,
			background-color 0.15s;
		border: none;
	}
	:global(.clause-side-handle:hover) {
		opacity: 1;
		background: var(--color-base-content);
		color: var(--color-base-100);
	}
	:global(.clause-side-handle.is-selected) {
		background: var(--color-primary);
		color: var(--color-primary-content);
		opacity: 1;
	}
	:global(.clause-handle-icon-wrap) {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	:global(.clause-handle-count) {
		position: absolute;
		min-width: 1rem;
		height: 1rem;
		font-size: 0.6rem;
		line-height: 1rem;
		text-align: center;
		background: var(--color-neutral);
		color: var(--color-neutral-content);
		border-radius: 999px;
		padding: 0 2px;
		font-weight: 700;
	}
	:global(.clause-handle-count--comment) {
		top: -6px;
		right: -7px;
	}
	:global(.clause-handle-count--amendment) {
		bottom: -6px;
		left: -7px;
	}
	:global(.clause-side-handle.is-selected .clause-handle-count) {
		background: var(--color-primary-content);
		color: var(--color-primary);
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

	/* "Set as current clause" button — absolutely positioned at the bottom of each
	   clause card so it doesn't affect card height. */
	:global(.clause-set-current-btn) {
		position: absolute;
		bottom: -0.75rem;
		left: -0.5rem;
		z-index: 3;
	}
	:global(.clause-set-current-btn--other) {
		background: var(--color-base-300) !important;
	}
	:global(.clause-set-current-btn--other:hover) {
		background: var(--color-base-content) !important;
		color: var(--color-base-100);
	}

	/* Strip the fieldset chrome so the editor blends into the panel. */
	.editor-no-internal-preview :global(fieldset) {
		border: none;
		border-radius: 0;
		background: transparent;
		padding: 1rem 3.5rem 1rem 1rem;
	}

	/* Extra vertical gap between individual operative clause cards. */
	.editor-no-internal-preview :global(.space-y-4 > div) {
		padding-bottom: 1.25rem;
	}
	.editor-no-internal-preview :global(fieldset > legend) {
		display: none;
	}
</style>
