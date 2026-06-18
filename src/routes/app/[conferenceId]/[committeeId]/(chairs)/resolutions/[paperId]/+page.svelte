<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import ResolutionEditorMount from '$lib/components/resolutions/ResolutionEditorMount.svelte';
	import SnapshotHistoryModal from '$lib/components/resolutions/SnapshotHistoryModal.svelte';
	import toast from 'svelte-french-toast';

	let historyOpen = $state(false);

	const conferenceId = $derived(page.params.conferenceId!);
	const committeeId = $derived(page.params.committeeId!);
	const paperId = $derived(page.params.paperId!);

	const currentUser = await getCurrentUser();

	const paper = await client.liveQuery.resolutionPapers({
		__args: { where: { id: paperId } },
		id: true,
		title: true,
		status: true,
		documentNumber: true,
		committee: { id: true },
		creatorCommitteeMember: {
			id: true,
			representation: { name: true, alpha2Code: true, alpha3Code: true }
		},
		sponsors: {
			id: true,
			committeeMember: { id: true, representation: { name: true, alpha2Code: true } }
		},
		editors: {
			id: true,
			conferenceUser: { id: true, name: true, userEmail: true }
		},
		agendaItem: { id: true, title: true }
	});

	const currentPaper = $derived(paper?.[0]);

	let submitting = $state(false);
	async function submitPaper() {
		if (!currentPaper) return;
		if (!confirm(m.submitPaperConfirmTitle() + '\n\n' + m.submitPaperConfirmWarning())) return;
		submitting = true;
		try {
			await client.mutate.updateResolutionPaper({
				__args: { id: currentPaper.id, status: 'SUBMITTED' },
				id: true
			});
			toast.success('Submitted');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to submit');
		} finally {
			submitting = false;
		}
	}

	async function setStatus(status: 'DRAFT_RESOLUTION' | 'AMENDMENT_PHASE' | 'VOTING_PHASE') {
		if (!currentPaper) return;
		try {
			await client.mutate.updateResolutionPaper({
				__args: { id: currentPaper.id, status },
				id: true
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to update');
		}
	}

	async function backToList() {
		await goto(
			resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions', {
				conferenceId,
				committeeId
			})
		);
	}

	const presenceUser = $derived({
		id: currentUser.id ?? 'anonymous',
		name:
			[currentUser.givenName, currentUser.familyName].filter(Boolean).join(' ').trim() ||
			currentUser.email ||
			'Anonymous',
		color: undefined
	});
</script>

{#if currentPaper}
	<div class="flex h-[calc(100vh-4rem)] w-full">
		<!-- Main editor column -->
		<div class="flex flex-1 flex-col">
			<header class="bg-base-100 flex items-center gap-3 border-b px-4 py-2">
				<button class="btn btn-ghost btn-sm" onclick={backToList} aria-label="back">
					<i class="fas fa-arrow-left"></i>
				</button>
				<div class="min-w-0 flex-1">
					<div class="truncate text-lg font-semibold">
						{currentPaper.title || m.workingPaper()}
					</div>
					<div class="text-base-content/60 text-xs">
						{currentPaper.documentNumber ?? ''}
						{currentPaper.agendaItem?.title ? '· ' + currentPaper.agendaItem.title : ''}
					</div>
				</div>
				<div class="flex items-center gap-2">
					<button
						class="btn btn-sm btn-ghost"
						onclick={() => (historyOpen = true)}
						title={m.documentHistory()}
					>
						<i class="fas fa-clock-rotate-left"></i>
					</button>
					{#if currentPaper.status === 'WORKING_PAPER'}
						<button class="btn btn-sm btn-primary" onclick={submitPaper} disabled={submitting}>
							{#if submitting}<i class="fas fa-spinner fa-spin"></i>{/if}
							{m.submit()}
						</button>
					{:else if currentPaper.status === 'SUBMITTED'}
						<button class="btn btn-sm btn-primary" onclick={() => setStatus('DRAFT_RESOLUTION')}>
							{m.draftResolutions()}
						</button>
					{:else if currentPaper.status === 'DRAFT_RESOLUTION'}
						<button class="btn btn-sm btn-warning" onclick={() => setStatus('AMENDMENT_PHASE')}>
							{m.amendmentPhase()}
						</button>
					{:else if currentPaper.status === 'AMENDMENT_PHASE'}
						<button class="btn btn-sm btn-secondary" onclick={() => setStatus('VOTING_PHASE')}>
							{m.voting()}
						</button>
					{/if}
					<span
						class="badge"
						class:badge-ghost={currentPaper.status === 'WORKING_PAPER'}
						class:badge-info={currentPaper.status === 'SUBMITTED'}
						class:badge-primary={currentPaper.status === 'DRAFT_RESOLUTION'}
						class:badge-warning={currentPaper.status === 'AMENDMENT_PHASE'}
						class:badge-secondary={currentPaper.status === 'VOTING_PHASE'}
						class:badge-success={currentPaper.status === 'FINAL'}
					>
						{currentPaper.status}
					</span>
				</div>
			</header>

			<div class="min-h-0 flex-1 overflow-auto">
				{#if browser}
					<ResolutionEditorMount
						{paperId}
						user={presenceUser}
						editable={currentPaper.status !== 'FINAL'}
					/>
				{/if}
			</div>
		</div>

		<SnapshotHistoryModal bind:open={historyOpen} {paperId} close={() => (historyOpen = false)} />

		<!-- Side drawer -->
		<aside class="bg-base-200 hidden w-80 shrink-0 border-l p-4 lg:block">
			<BasicCard title={m.sponsors()}>
				{#if !currentPaper.sponsors.length}
					<p class="text-sm opacity-60">No sponsors yet</p>
				{:else}
					<ul class="space-y-1">
						{#each currentPaper.sponsors as sponsor (sponsor.id)}
							<li class="text-sm">
								{sponsor.committeeMember?.representation?.name ?? '?'}
							</li>
						{/each}
					</ul>
				{/if}
			</BasicCard>
		</aside>
	</div>
{:else}
	<div class="flex h-full w-full items-center justify-center">
		<i class="fas fa-spinner fa-spin text-3xl opacity-50"></i>
	</div>
{/if}
