<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import type { PageData } from './$houdini';
	import { graphql } from '$houdini';
	import { onMount } from 'svelte';
	import { CommitteeSubscription } from '../committeeSubscription';
	import { ChairResolutionPapersSubscription } from './chairResolutionPapersSubscription';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import Majorities from '$lib/components/Majorities.svelte';
	import StatusWidget from '../StatusWidget.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import toast from 'svelte-french-toast';

	let { data }: { data: PageData } = $props();

	let committeeQuery = $derived(data?.CommitteeTeamQuery);
	let committee = $derived(
		$CommitteeSubscription.data?.findFirstCommittee ?? $committeeQuery.data?.findFirstCommittee
	);

	let papersQuery = $derived(data?.ChairResolutionPapersQuery);
	let papers = $derived(
		$ChairResolutionPapersSubscription.data?.findManyResolutionPaper ??
			$papersQuery.data?.findManyResolutionPaper ??
			[]
	);

	// Submitted papers, sorted by sponsor count descending
	let submittedPapers = $derived(
		papers
			.filter((p) => p.status === 'SUBMITTED')
			.sort((a, b) => b.sponsors.length - a.sponsors.length)
	);

	// Draft resolutions (DR, AMENDMENT_PHASE, FINAL)
	// During re-evaluation: sorted by sponsor count (descending) to show ranking
	// Otherwise: sorted by sequenceNumber
	let draftResolutions = $derived(
		papers
			.filter(
				(p) =>
					p.status === 'DRAFT_RESOLUTION' || p.status === 'AMENDMENT_PHASE' || p.status === 'FINAL'
			)
			.sort((a, b) =>
				committee?.supportReEvaluationOpen
					? b.sponsors.length - a.sponsors.length
					: (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0)
			)
	);

	let existingDrCount = $derived(draftResolutions.length);
	let maxDr = $derived(committee?.maxDraftResolutions ?? 3);
	let availableSlots = $derived(Math.max(0, maxDr - existingDrCount));

	onMount(() => {
		ChairResolutionPapersSubscription.listen({
			committeeId: page.params.committeeId!
		});
	});

	// Promote mutation
	const PromoteMutation = graphql(`
		mutation PromoteToDraftResolutionMutation($paperId: ID!) {
			promoteToDraftResolution(paperId: $paperId) {
				id
				documentNumber
				status
			}
		}
	`);

	// Update committee mutation (for activeDR + re-evaluation)
	const UpdateCommitteeMutation = graphql(`
		mutation UpdateCommitteeResolutionsMutation(
			$id: ID!
			$activeDraftResolutionId: ID
			$clearActiveDraftResolution: Boolean
			$supportReEvaluationOpen: Boolean
		) {
			updateCommittee(
				id: $id
				activeDraftResolutionId: $activeDraftResolutionId
				clearActiveDraftResolution: $clearActiveDraftResolution
				supportReEvaluationOpen: $supportReEvaluationOpen
			) {
				id
				activeDraftResolutionId
				supportReEvaluationOpen
			}
		}
	`);

	let showPromoteModal = $state(false);
	let promotePaperId = $state<string | null>(null);
	let promotePaperTitle = $state('');

	function openPromoteModal(paperId: string, title: string | null) {
		promotePaperId = paperId;
		promotePaperTitle = title || m.untitledPaper();
		showPromoteModal = true;
	}

	async function handlePromote() {
		if (!promotePaperId) return;
		try {
			await PromoteMutation.mutate({ paperId: promotePaperId });
			showPromoteModal = false;
			toast.success(m.paperPromoted());
		} catch {
			toast.error(m.saveError());
		}
	}

	async function setActiveDr(paperId: string) {
		try {
			await UpdateCommitteeMutation.mutate({
				id: page.params.committeeId!,
				activeDraftResolutionId: paperId
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	async function clearActiveDr() {
		try {
			await UpdateCommitteeMutation.mutate({
				id: page.params.committeeId!,
				clearActiveDraftResolution: true
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	async function toggleReEvaluation(open: boolean) {
		try {
			await UpdateCommitteeMutation.mutate({
				id: page.params.committeeId!,
				supportReEvaluationOpen: open
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	function getStatusBadgeClass(status: string) {
		switch (status) {
			case 'DRAFT_RESOLUTION':
				return 'badge-info';
			case 'AMENDMENT_PHASE':
				return 'badge-secondary';
			case 'FINAL':
				return 'badge-success';
			default:
				return 'badge-ghost';
		}
	}

	function getStatusText(status: string) {
		switch (status) {
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

	function timeAgo(dateStr: string | Date | null | undefined) {
		if (!dateStr) return '';
		const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 60000);
		if (minutes < 1) return 'just now';
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		return `${days}d ago`;
	}
</script>

<svelte:head>
	<title>{m.resolutions()} - MUNify CHASE</title>
</svelte:head>

{#if committee}
	<div class="flex h-full w-full items-center justify-center">
		<div class="flex h-full w-full max-w-screen-xl flex-col gap-6 p-6 lg:flex-row">
			<!-- Sidebar -->
			<div class="top-22 flex h-full flex-col gap-4 lg:sticky lg:w-lg">
				<BasicCard>
					<StatusWidget {committee} />
				</BasicCard>
				<BasicCard>
					<Majorities
						totalPresent={committee.totalPresent}
						simpleMajority={committee.simpleMajority}
						twoThirdsMajority={committee.twoThirdsMajority}
						paperSupportThreshold={committee.paperSupportThreshold}
					/>
				</BasicCard>
			</div>

			<!-- Main content -->
			<div class="flex h-full w-full flex-3 flex-col gap-4">
				<!-- Section 1: Submitted Papers Queue -->
				<BasicCard title={m.submittedPapers()}>
					<p class="text-base-content/50 mb-3 text-sm">{m.submittedPapersDescription()}</p>

					{#if submittedPapers.length === 0}
						<div class="text-base-content/50 py-6 text-center text-sm">
							{m.noSubmittedPapers()}
						</div>
					{:else}
						<div class="flex flex-col gap-3">
							{#each submittedPapers as paper, i (paper.id)}
								<div
									class="card bg-base-200 shadow-sm {i < availableSlots
										? 'border-l-4 border-warning'
										: ''}"
								>
									<div class="card-body flex-row items-center gap-4 p-4">
										<div class="flex-1">
											<div class="flex items-center gap-2">
												{#if i < availableSlots}
													<span class="badge badge-warning badge-sm">{m.topCandidate()}</span>
												{/if}
												<h3 class="font-bold">
													{paper.title || m.untitledPaper()}
												</h3>
											</div>
											<div class="mt-1 flex items-center gap-3 text-xs opacity-60">
												{#if paper.creator?.representation}
													<span class="flex items-center gap-1">
														<Flag representation={paper.creator.representation} size="xs" />
														{paper.creator.representation.name}
													</span>
												{/if}
												<span>
													<i class="fas fa-users mr-1"></i>
													{m.sponsorCount({
														count: String(paper.sponsors.length)
													})}
												</span>
												<span>{timeAgo(paper.updatedAt)}</span>
											</div>
										</div>
										<div class="flex gap-2">
											<a
												href="/app/{page.params.conferenceId}/participant/{page.params
													.committeeId}/papers/{paper.id}"
												class="btn btn-ghost btn-sm"
												target="_blank"
											>
												{m.viewPaper()}
											</a>
											<button
												class="btn btn-primary btn-sm"
												onclick={() => openPromoteModal(paper.id, paper.title)}
												disabled={availableSlots <= 0}
											>
												<i class="fas fa-arrow-up mr-1"></i>
												{m.promote()}
											</button>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</BasicCard>

				<!-- Section 2: Draft Resolutions List -->
				<BasicCard title={m.draftResolutions()}>
					{#if draftResolutions.length === 0}
						<div class="text-base-content/50 py-6 text-center text-sm">
							{m.noDraftResolutionsYet()}
						</div>
					{:else}
						<div class="flex flex-col gap-3">
							{#each draftResolutions as paper (paper.id)}
								{@const isActive = paper.id === committee.activeDraftResolutionId}
								{@const canSetActive =
									!isActive &&
									(paper.status === 'DRAFT_RESOLUTION' || paper.status === 'AMENDMENT_PHASE')}
								<div
									class="card bg-base-200 shadow-sm transition-shadow {isActive
										? 'border-l-4 border-success'
										: ''}"
								>
									<div class="card-body flex-row items-center gap-4 p-4">
										<a href="./resolutions/{paper.id}" class="flex flex-1 flex-col">
											<div class="flex items-center gap-2">
												<h3 class="font-bold font-mono">
													{paper.documentNumber ?? m.draftResolution()}
												</h3>
												<span class="badge badge-soft badge-sm {getStatusBadgeClass(paper.status)}">
													{getStatusText(paper.status)}
												</span>
												{#if isActive}
													<span class="badge badge-success badge-xs">
														{m.activeDraftResolution()}
													</span>
												{/if}
											</div>
											<div class="mt-1 flex items-center gap-3 text-xs opacity-60">
												<span
													class={committee.supportReEvaluationOpen
														? 'text-warning font-semibold'
														: ''}
												>
													<i class="fas fa-users mr-1"></i>
													{m.supporterCount({
														count: String(paper.sponsors.length)
													})}
												</span>
											</div>
										</a>
										{#if paper.status === 'DRAFT_RESOLUTION' || paper.status === 'AMENDMENT_PHASE'}
											<!-- svelte-ignore a11y_no_static_element_interactions -->
											<div onclick={(e: MouseEvent) => e.stopPropagation()}>
												<input
													type="checkbox"
													class="toggle toggle-success"
													checked={isActive}
													onchange={() => {
														if (isActive) {
															clearActiveDr();
														} else {
															setActiveDr(paper.id);
														}
													}}
												/>
											</div>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</BasicCard>

				<!-- Section 3: Debate Controls -->
				<BasicCard title={m.debateControls()}>
					<div class="flex flex-col gap-4">
						<!-- Support Re-evaluation toggle -->
						<div class="rounded-lg bg-base-200 p-4">
							<div class="flex items-center justify-between">
								<div>
									<p class="font-semibold">{m.supportReEvaluation()}</p>
									<p class="text-base-content/50 text-sm">
										{#if committee.supportReEvaluationOpen}
											{m.supportReEvaluationOpen()}
										{:else}
											{m.supportReEvaluationClosed()}
										{/if}
									</p>
								</div>
								<input
									type="checkbox"
									class="toggle toggle-warning"
									checked={committee.supportReEvaluationOpen}
									onchange={() => toggleReEvaluation(!committee.supportReEvaluationOpen)}
								/>
							</div>
						</div>
					</div>
				</BasicCard>

				<!-- Section 4: Voting Controls (placeholder) -->
				<BasicCard title={m.voting()}>
					<div class="py-4 text-center">
						<p class="text-base-content/40 text-sm">{m.votingControlsPlaceholder()}</p>
					</div>
				</BasicCard>
			</div>
		</div>
	</div>

	<!-- Promote confirmation modal -->
	<Modal bind:open={showPromoteModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.promoteToDraftResolution()}</h3>
			<p>{m.promoteToDraftResolutionConfirm()}</p>
			<p class="font-bold">{promotePaperTitle}</p>
			<div class="flex justify-end gap-2">
				<button class="btn btn-ghost btn-sm" onclick={() => (showPromoteModal = false)}>
					{m.abort()}
				</button>
				<button class="btn btn-primary btn-sm" onclick={handlePromote}>
					{m.yes()}
				</button>
			</div>
		</div>
	</Modal>
{/if}
