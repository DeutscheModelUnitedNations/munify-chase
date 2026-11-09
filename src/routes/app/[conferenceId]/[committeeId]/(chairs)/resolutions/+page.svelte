<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { client } from '#lib/api/rumbleClient/client';
	import { nanoid } from '#lib/helpers/nanoid';
	import { m } from '#lib/paraglide/messages';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import CommitteePhaseToggles from '#lib/components/resolutions/CommitteePhaseToggles.svelte';
	import ChairPaperCard from './ChairPaperCard.svelte';
	import { chairPaperList, errorMessage, paperListSelection } from '../../../papers';
	import {
		statusLabel,
		PAPER_STATUS_ORDER,
		type PaperStatus
	} from '#lib/components/resolutions/paperContext';
	import toast from 'svelte-french-toast';

	const conferenceId = $derived(page.params.conferenceId!);
	const committeeId = $derived(page.params.committeeId!);

	const committee = await client.liveQuery.committee({
		__args: { id: committeeId },
		id: true,
		name: true,
		activeDraftResolutionId: true,
		amendmentSubmissionOpen: true,
		amendmentSponsoringOpen: true,
		supportReevaluationOpen: true,
		activeAgendaItem: { id: true, title: true }
	});

	let settingActiveId = $state<string | null>(null);
	async function setActive(paperId: string) {
		// Setting the active paper again unsets it
		const nextActive = committee?.activeDraftResolutionId === paperId ? undefined : paperId;
		settingActiveId = paperId;
		try {
			await client.mutate.setActiveDraftResolution({
				__args: { committeeId, paperId: nextActive },
				id: true,
				activeDraftResolutionId: true
			});
		} catch (err) {
			toast.error(errorMessage({ err, fallback: 'Failed' }));
		} finally {
			settingActiveId = null;
		}
	}

	const papers = await client.liveQuery.resolutionPapers({
		__args: { where: { committee: { id: { eq: committeeId } } } },
		...paperListSelection,
		createdAt: true,
		agendaItem: { id: true, title: true }
	});

	const statusFilters: { key: PaperStatus | 'ALL'; label: () => string }[] = [
		{ key: 'ALL', label: () => m.all() },
		...PAPER_STATUS_ORDER.map((s) => ({ key: s, label: () => statusLabel(s) }))
	];
	let activeFilter = $state<PaperStatus | 'ALL'>('ALL');

	const filteredPapers = $derived(
		chairPaperList({
			papers,
			activeAgendaItemId: committee?.activeAgendaItem?.id,
			status: activeFilter
		})
	);

	function paperHref(paperId: string) {
		return resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions/[paperId]', {
			conferenceId,
			committeeId,
			paperId
		});
	}

	let creating = $state(false);

	/** A new working paper on the active agenda item, credited to the committee's first seat. */
	async function createWorkingPaper(agendaItemId: string) {
		const members = await client.query.committeeMembers({
			__args: { where: { committee: { id: { eq: committeeId } } } },
			id: true
		});
		const creatorCommitteeMemberId = members?.[0]?.id;
		if (!creatorCommitteeMemberId) throw new Error(m.noCommitteeMembers());
		return client.mutate.createResolutionPaper({
			__args: {
				id: nanoid(),
				committeeId,
				agendaItemId,
				creatorCommitteeMemberId,
				status: 'WORKING_PAPER'
			},
			id: true
		});
	}

	async function createPaper() {
		const agendaItemId = committee?.activeAgendaItem?.id;
		if (!agendaItemId) {
			toast.error(m.selectActiveAgendaItemFirst());
			return;
		}
		creating = true;
		try {
			const created = await createWorkingPaper(agendaItemId);
			if (created) await goto(paperHref(created.id));
		} catch (err) {
			toast.error(errorMessage({ err, fallback: 'Failed to create paper' }));
		} finally {
			creating = false;
		}
	}

	registerCommands(() => [
		{
			id: 'resolutions.create',
			title: m.createPaper,
			group: 'page',
			icon: 'plus',
			enabled: () => !creating && !!committee?.activeAgendaItem,
			run: createPaper
		}
	]);

	let promotingId = $state<string | null>(null);
	async function promote(paperId: string) {
		promotingId = paperId;
		try {
			await client.mutate.updateResolutionPaper({
				__args: {
					id: paperId,
					status: 'DRAFT_RESOLUTION'
				},
				id: true
			});
			toast.success(m.promotedToDr());
		} catch (err) {
			toast.error(errorMessage({ err, fallback: 'Failed to promote' }));
		} finally {
			promotingId = null;
		}
	}
</script>

<div class="flex h-full w-full flex-col items-center">
	<div class="flex w-full max-w-screen-xl flex-col gap-6 p-6">
		<header class="flex flex-wrap items-center justify-between gap-4">
			<h1 class="text-3xl font-bold">{m.resolutions()}</h1>
			<button
				class="btn btn-primary"
				data-tour="resolutions.create"
				disabled={creating || !committee?.activeAgendaItem}
				onclick={createPaper}
			>
				{#if creating}<i aria-hidden="true" class="ph-fill ph-spinner-gap animate-spin"
					></i>{:else}<i aria-hidden="true" class="ph-fill ph-plus"></i>{/if}
				{m.createPaper()}
			</button>
		</header>

		{#if committee}
			<div class="bg-base-100 rounded-box p-4" data-tour="resolutions.phase-toggles">
				<CommitteePhaseToggles
					{committeeId}
					amendmentSubmissionOpen={committee.amendmentSubmissionOpen}
					amendmentSponsoringOpen={committee.amendmentSponsoringOpen}
					supportReevaluationOpen={committee.supportReevaluationOpen}
				/>
			</div>
		{/if}

		<div class="overflow-x-auto" data-tour="resolutions.filters">
			<div role="tablist" class="tabs tabs-boxed w-max min-w-full">
				{#each statusFilters as filter (filter.key)}
					<button
						role="tab"
						class="tab"
						class:tab-active={activeFilter === filter.key}
						onclick={() => (activeFilter = filter.key)}
					>
						{filter.label()}
					</button>
				{/each}
			</div>
		</div>

		{#if !filteredPapers.length}
			<BasicCard data-tour="resolutions.list">
				<div class="flex flex-col items-center gap-2 py-12 text-center opacity-70">
					<i aria-hidden="true" class="ph-fill ph-file-text text-5xl"></i>
					<p class="text-lg font-semibold">{m.noPapersYet()}</p>
					<p>{m.createFirstPaper()}</p>
				</div>
			</BasicCard>
		{:else}
			<div class="grid gap-3" data-tour="resolutions.list">
				{#each filteredPapers as paper (paper.id)}
					<ChairPaperCard
						{paper}
						href={paperHref(paper.id)}
						isActive={committee?.activeDraftResolutionId === paper.id}
						promoting={promotingId === paper.id}
						settingActive={settingActiveId === paper.id}
						onPromote={() => promote(paper.id)}
						onSetActive={() => setActive(paper.id)}
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>
