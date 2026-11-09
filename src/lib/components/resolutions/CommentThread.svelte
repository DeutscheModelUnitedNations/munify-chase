<script lang="ts">
	import { browser } from '$app/env';
	import { m } from '#lib/paraglide/messages';
	import { client } from '#lib/api/rumbleClient/client';
	import { nanoid } from '#lib/helpers/nanoid';
	import toast from 'svelte-french-toast';
	import { isTeam, type ResolutionViewer } from './paperContext';
	import { commentAuthorDisplay, newCommentArgs, sendsOnKey } from './commentThread';
	import { errorMessage } from './sponsors';
	import CommentItem from './CommentItem.svelte';

	interface Props {
		paperId: string;
		/** null = document-level comments. */
		selectedClauseId: string | null;
		viewer: ResolutionViewer;
	}

	let { paperId, selectedClauseId, viewer }: Props = $props();

	const comments = await client.liveQuery.resolutionComments({
		__args: { where: { paper: { id: { eq: paperId } } }, orderBy: { createdAt: 'asc' } },
		id: true,
		content: true,
		clauseId: true,
		visibility: true,
		parentCommentId: true,
		createdAt: true,
		author: {
			id: true,
			name: true,
			userEmail: true,
			conferenceUserType: true,
			user: {
				givenName: true,
				familyName: true,
				preferredUsername: true
			},
			committeeMember: {
				representation: {
					name: true,
					type: true,
					alpha2Code: true,
					alpha3Code: true,
					icon: true
				}
			},
			conferenceMember: {
				representation: {
					name: true,
					type: true,
					alpha2Code: true,
					alpha3Code: true,
					icon: true
				}
			}
		}
	});

	type Author = (typeof comments)[number]['author'];

	const authorDisplay = (author: Author | null | undefined) =>
		commentAuthorDisplay({ author, viewerIsTeam: isTeam(viewer) });

	// Comments scoped to the current selection (clause-level vs document-level).
	const scoped = $derived(
		(comments ?? []).filter((c) => (c.clauseId ?? null) === selectedClauseId)
	);
	const roots = $derived(scoped.filter((c) => !c.parentCommentId));
	function repliesOf(parentId: string) {
		return scoped.filter((c) => c.parentCommentId === parentId);
	}

	let draft = $state('');
	let teamOnly = $state(browser ? localStorage.getItem('commentTeamOnly') === 'true' : false);
	$effect(() => {
		localStorage.setItem('commentTeamOnly', String(teamOnly));
	});
	let replyTo = $state<string | null>(null);
	let sending = $state(false);

	const canTeamOnly = $derived(isTeam(viewer));
	const replyToComment = $derived((comments ?? []).find((c) => c.id === replyTo) ?? null);
	const replyForcesTeamOnly = $derived(replyToComment?.visibility === 'TEAM_ONLY');
	const effectiveTeamOnly = $derived(replyForcesTeamOnly || teamOnly);

	async function send() {
		const content = draft.trim();
		if (!content) return;
		sending = true;
		try {
			await client.mutate.createResolutionComment({
				__args: newCommentArgs({
					id: nanoid(),
					paperId,
					content,
					clauseId: selectedClauseId,
					replyTo,
					teamOnly: effectiveTeamOnly && canTeamOnly
				}),
				id: true
			});
			draft = '';
			replyTo = null;
		} catch (err) {
			toast.error(errorMessage(err, 'Failed to comment'));
		} finally {
			sending = false;
		}
	}

	async function remove(id: string) {
		try {
			await client.mutate.deleteResolutionComment({ __args: { id } });
		} catch (err) {
			toast.error(errorMessage(err, 'Failed to delete'));
		}
	}

	function canDelete(authorId: string | undefined) {
		return canTeamOnly || (authorId ?? '') === viewer.conferenceUserId;
	}

	function onDraftKey(e: KeyboardEvent) {
		if (!sendsOnKey({ key: e.key, shiftKey: e.shiftKey, sending, draft })) return;
		e.preventDefault();
		send();
	}
</script>

{#snippet composer()}
	<div class="border-base-300 flex flex-col gap-2 border-t pt-2">
		{#if replyTo}
			<div class="text-base-content/60 flex items-center justify-between text-xs">
				<span>{m.replyingToComment()}</span>
				<button
					class="btn btn-ghost btn-xs"
					aria-label={m.cancel()}
					onclick={() => (replyTo = null)}
				>
					<i aria-hidden="true" class="ph-fill ph-x"></i>
				</button>
			</div>
		{/if}
		<textarea
			class="textarea textarea-sm w-full"
			class:textarea-bordered={!effectiveTeamOnly}
			class:textarea-warning={effectiveTeamOnly}
			rows="2"
			placeholder={m.writeAComment()}
			bind:value={draft}
			onkeydown={onDraftKey}></textarea>
		<div class="flex items-center justify-between gap-2">
			{#if canTeamOnly}
				<label
					class="label gap-2 py-0"
					class:cursor-pointer={!replyForcesTeamOnly}
					class:cursor-not-allowed={replyForcesTeamOnly}
				>
					<input
						type="checkbox"
						class="checkbox checkbox-xs"
						class:checkbox-warning={effectiveTeamOnly}
						checked={effectiveTeamOnly}
						disabled={replyForcesTeamOnly}
						onchange={(e) => {
							if (!replyForcesTeamOnly) teamOnly = e.currentTarget.checked;
						}}
					/>
					<span class="label-text text-xs">{m.teamOnly()}</span>
				</label>
			{:else}
				<span></span>
			{/if}
			<button class="btn btn-primary btn-sm" disabled={sending || !draft.trim()} onclick={send}>
				{#if sending}<i aria-hidden="true" class="ph-fill ph-spinner-gap animate-spin"></i>{:else}<i
						aria-hidden="true"
						class="ph-fill ph-paper-plane-tilt"
					></i>{/if}
				{m.send()}
			</button>
		</div>
	</div>
{/snippet}

<div class="flex h-full flex-col gap-3">
	<p class="text-base-content/60 text-xs">
		{selectedClauseId ? m.comments() : m.documentComments()}
	</p>

	<div class="flex-1 space-y-4 overflow-y-auto">
		{#if !roots.length}
			<p class="text-base-content/50 py-6 text-center text-sm">{m.noCommentsYet()}</p>
		{:else}
			{#each roots as comment (comment.id)}
				{@const display = authorDisplay(comment.author)}
				<CommentItem
					name={display.name}
					representation={display.representation}
					content={comment.content}
					teamOnly={comment.visibility === 'TEAM_ONLY'}
					canDelete={canDelete(comment.author?.id)}
					ondelete={() => remove(comment.id)}
				>
					{#each repliesOf(comment.id) as reply (reply.id)}
						{@const replyDisplay = authorDisplay(reply.author)}
						<CommentItem
							reply
							name={replyDisplay.name}
							representation={replyDisplay.representation}
							content={reply.content}
							teamOnly={reply.visibility === 'TEAM_ONLY'}
							canDelete={canDelete(reply.author?.id)}
							ondelete={() => remove(reply.id)}
						/>
					{/each}

					<button
						class="btn btn-ghost btn-xs mt-1"
						onclick={() => (replyTo = replyTo === comment.id ? null : comment.id)}
					>
						<i aria-hidden="true" class="ph-fill ph-arrow-bend-up-left"></i>
						{m.reply()}
					</button>
				</CommentItem>
			{/each}
		{/if}
	</div>

	{@render composer()}
</div>
