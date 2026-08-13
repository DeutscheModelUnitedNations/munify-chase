<script lang="ts">
	import { browser } from '$app/environment';
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import toast from 'svelte-french-toast';
	import type { ResolutionViewer } from './paperContext';
	import { isTeam } from './paperContext';
	import Flag from '$lib/components/Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';

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
					faIcon: true
				}
			},
			conferenceMember: {
				representation: {
					name: true,
					type: true,
					alpha2Code: true,
					alpha3Code: true,
					faIcon: true
				}
			}
		}
	});

	type Author = NonNullable<(typeof comments)[number]['author']>;

	function authorRepresentation(author: Author | null | undefined) {
		return (
			author?.committeeMember?.representation ?? author?.conferenceMember?.representation ?? null
		);
	}

	function authorDisplay(author: Author | null | undefined): {
		name: string;
		representation: ReturnType<typeof authorRepresentation>;
	} {
		if (!author) return { name: '?', representation: null };

		const isParticipantAuthor =
			author.conferenceUserType === 'DELEGATE' || author.conferenceUserType === 'NON_STATE_ACTOR';

		if (isParticipantAuthor) {
			const rep = authorRepresentation(author);
			const name =
				rep?.name ??
				(rep?.alpha3Code ? getTranslatedCountryNameFromAlpha3Code(rep.alpha3Code) : null) ??
				'?';
			return { name, representation: rep };
		}

		if (isTeam(viewer)) {
			const oidcName =
				[author.user?.givenName, author.user?.familyName].filter(Boolean).join(' ').trim() || null;
			return {
				name: author.name ?? oidcName ?? author.user?.preferredUsername ?? author.userEmail ?? '?',
				representation: null
			};
		}

		return { name: m.roleTeam(), representation: null };
	}

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

	const canTeamOnly = $derived(viewer.type === 'ADMIN' || viewer.type === 'TEAM');
	const replyToComment = $derived((comments ?? []).find((c) => c.id === replyTo) ?? null);
	const replyForcesTeamOnly = $derived(replyToComment?.visibility === 'TEAM_ONLY');
	const effectiveTeamOnly = $derived(replyForcesTeamOnly || teamOnly);

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
					visibility: effectiveTeamOnly && canTeamOnly ? 'TEAM_ONLY' : 'PUBLIC'
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

	<div class="flex-1 space-y-4 overflow-y-auto">
		{#if !roots.length}
			<p class="text-base-content/50 py-6 text-center text-sm">{m.noCommentsYet()}</p>
		{:else}
			{#each roots as comment (comment.id)}
				{@const display = authorDisplay(comment.author)}
				<div
					class="bg-base-100 rounded-lg border-l-2 p-4"
					class:border-warning={comment.visibility === 'TEAM_ONLY'}
					class:border-transparent={comment.visibility !== 'TEAM_ONLY'}
				>
					<div class="flex items-start justify-between gap-2">
						<div class="flex items-center gap-2.5">
							{#if display.representation}
								<Flag size="xs" representation={display.representation} />
							{/if}
							<span class="text-sm font-semibold">{display.name}</span>
						</div>
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
					<p class="mt-2 text-sm whitespace-pre-wrap">{comment.content}</p>

					{#each repliesOf(comment.id) as reply (reply.id)}
						{@const replyDisplay = authorDisplay(reply.author)}
						<div
							class="mt-2 ml-4 border-l-2 pl-2"
							class:border-warning={reply.visibility === 'TEAM_ONLY'}
							class:border-base-300={reply.visibility !== 'TEAM_ONLY'}
						>
							<div class="flex items-start justify-between gap-2">
								<div class="flex items-center gap-2.5">
									{#if replyDisplay.representation}
										<Flag size="xs" representation={replyDisplay.representation} />
									{/if}
									<span class="text-xs font-semibold">{replyDisplay.name}</span>
								</div>
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
							<p class="mt-1.5 text-xs whitespace-pre-wrap">{reply.content}</p>
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
				<button
					class="btn btn-ghost btn-xs"
					aria-label={m.cancel()}
					onclick={() => (replyTo = null)}
				>
					<i class="fas fa-xmark"></i>
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
			onkeydown={(e) => {
				if (e.key === 'Enter' && !e.shiftKey && !sending && draft.trim()) {
					e.preventDefault();
					send();
				}
			}}></textarea>
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
				{#if sending}<i class="fas fa-spinner fa-spin"></i>{:else}<i class="fas fa-paper-plane"
					></i>{/if}
				{m.send()}
			</button>
		</div>
	</div>
</div>
