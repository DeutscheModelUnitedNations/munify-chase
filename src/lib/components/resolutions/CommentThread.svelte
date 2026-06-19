<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import toast from 'svelte-french-toast';
	import type { ResolutionViewer } from './paperContext';

	interface Props {
		paperId: string;
		/** null = document-level comments. */
		selectedClauseId: string | null;
		viewer: ResolutionViewer;
	}

	let { paperId, selectedClauseId, viewer }: Props = $props();

	const comments = await client.liveQuery.resolutionComments({
		__args: { where: { paper: { id: paperId } }, orderBy: { createdAt: 'asc' } },
		id: true,
		content: true,
		clauseId: true,
		visibility: true,
		parentCommentId: true,
		createdAt: true,
		author: { id: true, name: true }
	});

	// Comments scoped to the current selection (clause-level vs document-level).
	const scoped = $derived(
		(comments ?? []).filter((c) => (c.clauseId ?? null) === selectedClauseId)
	);
	const roots = $derived(scoped.filter((c) => !c.parentCommentId));
	function repliesOf(parentId: string) {
		return scoped.filter((c) => c.parentCommentId === parentId);
	}

	let draft = $state('');
	let teamOnly = $state(false);
	let replyTo = $state<string | null>(null);
	let sending = $state(false);

	const canTeamOnly = $derived(viewer.type === 'ADMIN' || viewer.type === 'TEAM');

	async function send() {
		const content = draft.trim();
		if (!content) return;
		sending = true;
		try {
			await client.mutate.createResolutionComment({
				__args: {
					id: nanoid(),
					paperId,
					content,
					clauseId: selectedClauseId ?? undefined,
					parentCommentId: replyTo ?? undefined,
					visibility: teamOnly && canTeamOnly ? 'TEAM_ONLY' : 'PUBLIC'
				},
				id: true
			});
			draft = '';
			replyTo = null;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to comment');
		} finally {
			sending = false;
		}
	}

	async function remove(id: string) {
		try {
			await client.mutate.deleteResolutionComment({ __args: { id } });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to delete');
		}
	}

	function canDelete(authorId: string) {
		return canTeamOnly || authorId === viewer.conferenceUserId;
	}
</script>

<div class="flex h-full flex-col gap-3">
	<p class="text-base-content/60 text-xs">
		{selectedClauseId ? m.comments() : m.documentComments()}
	</p>

	<div class="flex-1 space-y-2 overflow-y-auto">
		{#if !roots.length}
			<p class="text-base-content/50 py-6 text-center text-sm">{m.noCommentsYet()}</p>
		{:else}
			{#each roots as comment (comment.id)}
				<div class="bg-base-100 rounded-lg p-2">
					<div class="flex items-start justify-between gap-2">
						<span class="text-sm font-semibold">{comment.author?.name ?? '?'}</span>
						<div class="flex items-center gap-1">
							{#if comment.visibility === 'TEAM_ONLY'}
								<span class="badge badge-xs badge-warning" title={m.teamOnly()}>
									<i class="fas fa-user-shield"></i>
								</span>
							{/if}
							{#if canDelete(comment.author?.id ?? '')}
								<button
									class="btn btn-ghost btn-xs"
									aria-label={m.delete()}
									onclick={() => remove(comment.id)}
								>
									<i class="fas fa-trash text-error"></i>
								</button>
							{/if}
						</div>
					</div>
					<p class="text-sm whitespace-pre-wrap">{comment.content}</p>

					{#each repliesOf(comment.id) as reply (reply.id)}
						<div class="border-base-300 mt-2 ml-4 border-l-2 pl-2">
							<div class="flex items-start justify-between gap-2">
								<span class="text-xs font-semibold">{reply.author?.name ?? '?'}</span>
								{#if canDelete(reply.author?.id ?? '')}
									<button
										class="btn btn-ghost btn-xs"
										aria-label={m.delete()}
										onclick={() => remove(reply.id)}
									>
										<i class="fas fa-trash text-error"></i>
									</button>
								{/if}
							</div>
							<p class="text-xs whitespace-pre-wrap">{reply.content}</p>
						</div>
					{/each}

					<button
						class="btn btn-ghost btn-xs mt-1"
						onclick={() => (replyTo = replyTo === comment.id ? null : comment.id)}
					>
						<i class="fas fa-reply"></i>
						{m.reply()}
					</button>
				</div>
			{/each}
		{/if}
	</div>

	<div class="border-base-300 flex flex-col gap-2 border-t pt-2">
		{#if replyTo}
			<div class="text-base-content/60 flex items-center justify-between text-xs">
				<span>{m.replyingToComment()}</span>
				<button class="btn btn-ghost btn-xs" onclick={() => (replyTo = null)}>
					<i class="fas fa-xmark"></i>
				</button>
			</div>
		{/if}
		<textarea
			class="textarea textarea-bordered textarea-sm w-full"
			rows="2"
			placeholder={m.writeAComment()}
			bind:value={draft}
		></textarea>
		<div class="flex items-center justify-between gap-2">
			{#if canTeamOnly}
				<label class="label cursor-pointer gap-2 py-0">
					<input type="checkbox" class="checkbox checkbox-xs" bind:checked={teamOnly} />
					<span class="label-text text-xs">{m.teamOnly()}</span>
				</label>
			{:else}
				<span></span>
			{/if}
			<button class="btn btn-primary btn-sm" disabled={sending || !draft.trim()} onclick={send}>
				{#if sending}<i class="fas fa-spinner fa-spin"></i>{:else}<i class="fas fa-paper-plane"
					></i>{/if}
				{m.send()}
			</button>
		</div>
	</div>
</div>
