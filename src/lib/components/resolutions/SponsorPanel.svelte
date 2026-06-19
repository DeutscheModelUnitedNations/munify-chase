<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import toast from 'svelte-french-toast';
	import { isTeam, type PaperStatus, type ResolutionViewer } from './paperContext';

	interface Props {
		paperId: string;
		committeeId: string;
		paperStatus: PaperStatus;
		viewer: ResolutionViewer;
	}

	let { paperId, committeeId, paperStatus, viewer }: Props = $props();

	const sponsors = await client.liveQuery.paperSponsors({
		__args: { where: { paper: { id: paperId } } },
		id: true,
		committeeMember: { id: true, representation: { name: true } }
	});

	const team = $derived(isTeam(viewer));
	const myMemberId = $derived(viewer.committeeMemberId ?? null);
	const iSponsor = $derived((sponsors ?? []).find((s) => s.committeeMember?.id === myMemberId));
	const sponsoringAllowed = $derived(
		paperStatus === 'WORKING_PAPER' || paperStatus === 'SUBMITTED'
	);

	// Chair-only member picker (queried always; shown only to team).
	const members = await client.liveQuery.committeeMembers({
		__args: { where: { committee: { id: committeeId } } },
		id: true,
		representation: { name: true }
	});
	let pickMemberId = $state('');

	let busy = $state(false);
	async function add(committeeMemberId?: string) {
		busy = true;
		try {
			await client.mutate.addPaperSponsor({
				__args: { id: nanoid(), paperId, committeeMemberId },
				id: true
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed');
		} finally {
			busy = false;
		}
	}
	async function remove(id: string) {
		try {
			await client.mutate.removePaperSponsor({ __args: { id } });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed');
		}
	}
</script>

<div class="flex flex-col gap-3">
	{#if !sponsors?.length}
		<p class="text-base-content/50 text-sm">{m.noSponsorsYet()}</p>
	{:else}
		<ul class="space-y-1">
			{#each sponsors as s (s.id)}
				<li class="flex items-center justify-between gap-2 text-sm">
					<span>{s.committeeMember?.representation?.name ?? '?'}</span>
					{#if team || s.committeeMember?.id === myMemberId}
						<button
							class="btn btn-ghost btn-xs"
							aria-label={m.delete()}
							onclick={() => remove(s.id)}
						>
							<i class="fas fa-xmark text-error"></i>
						</button>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}

	{#if !team && myMemberId && !iSponsor && sponsoringAllowed}
		<button class="btn btn-primary btn-sm" disabled={busy} onclick={() => add()}>
			<i class="fas fa-handshake"></i>
			{m.sponsorThisPaper()}
		</button>
	{/if}

	{#if team}
		<div class="join">
			<select class="select select-bordered select-sm join-item" bind:value={pickMemberId}>
				<option value="">{m.selectMember()}</option>
				{#each members as mem (mem.id)}
					<option value={mem.id}>{mem.representation?.name ?? mem.id}</option>
				{/each}
			</select>
			<button
				class="btn btn-sm btn-primary join-item"
				disabled={busy || !pickMemberId}
				onclick={() => add(pickMemberId)}>{m.addSponsor()}</button
			>
		</div>
	{/if}
</div>
