<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Flag from './Flag.svelte';
	import { slide } from 'svelte/transition';
	import type { ChairPaperCommentsSubscription$result } from '$houdini';

	type Comment = ChairPaperCommentsSubscription$result['findManyResolutionComment'][number];

	interface Props {
		paperId: string;
		clauseId?: string | null;
		comments: Comment[];
		myConferenceUserId?: string;
		canPostTeamOnly: boolean;
		readonly?: boolean;
		onCreateComment: (
			content: string,
			visibility: string,
			parentCommentId?: string
		) => Promise<void>;
		onUpdateComment: (commentId: string, content: string) => Promise<void>;
		onDeleteComment: (commentId: string) => Promise<void>;
	}

	let {
		paperId,
		clauseId = null,
		comments,
		myConferenceUserId,
		canPostTeamOnly,
		readonly = false,
		onCreateComment,
		onUpdateComment,
		onDeleteComment
	}: Props = $props();

	// Filter comments for this clause
	let topLevelComments = $derived(
		comments.filter((c) => c.parentCommentId === null && c.clauseId === clauseId)
	);

	function getReplies(parentId: string): Comment[] {
		return comments.filter((c) => c.parentCommentId === parentId);
	}

	let commentCount = $derived(comments.filter((c) => c.clauseId === clauseId).length);

	// UI state
	let expanded = $state(clauseId === null);
	let newContent = $state('');
	let newVisibility = $state<'PUBLIC' | 'TEAM_ONLY'>('TEAM_ONLY');
	let replyingTo = $state<string | null>(null);
	let replyContent = $state('');
	let replyVisibility = $state<'PUBLIC' | 'TEAM_ONLY'>('TEAM_ONLY');
	let editingId = $state<string | null>(null);
	let editContent = $state('');
	let submitting = $state(false);

	async function handleSubmit() {
		if (!newContent.trim() || submitting) return;
		submitting = true;
		try {
			await onCreateComment(newContent.trim(), newVisibility);
			newContent = '';
			newVisibility = 'TEAM_ONLY';
		} finally {
			submitting = false;
		}
	}

	async function handleReply(parentId: string) {
		if (!replyContent.trim() || submitting) return;
		submitting = true;
		try {
			await onCreateComment(replyContent.trim(), replyVisibility, parentId);
			replyContent = '';
			replyVisibility = 'TEAM_ONLY';
			replyingTo = null;
		} finally {
			submitting = false;
		}
	}

	async function handleEdit(commentId: string) {
		if (!editContent.trim() || submitting) return;
		submitting = true;
		try {
			await onUpdateComment(commentId, editContent.trim());
			editingId = null;
			editContent = '';
		} finally {
			submitting = false;
		}
	}

	async function handleDelete(commentId: string) {
		if (submitting) return;
		submitting = true;
		try {
			await onDeleteComment(commentId);
		} finally {
			submitting = false;
		}
	}

	function startEdit(comment: Comment) {
		editingId = comment.id;
		editContent = comment.content;
	}

	function startReply(commentId: string) {
		replyingTo = commentId;
		replyContent = '';
		replyVisibility = 'TEAM_ONLY';
	}

	function formatTime(dateInput: Date | string): string {
		const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
		return d.toLocaleString(undefined, {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getAuthorName(comment: Comment): string {
		const rep = comment.author.committeeMember?.representation;
		return rep?.name ?? comment.author.conferenceUserType ?? '?';
	}

	function isAuthor(comment: Comment): boolean {
		return comment.author.id === myConferenceUserId;
	}
</script>

{#if !readonly || commentCount > 0}
	<div class="mt-1">
		<!-- Collapsed toggle -->
		<button
			class="btn btn-ghost btn-xs gap-1 opacity-60 hover:opacity-100"
			onclick={() => (expanded = !expanded)}
		>
			<i class="fas fa-comment text-xs"></i>
			{#if commentCount > 0}
				<span class="text-xs">{commentCount}</span>
			{:else}
				<span class="text-xs">{m.addComment()}</span>
			{/if}
			<i class="fas fa-chevron-{expanded ? 'up' : 'down'} text-xs ml-1"></i>
		</button>

		{#if expanded}
			<div
				class="mt-2 space-y-2 pl-2 border-l-2 border-base-300"
				transition:slide={{ duration: 200 }}
			>
				{#if topLevelComments.length === 0}
					<p class="text-xs text-base-content/50">{m.noComments()}</p>
				{/if}

				{#each topLevelComments as comment (comment.id)}
					<div class="bg-base-100 rounded-lg p-2 text-sm">
						<!-- Comment header -->
						<div class="flex items-center gap-2 mb-1">
							{#if comment.author.committeeMember?.representation}
								<Flag representation={comment.author.committeeMember.representation} size="xs" />
							{/if}
							<span class="font-semibold text-xs">{getAuthorName(comment)}</span>
							<span class="text-xs text-base-content/40">{formatTime(comment.createdAt)}</span>
							{#if comment.visibility === 'PUBLIC'}
								<span class="badge badge-xs badge-info">{m.publicComment()}</span>
							{/if}
						</div>

						<!-- Comment body -->
						{#if editingId === comment.id}
							<div class="flex gap-2 mt-1">
								<textarea
									class="textarea textarea-bordered textarea-xs flex-1 min-h-[2rem]"
									bind:value={editContent}
									onkeydown={(e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault();
											handleEdit(comment.id);
										}
										if (e.key === 'Escape') editingId = null;
									}}
								></textarea>
								<div class="flex flex-col gap-1">
									<button
										class="btn btn-xs btn-primary"
										disabled={submitting}
										onclick={() => handleEdit(comment.id)}
									>
										<i class="fas fa-check"></i>
									</button>
									<button class="btn btn-xs btn-ghost" onclick={() => (editingId = null)}>
										<i class="fas fa-times"></i>
									</button>
								</div>
							</div>
						{:else}
							<p class="text-sm whitespace-pre-wrap">{comment.content}</p>
						{/if}

						<!-- Comment actions -->
						{#if !readonly && editingId !== comment.id}
							<div class="flex gap-2 mt-1">
								<button
									class="btn btn-ghost btn-xs text-xs opacity-50 hover:opacity-100"
									onclick={() => startReply(comment.id)}
								>
									{m.replyToComment()}
								</button>
								{#if isAuthor(comment)}
									<button
										class="btn btn-ghost btn-xs text-xs opacity-50 hover:opacity-100"
										onclick={() => startEdit(comment)}
									>
										{m.editComment()}
									</button>
									<button
										class="btn btn-ghost btn-xs text-xs text-error opacity-50 hover:opacity-100"
										onclick={() => handleDelete(comment.id)}
									>
										{m.deleteComment()}
									</button>
								{/if}
							</div>
						{/if}

						<!-- Replies -->
						{#if getReplies(comment.id).length > 0}
							<div class="ml-4 mt-2 space-y-2 border-l-2 border-base-300 pl-2">
								{#each getReplies(comment.id) as reply (reply.id)}
									<div class="bg-base-200/50 rounded p-2 text-sm">
										<div class="flex items-center gap-2 mb-1">
											{#if reply.author.committeeMember?.representation}
												<Flag
													representation={reply.author.committeeMember.representation}
													size="xs"
												/>
											{/if}
											<span class="font-semibold text-xs">{getAuthorName(reply)}</span>
											<span class="text-xs text-base-content/40">{formatTime(reply.createdAt)}</span
											>
											{#if reply.visibility === 'PUBLIC'}
												<span class="badge badge-xs badge-info">{m.publicComment()}</span>
											{/if}
										</div>

										{#if editingId === reply.id}
											<div class="flex gap-2 mt-1">
												<textarea
													class="textarea textarea-bordered textarea-xs flex-1 min-h-[2rem]"
													bind:value={editContent}
													onkeydown={(e) => {
														if (e.key === 'Enter' && !e.shiftKey) {
															e.preventDefault();
															handleEdit(reply.id);
														}
														if (e.key === 'Escape') editingId = null;
													}}
												></textarea>
												<div class="flex flex-col gap-1">
													<button
														class="btn btn-xs btn-primary"
														disabled={submitting}
														onclick={() => handleEdit(reply.id)}
													>
														<i class="fas fa-check"></i>
													</button>
													<button class="btn btn-xs btn-ghost" onclick={() => (editingId = null)}>
														<i class="fas fa-times"></i>
													</button>
												</div>
											</div>
										{:else}
											<p class="text-sm whitespace-pre-wrap">{reply.content}</p>
										{/if}

										{#if !readonly && editingId !== reply.id && isAuthor(reply)}
											<div class="flex gap-2 mt-1">
												<button
													class="btn btn-ghost btn-xs text-xs opacity-50 hover:opacity-100"
													onclick={() => startEdit(reply)}
												>
													{m.editComment()}
												</button>
												<button
													class="btn btn-ghost btn-xs text-xs text-error opacity-50 hover:opacity-100"
													onclick={() => handleDelete(reply.id)}
												>
													{m.deleteComment()}
												</button>
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{/if}

						<!-- Reply form -->
						{#if !readonly && replyingTo === comment.id}
							<div class="ml-4 mt-2 flex gap-2" transition:slide={{ duration: 150 }}>
								<textarea
									class="textarea textarea-bordered textarea-xs flex-1 min-h-[2rem]"
									placeholder={m.commentPlaceholder()}
									bind:value={replyContent}
									onkeydown={(e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault();
											handleReply(comment.id);
										}
										if (e.key === 'Escape') replyingTo = null;
									}}
								></textarea>
								<div class="flex flex-col gap-1">
									{#if canPostTeamOnly}
										<select class="select select-xs select-bordered" bind:value={replyVisibility}>
											<option value="TEAM_ONLY">{m.teamOnly()}</option>
											<option value="PUBLIC">{m.publicComment()}</option>
										</select>
									{/if}
									<button
										class="btn btn-xs btn-primary"
										disabled={submitting || !replyContent.trim()}
										onclick={() => handleReply(comment.id)}
									>
										<i class="fas fa-reply"></i>
									</button>
								</div>
							</div>
						{/if}
					</div>
				{/each}

				<!-- New comment form -->
				{#if !readonly}
					<div class="flex gap-2">
						<textarea
							class="textarea textarea-bordered textarea-xs flex-1 min-h-[2rem]"
							placeholder={m.commentPlaceholder()}
							bind:value={newContent}
							onkeydown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleSubmit();
								}
							}}
						></textarea>
						<div class="flex flex-col gap-1">
							{#if canPostTeamOnly}
								<select class="select select-xs select-bordered" bind:value={newVisibility}>
									<option value="TEAM_ONLY">{m.teamOnly()}</option>
									<option value="PUBLIC">{m.publicComment()}</option>
								</select>
							{/if}
							<button
								class="btn btn-xs btn-primary"
								disabled={submitting || !newContent.trim()}
								onclick={handleSubmit}
							>
								<i class="fas fa-paper-plane"></i>
							</button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}
