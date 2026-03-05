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
		<div class="collapse collapse-arrow bg-base-100 shadow-sm">
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

		<!-- Collaborative editing info banner -->
		{#if hasOtherLocks}
			<div class="alert alert-info mt-2 text-sm">
				<i class="fas fa-lock"></i>
				<span>{m.collaborativeEditingInfo()}</span>
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
					editable={paper.status !== 'AMENDMENT_PHASE'}
					onResolutionChange={handleResolutionChange}
					onClauseLock={handleClauseLock}
					onClauseUnlock={handleClauseUnlock}
					onClauseInteraction={handleClauseInteraction}
					{lockedClauseIds}
					{editableClauseIds}
					amendments={paper.status === 'AMENDMENT_PHASE' ? amendmentOverlays : undefined}
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
{/if}
