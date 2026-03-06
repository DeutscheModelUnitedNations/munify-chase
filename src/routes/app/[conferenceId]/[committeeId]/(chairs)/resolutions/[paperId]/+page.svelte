<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import type { PageData } from './$houdini';
	import { graphql } from '$houdini';
	import { onMount } from 'svelte';
	import { CommitteeSubscription } from '../../committeeSubscription';
	import { ChairPaperDetailSubscription } from './chairPaperDetailSubscription';
	import { ChairPaperClauseLocksSubscription } from './chairLockSubscription';
	import { ChairPaperCommentsSubscription } from './chairCommentsSubscription';
	import { ChairAmendmentsSubscription } from './chairAmendmentsSubscription';
	import { ChairClauseVotesSubscription } from './chairClauseVotesSubscription';
	import { ChairVoteResultSubscription } from './chairVoteResultSubscription';
	import {
		ResolutionEditor,
		migrateResolution,
		calculateAmendmentDiffSize,
		type Resolution,
		type AmendmentOverlay,
		type OperativeClause
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import Flag from '$lib/components/Flag.svelte';
	import Fieldset from '$lib/components/Fieldset.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import CommentSection from '$lib/components/CommentSection.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import toast from 'svelte-french-toast';
	import { fly, fade } from 'svelte/transition';
	import { SvelteSet, SvelteMap } from 'svelte/reactivity';

	let { data }: { data: PageData } = $props();

	let committeeQuery = $derived(data?.CommitteeTeamQuery);
	let committee = $derived(
		$CommitteeSubscription.data?.findFirstCommittee ?? $committeeQuery.data?.findFirstCommittee
	);

	let query = $derived(data?.ChairPaperDetailQuery);

	let remotePaper = $derived(
		$ChairPaperDetailSubscription.data?.findFirstResolutionPaper ??
			$query.data?.findFirstResolutionPaper
	);

	let paper = $derived(remotePaper);

	// Current user identity (for lock ownership)
	let myConferenceUserId = $derived($query.data?.currentUser?.[0]?.id);

	// Resolution content
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

	onMount(() => {
		ChairPaperDetailSubscription.listen({ paperId: page.params.paperId! });
		ChairPaperClauseLocksSubscription.listen({ paperId: page.params.paperId! });
		ChairPaperCommentsSubscription.listen({ paperId: page.params.paperId! });
		ChairAmendmentsSubscription.listen({ paperId: page.params.paperId! });
		ChairClauseVotesSubscription.listen({ paperId: page.params.paperId! });
		ChairVoteResultSubscription.listen({ paperId: page.params.paperId! });

		// Hybrid heartbeat — only fires when idle with held locks
		const heartbeatInterval = setInterval(() => {
			if (editableClauseIds.size > 0 && Date.now() - lastInteractionTime > 25_000) {
				for (const clauseId of editableClauseIds) {
					AcquireLockMutation.mutate({
						paperId: page.params.paperId!,
						clauseId
					}).catch(() => {
						optimisticMyLockIds.delete(clauseId);
					});
				}
			}
		}, 30_000);

		// Best-effort lock release on tab close
		const handleBeforeUnload = () => {
			const body = JSON.stringify({
				query: `mutation { releaseAllMyLocks(paperId: "${page.params.paperId}") }`
			});
			navigator.sendBeacon('/api/graphql', new Blob([body], { type: 'application/json' }));
		};
		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			clearInterval(heartbeatInterval);
			window.removeEventListener('beforeunload', handleBeforeUnload);

			// Release locks on navigation
			ReleaseAllMyLocksMutation.mutate({ paperId: page.params.paperId! }).catch(() => {});
		};
	});

	// =====================================================
	// Clause-level locking
	// =====================================================

	let lastInteractionTime = $state(Date.now());

	const AcquireLockMutation = graphql(`
		mutation ChairAcquireClauseLockMutation($paperId: ID!, $clauseId: String!) {
			acquireClauseLock(paperId: $paperId, clauseId: $clauseId) {
				id
				clauseId
				conferenceUserId
			}
		}
	`);

	const ReleaseLockMutation = graphql(`
		mutation ChairReleaseClauseLockMutation($paperId: ID!, $clauseId: String!) {
			releaseClauseLock(paperId: $paperId, clauseId: $clauseId)
		}
	`);

	const ReleaseAllMyLocksMutation = graphql(`
		mutation ChairReleaseAllMyLocksMutation($paperId: ID!) {
			releaseAllMyLocks(paperId: $paperId)
		}
	`);

	// Derive lock state from subscription
	let locks = $derived($ChairPaperClauseLocksSubscription.data?.findManyPaperClauseLock ?? []);

	// Clause IDs locked by OTHER users
	let lockedClauseIds = $derived.by(() => {
		const set = new SvelteSet<string>();
		for (const lock of locks) {
			if (lock.conferenceUserId !== myConferenceUserId) {
				set.add(lock.clauseId);
			}
		}
		return set;
	});

	// Clause IDs I hold confirmed locks for
	let myLockedClauseIds = $derived.by(() => {
		const set = new SvelteSet<string>();
		for (const lock of locks) {
			if (lock.conferenceUserId === myConferenceUserId) {
				set.add(lock.clauseId);
			}
		}
		return set;
	});

	// Map for lock badge rendering: clauseId → lock info
	let locksByClauseId = $derived.by(() => {
		const map = new SvelteMap<string, (typeof locks)[0]>();
		for (const lock of locks) {
			if (lock.conferenceUserId !== myConferenceUserId) {
				map.set(lock.clauseId, lock);
			}
		}
		return map;
	});

	// Optimistic lock IDs — added immediately on mutation success, before subscription arrives
	let optimisticMyLockIds = new SvelteSet<string>();

	// Effective editable clause IDs = confirmed (subscription) + optimistic
	let editableClauseIds = $derived.by(() => {
		const set = new SvelteSet(myLockedClauseIds);
		for (const id of optimisticMyLockIds) set.add(id);
		return set;
	});

	// Are there any locks held by other users?
	let hasOtherLocks = $derived(lockedClauseIds.size > 0);

	// Click "Start editing" → acquire lock
	async function handleClauseLock(clauseId: string) {
		if (lockedClauseIds.has(clauseId)) return;
		try {
			await AcquireLockMutation.mutate({
				paperId: page.params.paperId!,
				clauseId
			});
			optimisticMyLockIds.add(clauseId);
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
		optimisticMyLockIds.delete(clauseId);
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
		mutation ChairUpdatePaperContentMutation($paperId: ID!, $content: JSON!) {
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

	function getStatusBadgeClass(status: string) {
		switch (status) {
			case 'DRAFT_RESOLUTION':
				return 'badge-info';
			case 'AMENDMENT_PHASE':
				return 'badge-secondary';
			case 'VOTING_PHASE':
				return 'badge-accent';
			case 'FINAL':
				return 'badge-success';
			case 'SUBMITTED':
				return 'badge-warning';
			default:
				return 'badge-ghost';
		}
	}

	function getStatusText(status: string) {
		switch (status) {
			case 'WORKING_PAPER':
				return m.workingPaper();
			case 'SUBMITTED':
				return m.submitted();
			case 'DRAFT_RESOLUTION':
				return m.draftResolution();
			case 'AMENDMENT_PHASE':
				return m.amendmentPhase();
			case 'VOTING_PHASE':
				return m.votingPhase();
			case 'FINAL':
				return m.finalResolution();
			default:
				return status;
		}
	}

	// =====================================================
	// Comments
	// =====================================================

	let allComments = $derived($ChairPaperCommentsSubscription.data?.findManyResolutionComment ?? []);

	// Group comments by clauseId for inline display
	let commentsByClauseId = $derived.by(() => {
		const map = new Map<string | null, typeof allComments>();
		for (const comment of allComments) {
			const key = comment.clauseId;
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(comment);
		}
		return map;
	});

	// Comment counts per clause (for badge annotations)
	let commentCountByClauseId = $derived.by(() => {
		const map = new Map<string, number>();
		for (const comment of allComments) {
			if (comment.clauseId) {
				map.set(comment.clauseId, (map.get(comment.clauseId) ?? 0) + 1);
			}
		}
		return map;
	});

	// Comment statistics
	let documentCommentCount = $derived(allComments.filter((c) => !c.clauseId).length);
	let clauseCommentCount = $derived(allComments.filter((c) => c.clauseId).length);

	// Comment mutations
	const CreateCommentMutation = graphql(`
		mutation ChairCreateCommentMutation(
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
		mutation ChairUpdateCommentMutation($commentId: ID!, $content: String!) {
			updateComment(commentId: $commentId, content: $content) {
				id
			}
		}
	`);

	const DeleteCommentMutation = graphql(`
		mutation ChairDeleteCommentMutation($commentId: ID!) {
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

	// =====================================================
	// Sponsor management
	// =====================================================

	const AddSponsorMutation = graphql(`
		mutation ChairAddSponsorMutation($paperId: ID!, $committeeMemberId: ID!) {
			addSponsor(paperId: $paperId, committeeMemberId: $committeeMemberId) {
				id
			}
		}
	`);

	const RemoveSponsorMutation = graphql(`
		mutation ChairRemoveSponsorMutation($paperId: ID!, $committeeMemberId: ID!) {
			removeSponsor(paperId: $paperId, committeeMemberId: $committeeMemberId)
		}
	`);

	let showAddSponsorModal = $state(false);
	let sponsorSearchQuery = $state('');

	let availableMembers = $derived(
		(committee?.members ?? []).filter(
			(member) => !paper?.sponsors.some((s) => s.committeeMemberId === member.id)
		)
	);

	function getRepresentationName(
		rep: { name?: string | null; alpha3Code?: string | null } | null | undefined
	) {
		return rep?.name ?? getTranslatedCountryNameFromAlpha3Code(rep?.alpha3Code) ?? '';
	}

	let sortedSponsors = $derived(
		[...(paper?.sponsors ?? [])].sort((a, b) =>
			getRepresentationName(a.committeeMember?.representation).localeCompare(
				getRepresentationName(b.committeeMember?.representation)
			)
		)
	);

	let filteredAvailableMembers = $derived(
		(sponsorSearchQuery
			? availableMembers.filter((member) =>
					getRepresentationName(member.representation)
						.toLowerCase()
						.includes(sponsorSearchQuery.toLowerCase())
				)
			: availableMembers
		).sort((a, b) =>
			getRepresentationName(a.representation).localeCompare(getRepresentationName(b.representation))
		)
	);

	async function handleAddSponsor(committeeMemberId: string) {
		await AddSponsorMutation.mutate({ paperId: page.params.paperId!, committeeMemberId });
		toast.success(m.sponsorAdded());
	}

	async function handleRemoveSponsor(committeeMemberId: string) {
		await RemoveSponsorMutation.mutate({ paperId: page.params.paperId!, committeeMemberId });
		toast.success(m.sponsorRemoved());
	}

	// Collapsible metadata
	let metadataOpen = $state(false);

	// =====================================================
	// Amendments (Phase 6c)
	// =====================================================

	let allAmendments = $derived($ChairAmendmentsSubscription.data?.findManyAmendment ?? []);

	let submittedAmendments = $derived(allAmendments.filter((a) => a.status === 'SUBMITTED'));

	let currentOpIndex = $derived(committee?.currentOperativeIndex ?? 0);

	let operativeClauses = $derived((resolution?.operative ?? []) as OperativeClause[]);

	// GO-ordered: current paragraph first → DELETE > ALTER_TEXT (diff size desc) > ADD > ALTER_POSITION → then by createdAt
	let sortedSubmittedAmendments = $derived.by(() => {
		const typeOrder: Record<string, number> = {
			DELETE: 0,
			ALTER_TEXT: 1,
			ADD: 2,
			ALTER_POSITION: 3
		};
		return [...submittedAmendments].sort((a, b) => {
			// Current paragraph first
			const aIsCurrent = (a.targetOperativeIndex ?? -1) === currentOpIndex;
			const bIsCurrent = (b.targetOperativeIndex ?? -1) === currentOpIndex;
			if (aIsCurrent && !bIsCurrent) return -1;
			if (!aIsCurrent && bIsCurrent) return 1;

			// Then by type
			const aType = typeOrder[a.type] ?? 99;
			const bType = typeOrder[b.type] ?? 99;
			if (aType !== bType) return aType - bType;

			// For ALTER_TEXT, sort by diff size descending
			if (a.type === 'ALTER_TEXT' && b.type === 'ALTER_TEXT') {
				const aClause = operativeClauses[a.targetOperativeIndex ?? 0];
				const bClause = operativeClauses[b.targetOperativeIndex ?? 0];
				if (aClause && bClause && a.newContent && b.newContent) {
					const aDiff = calculateAmendmentDiffSize(aClause, a.newContent as OperativeClause);
					const bDiff = calculateAmendmentDiffSize(bClause, b.newContent as OperativeClause);
					if (aDiff !== bDiff) return bDiff - aDiff;
				}
			}

			// Then by createdAt
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		});
	});

	// Transform server amendments → AmendmentOverlay[] for editor rendering
	let amendmentOverlays = $derived.by(() => {
		const visible = allAmendments.filter(
			(a) => a.status === 'SUBMITTED' || a.status === 'CONSENSUS_ADOPTED' || a.status === 'ACCEPTED'
		);
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
					isOwnAmendment: false
				}) satisfies AmendmentOverlay
		);
	});

	// Amendment mutations
	const AdoptByConsensusMutation = graphql(`
		mutation ChairAdoptByConsensusMutation($amendmentId: ID!) {
			adoptByConsensus(amendmentId: $amendmentId) {
				id
				status
			}
		}
	`);

	const AcceptAmendmentMutation = graphql(`
		mutation ChairAcceptAmendmentMutation($amendmentId: ID!) {
			acceptAmendment(amendmentId: $amendmentId) {
				id
				status
			}
		}
	`);

	const RejectAmendmentMutation = graphql(`
		mutation ChairRejectAmendmentMutation($amendmentId: ID!) {
			rejectAmendment(amendmentId: $amendmentId) {
				id
				status
			}
		}
	`);

	const WithdrawAmendmentMutation = graphql(`
		mutation ChairWithdrawAmendmentMutation($amendmentId: ID!) {
			withdrawAmendment(amendmentId: $amendmentId) {
				id
				status
			}
		}
	`);

	const UpdateCommitteeMutation = graphql(`
		mutation ChairAdvanceParagraphMutation($id: ID!, $currentOperativeIndex: Int) {
			updateCommittee(id: $id, currentOperativeIndex: $currentOperativeIndex) {
				id
				currentOperativeIndex
			}
		}
	`);

	let showAdoptConfirmModal = $state(false);
	let showRejectConfirmModal = $state(false);
	let confirmAmendmentId = $state<string | null>(null);

	async function handleAdoptByConsensus(amendmentId: string) {
		try {
			await AdoptByConsensusMutation.mutate({ amendmentId });
			toast.success(m.amendmentAdopted());
			showAdoptConfirmModal = false;
			confirmAmendmentId = null;
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleRejectAmendment(amendmentId: string) {
		try {
			await RejectAmendmentMutation.mutate({ amendmentId });
			toast.success(m.amendmentRejectedToast());
			showRejectConfirmModal = false;
			confirmAmendmentId = null;
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleWithdrawAmendment(amendmentId: string) {
		try {
			await WithdrawAmendmentMutation.mutate({ amendmentId });
			toast.success(m.amendmentWithdrawnToast());
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleAdvanceParagraph() {
		if (!committee) return;
		try {
			await UpdateCommitteeMutation.mutate({
				id: committee.id,
				currentOperativeIndex: currentOpIndex + 1
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

	// =====================================================
	// Voting Phase (Phase 7)
	// =====================================================

	let clauseVotes = $derived($ChairClauseVotesSubscription.data?.findManyOperativeClauseVote ?? []);
	let voteResult = $derived(
		$ChairVoteResultSubscription.data?.findFirstResolutionVoteResult ?? null
	);

	// Map clauseId → vote for quick lookup
	let clauseVoteMap = $derived.by(() => {
		const map = new SvelteMap<string, (typeof clauseVotes)[0]>();
		for (const v of clauseVotes) {
			map.set(v.clauseId, v);
		}
		return map;
	});

	// Rejected clause IDs for editor strikethrough
	let rejectedClauseIds = $derived(
		clauseVotes.filter((v) => v.outcome === 'REJECTED').map((v) => v.clauseId)
	);

	let votedClauseCount = $derived(clauseVotes.length);
	let allClausesVoted = $derived(
		operativeClauses.length > 0 && votedClauseCount >= operativeClauses.length
	);

	// Quick vote inputs
	let quickVotesFor = $state(0);
	let quickVotesAgainst = $state(0);
	let quickVotesAbstain = $state(0);

	// Final vote inputs
	let finalVotesFor = $state(0);
	let finalVotesAgainst = $state(0);
	let finalVotesAbstain = $state(0);

	// Modals
	let showStartVotingPhaseModal = $state(false);
	let showFinalVoteConfirmModal = $state(false);
	let finalVoteOutcome = $state<'ADOPTED' | 'REJECTED' | 'SENT_BACK'>('ADOPTED');
	let showRevertStatusModal = $state(false);
	let revertRestoreSnapshot = $state(false);

	// Voting mutations
	const StartVotingPhaseMutation = graphql(`
		mutation ChairStartVotingPhaseMutation($paperId: ID!) {
			startVotingPhase(paperId: $paperId) {
				id
				status
			}
		}
	`);

	const RecordClauseVoteMutation = graphql(`
		mutation ChairRecordClauseVoteMutation(
			$paperId: ID!
			$clauseId: String!
			$outcome: VoteOutcomeEnum!
			$votesFor: Int!
			$votesAgainst: Int!
			$votesAbstain: Int
		) {
			recordClauseVote(
				paperId: $paperId
				clauseId: $clauseId
				outcome: $outcome
				votesFor: $votesFor
				votesAgainst: $votesAgainst
				votesAbstain: $votesAbstain
			) {
				id
				clauseId
				outcome
			}
		}
	`);

	const DeleteClauseVoteMutation = graphql(`
		mutation ChairDeleteClauseVoteMutation($paperId: ID!, $clauseId: String!) {
			deleteClauseVote(paperId: $paperId, clauseId: $clauseId)
		}
	`);

	const RecordFinalVoteMutation = graphql(`
		mutation ChairRecordFinalVoteMutation(
			$paperId: ID!
			$outcome: VoteOutcomeEnum!
			$votesFor: Int!
			$votesAgainst: Int!
			$votesAbstain: Int
		) {
			recordVoteResult(
				paperId: $paperId
				outcome: $outcome
				votesFor: $votesFor
				votesAgainst: $votesAgainst
				votesAbstain: $votesAbstain
			) {
				id
				status
			}
		}
	`);

	const RevertPaperStatusMutation = graphql(`
		mutation ChairRevertPaperStatusMutation($paperId: ID!, $restoreSnapshot: Boolean) {
			revertPaperStatus(paperId: $paperId, restoreSnapshot: $restoreSnapshot) {
				id
				status
			}
		}
	`);

	async function handleRevertStatus() {
		try {
			await RevertPaperStatusMutation.mutate({
				paperId: page.params.paperId!,
				restoreSnapshot: revertRestoreSnapshot
			});
			showRevertStatusModal = false;
			revertRestoreSnapshot = false;
			toast.success(m.statusReverted());
		} catch {
			toast.error(m.saveError());
		}
	}

	function getPreviousStatus(status: string): string {
		const order = [
			'WORKING_PAPER',
			'SUBMITTED',
			'DRAFT_RESOLUTION',
			'AMENDMENT_PHASE',
			'VOTING_PHASE',
			'FINAL'
		];
		const idx = order.indexOf(status);
		return idx > 0 ? order[idx - 1] : status;
	}

	async function handleStartVotingPhase() {
		try {
			await StartVotingPhaseMutation.mutate({ paperId: page.params.paperId! });
			showStartVotingPhaseModal = false;
			toast.success(m.votingPhaseStarted());
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleRecordClauseVote(outcome: 'ADOPTED' | 'REJECTED') {
		const clause = operativeClauses[currentOpIndex];
		if (!clause) return;
		try {
			await RecordClauseVoteMutation.mutate({
				paperId: page.params.paperId!,
				clauseId: clause.id,
				outcome,
				votesFor: quickVotesFor,
				votesAgainst: quickVotesAgainst,
				votesAbstain: quickVotesAbstain
			});
			toast.success(m.clauseVoteRecorded());
			quickVotesFor = 0;
			quickVotesAgainst = 0;
			quickVotesAbstain = 0;
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleDeleteClauseVote(clauseId: string) {
		try {
			await DeleteClauseVoteMutation.mutate({
				paperId: page.params.paperId!,
				clauseId
			});
			toast.success(m.clauseVoteDeleted());
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleRecordFinalVote() {
		try {
			await RecordFinalVoteMutation.mutate({
				paperId: page.params.paperId!,
				outcome: finalVoteOutcome,
				votesFor: finalVotesFor,
				votesAgainst: finalVotesAgainst,
				votesAbstain: finalVotesAbstain
			});
			showFinalVoteConfirmModal = false;
			if (finalVoteOutcome === 'ADOPTED') {
				toast.success(m.resolutionAdopted());
			} else if (finalVoteOutcome === 'REJECTED') {
				toast.success(m.resolutionRejected());
			} else {
				toast.success(m.resolutionSentBack());
			}
		} catch {
			toast.error(m.saveError());
		}
	}

	function navigateToVotingClause(index: number) {
		if (!committee) return;
		UpdateCommitteeMutation.mutate({
			id: committee.id,
			currentOperativeIndex: index
		}).catch(() => toast.error(m.saveError()));
	}
</script>

<svelte:head>
	<title>{paper?.documentNumber ?? m.draftResolution()} - MUNify CHASE</title>
</svelte:head>

{#if paper}
	<div class="mx-auto flex max-w-4xl flex-col px-4">
		<!-- Back button + save status -->
		<div class="flex items-center justify-between py-2">
			<a href="./." class="btn btn-ghost btn-sm">
				<i class="fa-duotone fa-arrow-left mr-1"></i>
				{m.backToResolutions()}
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
			</div>
		</div>

		<!-- Collapsible metadata header -->
		<div class="flex items-start gap-2">
			<div class="collapse collapse-arrow bg-base-100 shadow-sm flex-1">
				<input type="checkbox" bind:checked={metadataOpen} />
				<div class="collapse-title">
					<div class="flex items-center gap-2">
						<span class="font-bold font-mono">
							{paper.documentNumber ?? m.draftResolution()}
						</span>
						<span class="badge badge-soft badge-sm {getStatusBadgeClass(paper.status)}">
							{getStatusText(paper.status)}
						</span>
					</div>
				</div>
				<div class="collapse-content flex flex-col gap-4">
					<!-- Agenda Item -->
					{#if paper.agendaItem}
						<div class="text-sm">
							<span class="opacity-60">{m.agendaItem()}:</span>
							{paper.agendaItem.title}
						</div>
					{/if}

					<!-- Creator -->
					{#if paper.creator?.representation}
						<div class="flex items-center gap-2 text-sm">
							<span class="opacity-60">{m.submittingNation()}:</span>
							<Flag representation={paper.creator.representation} size="xs" />
							{paper.creator.representation.name ??
								getTranslatedCountryNameFromAlpha3Code(paper.creator.representation.alpha3Code)}
						</div>
					{/if}

					<!-- Sponsors -->
					<Fieldset legend={m.sponsors()} faIcon="fas fa-users">
						<div class="flex flex-wrap gap-2">
							{#each sortedSponsors as sponsor (sponsor.id)}
								<div
									class="group relative tooltip tooltip-bottom"
									data-tip={sponsor.committeeMember?.representation?.name ??
										getTranslatedCountryNameFromAlpha3Code(
											sponsor.committeeMember?.representation?.alpha3Code
										)}
								>
									<Flag representation={sponsor.committeeMember?.representation} size="xs" />
									<button
										class="absolute -top-1 -right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
										onclick={() => handleRemoveSponsor(sponsor.committeeMemberId)}
									>
										<i class="fas fa-times text-[0.5rem]"></i>
									</button>
								</div>
							{/each}
							<button
								class="btn btn-ghost btn-xs"
								onclick={() => {
									sponsorSearchQuery = '';
									showAddSponsorModal = true;
								}}
							>
								<i class="fas fa-plus"></i>
							</button>
						</div>
						<p class="mt-1 text-xs opacity-60">
							{m.sponsorCount({ count: String(paper.sponsors.length) })}
						</p>
					</Fieldset>
				</div>
			</div>
			{#if paper.status !== 'WORKING_PAPER'}
				<button
					class="btn btn-ghost btn-xs opacity-60 hover:opacity-100 mt-3"
					title={m.revertStatus()}
					onclick={() => {
						revertRestoreSnapshot = false;
						showRevertStatusModal = true;
					}}
				>
					<i class="fas fa-undo text-xs"></i>
				</button>
			{/if}
		</div>

		<!-- Collaborative editing info banner -->
		{#if hasOtherLocks}
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

		<!-- Comment statistics -->
		{#if allComments.length > 0}
			<div class="flex items-center gap-4 text-sm text-base-content/60 mt-2">
				<div class="flex items-center gap-1">
					<i class="fas fa-comments"></i>
					<span class="font-semibold">{allComments.length}</span>
					{m.comments()}
				</div>
				<span class="text-base-content/30">|</span>
				<div class="flex items-center gap-1">
					<span>{documentCommentCount}</span>
					{m.documentWide()}
				</div>
				<span class="text-base-content/30">|</span>
				<div class="flex items-center gap-1">
					<span>{clauseCommentCount}</span>
					{m.clauseComments()}
				</div>
			</div>
		{/if}

		<!-- Resolution Editor -->
		<div class="py-2">
			{#if resolution}
				<ResolutionEditor
					committeeName={committee?.name ?? ''}
					{resolution}
					editable={paper.status !== 'AMENDMENT_PHASE' &&
						paper.status !== 'VOTING_PHASE' &&
						paper.status !== 'FINAL'}
					onResolutionChange={handleResolutionChange}
					onClauseLock={handleClauseLock}
					onClauseUnlock={handleClauseUnlock}
					onClauseInteraction={handleClauseInteraction}
					{lockedClauseIds}
					{editableClauseIds}
					amendments={paper.status === 'AMENDMENT_PHASE' ? amendmentOverlays : undefined}
					rejectedClauseIds={paper.status === 'VOTING_PHASE' || paper.status === 'FINAL'
						? rejectedClauseIds
						: undefined}
					onAmendmentClick={paper.status === 'AMENDMENT_PHASE' ? handleAmendmentClick : undefined}
				>
					{#snippet preambleAnnotations({ clause })}
						{@const lock = locksByClauseId.get(clause.id)}
						{@const commentCount = commentCountByClauseId.get(clause.id) ?? 0}
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
						{#if commentCount > 0}
							<div class="badge badge-sm badge-info">
								<i class="fas fa-comment text-xs"></i>
								{commentCount}
							</div>
						{/if}
					{/snippet}
					{#snippet clauseAnnotations({ clause })}
						{@const lock = locksByClauseId.get(clause.id)}
						{@const commentCount = commentCountByClauseId.get(clause.id) ?? 0}
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
						{#if commentCount > 0}
							<div class="badge badge-sm badge-info">
								<i class="fas fa-comment text-xs"></i>
								{commentCount}
							</div>
						{/if}
					{/snippet}
					{#snippet preambleClauseToolbar({ clause })}
						<CommentSection
							paperId={page.params.paperId!}
							clauseId={clause.id}
							comments={commentsByClauseId.get(clause.id) ?? []}
							{myConferenceUserId}
							canPostTeamOnly={true}
							onCreateComment={(content, visibility, parentCommentId) =>
								onCreateComment(content, visibility, parentCommentId, clause.id)}
							{onUpdateComment}
							{onDeleteComment}
						/>
					{/snippet}
					{#snippet clauseToolbar({ clause })}
						<CommentSection
							paperId={page.params.paperId!}
							clauseId={clause.id}
							comments={commentsByClauseId.get(clause.id) ?? []}
							{myConferenceUserId}
							canPostTeamOnly={true}
							onCreateComment={(content, visibility, parentCommentId) =>
								onCreateComment(content, visibility, parentCommentId, clause.id)}
							{onUpdateComment}
							{onDeleteComment}
						/>
					{/snippet}
				</ResolutionEditor>
			{/if}
		</div>

		<!-- Amendment phase controls (Phase 6c) -->
		{#if paper.status === 'AMENDMENT_PHASE'}
			<Fieldset legend={m.currentParagraph()} faIcon="fas fa-list-ol">
				<div class="flex items-center justify-between">
					<span class="font-mono text-lg font-bold">
						OP {currentOpIndex + 1} / {operativeClauses.length}
					</span>
					<button
						class="btn btn-primary btn-sm"
						onclick={handleAdvanceParagraph}
						disabled={currentOpIndex >= operativeClauses.length - 1}
					>
						<i class="fas fa-forward mr-1"></i>
						{m.advanceToNextParagraph()}
					</button>
				</div>
			</Fieldset>

			<Fieldset legend={m.amendmentQueue()} faIcon="fas fa-gavel">
				{#if sortedSubmittedAmendments.length === 0}
					<p class="text-base-content/50 text-sm">{m.noAmendments()}</p>
				{:else}
					<div class="flex flex-col gap-2">
						{#each sortedSubmittedAmendments as amendment (amendment.id)}
							{@const isCurrentParagraph =
								(amendment.targetOperativeIndex ?? -1) === currentOpIndex}
							<div
								id="amendment-{amendment.id}"
								class="card card-border bg-base-100 p-3 transition-all {isCurrentParagraph
									? 'border-primary border-2'
									: ''}"
							>
								<div class="flex items-center justify-between gap-2">
									<div class="flex items-center gap-2 flex-wrap">
										<span class="badge badge-sm {getAmendmentTypeBadgeClass(amendment.type)}">
											{getAmendmentTypeLabel(amendment.type)}
										</span>
										{#if amendment.targetOperativeIndex != null}
											<span class="badge badge-ghost badge-sm font-mono">
												OP {amendment.targetOperativeIndex + 1}
											</span>
										{/if}
										{#if amendment.proposer?.representation}
											<div class="flex items-center gap-1 text-sm">
												<Flag representation={amendment.proposer.representation} size="xs" />
												<span>
													{amendment.proposer.representation.name ??
														getTranslatedCountryNameFromAlpha3Code(
															amendment.proposer.representation.alpha3Code
														)}
												</span>
											</div>
										{/if}
										<span class="badge badge-ghost badge-xs">
											{amendment.sponsors?.length ?? 0}
											{m.sponsors()}
										</span>
									</div>
									<div class="flex items-center gap-1">
										<button
											class="btn btn-success btn-xs"
											onclick={() => {
												confirmAmendmentId = amendment.id;
												showAdoptConfirmModal = true;
											}}
										>
											{m.adoptByConsensus()}
										</button>
										<button
											class="btn btn-error btn-xs"
											onclick={() => {
												confirmAmendmentId = amendment.id;
												showRejectConfirmModal = true;
											}}
										>
											{m.amendmentRejected()}
										</button>
										<button
											class="btn btn-ghost btn-xs"
											onclick={() => handleWithdrawAmendment(amendment.id)}
										>
											{m.withdrawAmendment()}
										</button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</Fieldset>

			<!-- Start Voting Phase button -->
			<div class="flex justify-end mt-2">
				<button class="btn btn-accent btn-sm" onclick={() => (showStartVotingPhaseModal = true)}>
					<i class="fas fa-vote-yea mr-1"></i>
					{m.startVotingPhase()}
				</button>
			</div>
		{/if}

		<!-- Voting Phase controls (Phase 7) -->
		{#if paper.status === 'VOTING_PHASE'}
			<!-- Paragraph Voting -->
			<Fieldset legend={m.paragraphVoting()} faIcon="fas fa-list-ol">
				<div class="flex items-center justify-between mb-3">
					<span class="font-mono text-lg font-bold">
						OP {currentOpIndex + 1} / {operativeClauses.length}
					</span>
					<span class="text-sm opacity-60">
						{m.clausesVoted({
							voted: String(votedClauseCount),
							total: String(operativeClauses.length)
						})}
					</span>
				</div>

				<!-- Nav buttons -->
				<div class="flex items-center gap-2 mb-3">
					<button
						class="btn btn-ghost btn-sm"
						disabled={currentOpIndex <= 0}
						onclick={() => navigateToVotingClause(currentOpIndex - 1)}
					>
						<i class="fas fa-chevron-left mr-1"></i>
						{m.previousParagraph()}
					</button>
					<button
						class="btn btn-ghost btn-sm"
						disabled={currentOpIndex >= operativeClauses.length - 1}
						onclick={() => navigateToVotingClause(currentOpIndex + 1)}
					>
						{m.nextParagraph()}
						<i class="fas fa-chevron-right ml-1"></i>
					</button>
				</div>

				<!-- Current clause vote status -->
				{@const currentClause = operativeClauses[currentOpIndex]}
				{#if currentClause}
					{@const existingVote = clauseVoteMap.get(currentClause.id)}
					{#if existingVote}
						<!-- Already voted -->
						<div
							class="alert {existingVote.outcome === 'ADOPTED'
								? 'alert-success'
								: 'alert-error'} mb-2"
						>
							<i
								class="fas {existingVote.outcome === 'ADOPTED'
									? 'fa-check-circle'
									: 'fa-times-circle'}"
							></i>
							<span>
								OP {currentOpIndex + 1}:
								<strong>
									{existingVote.outcome === 'ADOPTED' ? m.adopted() : m.rejected()}
								</strong>
								— {m.votesFor()}: {existingVote.votesFor} | {m.votesAgainst()}: {existingVote.votesAgainst}
								{#if existingVote.votesAbstain > 0}
									| {m.votesAbstain()}: {existingVote.votesAbstain}
								{/if}
							</span>
							<button
								class="btn btn-ghost btn-xs"
								onclick={() => handleDeleteClauseVote(currentClause.id)}
							>
								<i class="fas fa-undo mr-1"></i>
								{m.undoVote()}
							</button>
						</div>
					{:else}
						<!-- Quick vote form -->
						<div class="rounded-lg bg-base-200 p-3">
							<p class="text-sm font-medium mb-2">
								{m.voteOnParagraph({ index: String(currentOpIndex + 1) })}
							</p>
							<div class="flex items-end gap-3 flex-wrap">
								<label class="form-control w-24">
									<div class="label"><span class="label-text text-xs">{m.votesFor()}</span></div>
									<input
										type="number"
										class="input input-bordered input-sm w-full"
										min="0"
										bind:value={quickVotesFor}
									/>
								</label>
								<label class="form-control w-24">
									<div class="label">
										<span class="label-text text-xs">{m.votesAgainst()}</span>
									</div>
									<input
										type="number"
										class="input input-bordered input-sm w-full"
										min="0"
										bind:value={quickVotesAgainst}
									/>
								</label>
								<label class="form-control w-24">
									<div class="label">
										<span class="label-text text-xs">{m.votesAbstain()}</span>
									</div>
									<input
										type="number"
										class="input input-bordered input-sm w-full"
										min="0"
										bind:value={quickVotesAbstain}
									/>
								</label>
								<button
									class="btn btn-success btn-sm"
									onclick={() => handleRecordClauseVote('ADOPTED')}
								>
									<i class="fas fa-check mr-1"></i>
									{m.adoptClause()}
								</button>
								<button
									class="btn btn-error btn-sm"
									onclick={() => handleRecordClauseVote('REJECTED')}
								>
									<i class="fas fa-times mr-1"></i>
									{m.rejectClause()}
								</button>
							</div>
						</div>
					{/if}
				{/if}
			</Fieldset>

			<!-- Clause Vote Summary -->
			<Fieldset legend={m.clauseVoteSummary()} faIcon="fas fa-clipboard-check">
				<div class="flex flex-col gap-1">
					{#each operativeClauses as clause, i (clause.id)}
						{@const vote = clauseVoteMap.get(clause.id)}
						<button
							class="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-base-200 transition-colors text-left {i ===
							currentOpIndex
								? 'bg-base-200 font-semibold'
								: ''}"
							onclick={() => navigateToVotingClause(i)}
						>
							<span class="font-mono w-12">OP {i + 1}</span>
							{#if vote}
								<span
									class="badge badge-xs {vote.outcome === 'ADOPTED'
										? 'badge-success'
										: 'badge-error'}"
								>
									{vote.outcome === 'ADOPTED' ? m.adopted() : m.rejected()}
								</span>
							{:else}
								<span class="badge badge-xs badge-ghost">—</span>
							{/if}
						</button>
					{/each}
				</div>
			</Fieldset>

			<!-- Final Vote -->
			<Fieldset legend={m.finalVote()} faIcon="fas fa-gavel">
				{#if voteResult}
					<div
						class="alert {voteResult.outcome === 'ADOPTED'
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
						<span>
							<strong>
								{voteResult.outcome === 'ADOPTED'
									? m.adopted()
									: voteResult.outcome === 'REJECTED'
										? m.rejected()
										: m.sentBack()}
							</strong>
							— {m.votesFor()}: {voteResult.votesFor} | {m.votesAgainst()}: {voteResult.votesAgainst}
							{#if voteResult.votesAbstain > 0}
								| {m.votesAbstain()}: {voteResult.votesAbstain}
							{/if}
						</span>
					</div>
				{:else}
					<p class="text-sm opacity-60 mb-3">{m.finalVoteDescription()}</p>
					<div class="flex items-end gap-3 flex-wrap">
						<label class="form-control w-24">
							<div class="label"><span class="label-text text-xs">{m.votesFor()}</span></div>
							<input
								type="number"
								class="input input-bordered input-sm w-full"
								min="0"
								bind:value={finalVotesFor}
							/>
						</label>
						<label class="form-control w-24">
							<div class="label">
								<span class="label-text text-xs">{m.votesAgainst()}</span>
							</div>
							<input
								type="number"
								class="input input-bordered input-sm w-full"
								min="0"
								bind:value={finalVotesAgainst}
							/>
						</label>
						<label class="form-control w-24">
							<div class="label">
								<span class="label-text text-xs">{m.votesAbstain()}</span>
							</div>
							<input
								type="number"
								class="input input-bordered input-sm w-full"
								min="0"
								bind:value={finalVotesAbstain}
							/>
						</label>
					</div>
					<div class="flex gap-2 mt-3">
						<button
							class="btn btn-success btn-sm"
							onclick={() => {
								finalVoteOutcome = 'ADOPTED';
								showFinalVoteConfirmModal = true;
							}}
						>
							<i class="fas fa-check mr-1"></i>
							{m.adoptResolution()}
						</button>
						<button
							class="btn btn-error btn-sm"
							onclick={() => {
								finalVoteOutcome = 'REJECTED';
								showFinalVoteConfirmModal = true;
							}}
						>
							<i class="fas fa-times mr-1"></i>
							{m.rejectResolution()}
						</button>
						<button
							class="btn btn-warning btn-sm"
							onclick={() => {
								finalVoteOutcome = 'SENT_BACK';
								showFinalVoteConfirmModal = true;
							}}
						>
							<i class="fas fa-undo mr-1"></i>
							{m.sendBack()}
						</button>
					</div>
				{/if}
			</Fieldset>
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
		<Fieldset legend={m.documentLevelComments()} faIcon="fas fa-comments">
			<CommentSection
				paperId={page.params.paperId!}
				clauseId={null}
				comments={commentsByClauseId.get(null) ?? []}
				{myConferenceUserId}
				canPostTeamOnly={true}
				onCreateComment={(content, visibility, parentCommentId) =>
					onCreateComment(content, visibility, parentCommentId, null)}
				{onUpdateComment}
				{onDeleteComment}
			/>
		</Fieldset>
	</div>

	<!-- Add Sponsor Modal -->
	<Modal bind:open={showAddSponsorModal}>
		<div class="flex items-center justify-between mb-4">
			<h3 class="font-bold text-lg">{m.addSponsor()}</h3>
			<button class="btn btn-ghost btn-sm" onclick={() => (showAddSponsorModal = false)}>
				<i class="fas fa-times"></i>
			</button>
		</div>
		<input
			class="input input-bordered w-full mb-3"
			placeholder={m.searchMembers()}
			bind:value={sponsorSearchQuery}
		/>
		<div class="max-h-64 overflow-y-auto space-y-1">
			{#each filteredAvailableMembers as member (member.id)}
				<button
					class="btn btn-ghost btn-sm w-full justify-start gap-2"
					onclick={() => handleAddSponsor(member.id)}
				>
					<Flag representation={member.representation} size="xs" />
					<span>
						{member.representation?.name ??
							getTranslatedCountryNameFromAlpha3Code(member.representation?.alpha3Code)}
					</span>
				</button>
			{/each}
			{#if filteredAvailableMembers.length === 0}
				<p class="text-center text-sm opacity-60 py-4">{m.noResults()}</p>
			{/if}
		</div>
	</Modal>

	<!-- Adopt by Consensus confirmation modal -->
	<Modal bind:open={showAdoptConfirmModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.adoptByConsensus()}</h3>
			<p>{m.confirmAdoptByConsensus()}</p>
			<div class="flex justify-end gap-2">
				<button
					class="btn btn-ghost btn-sm"
					onclick={() => {
						showAdoptConfirmModal = false;
						confirmAmendmentId = null;
					}}
				>
					{m.abort()}
				</button>
				<button
					class="btn btn-success btn-sm"
					onclick={() => confirmAmendmentId && handleAdoptByConsensus(confirmAmendmentId)}
				>
					{m.yes()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Reject confirmation modal -->
	<Modal bind:open={showRejectConfirmModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.amendmentRejected()}</h3>
			<p>{m.confirmRejectAmendment()}</p>
			<div class="flex justify-end gap-2">
				<button
					class="btn btn-ghost btn-sm"
					onclick={() => {
						showRejectConfirmModal = false;
						confirmAmendmentId = null;
					}}
				>
					{m.abort()}
				</button>
				<button
					class="btn btn-error btn-sm"
					onclick={() => confirmAmendmentId && handleRejectAmendment(confirmAmendmentId)}
				>
					{m.yes()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Start Voting Phase confirmation modal -->
	<Modal bind:open={showStartVotingPhaseModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.startVotingPhase()}</h3>
			<p>{m.confirmStartVotingPhase()}</p>
			<div class="flex justify-end gap-2">
				<button class="btn btn-ghost btn-sm" onclick={() => (showStartVotingPhaseModal = false)}>
					{m.abort()}
				</button>
				<button class="btn btn-accent btn-sm" onclick={handleStartVotingPhase}>
					{m.yes()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Final Vote confirmation modal -->
	<Modal bind:open={showFinalVoteConfirmModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.finalVote()}</h3>
			<p>
				{#if finalVoteOutcome === 'ADOPTED'}
					{m.confirmAdoptResolution()}
				{:else if finalVoteOutcome === 'REJECTED'}
					{m.confirmRejectResolution()}
				{:else}
					{m.confirmSendBack()}
				{/if}
			</p>
			<div class="flex justify-end gap-2">
				<button class="btn btn-ghost btn-sm" onclick={() => (showFinalVoteConfirmModal = false)}>
					{m.abort()}
				</button>
				<button
					class="btn btn-sm {finalVoteOutcome === 'ADOPTED'
						? 'btn-success'
						: finalVoteOutcome === 'REJECTED'
							? 'btn-error'
							: 'btn-warning'}"
					onclick={handleRecordFinalVote}
				>
					{m.yes()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Revert Status confirmation modal -->
	<Modal bind:open={showRevertStatusModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.revertStatus()}</h3>
			<p>
				{m.confirmRevertStatus({
					from: getStatusText(paper.status),
					to: getStatusText(getPreviousStatus(paper.status))
				})}
			</p>

			{#if paper.status === 'AMENDMENT_PHASE'}
				<label class="flex items-start gap-3 cursor-pointer">
					<input
						type="checkbox"
						class="checkbox checkbox-sm mt-0.5"
						bind:checked={revertRestoreSnapshot}
					/>
					<div>
						<div class="font-medium text-sm">{m.restoreContentFromSnapshot()}</div>
						<div class="text-xs opacity-60">{m.restoreContentFromSnapshotDescription()}</div>
					</div>
				</label>
			{/if}

			{#if paper.status === 'VOTING_PHASE'}
				<div class="alert alert-warning text-sm">
					<i class="fas fa-exclamation-triangle"></i>
					{m.revertVotingWarning()}
				</div>
			{/if}

			{#if paper.status === 'DRAFT_RESOLUTION'}
				<div class="alert alert-warning text-sm">
					<i class="fas fa-exclamation-triangle"></i>
					{m.revertDrWarning()}
				</div>
			{/if}

			<div class="flex justify-end gap-2">
				<button class="btn btn-ghost btn-sm" onclick={() => (showRevertStatusModal = false)}>
					{m.abort()}
				</button>
				<button class="btn btn-warning btn-sm" onclick={handleRevertStatus}>
					{m.revertStatus()}
				</button>
			</div>
		</div>
	</Modal>
{/if}
