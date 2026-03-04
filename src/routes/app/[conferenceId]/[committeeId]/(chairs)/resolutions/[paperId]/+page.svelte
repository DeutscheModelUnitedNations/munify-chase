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
	import {
		ResolutionEditor,
		migrateResolution,
		type Resolution
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import Flag from '$lib/components/Flag.svelte';
	import Fieldset from '$lib/components/Fieldset.svelte';
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

	// Collapsible metadata
	let metadataOpen = $state(false);
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
						<span class="opacity-60">Creator:</span>
						<Flag representation={paper.creator.representation} size="xs" />
						{paper.creator.representation.name ??
							getTranslatedCountryNameFromAlpha3Code(paper.creator.representation.alpha3Code)}
					</div>
				{/if}

				<!-- Sponsors -->
				<Fieldset legend={m.sponsors()} faIcon="fas fa-users">
					<div class="flex flex-wrap gap-2">
						{#each paper.sponsors as sponsor (sponsor.id)}
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
					editable={true}
					onResolutionChange={handleResolutionChange}
					onClauseLock={handleClauseLock}
					onClauseUnlock={handleClauseUnlock}
					onClauseInteraction={handleClauseInteraction}
					{lockedClauseIds}
					{editableClauseIds}
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
{/if}
