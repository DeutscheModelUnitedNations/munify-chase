<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { urqlClient } from '$lib/api/client';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import { onDestroy, tick, untrack } from 'svelte';
	import { fly } from 'svelte/transition';
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
	import {
		createPaperYjsClient,
		type PaperYjsClient,
		type PresenceUserMeta
	} from '$lib/api/yjs/createPaperYjs.svelte';
	import PresenceIndicator from './PresenceIndicator.svelte';
	import ClausePresenceBadges from './ClausePresenceBadges.svelte';

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
	import { workingPaperName } from '$lib/helpers/paperName';
	import { launchClauseVote } from './resolutionVotes';
	import { openVotingModal, resumeVotingModal } from '$lib/components/voting/votingModal';
	import { downloadResolutionTypst, downloadResolutionPdf } from '$lib/utils/resolutionExport';
	import { getEngine, unloadEngine } from '$lib/ai/model';
	import { assessAiCapability } from '$lib/ai/assess';
	import {
		initAiPreference,
		getAiOnboarded,
		getAiPreference,
		getLocalModelTier,
		setAiPreference,
		type AiPreference
	} from '$lib/ai/aiPreference.svelte';
	import AiOnboardingModal from './AiOnboardingModal.svelte';

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
		totalPresent: true,
		simpleMajority: true,
		twoThirdsMajority: true,
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
	const reviewItemsForBadges = await client.liveQuery.amendmentReviewItems({
		__args: { where: { paper: { id: paperId } } },
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
	const rejectedClauseIds = $derived(
		(clauseVotes ?? []).filter((v) => v.vote?.outcome === 'REJECTED').map((v) => v.clauseId)
	);
	const showVoteTab = $derived(status !== 'WORKING_PAPER' && status !== 'SUBMITTED');
	// Lookup map for clause vote records (for inline vote button + outcome badge).
	const clauseVoteMap = $derived(new Map((clauseVotes ?? []).map((v) => [v.clauseId, v])));

	const amendmentCountMap = $derived(
		(amendmentRows ?? [])
			.filter((a) => a.status === 'SUBMITTED' && (a.sponsors?.length ?? 0) >= minAmendmentSponsors)
			.reduce((m, a) => {
				if (a.targetClauseId) m.set(a.targetClauseId, (m.get(a.targetClauseId) ?? 0) + 1);
				return m;
			}, new Map<string, number>())
	);
	const commentCountMap = $derived(
		(comments ?? []).reduce((m, c) => {
			if (c.clauseId) m.set(c.clauseId, (m.get(c.clauseId) ?? 0) + 1);
			return m;
		}, new Map<string, number>())
	);
	const reviewClauseIds = $derived(
		new Set(
			(reviewItemsForBadges ?? [])
				.filter((r) => r.phase !== 'RESOLVED' && r.triggerAmendment?.targetClauseId)
				.map((r) => r.triggerAmendment!.targetClauseId as string)
		)
	);
	// Maps clauseId → first unresolved trigger amendment ID for direct modal opening.
	const reviewTriggerForClause = $derived(
		(reviewItemsForBadges ?? [])
			.filter(
				(r) =>
					r.phase !== 'RESOLVED' && r.triggerAmendment?.targetClauseId && r.triggerAmendment?.id
			)
			.reduce((map, r) => {
				const clauseId = r.triggerAmendment!.targetClauseId as string;
				if (!map.has(clauseId)) map.set(clauseId, r.triggerAmendment!.id as string);
				return map;
			}, new Map<string, string>())
	);
	let pendingOpenTriggerId = $state<string | null>(null);

	function amendmentCountFor(clauseId: string) {
		return amendmentCountMap.get(clauseId) ?? 0;
	}
	function commentCountFor(clauseId: string) {
		return commentCountMap.get(clauseId) ?? 0;
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

	function dodgeOnHover(node: HTMLElement) {
		const onMove = (e: MouseEvent) => {
			const r = node.getBoundingClientRect();
			const pad = 24;
			aiNotifDodging =
				e.clientX >= r.left - pad &&
				e.clientX <= r.right + pad &&
				e.clientY >= r.top - pad &&
				e.clientY <= r.bottom + pad;
		};
		window.addEventListener('mousemove', onMove);
		return () => {
			window.removeEventListener('mousemove', onMove);
			aiNotifDodging = false;
		};
	}

	function formatModelId(id: string): string {
		// Strip quantisation suffix (e.g. -q4f32_1-MLC) and replace dashes with spaces
		return id.replace(/-q\d+f\d+.*$/, '').replaceAll('-', ' ');
	}

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
		initAiPreference();
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
		const created = untrack(() => {
			const presenceUser = {
				id: currentUser.id || 'anonymous',
				name:
					[currentUser.givenName, currentUser.familyName].filter(Boolean).join(' ').trim() ||
					currentUser.email ||
					'Anonymous',
				color: undefined
			};
			const presenceMeta: PresenceUserMeta = {
				conferenceUserType: (conferenceUsers?.[0]?.conferenceUserType ??
					'SPECTATOR') as PresenceUserMeta['conferenceUserType'],
				nationName: conferenceUsers?.[0]?.committeeMember?.representation?.name ?? null,
				alpha2Code: conferenceUsers?.[0]?.committeeMember?.representation?.alpha2Code ?? null,
				alpha3Code: conferenceUsers?.[0]?.committeeMember?.representation?.alpha3Code ?? null
			};
			return createPaperYjsClient({ paperId: pid, user: presenceUser, meta: presenceMeta });
		});
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
			return '<i class="fas fa-chevron-right"></i>';
		}

		type BtnState = 'hidden' | 'next' | 'other';
		let lastBtnState: BtnState | null = null;

		function applyBtnState(p: typeof params) {
			const state: BtnState =
				!p.showSetCurrentBtn || p.isCurrentClause ? 'hidden' : p.isNextClause ? 'next' : 'other';

			// Always keep the callbacks fresh so closures don't go stale.
			if (state === 'next') setCurrentBtn.onclick = () => p.onSetCurrentNext?.();
			else if (state === 'other') setCurrentBtn.onclick = () => p.onSetCurrentOutOfOrder?.();

			if (state === lastBtnState) return;
			lastBtnState = state;

			if (state === 'hidden') {
				setCurrentBtn.style.display = 'none';
			} else if (state === 'next') {
				setCurrentBtn.style.display = '';
				setCurrentBtn.className =
					'clause-set-current-btn clause-set-current-btn--next btn btn-xs btn-success gap-1';
				setCurrentBtn.innerHTML = `<i class="fas fa-play"></i>${m.setAsCurrentClause()}`;
			} else {
				setCurrentBtn.style.display = '';
				setCurrentBtn.className =
					'clause-set-current-btn clause-set-current-btn--other btn btn-xs btn-ghost gap-1';
				setCurrentBtn.innerHTML = '<i class="fas fa-play"></i>';
			}
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
	let outOfOrderClauseIndex = $state<number | null>(null);

	async function setCurrentClause(index: number) {
		const committeeId = committee?.id;
		if (!committeeId) return;
		try {
			await client.mutate.setCommitteeResolutionToggles({
				__args: { committeeId, currentOperativeIndex: index },
				id: true,
				currentOperativeIndex: true
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed');
		}
	}

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
								if (e.key === 'Escape') editingDocNum = false;
							}}
							onblur={saveDocNum}
							autofocus
						/>
					</div>
				{:else}
					<div class="flex items-center gap-1">
						<span class="truncate text-lg font-semibold">
							{paper.documentNumber || paper.title || workingPaperName(paperId)}
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
					currentClauseId={operative[committee.currentOperativeIndex]?.id ?? null}
					currentClauseLabel={m.clauseN({ n: String(committee.currentOperativeIndex + 1) })}
					onStartClauseVote={startClauseVote}
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
					type="button"
					class="btn btn-ghost btn-sm"
					title={m.downloadTypst()}
					aria-label={m.downloadTypst()}
					disabled={!yClient?.store.snapshot}
					onclick={() =>
						yClient?.store.snapshot &&
						downloadResolutionTypst(yClient.store.snapshot, headerData, paper?.documentNumber)}
				>
					<i class="fas fa-file-code"></i>
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
						<i class="fas fa-file-pdf"></i>
					{/if}
				</button>
				{#if yClient && yClient.remotePresences.length > 0}
					<button
						class="btn btn-ghost btn-sm gap-1.5"
						onclick={() => (presenceOpen = true)}
						title="Co-editors"
					>
						<i class="fas fa-users"></i>
						{yClient.remotePresences.length}
					</button>
				{/if}
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
						onclick={() => (shareOpen = true)}
						title={m.shareCodes()}
					>
						<i class="fas fa-share-nodes"></i>
						{m.shareCodes()}
					</button>
				{/if}
				<button
					class="btn btn-ghost btn-sm"
					onclick={() => (detailsOpen = !detailsOpen)}
					title={m.sponsors()}
				>
					<i class="fas fa-users-gear"></i>
					{m.sponsors()}
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
						onclick={() => (aiOnboardingOpen = true)}
						title={m.aiOnboardingOpenSettings()}
					>
						<i class="fas fa-robot"></i>
					</button>
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
				{#if status === 'WORKING_PAPER' && (isCreator || team)}
					<button
						class="btn btn-primary btn-sm"
						disabled={submitting}
						onclick={() => (submitConfirmOpen = true)}
					>
						<i class="fas fa-paper-plane"></i>
						{m.submit()}
					</button>
				{/if}
			</div>
		</header>

		<!-- Locked-paper notice: shown to creators/editors while the paper is in SUBMITTED stage -->
		{#if !team && status === 'SUBMITTED' && isCreatorOrEditor}
			<div
				role="status"
				class="bg-warning/10 border-warning/30 flex items-center gap-2 border-b px-4 py-2 text-sm"
			>
				<i class="fas fa-lock text-warning shrink-0"></i>
				<span>{m.paperLockedAfterSubmission()}</span>
			</div>
		{/if}

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
							clauseAnnotations={clauseAnnotationsSnippet}
							preambleAnnotations={preambleAnnotationsSnippet}
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
				>
					<ClauseContextPanel
						{paperId}
						committeeId={committee.id}
						{selectedClauseId}
						{selectedClauseIndex}
						{operative}
						{operativeCount}
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
						<i class="fas fa-play"></i>
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
						<i class="fas fa-xmark"></i>
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
						<i class="fas fa-users mr-2"></i>Co-editors
					</h3>
					<button
						class="btn btn-ghost btn-sm"
						onclick={() => (presenceOpen = false)}
						aria-label={m.close()}
					>
						<i class="fas fa-xmark"></i>
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
						<i class="fas fa-xmark"></i>
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

	<AiOnboardingModal
		bind:open={aiOnboardingOpen}
		hasBackend={aiHasBackend}
		initialModelTier={getLocalModelTier()}
		onConfirm={applyAiPreference}
	/>

	<!-- AI model status (chairs only) -->
	{#if aiDownloadProgress !== null || aiReady || aiDisabledReason !== null}
		<div
			use:dodgeOnHover
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
					<i class="fas fa-circle-check text-success shrink-0"></i>
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
					<i class="fas fa-microchip opacity-40 mt-0.5 shrink-0"></i>
					<div>
						<p class="font-medium">AI features unavailable</p>
						<p class="opacity-50 mt-0.5">{aiDisabledReason}</p>
					</div>
				</div>
			{/if}
		</div>
	{/if}
{:else}
	<div class="flex h-full w-full items-center justify-center">
		<i class="fas fa-spinner fa-spin text-3xl opacity-50"></i>
	</div>
{/if}

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
	{@const ac = amendmentCountFor(clause.id)}
	{@const cc = commentCountFor(clause.id)}
	{@const existingVote = clauseVoteMap.get(clause.id)}
	{@const outcome = existingVote?.vote?.outcome}
	{@const isCurrent = index === committee?.currentOperativeIndex}
	{@const isNext = index === (committee?.currentOperativeIndex ?? -1) + 1}
	{@const hasReview = reviewClauseIds.has(clause.id)}
	<div
		use:highlightClause={{
			selected: selectedClauseId === clause.id,
			current: isCurrent && isDebatePhase,
			clauseId: clause.id,
			commentCount: cc,
			amendmentCount: ac,
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
			{#if (isCurrent && isDebatePhase) || ac || cc || outcome || hasReview}
				<div class="flex items-center gap-1" class:opacity-100={selectedClauseId === clause.id}>
					{#if isCurrent && isDebatePhase}
						<button class="btn btn-xs btn-secondary gap-1" onclick={() => selectClause(clause.id)}>
							<i class="fas fa-caret-right"></i>{m.currentClause()}
						</button>
					{/if}
					{#if outcome}
						<button
							class="btn btn-xs gap-1 {outcome === 'ADOPTED' ? 'btn-success' : 'btn-error'}"
							onclick={() => selectClause(clause.id)}
						>
							{outcome === 'ADOPTED' ? m.adopted() : m.rejected()}
						</button>
					{/if}
					{#if ac}
						<button
							class="btn btn-xs btn-warning gap-1 relative"
							onclick={() =>
								hasReview
									? selectClauseAndOpenReview(clause.id)
									: selectClauseWithTab(clause.id, 'amendments')}
						>
							<i class="fas fa-pen-nib"></i>{ac}
							{#if hasReview}<span class="badge badge-error badge-xs absolute -right-1 -top-1"
									>!</span
								>{/if}
						</button>
					{:else if hasReview}
						<button
							class="btn btn-xs btn-error gap-1"
							onclick={() => selectClauseAndOpenReview(clause.id)}
						>
							<i class="fas fa-triangle-exclamation"></i>
						</button>
					{/if}
					{#if cc}
						<button
							class="btn btn-xs gap-1"
							onclick={() => selectClauseWithTab(clause.id, 'comments')}
						>
							<i class="fas fa-comment"></i>{cc}
						</button>
					{/if}
				</div>
			{/if}
		</div>
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
