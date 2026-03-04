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
	import {
		ResolutionEditor,
		migrateResolution,
		type Resolution
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import Modal from '$lib/components/Modal.svelte';
	import Fieldset from '$lib/components/Fieldset.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import CommentSection from '$lib/components/CommentSection.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import toast from 'svelte-french-toast';
	import { fly, fade } from 'svelte/transition';

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
		paper?.status === 'DRAFT_RESOLUTION' || paper?.status === 'AMENDMENT_PHASE'
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
									: 'badge-success'}"
					>
						{paper.status === 'WORKING_PAPER'
							? m.workingPaper()
							: paper.status === 'SUBMITTED'
								? m.submitted()
								: paper.status === 'DRAFT_RESOLUTION'
									? m.draftResolution()
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

		<!-- Resolution Editor -->
		<div class="py-2">
			{#if resolution}
				{@const collab = canEdit && collaborativeMode}
				<ResolutionEditor
					committeeName={committee?.name ?? ''}
					{resolution}
					editable={canEdit}
					onResolutionChange={handleResolutionChange}
					onClauseLock={collab ? handleClauseLock : undefined}
					onClauseUnlock={collab ? handleClauseUnlock : undefined}
					onClauseInteraction={collab ? handleClauseInteraction : undefined}
					lockedClauseIds={collab ? lockedClauseIds : undefined}
					editableClauseIds={collab ? editableClauseIds : undefined}
				>
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
{/if}
