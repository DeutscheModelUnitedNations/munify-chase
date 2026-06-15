<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import { m } from '$lib/paraglide/messages';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import toast from 'svelte-french-toast';

	type PaperStatus =
		| 'WORKING_PAPER'
		| 'SUBMITTED'
		| 'DRAFT_RESOLUTION'
		| 'AMENDMENT_PHASE'
		| 'VOTING_PHASE'
		| 'FINAL';

	const conferenceId = $derived(page.params.conferenceId!);
	const committeeId = $derived(page.params.committeeId!);

	const currentUser = await getCurrentUser();

	const committee = await client.liveQuery.committee({
		__args: { id: committeeId },
		id: true,
		name: true,
		activeAgendaItem: { id: true, title: true },
		agendaItems: { id: true, title: true }
	});

	const papers = await client.liveQuery.resolutionPapers({
		__args: {
			where: { committee: { id: committeeId } }
		},
		id: true,
		title: true,
		status: true,
		documentNumber: true,
		createdAt: true,
		updatedAt: true,
		creatorCommitteeMember: {
			id: true,
			representation: { name: true, alpha2Code: true, alpha3Code: true }
		},
		sponsors: { id: true },
		agendaItem: { id: true, title: true }
	});

	const statusFilters: { key: PaperStatus | 'ALL'; label: () => string }[] = [
		{ key: 'ALL', label: () => m.all() },
		{ key: 'WORKING_PAPER', label: () => m.workingPapers() },
		{ key: 'SUBMITTED', label: () => m.submittedPapers() },
		{ key: 'DRAFT_RESOLUTION', label: () => m.draftResolutions() },
		{ key: 'AMENDMENT_PHASE', label: () => m.amendmentPhase() },
		{ key: 'VOTING_PHASE', label: () => m.voting() },
		{ key: 'FINAL', label: () => m.final() }
	];
	let activeFilter = $state<PaperStatus | 'ALL'>('ALL');

	const filteredPapers = $derived.by(() => {
		const list = papers ?? [];
		if (activeFilter === 'ALL') return list;
		return list.filter((p) => p.status === activeFilter);
	});

	let creating = $state(false);
	async function createPaper() {
		if (!committee?.activeAgendaItem) {
			toast.error('Select an active agenda item first');
			return;
		}
		creating = true;
		try {
			const newId = nanoid();
			// Find the chair's committee member (chairs don't have one — fallback to any).
			// For now: chair-create requires a creator committee member; we use the first
			// delegate member as a stand-in. UI will let the user pick later.
			const memberSearch = await client.query.committeeMembers({
				__args: { where: { committee: { id: committeeId } } },
				id: true
			});
			if (!memberSearch?.length) {
				toast.error('No committee members found');
				return;
			}
			const created = await client.mutate.chairCreateResolutionPaper({
				__args: {
					id: newId,
					committeeId,
					agendaItemId: committee.activeAgendaItem.id,
					creatorCommitteeMemberId: memberSearch[0].id,
					status: 'WORKING_PAPER'
				},
				id: true
			});
			if (created) {
				await goto(
					resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions/[paperId]', {
						conferenceId,
						committeeId,
						paperId: created.id
					})
				);
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to create paper');
		} finally {
			creating = false;
		}
	}

	function paperHref(paperId: string) {
		return resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions/[paperId]', {
			conferenceId,
			committeeId,
			paperId
		});
	}

	function statusBadgeClass(status: PaperStatus): string {
		switch (status) {
			case 'WORKING_PAPER':
				return 'badge-ghost';
			case 'SUBMITTED':
				return 'badge-info';
			case 'DRAFT_RESOLUTION':
				return 'badge-primary';
			case 'AMENDMENT_PHASE':
				return 'badge-warning';
			case 'VOTING_PHASE':
				return 'badge-secondary';
			case 'FINAL':
				return 'badge-success';
		}
	}

	function statusLabel(status: PaperStatus): string {
		switch (status) {
			case 'WORKING_PAPER':
				return m.workingPaper();
			case 'SUBMITTED':
				return m.submittedPapers();
			case 'DRAFT_RESOLUTION':
				return m.draftResolutions();
			case 'AMENDMENT_PHASE':
				return m.amendmentPhase();
			case 'VOTING_PHASE':
				return m.voting();
			case 'FINAL':
				return m.final();
		}
	}

	void currentUser;
</script>

<div class="flex h-full w-full flex-col items-center">
	<div class="flex w-full max-w-screen-xl flex-col gap-6 p-6">
		<header class="flex flex-wrap items-center justify-between gap-4">
			<h1 class="text-3xl font-bold">{m.resolutions()}</h1>
			<button
				class="btn btn-primary"
				disabled={creating || !committee?.activeAgendaItem}
				onclick={createPaper}
			>
				{#if creating}
					<i class="fas fa-spinner fa-spin"></i>
				{:else}
					<i class="fas fa-plus"></i>
				{/if}
				{m.createPaper()}
			</button>
		</header>

		<div class="flex flex-wrap gap-2">
			{#each statusFilters as filter (filter.key)}
				<button
					class="btn btn-sm"
					class:btn-primary={activeFilter === filter.key}
					class:btn-ghost={activeFilter !== filter.key}
					onclick={() => (activeFilter = filter.key)}
				>
					{filter.label()}
				</button>
			{/each}
		</div>

		{#if !filteredPapers.length}
			<BasicCard>
				<div class="flex flex-col items-center gap-2 py-12 text-center opacity-70">
					<i class="fas fa-file-lines text-5xl"></i>
					<p class="text-lg font-semibold">{m.noPapersYet()}</p>
					<p>{m.createFirstPaper()}</p>
				</div>
			</BasicCard>
		{:else}
			<div class="grid gap-3">
				{#each filteredPapers as paper (paper.id)}
					<a
						href={paperHref(paper.id)}
						class="card bg-base-100 hover:bg-base-200 cursor-pointer transition"
					>
						<div class="card-body flex-row items-center gap-4 p-4">
							<div class="flex-1">
								<div class="flex flex-wrap items-center gap-2">
									<span class="font-semibold">
										{paper.title || paper.documentNumber || m.workingPaper()}
									</span>
									<span class="badge badge-sm {statusBadgeClass(paper.status)}">
										{statusLabel(paper.status)}
									</span>
								</div>
								<div class="text-base-content/60 text-sm">
									{paper.agendaItem?.title ?? ''}
									{#if paper.creatorCommitteeMember?.representation?.name}
										· {paper.creatorCommitteeMember.representation.name}
									{/if}
									· {paper.sponsors.length}
									{paper.sponsors.length === 1 ? m.sponsor() : m.sponsors()}
								</div>
							</div>
							<i class="fas fa-chevron-right opacity-50"></i>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
