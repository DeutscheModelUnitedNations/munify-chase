<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import type { PageData } from './$houdini';
	import { graphql } from '$houdini';
	import { onMount } from 'svelte';
	import { ParticipantPaperDetailSubscription } from './paperDetailSubscription';
	import { PaperClauseLocksSubscription } from './lockSubscription';
	import { ParticipantCommitteeSubscription } from '../../committeeSubscription';
	import { ParticipantPaperCommentsSubscription } from './commentsSubscription';
	import { ParticipantAmendmentsSubscription } from './amendmentsSubscription';
	import {
		ResolutionEditor,
		migrateResolution,
		createEmptyOperativeClause,
		type Resolution,
		type ResolutionHeaderData,
		type AmendmentOverlay,
		type OperativeClause
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import Modal from '$lib/components/Modal.svelte';
	import Fieldset from '$lib/components/Fieldset.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import CommentSection from '$lib/components/CommentSection.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import toast from 'svelte-french-toast';
	import { fly, fade } from 'svelte/transition';
	import { SvelteMap } from 'svelte/reactivity';

	let { data }: { data: PageData } = $props();

	let query = $derived(data?.ParticipantPaperDetailQuery);
	let identityQuery = $derived(data?.ParticipantIdentityQuery);
	let layoutQuery = $derived(data?.ParticipantCommitteeLayoutQuery);
	let committee = $derived(
		$ParticipantCommitteeSubscription.data?.findFirstCommittee ??
			$layoutQuery.data?.findFirstCommittee
	);

	let conferenceUser = $derived($identityQuery.data?.findManyConferenceUser?.[0]);
	let role = $derived(conferenceUser?.conferenceUserType);
	let myCommitteeMemberId = $derived(conferenceUser?.committeeMemberId);
	let myConferenceUserId = $derived(conferenceUser?.id);
	let isDelegate = $derived(role === 'DELEGATE');

	// Use subscription data with query fallback, but don't overwrite local edits
	let remotePaper = $derived(
		$ParticipantPaperDetailSubscription.data?.findFirstResolutionPaper ??
			$query.data?.findFirstResolutionPaper
	);

	let paper = $derived(remotePaper);

	// Access control
	let isCreator = $derived(paper?.creatorCommitteeMemberId === myCommitteeMemberId);
	let isEditor = $derived(paper?.editors.some((e) => e.conferenceUserId === myConferenceUserId));
	let canEdit = $derived((isCreator || isEditor) && paper?.status === 'WORKING_PAPER');
	let canSubmit = $derived(isCreator && paper?.status === 'WORKING_PAPER');
	let canManageShareCodes = $derived(isCreator);
	let canSponsor = $derived(isDelegate);
	let isSponsor = $derived(
		paper?.sponsors.some((s) => s.committeeMemberId === myCommitteeMemberId)
	);
	let sortedSponsors = $derived(
		[...(paper?.sponsors ?? [])].sort((a, b) => {
			const nameA =
				a.committeeMember?.representation?.name ??
				getTranslatedCountryNameFromAlpha3Code(a.committeeMember?.representation?.alpha3Code) ??
				'';
			const nameB =
				b.committeeMember?.representation?.name ??
				getTranslatedCountryNameFromAlpha3Code(b.committeeMember?.representation?.alpha3Code) ??
				'';
			return nameA.localeCompare(nameB);
		})
	);

	let canDelete = $derived(isCreator && paper?.status === 'WORKING_PAPER');

	// DR support: delegate can toggle support during re-evaluation
	let isDrStatus = $derived(
		paper?.status === 'DRAFT_RESOLUTION' ||
			paper?.status === 'AMENDMENT_PHASE' ||
			paper?.status === 'VOTING_PHASE'
	);
	let canToggleDrSupport = $derived(
		isDelegate && isDrStatus && committee?.supportReEvaluationOpen === true
	);

	// Collaborative mode: only enable lock UI when paper has other editors or is beyond working paper
	let collaborativeMode = $derived(
		(paper?.editors?.length ?? 0) > 0 || paper?.status !== 'WORKING_PAPER'
	);

	// Comments: show on SUBMITTED+ papers only (not working papers)
	let showComments = $derived(paper?.status !== 'WORKING_PAPER');

	// Resolution content — initialize from paper data
	let resolution = $state<Resolution | null>(null);
	let hasPendingSave = $state(false);

	$effect(() => {
		if (paper?.content && !resolution) {
			resolution = migrateResolution(paper.content as Resolution);
		}
	});

	// Accept remote updates when no local save is in-flight
	$effect(() => {
		if (remotePaper?.content && !hasPendingSave) {
			resolution = migrateResolution(remotePaper.content as Resolution);
		}
	});

	// Resolution header data for document preview
	let headerData = $derived<ResolutionHeaderData>({
		conferenceTitle: committee?.conference?.title ?? undefined,
		committeeAbbreviation: committee?.abbreviation ?? undefined,
		committeeFullName: committee?.name ?? undefined,
		committeeResolutionHeadline: committee?.resolutionHeadline ?? undefined,
		documentNumber: paper?.documentNumber ?? undefined,
		topic: committee?.activeAgendaItem?.title ?? undefined,
		authoringDelegation:
			getTranslatedCountryNameFromAlpha3Code(paper?.creator?.representation?.alpha3Code) ??
			paper?.creator?.representation?.name ??
			undefined,
		sponsoringDelegations: paper?.sponsors
			?.map(
				(s) =>
					getTranslatedCountryNameFromAlpha3Code(s.committeeMember?.representation?.alpha3Code) ??
					s.committeeMember?.representation?.name ??
					''
			)
			.filter(Boolean)
			.sort((a, b) => a.localeCompare(b)),
		lastEdited: paper?.updatedAt ?? undefined
	});

	onMount(() => {
		ParticipantPaperDetailSubscription.listen({ paperId: page.params.paperId! });
		ParticipantCommitteeSubscription.listen({ id: page.params.committeeId! });
		if (collaborativeMode) {
			PaperClauseLocksSubscription.listen({ paperId: page.params.paperId! });
		}
		if (showComments) {
			ParticipantPaperCommentsSubscription.listen({ paperId: page.params.paperId! });
		}

		// Hybrid heartbeat — only fires when idle with held locks
		const heartbeatInterval = setInterval(() => {
			if (editableClauseIds.size > 0 && canEdit && Date.now() - lastInteractionTime > 25_000) {
				for (const clauseId of editableClauseIds) {
					AcquireLockMutation.mutate({
						paperId: page.params.paperId!,
						clauseId
					}).catch(() => {
						optimisticMyLockIds = new Set([...optimisticMyLockIds].filter((id) => id !== clauseId));
					});
				}
			}
		}, 30_000);

		// Best-effort lock release on tab close
		const handleBeforeUnload = () => {
			if (canEdit) {
				const body = JSON.stringify({
					query: `mutation { releaseAllMyLocks(paperId: "${page.params.paperId}") }`
				});
				navigator.sendBeacon('/api/graphql', new Blob([body], { type: 'application/json' }));
			}
		};
		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			clearInterval(heartbeatInterval);
			window.removeEventListener('beforeunload', handleBeforeUnload);

			// Release locks on navigation
			if (canEdit) {
				ReleaseAllMyLocksMutation.mutate({ paperId: page.params.paperId! }).catch(() => {});
			}
		};
	});

	// Start comments subscription when status changes to submitted+
	$effect(() => {
		if (showComments) {
			ParticipantPaperCommentsSubscription.listen({ paperId: page.params.paperId! });
		}
	});

	// Start amendments subscription when paper enters amendment phase or voting phase
	$effect(() => {
		if (paper?.status === 'AMENDMENT_PHASE' || paper?.status === 'VOTING_PHASE') {
			ParticipantAmendmentsSubscription.listen({ paperId: page.params.paperId! });
		}
	});

	// =====================================================
	// Clause-level locking
	// =====================================================

	let lastInteractionTime = $state(Date.now());

	// Lock mutations
	const AcquireLockMutation = graphql(`
		mutation AcquireClauseLockMutation($paperId: ID!, $clauseId: String!) {
			acquireClauseLock(paperId: $paperId, clauseId: $clauseId) {
				id
				clauseId
				conferenceUserId
			}
		}
	`);

	const ReleaseLockMutation = graphql(`
		mutation ReleaseClauseLockMutation($paperId: ID!, $clauseId: String!) {
			releaseClauseLock(paperId: $paperId, clauseId: $clauseId)
		}
	`);

	const ReleaseAllMyLocksMutation = graphql(`
		mutation ReleaseAllMyLocksMutation($paperId: ID!) {
			releaseAllMyLocks(paperId: $paperId)
		}
	`);

	// Derive lock state from subscription
	let locks = $derived($PaperClauseLocksSubscription.data?.findManyPaperClauseLock ?? []);

	// Clause IDs locked by OTHER users
	let lockedClauseIds = $derived.by(() => {
		const set = new Set<string>();
		for (const lock of locks) {
			if (lock.conferenceUserId !== myConferenceUserId) {
				set.add(lock.clauseId);
			}
		}
		return set;
	});

	// Clause IDs I hold confirmed locks for
	let myLockedClauseIds = $derived.by(() => {
		const set = new Set<string>();
		for (const lock of locks) {
			if (lock.conferenceUserId === myConferenceUserId) {
				set.add(lock.clauseId);
			}
		}
		return set;
	});

	// Map for lock badge rendering: clauseId → lock info
	let locksByClauseId = $derived.by(() => {
		const map = new Map<string, (typeof locks)[0]>();
		for (const lock of locks) {
			if (lock.conferenceUserId !== myConferenceUserId) {
				map.set(lock.clauseId, lock);
			}
		}
		return map;
	});

	// Optimistic lock IDs — added immediately on mutation success, before subscription arrives
	let optimisticMyLockIds = $state(new Set<string>());

	// Effective editable clause IDs = confirmed (subscription) + optimistic
	let editableClauseIds = $derived.by(() => {
		const set = new Set(myLockedClauseIds);
		for (const id of optimisticMyLockIds) set.add(id);
		return set;
	});

	// Are there any locks held by other users?
	let hasOtherLocks = $derived(lockedClauseIds.size > 0);

	// Click "Start editing" → acquire lock
	async function handleClauseLock(clauseId: string) {
		if (!canEdit || lockedClauseIds.has(clauseId)) return;
		try {
			await AcquireLockMutation.mutate({
				paperId: page.params.paperId!,
				clauseId
			});
			optimisticMyLockIds = new Set([...optimisticMyLockIds, clauseId]);
			lastInteractionTime = Date.now();
		} catch {
			const lock = locksByClauseId.get(clauseId);
			const country =
				lock?.conferenceUser?.committeeMember?.representation?.name ??
				getTranslatedCountryNameFromAlpha3Code(
					lock?.conferenceUser?.committeeMember?.representation?.alpha3Code
				) ??
				'?';
			toast.error(m.lockAcquireFailed({ country }));
		}
	}

	// Click "Done editing" → release lock
	async function handleClauseUnlock(clauseId: string) {
		if (!canEdit) return;
		optimisticMyLockIds = new Set([...optimisticMyLockIds].filter((id) => id !== clauseId));
		await ReleaseLockMutation.mutate({
			paperId: page.params.paperId!,
			clauseId
		}).catch(() => {});
	}

	// Any interaction (typing, clicking) → refresh idle timer
	function handleClauseInteraction(_clauseId: string) {
		lastInteractionTime = Date.now();
	}

	// Auto-save
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let saveTimeout: ReturnType<typeof setTimeout>;

	const UpdateContentMutation = graphql(`
		mutation UpdatePaperContentMutation($paperId: ID!, $content: JSON!) {
			updatePaperContent(paperId: $paperId, content: $content) {
				id
			}
		}
	`);

	function handleResolutionChange(updated: Resolution) {
		resolution = updated;
		hasPendingSave = true;
		clearTimeout(saveTimeout);
		saveStatus = 'saving';
		saveTimeout = setTimeout(async () => {
			try {
				await UpdateContentMutation.mutate({
					paperId: page.params.paperId!,
					content: updated
				});
				saveStatus = 'saved';
				hasPendingSave = false;
			} catch {
				saveStatus = 'error';
			}
		}, 500);
	}

	let titleInput = $state('');
	let titleInitialized = $state(false);

	$effect(() => {
		if (paper?.title !== undefined && !titleInitialized) {
			titleInput = paper.title ?? '';
			titleInitialized = true;
		}
	});

	// Title save
	const UpdateTitleMutation = graphql(`
		mutation UpdatePaperTitleMutation($paperId: ID!, $title: String!) {
			updatePaperTitle(paperId: $paperId, title: $title) {
				id
				title
			}
		}
	`);

	let titleSaveTimeout: ReturnType<typeof setTimeout>;

	function handleTitleChange() {
		if (titleInput === (paper?.title ?? '')) return;
		clearTimeout(titleSaveTimeout);
		saveStatus = 'saving';
		titleSaveTimeout = setTimeout(async () => {
			try {
				await UpdateTitleMutation.mutate({
					paperId: page.params.paperId!,
					title: titleInput
				});
				saveStatus = 'saved';
			} catch {
				saveStatus = 'error';
			}
		}, 500);
	}

	// Submit paper
	const SubmitPaperMutation = graphql(`
		mutation SubmitPaperMutation($paperId: ID!) {
			submitPaper(paperId: $paperId) {
				id
				status
			}
		}
	`);

	let showSubmitModal = $state(false);

	async function handleSubmit() {
		try {
			await SubmitPaperMutation.mutate({ paperId: page.params.paperId! });
			showSubmitModal = false;
			toast.success(m.paperSubmitted());
		} catch {
			toast.error(m.saveError());
		}
	}

	// Delete paper
	const SoftDeletePaperMutation = graphql(`
		mutation SoftDeletePaperMutation($paperId: ID!) {
			softDeletePaper(paperId: $paperId)
		}
	`);

	let showDeleteModal = $state(false);

	async function handleDelete() {
		try {
			await SoftDeletePaperMutation.mutate({ paperId: page.params.paperId! });
			showDeleteModal = false;
			toast.success(m.paperDeleted());
			goto(`/app/${page.params.conferenceId}/participant/${page.params.committeeId}/papers`);
		} catch {
			toast.error(m.saveError());
		}
	}

	// Sponsor mutations
	const AddSponsorMutation = graphql(`
		mutation AddSponsorMutation($paperId: ID!, $committeeMemberId: ID!) {
			addSponsor(paperId: $paperId, committeeMemberId: $committeeMemberId) {
				id
			}
		}
	`);

	const RemoveSponsorMutation = graphql(`
		mutation RemoveSponsorMutation($paperId: ID!, $committeeMemberId: ID!) {
			removeSponsor(paperId: $paperId, committeeMemberId: $committeeMemberId)
		}
	`);

	async function handleToggleSponsor() {
		if (!myCommitteeMemberId) return;
		try {
			if (isSponsor) {
				await RemoveSponsorMutation.mutate({
					paperId: page.params.paperId!,
					committeeMemberId: myCommitteeMemberId
				});
			} else {
				await AddSponsorMutation.mutate({
					paperId: page.params.paperId!,
					committeeMemberId: myCommitteeMemberId
				});
			}
		} catch {
			toast.error(m.saveError());
		}
	}

	// Share code mutations
	const CreateShareCodeMutation = graphql(`
		mutation CreateShareCodeMutation($paperId: ID!, $permission: ShareCodePermissionEnum!) {
			createShareCode(paperId: $paperId, permission: $permission) {
				id
				code
				permission
			}
		}
	`);

	const DeleteShareCodeMutation = graphql(`
		mutation DeleteShareCodeMutation($shareCodeId: ID!) {
			deleteShareCode(shareCodeId: $shareCodeId)
		}
	`);

	async function handleCreateShareCode(permission: 'SPONSOR' | 'EDIT') {
		try {
			await CreateShareCodeMutation.mutate({
				paperId: page.params.paperId!,
				permission
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleDeleteShareCode(shareCodeId: string) {
		try {
			await DeleteShareCodeMutation.mutate({ shareCodeId });
		} catch {
			toast.error(m.saveError());
		}
	}

	async function copyToClipboard(text: string) {
		await navigator.clipboard.writeText(text);
		toast.success(m.codeCopied());
	}

	// =====================================================
	// Comments
	// =====================================================

	let allComments = $derived(
		$ParticipantPaperCommentsSubscription.data?.findManyResolutionComment ?? []
	);

	let commentsByClauseId = $derived.by(() => {
		const map = new Map<string | null, typeof allComments>();
		for (const comment of allComments) {
			const key = comment.clauseId;
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(comment);
		}
		return map;
	});

	// Comment mutations
	const CreateCommentMutation = graphql(`
		mutation ParticipantCreateCommentMutation(
			$paperId: ID!
			$content: String!
			$clauseId: String
			$visibility: CommentVisibilityEnum
			$parentCommentId: ID
		) {
			createComment(
				paperId: $paperId
				content: $content
				clauseId: $clauseId
				visibility: $visibility
				parentCommentId: $parentCommentId
			) {
				id
			}
		}
	`);

	const UpdateCommentMutation = graphql(`
		mutation ParticipantUpdateCommentMutation($commentId: ID!, $content: String!) {
			updateComment(commentId: $commentId, content: $content) {
				id
			}
		}
	`);

	const DeleteCommentMutation = graphql(`
		mutation ParticipantDeleteCommentMutation($commentId: ID!) {
			deleteComment(commentId: $commentId)
		}
	`);

	async function onCreateComment(
		content: string,
		visibility: string,
		parentCommentId?: string,
		clauseId?: string | null
	) {
		await CreateCommentMutation.mutate({
			paperId: page.params.paperId!,
			content,
			clauseId: clauseId ?? null,
			visibility: visibility as 'PUBLIC' | 'TEAM_ONLY',
			parentCommentId: parentCommentId ?? null
		});
		toast.success(m.commentPosted());
	}

	async function onUpdateComment(commentId: string, content: string) {
		await UpdateCommentMutation.mutate({ commentId, content });
		toast.success(m.commentUpdated());
	}

	async function onDeleteComment(commentId: string) {
		await DeleteCommentMutation.mutate({ commentId });
		toast.success(m.commentDeleted());
	}

	// Collapsible metadata
	let metadataOpen = $state(true);

	// =====================================================
	// Amendments (Phase 6d)
	// =====================================================

	let allAmendments = $derived($ParticipantAmendmentsSubscription.data?.findManyAmendment ?? []);

	// Use subscription data directly for fields not in layout query
	let committeeSubscriptionData = $derived(
		$ParticipantCommitteeSubscription.data?.findFirstCommittee
	);
	let currentOpIndex = $derived(committeeSubscriptionData?.currentOperativeIndex ?? 0);

	let isActiveDr = $derived(paper?.id === committee?.activeDraftResolutionId);

	let showAmendmentUI = $derived(paper?.status === 'AMENDMENT_PHASE' && isActiveDr);

	let operativeClauses = $derived((resolution?.operative ?? []) as OperativeClause[]);

	let myAmendments = $derived(
		allAmendments.filter(
			(a) =>
				a.proposerCommitteeMemberId === myCommitteeMemberId &&
				(a.status === 'PENDING' || a.status === 'SUBMITTED')
		)
	);

	let mySponsoredAmendments = $derived(
		allAmendments.filter(
			(a) =>
				a.proposerCommitteeMemberId !== myCommitteeMemberId &&
				(a.status === 'PENDING' || a.status === 'SUBMITTED') &&
				a.sponsors?.some((s) => s.committeeMemberId === myCommitteeMemberId)
		)
	);

	let sponsorThresholdNeeded = $derived(
		Math.ceil((committeeSubscriptionData?.totalPresent ?? 0) * 0.1)
	);

	// Overlays for editor: SUBMITTED/CONSENSUS_ADOPTED/ACCEPTED always visible;
	// PENDING only if user is proposer or sponsor
	let amendmentOverlays = $derived.by(() => {
		const visible = allAmendments.filter((a) => {
			if (a.status === 'SUBMITTED' || a.status === 'CONSENSUS_ADOPTED' || a.status === 'ACCEPTED')
				return true;
			if (a.status === 'PENDING') {
				if (a.proposerCommitteeMemberId === myCommitteeMemberId) return true;
				if (a.sponsors?.some((s) => s.committeeMemberId === myCommitteeMemberId)) return true;
			}
			return false;
		});
		return visible.map(
			(a) =>
				({
					id: a.id,
					type: a.type,
					status: a.status,
					targetClauseId: a.targetClauseId ?? undefined,
					targetOperativeIndex: a.targetOperativeIndex ?? undefined,
					targetPosition: a.targetPosition ?? undefined,
					newContent: a.newContent as OperativeClause | undefined,
					proposerName:
						a.proposer?.representation?.name ??
						getTranslatedCountryNameFromAlpha3Code(a.proposer?.representation?.alpha3Code),
					sponsorCount: a.sponsors?.length ?? 0,
					isOwnAmendment: a.proposerCommitteeMemberId === myCommitteeMemberId
				}) satisfies AmendmentOverlay
		);
	});

	// Amendment mutations
	const CreateAmendmentMutation = graphql(`
		mutation ParticipantCreateAmendmentMutation(
			$paperId: ID!
			$type: AmendmentTypeEnum!
			$targetClauseId: String
			$targetOperativeIndex: Int
			$targetPosition: Int
			$newContent: JSON
		) {
			createAmendment(
				paperId: $paperId
				type: $type
				targetClauseId: $targetClauseId
				targetOperativeIndex: $targetOperativeIndex
				targetPosition: $targetPosition
				newContent: $newContent
			) {
				id
			}
		}
	`);

	const SubmitAmendmentMutation = graphql(`
		mutation ParticipantSubmitAmendmentMutation($amendmentId: ID!) {
			submitAmendment(amendmentId: $amendmentId) {
				id
				status
			}
		}
	`);

	const ParticipantWithdrawAmendmentMutation = graphql(`
		mutation ParticipantWithdrawAmendmentMutation($amendmentId: ID!) {
			withdrawAmendment(amendmentId: $amendmentId) {
				id
				status
			}
		}
	`);

	const AddAmendmentSponsorMutation = graphql(`
		mutation ParticipantAddAmendmentSponsorMutation($amendmentId: ID!, $committeeMemberId: ID!) {
			addAmendmentSponsor(amendmentId: $amendmentId, committeeMemberId: $committeeMemberId) {
				id
			}
		}
	`);

	const RemoveAmendmentSponsorMutation = graphql(`
		mutation ParticipantRemoveAmendmentSponsorMutation($amendmentId: ID!, $committeeMemberId: ID!) {
			removeAmendmentSponsor(amendmentId: $amendmentId, committeeMemberId: $committeeMemberId)
		}
	`);

	// Amendment creation modal state
	let showCreateAmendmentModal = $state(false);
	let amendmentType = $state<'DELETE' | 'ADD' | 'ALTER_TEXT' | 'ALTER_POSITION'>('DELETE');
	let amendmentTargetIndex = $state(0);
	let amendmentTargetClauseId = $state<string | undefined>(undefined);
	let amendmentTargetPosition = $state<number | undefined>(undefined);
	let amendmentNewContent = $state<OperativeClause | null>(null);

	function openCreateAmendment(
		index: number,
		type: 'DELETE' | 'ADD' | 'ALTER_TEXT' | 'ALTER_POSITION'
	) {
		amendmentType = type;
		amendmentTargetIndex = index;
		const clause = operativeClauses[index];
		amendmentTargetClauseId = clause?.id;

		if (type === 'ALTER_TEXT' && clause) {
			// Deep clone the existing clause for editing
			amendmentNewContent = JSON.parse(JSON.stringify(clause));
		} else if (type === 'ADD') {
			amendmentNewContent = createEmptyOperativeClause();
			amendmentTargetPosition = index + 1;
		} else if (type === 'ALTER_POSITION') {
			amendmentTargetPosition = index;
		} else {
			amendmentNewContent = null;
		}
		showCreateAmendmentModal = true;
	}

	async function handleCreateAmendment() {
		if (!paper) return;
		try {
			await CreateAmendmentMutation.mutate({
				paperId: paper.id,
				type: amendmentType,
				targetClauseId: amendmentType === 'ADD' ? null : (amendmentTargetClauseId ?? null),
				targetOperativeIndex: amendmentType === 'ADD' ? null : amendmentTargetIndex,
				targetPosition:
					amendmentType === 'ADD' || amendmentType === 'ALTER_POSITION'
						? (amendmentTargetPosition ?? null)
						: null,
				newContent:
					amendmentType === 'ALTER_TEXT' || amendmentType === 'ADD' ? amendmentNewContent : null
			});
			showCreateAmendmentModal = false;
			toast.success(m.amendmentCreated());
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleSubmitAmendment(amendmentId: string) {
		try {
			await SubmitAmendmentMutation.mutate({ amendmentId });
			toast.success(m.amendmentSubmittedToast());
		} catch {
			toast.error(m.thresholdNotMet());
		}
	}

	async function handleParticipantWithdrawAmendment(amendmentId: string) {
		try {
			await ParticipantWithdrawAmendmentMutation.mutate({ amendmentId });
			toast.success(m.amendmentWithdrawnToast());
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleSponsorAmendment(amendmentId: string) {
		if (!myCommitteeMemberId) return;
		try {
			await AddAmendmentSponsorMutation.mutate({
				amendmentId,
				committeeMemberId: myCommitteeMemberId
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleWithdrawSponsorship(amendmentId: string) {
		if (!myCommitteeMemberId) return;
		try {
			await RemoveAmendmentSponsorMutation.mutate({
				amendmentId,
				committeeMemberId: myCommitteeMemberId
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	function handleAmendmentClick(amendmentId: string) {
		const el = document.getElementById(`amendment-${amendmentId}`);
		el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		el?.classList.add('ring-2', 'ring-primary');
		setTimeout(() => el?.classList.remove('ring-2', 'ring-primary'), 2000);
	}

	function getAmendmentTypeBadgeClass(type: string) {
		switch (type) {
			case 'DELETE':
				return 'badge-error';
			case 'ADD':
				return 'badge-success';
			case 'ALTER_TEXT':
				return 'badge-warning';
			case 'ALTER_POSITION':
				return 'badge-info';
			default:
				return 'badge-ghost';
		}
	}

	function getAmendmentTypeLabel(type: string) {
		switch (type) {
			case 'DELETE':
				return m.deleteClause();
			case 'ADD':
				return m.addClause();
			case 'ALTER_TEXT':
				return m.alterText();
			case 'ALTER_POSITION':
				return m.alterPosition();
			default:
				return type;
		}
	}

	function getAmendmentStatusLabel(status: string) {
		switch (status) {
			case 'PENDING':
				return m.amendmentPending();
			case 'SUBMITTED':
				return m.amendmentSubmitted();
			case 'CONSENSUS_ADOPTED':
				return m.amendmentConsensusAdopted();
			case 'ACCEPTED':
				return m.amendmentAccepted();
			case 'REJECTED':
				return m.amendmentRejected();
			case 'WITHDRAWN':
				return m.amendmentWithdrawn();
			default:
				return status;
		}
	}

	// =====================================================
	// Clause Votes (Phase 7 — participant view)
	// =====================================================

	const ParticipantClauseVotesSubscription = graphql(`
		subscription ParticipantClauseVotesSubscription($paperId: ID!) {
			findManyOperativeClauseVote(where: { paperId: $paperId }) {
				id
				clauseId
				outcome
				votesFor
				votesAgainst
				votesAbstain
			}
		}
	`);

	const ParticipantVoteResultSubscription = graphql(`
		subscription ParticipantVoteResultSubscription($paperId: ID!) {
			findFirstResolutionVoteResult(where: { paperId: $paperId }) {
				id
				outcome
				votesFor
				votesAgainst
				votesAbstain
			}
		}
	`);

	// Start clause votes subscription when paper enters voting or final phase
	$effect(() => {
		if (paper?.status === 'VOTING_PHASE' || paper?.status === 'FINAL') {
			ParticipantClauseVotesSubscription.listen({ paperId: page.params.paperId! });
			ParticipantVoteResultSubscription.listen({ paperId: page.params.paperId! });
		}
	});

	let clauseVotes = $derived(
		$ParticipantClauseVotesSubscription.data?.findManyOperativeClauseVote ?? []
	);
	let voteResult = $derived(
		$ParticipantVoteResultSubscription.data?.findFirstResolutionVoteResult ?? null
	);

	let rejectedClauseIds = $derived(
		clauseVotes.filter((v) => v.outcome === 'REJECTED').map((v) => v.clauseId)
	);

	let clauseVoteMap = $derived.by(() => {
		const map = new SvelteMap<string, (typeof clauseVotes)[0]>();
		for (const v of clauseVotes) {
			map.set(v.clauseId, v);
		}
		return map;
	});

	// Mini editor resolution for amendment creation modal
	let miniResolution = $derived.by(() => {
		if (!amendmentNewContent) return null;
		return {
			committeeName: '',
			preamble: [],
			operative: [amendmentNewContent]
		} as Resolution;
	});

	function handleMiniResolutionChange(updated: Resolution) {
		if (updated.operative?.[0]) {
			amendmentNewContent = updated.operative[0] as OperativeClause;
		}
	}
</script>

<svelte:head>
	<title>{paper?.documentNumber ?? paper?.title ?? m.untitledPaper()} - MUNify CHASE</title>
</svelte:head>

{#if paper}
	<div class="mx-auto flex max-w-4xl flex-col px-4">
		<!-- Back button + save status -->
		<div class="flex items-center justify-between py-2">
			<a
				href="/app/{page.params.conferenceId}/participant/{page.params.committeeId}/papers"
				class="btn btn-ghost btn-sm"
			>
				<i class="fa-duotone fa-arrow-left mr-1"></i>
				{m.back()}
			</a>
			<div class="flex items-center gap-2 text-sm">
				{#if saveStatus === 'saving'}
					<span class="text-warning">
						<i class="fas fa-circle-notch fa-spin mr-1"></i>{m.savingChanges()}
					</span>
				{:else if saveStatus === 'saved'}
					<span class="text-success">
						<i class="fas fa-check mr-1"></i>{m.changesSaved()}
					</span>
				{:else if saveStatus === 'error'}
					<span class="text-error">
						<i class="fas fa-exclamation-triangle mr-1"></i>{m.saveError()}
					</span>
				{/if}
				{#if canDelete}
					<button class="btn btn-ghost btn-sm text-error" onclick={() => (showDeleteModal = true)}>
						<i class="fas fa-trash"></i>
					</button>
				{/if}
			</div>
		</div>

		<!-- Collapsible metadata header -->
		<div class="collapse collapse-arrow bg-base-100 shadow-sm">
			<input type="checkbox" bind:checked={metadataOpen} />
			<div class="collapse-title">
				<div class="flex items-center gap-2">
					{#if paper.documentNumber}
						<span class="font-bold font-mono">{paper.documentNumber}</span>
					{:else}
						<span class="font-bold">{paper.title || m.untitledPaper()}</span>
					{/if}
					<span
						class="badge badge-soft badge-sm {paper.status === 'WORKING_PAPER'
							? 'badge-ghost'
							: paper.status === 'SUBMITTED'
								? 'badge-warning'
								: paper.status === 'DRAFT_RESOLUTION'
									? 'badge-info'
									: paper.status === 'AMENDMENT_PHASE'
										? 'badge-secondary'
										: paper.status === 'VOTING_PHASE'
											? 'badge-accent'
											: 'badge-success'}"
					>
						{paper.status === 'WORKING_PAPER'
							? m.workingPaper()
							: paper.status === 'SUBMITTED'
								? m.submitted()
								: paper.status === 'DRAFT_RESOLUTION'
									? m.draftResolution()
									: paper.status === 'AMENDMENT_PHASE'
										? m.amendmentPhase()
										: paper.status === 'VOTING_PHASE'
											? m.votingPhase()
											: m.finalResolution()}
					</span>
				</div>
			</div>
			<div class="collapse-content flex flex-col gap-4">
				<!-- Title -->
				{#if canEdit}
					<Fieldset legend={m.paperTitle()} faIcon="fas fa-heading">
						<input
							type="text"
							class="input input-sm w-full"
							placeholder={m.untitledPaper()}
							bind:value={titleInput}
							oninput={handleTitleChange}
							onblur={handleTitleChange}
						/>
					</Fieldset>
				{/if}

				<!-- Sponsors -->
				<Fieldset legend={m.sponsors()} faIcon="fas fa-users">
					<div class="flex flex-wrap gap-2">
						{#each sortedSponsors as sponsor}
							<div
								class="tooltip tooltip-bottom"
								data-tip={sponsor.committeeMember?.representation?.name ??
									getTranslatedCountryNameFromAlpha3Code(
										sponsor.committeeMember?.representation?.alpha3Code
									)}
							>
								<Flag representation={sponsor.committeeMember?.representation} size="xs" />
							</div>
						{/each}
					</div>
					<p class="text-base-content/50 mt-1 text-xs">
						{m.supporterCount({ count: String(paper.sponsors.length) })}
					</p>
					{#if canSponsor && myCommitteeMemberId && !isDrStatus}
						<!-- WP/Submitted sponsor toggle -->
						<button
							class="btn btn-sm mt-2 {isSponsor ? 'btn-soft btn-error' : 'btn-primary'}"
							onclick={handleToggleSponsor}
						>
							{isSponsor ? m.removeSponsor() : m.sponsorPaper()}
						</button>
					{:else if canToggleDrSupport && myCommitteeMemberId}
						<!-- DR support toggle during re-evaluation -->
						<div class="mt-2 flex items-center gap-2">
							<span class="badge badge-warning animate-pulse badge-sm"
								>{m.supportReEvaluation()}</span
							>
							<button
								class="btn btn-sm {isSponsor ? 'btn-outline' : 'btn-primary'}"
								onclick={handleToggleSponsor}
							>
								{#if isSponsor}
									<i class="fas fa-minus mr-1"></i>
									{m.withdrawSupport()}
								{:else}
									<i class="fas fa-plus mr-1"></i>
									{m.supportDraftResolution()}
								{/if}
							</button>
						</div>
					{/if}
				</Fieldset>

				<!-- Share codes (creator only) -->
				{#if canManageShareCodes}
					<Fieldset legend={m.shareCodes()} faIcon="fas fa-share-nodes">
						{#if paper.shareCodes.length > 0}
							<div class="flex flex-col gap-2">
								{#each paper.shareCodes as shareCode}
									<div class="flex items-center gap-2">
										<code class="bg-base-300 rounded px-2 py-1 text-sm font-mono"
											>{shareCode.code}</code
										>
										<span
											class="badge badge-soft badge-sm {shareCode.permission === 'EDIT'
												? 'badge-info'
												: 'badge-primary'}"
										>
											{shareCode.permission === 'EDIT' ? m.editAccess() : m.sponsor()}
										</span>
										<button
											class="btn btn-ghost btn-xs"
											onclick={() => copyToClipboard(shareCode.code)}
										>
											<i class="fas fa-copy"></i>
										</button>
										<button
											class="btn btn-ghost btn-xs text-error"
											onclick={() => handleDeleteShareCode(shareCode.id)}
										>
											<i class="fas fa-trash"></i>
										</button>
									</div>
								{/each}
							</div>
						{/if}
						<div class="mt-2 flex gap-2">
							<button class="btn btn-soft btn-xs" onclick={() => handleCreateShareCode('SPONSOR')}>
								<i class="fas fa-plus mr-1"></i>
								{m.createShareCodeSponsor()}
							</button>
							<button class="btn btn-soft btn-xs" onclick={() => handleCreateShareCode('EDIT')}>
								<i class="fas fa-plus mr-1"></i>
								{m.createShareCodeEdit()}
							</button>
						</div>
					</Fieldset>
				{/if}
			</div>
		</div>

		<!-- Collaborative editing info banner -->
		{#if canEdit && collaborativeMode && hasOtherLocks}
			<div class="alert alert-info mt-2 text-sm">
				<i class="fas fa-lock"></i>
				<span>{m.collaborativeEditingInfo()}</span>
			</div>
		{/if}

		<!-- Final vote result alert -->
		{#if paper.status === 'FINAL' && voteResult}
			<div
				class="alert mt-2 {voteResult.outcome === 'ADOPTED'
					? 'alert-success'
					: voteResult.outcome === 'REJECTED'
						? 'alert-error'
						: 'alert-warning'}"
			>
				<i
					class="fas {voteResult.outcome === 'ADOPTED'
						? 'fa-check-circle'
						: voteResult.outcome === 'REJECTED'
							? 'fa-times-circle'
							: 'fa-undo'}"
				></i>
				<div>
					<span class="font-bold">
						{voteResult.outcome === 'ADOPTED'
							? m.adopted()
							: voteResult.outcome === 'REJECTED'
								? m.rejected()
								: m.sentBack()}
					</span>
					<span class="ml-2 text-sm">
						{m.votesFor()}: {voteResult.votesFor} | {m.votesAgainst()}: {voteResult.votesAgainst}
						{#if voteResult.votesAbstain > 0}
							| {m.votesAbstain()}: {voteResult.votesAbstain}
						{/if}
					</span>
				</div>
			</div>
		{/if}

		<!-- Voting phase indicator -->
		{#if paper.status === 'VOTING_PHASE'}
			<div class="alert alert-info mt-2 text-sm">
				<i class="fas fa-vote-yea"></i>
				<span>{m.votingPhaseActive()}</span>
			</div>
		{/if}

		<!-- Resolution Editor -->
		<div class="py-2">
			{#if resolution}
				{@const collab = canEdit && collaborativeMode}
				<ResolutionEditor
					committeeName={committee?.name ?? ''}
					{resolution}
					{headerData}
					editable={canEdit && paper.status !== 'VOTING_PHASE' && paper.status !== 'FINAL'}
					onResolutionChange={handleResolutionChange}
					onClauseLock={collab ? handleClauseLock : undefined}
					onClauseUnlock={collab ? handleClauseUnlock : undefined}
					onClauseInteraction={collab ? handleClauseInteraction : undefined}
					lockedClauseIds={collab ? lockedClauseIds : undefined}
					editableClauseIds={collab ? editableClauseIds : undefined}
					amendments={showAmendmentUI ? amendmentOverlays : undefined}
					rejectedClauseIds={paper.status === 'VOTING_PHASE' || paper.status === 'FINAL'
						? rejectedClauseIds
						: undefined}
					onAmendmentClick={showAmendmentUI ? handleAmendmentClick : undefined}
				>
					{#snippet betweenOperativeClauses({ index })}
						{#if showAmendmentUI && isDelegate}
							<div class="flex justify-center py-1">
								<div class="dropdown dropdown-bottom">
									<div tabindex="0" role="button" class="btn btn-ghost btn-xs gap-1">
										<i class="fas fa-plus text-xs"></i>
										{m.proposeAmendment()}
									</div>
									<ul
										role="menu"
										tabindex="0"
										class="dropdown-content menu bg-base-200 rounded-box z-10 w-52 p-2 shadow"
									>
										<li>
											<button onclick={() => openCreateAmendment(index, 'DELETE')}>
												<i class="fas fa-trash text-error"></i>
												{m.deleteClause()}
											</button>
										</li>
										<li>
											<button onclick={() => openCreateAmendment(index, 'ADD')}>
												<i class="fas fa-plus text-success"></i>
												{m.addClause()}
											</button>
										</li>
										<li>
											<button onclick={() => openCreateAmendment(index, 'ALTER_TEXT')}>
												<i class="fas fa-pen text-warning"></i>
												{m.alterText()}
											</button>
										</li>
										<li>
											<button onclick={() => openCreateAmendment(index, 'ALTER_POSITION')}>
												<i class="fas fa-arrows-alt text-info"></i>
												{m.alterPosition()}
											</button>
										</li>
									</ul>
								</div>
							</div>
						{/if}
					{/snippet}
					{#snippet preambleAnnotations({ clause })}
						{@const lock = locksByClauseId.get(clause.id)}
						{#if lock}
							<div
								class="tooltip tooltip-right"
								data-tip={m.clauseLockedBy({
									country:
										lock.conferenceUser?.committeeMember?.representation?.name ??
										getTranslatedCountryNameFromAlpha3Code(
											lock.conferenceUser?.committeeMember?.representation?.alpha3Code
										) ??
										'?'
								})}
								in:fly={{ y: -6, duration: 200 }}
								out:fade={{ duration: 150 }}
							>
								<div
									class="flex items-center gap-2 rounded-md bg-warning/40 px-2 py-1 text-sm shadow-sm"
								>
									{#if lock.conferenceUser?.committeeMember?.representation}
										<Flag
											representation={lock.conferenceUser.committeeMember.representation}
											size="xs"
										/>
									{/if}
									<i class="fas fa-lock text-warning text-base"></i>
								</div>
							</div>
						{/if}
					{/snippet}
					{#snippet clauseAnnotations({ clause })}
						{@const lock = locksByClauseId.get(clause.id)}
						{#if lock}
							<div
								class="tooltip tooltip-right"
								data-tip={m.clauseLockedBy({
									country:
										lock.conferenceUser?.committeeMember?.representation?.name ??
										getTranslatedCountryNameFromAlpha3Code(
											lock.conferenceUser?.committeeMember?.representation?.alpha3Code
										) ??
										'?'
								})}
								in:fly={{ y: -6, duration: 200 }}
								out:fade={{ duration: 150 }}
							>
								<div
									class="flex items-center gap-2 rounded-md bg-warning/40 px-2 py-1 text-sm shadow-sm"
								>
									{#if lock.conferenceUser?.committeeMember?.representation}
										<Flag
											representation={lock.conferenceUser.committeeMember.representation}
											size="xs"
										/>
									{/if}
									<i class="fas fa-lock text-warning text-base"></i>
								</div>
							</div>
						{/if}
					{/snippet}
					{#snippet preambleClauseToolbar({ clause })}
						{#if showComments}
							<CommentSection
								paperId={page.params.paperId!}
								clauseId={clause.id}
								comments={commentsByClauseId.get(clause.id) ?? []}
								{myConferenceUserId}
								canPostTeamOnly={false}
								readonly
								onCreateComment={(content, visibility, parentCommentId) =>
									onCreateComment(content, visibility, parentCommentId, clause.id)}
								{onUpdateComment}
								{onDeleteComment}
							/>
						{/if}
					{/snippet}
					{#snippet clauseToolbar({ clause })}
						{#if showComments}
							<CommentSection
								paperId={page.params.paperId!}
								clauseId={clause.id}
								comments={commentsByClauseId.get(clause.id) ?? []}
								{myConferenceUserId}
								canPostTeamOnly={false}
								readonly
								onCreateComment={(content, visibility, parentCommentId) =>
									onCreateComment(content, visibility, parentCommentId, clause.id)}
								{onUpdateComment}
								{onDeleteComment}
							/>
						{/if}
					{/snippet}
					{#snippet afterPreambleClause({ clause })}
						{#if showComments && !canEdit}
							<CommentSection
								paperId={page.params.paperId!}
								clauseId={clause.id}
								comments={commentsByClauseId.get(clause.id) ?? []}
								{myConferenceUserId}
								canPostTeamOnly={false}
								readonly
								onCreateComment={(content, visibility, parentCommentId) =>
									onCreateComment(content, visibility, parentCommentId, clause.id)}
								{onUpdateComment}
								{onDeleteComment}
							/>
						{/if}
					{/snippet}
					{#snippet afterOperativeClause({ clause, index })}
						{#if showComments && !canEdit}
							<CommentSection
								paperId={page.params.paperId!}
								clauseId={clause.id}
								comments={commentsByClauseId.get(clause.id) ?? []}
								{myConferenceUserId}
								canPostTeamOnly={false}
								readonly
								onCreateComment={(content, visibility, parentCommentId) =>
									onCreateComment(content, visibility, parentCommentId, clause.id)}
								{onUpdateComment}
								{onDeleteComment}
							/>
						{/if}
					{/snippet}
				</ResolutionEditor>
			{/if}
		</div>

		<!-- Amendment phase UI -->
		{#if showAmendmentUI}
			<!-- Current paragraph indicator -->
			<div class="alert alert-info text-sm">
				<i class="fas fa-list-ol"></i>
				<span
					>{m.currentParagraph()}: <strong class="font-mono">OP {currentOpIndex + 1}</strong></span
				>
			</div>

			<!-- My Amendments -->
			{#if myAmendments.length > 0 || mySponsoredAmendments.length > 0}
				<Fieldset legend={m.myAmendments()} faIcon="fas fa-file-pen">
					<div class="flex flex-col gap-2">
						{#each myAmendments as amendment (amendment.id)}
							{@const sponsorCount = amendment.sponsors?.length ?? 0}
							{@const thresholdMet = sponsorCount >= sponsorThresholdNeeded}
							<div id="amendment-{amendment.id}" class="card card-border bg-base-100 p-3">
								<div class="flex flex-col gap-2">
									<div class="flex items-center gap-2 flex-wrap">
										<span class="badge badge-sm {getAmendmentTypeBadgeClass(amendment.type)}">
											{amendment.documentNumber ?? getAmendmentTypeLabel(amendment.type)}
										</span>
										<span class="badge badge-ghost badge-sm">
											{getAmendmentStatusLabel(amendment.status)}
										</span>
										{#if amendment.targetOperativeIndex != null}
											<span class="badge badge-ghost badge-sm font-mono">
												OP {amendment.targetOperativeIndex + 1}
											</span>
										{/if}
									</div>

									<!-- Sponsor progress -->
									<div class="flex items-center gap-2">
										<progress
											class="progress progress-primary w-full"
											value={sponsorCount}
											max={sponsorThresholdNeeded}
										></progress>
										<span class="text-xs whitespace-nowrap">
											{m.sponsorThreshold({
												current: String(sponsorCount),
												needed: String(sponsorThresholdNeeded),
												percent: '10'
											})}
										</span>
									</div>

									<!-- Actions -->
									<div class="flex items-center gap-2">
										{#if amendment.status === 'PENDING'}
											<button
												class="btn btn-primary btn-xs"
												disabled={!thresholdMet}
												onclick={() => handleSubmitAmendment(amendment.id)}
											>
												{m.submitAmendment()}
											</button>
										{/if}
										<button
											class="btn btn-ghost btn-xs"
											onclick={() => handleParticipantWithdrawAmendment(amendment.id)}
										>
											{m.withdrawAmendment()}
										</button>
									</div>
								</div>
							</div>
						{/each}

						{#each mySponsoredAmendments as amendment (amendment.id)}
							<div id="amendment-{amendment.id}" class="card card-border bg-base-100 p-3">
								<div class="flex items-center justify-between gap-2">
									<div class="flex items-center gap-2 flex-wrap">
										<span class="badge badge-sm {getAmendmentTypeBadgeClass(amendment.type)}">
											{amendment.documentNumber ?? getAmendmentTypeLabel(amendment.type)}
										</span>
										{#if amendment.targetOperativeIndex != null}
											<span class="badge badge-ghost badge-sm font-mono">
												OP {amendment.targetOperativeIndex + 1}
											</span>
										{/if}
										{#if amendment.proposer?.representation}
											<div class="flex items-center gap-1 text-sm">
												<Flag representation={amendment.proposer.representation} size="xs" />
												<span class="text-xs">
													{m.proposedBy({
														name:
															amendment.proposer.representation.name ??
															getTranslatedCountryNameFromAlpha3Code(
																amendment.proposer.representation.alpha3Code
															) ??
															''
													})}
												</span>
											</div>
										{/if}
									</div>
									<button
										class="btn btn-ghost btn-xs"
										onclick={() => handleWithdrawSponsorship(amendment.id)}
									>
										{m.withdrawSponsorship()}
									</button>
								</div>
							</div>
						{/each}
					</div>
				</Fieldset>
			{/if}

			<!-- Pending amendments from others that I can sponsor -->
			{@const otherPendingAmendments = allAmendments.filter(
				(a) =>
					a.status === 'PENDING' &&
					a.proposerCommitteeMemberId !== myCommitteeMemberId &&
					!a.sponsors?.some((s) => s.committeeMemberId === myCommitteeMemberId)
			)}
			{#if otherPendingAmendments.length > 0 && isDelegate}
				<Fieldset legend={m.amendments()} faIcon="fas fa-handshake">
					<div class="flex flex-col gap-2">
						{#each otherPendingAmendments as amendment (amendment.id)}
							<div class="card card-border bg-base-100 p-3">
								<div class="flex items-center justify-between gap-2">
									<div class="flex items-center gap-2 flex-wrap">
										<span class="badge badge-sm {getAmendmentTypeBadgeClass(amendment.type)}">
											{amendment.documentNumber ?? getAmendmentTypeLabel(amendment.type)}
										</span>
										{#if amendment.targetOperativeIndex != null}
											<span class="badge badge-ghost badge-sm font-mono">
												OP {amendment.targetOperativeIndex + 1}
											</span>
										{/if}
										{#if amendment.proposer?.representation}
											<div class="flex items-center gap-1 text-sm">
												<Flag representation={amendment.proposer.representation} size="xs" />
											</div>
										{/if}
										<span class="text-xs">
											{amendment.sponsors?.length ?? 0}/{sponsorThresholdNeeded}
										</span>
									</div>
									<button
										class="btn btn-primary btn-xs"
										onclick={() => handleSponsorAmendment(amendment.id)}
									>
										{m.sponsorAmendment()}
									</button>
								</div>
							</div>
						{/each}
					</div>
				</Fieldset>
			{/if}
		{/if}

		<!-- Per-paragraph results when FINAL -->
		{#if paper.status === 'FINAL' && clauseVotes.length > 0}
			<Fieldset legend={m.clauseVoteSummary()} faIcon="fas fa-clipboard-check">
				<div class="flex flex-col gap-1">
					{#each operativeClauses as clause, i (clause.id)}
						{@const vote = clauseVoteMap.get(clause.id)}
						<div class="flex items-center gap-2 px-2 py-1 text-sm">
							<span class="font-mono w-12">OP {i + 1}</span>
							{#if vote}
								<span
									class="badge badge-xs {vote.outcome === 'ADOPTED'
										? 'badge-success'
										: 'badge-error'}"
								>
									{vote.outcome === 'ADOPTED' ? m.adopted() : m.rejected()}
								</span>
								<span class="text-xs opacity-60">
									{vote.votesFor}/{vote.votesAgainst}
									{#if vote.votesAbstain > 0}/{vote.votesAbstain}{/if}
								</span>
							{:else}
								<span class="badge badge-xs badge-ghost">—</span>
							{/if}
						</div>
					{/each}
				</div>
			</Fieldset>
		{/if}

		<!-- Document-level comments -->
		{#if showComments && (commentsByClauseId.get(null)?.length ?? 0) > 0}
			<Fieldset legend={m.documentLevelComments()} faIcon="fas fa-comments">
				<CommentSection
					paperId={page.params.paperId!}
					clauseId={null}
					comments={commentsByClauseId.get(null) ?? []}
					{myConferenceUserId}
					canPostTeamOnly={false}
					readonly
					onCreateComment={(content, visibility, parentCommentId) =>
						onCreateComment(content, visibility, parentCommentId, null)}
					{onUpdateComment}
					{onDeleteComment}
				/>
			</Fieldset>
		{/if}

		<!-- Submit button (creator only, working paper) -->
		{#if canSubmit}
			<div class="py-4">
				<button class="btn btn-primary w-full" onclick={() => (showSubmitModal = true)}>
					<i class="fas fa-paper-plane mr-2"></i>
					{m.submitToChair()}
				</button>
			</div>
		{/if}
	</div>

	<!-- Submit confirmation modal -->
	<Modal bind:open={showSubmitModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.submitToChair()}</h3>
			<p>{m.confirmSubmitPaper()}</p>
			<div class="flex justify-end gap-2">
				<button class="btn btn-ghost btn-sm" onclick={() => (showSubmitModal = false)}>
					{m.abort()}
				</button>
				<button class="btn btn-primary btn-sm" onclick={handleSubmit}>
					{m.yes()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Delete confirmation modal -->
	<Modal bind:open={showDeleteModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.deletePaper()}</h3>
			<p>{m.confirmDeletePaper()}</p>
			<div class="flex justify-end gap-2">
				<button class="btn btn-ghost btn-sm" onclick={() => (showDeleteModal = false)}>
					{m.abort()}
				</button>
				<button class="btn btn-error btn-sm" onclick={handleDelete}>
					{m.yes()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Amendment creation modal -->
	<Modal bind:open={showCreateAmendmentModal}>
		<div class="flex flex-col gap-4 p-4">
			<div class="flex items-center gap-2">
				<h3 class="text-lg font-bold">{m.proposeAmendment()}</h3>
				<span class="badge {getAmendmentTypeBadgeClass(amendmentType)}">
					{getAmendmentTypeLabel(amendmentType)}
				</span>
			</div>

			{#if amendmentType === 'DELETE'}
				<p class="text-sm">
					{m.deleteClause()} — <span class="font-mono">OP {amendmentTargetIndex + 1}</span>
				</p>
			{:else if amendmentType === 'ALTER_TEXT'}
				<p class="text-sm mb-2">
					{m.alterText()} — <span class="font-mono">OP {amendmentTargetIndex + 1}</span>
				</p>
				{#if miniResolution}
					<div class="border rounded-lg p-2">
						<ResolutionEditor
							committeeName=""
							resolution={miniResolution}
							editable={true}
							onResolutionChange={handleMiniResolutionChange}
						/>
					</div>
				{/if}
			{:else if amendmentType === 'ADD'}
				<p class="text-sm mb-2">
					{m.addClause()} — {m.targetPosition()}:
					<span class="font-mono">OP {(amendmentTargetPosition ?? 0) + 1}</span>
				</p>
				{#if miniResolution}
					<div class="border rounded-lg p-2">
						<ResolutionEditor
							committeeName=""
							resolution={miniResolution}
							editable={true}
							onResolutionChange={handleMiniResolutionChange}
						/>
					</div>
				{/if}
			{:else if amendmentType === 'ALTER_POSITION'}
				<p class="text-sm mb-2">
					{m.alterPosition()} — <span class="font-mono">OP {amendmentTargetIndex + 1}</span>
				</p>
				<label class="label text-sm font-medium" for="amendment-target-position"
					>{m.targetPosition()}</label
				>
				<select
					id="amendment-target-position"
					class="select select-bordered w-full"
					bind:value={amendmentTargetPosition}
				>
					{#each Array(operativeClauses.length) as _, i}
						{#if i !== amendmentTargetIndex}
							<option value={i}>OP {i + 1}</option>
						{/if}
					{/each}
				</select>
			{/if}

			<div class="flex justify-end gap-2">
				<button class="btn btn-ghost btn-sm" onclick={() => (showCreateAmendmentModal = false)}>
					{m.abort()}
				</button>
				<button class="btn btn-primary btn-sm" onclick={handleCreateAmendment}>
					{m.proposeAmendment()}
				</button>
			</div>
		</div>
	</Modal>
{/if}
