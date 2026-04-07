<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';
	import { getContext } from 'svelte';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import Majorities from '$lib/components/Majorities.svelte';
	import StatusWidget from '../StatusWidget.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import toast from 'svelte-french-toast';
	import { generatePaperName } from '$lib/utils/paperNameGenerator';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';

	const committee = getContext<any>('committee');

	const papers = await client.liveQuery.resolutionPapers({
		__args: { where: { committee: { id: page.params.committeeId! } } },
		id: true,
		title: true,
		status: true,
		documentNumber: true,
		sequenceNumber: true,
		updatedAt: true,
		creatorCommitteeMemberId: true,
		agendaItem: {
			id: true,
			title: true
		},
		creator: {
			id: true,
			representation: {
				name: true,
				alpha2Code: true,
				alpha3Code: true,
				faIcon: true
			}
		},
		sponsors: {
			id: true,
			committeeMemberId: true,
			committeeMember: {
				representation: {
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					faIcon: true
				}
			}
		}
	});

	// Submitted papers, sorted by sponsor count descending
	let submittedPapers = $derived(
		(papers ?? [])
			.filter((p) => p.status === 'SUBMITTED')
			.sort((a, b) => b.sponsors.length - a.sponsors.length)
	);

	// Draft resolutions (DR, AMENDMENT_PHASE, VOTING_PHASE, FINAL)
	// During re-evaluation: sorted by sponsor count (descending) to show ranking
	// Otherwise: sorted by sequenceNumber
	let draftResolutions = $derived(
		(papers ?? [])
			.filter(
				(p) =>
					p.status === 'DRAFT_RESOLUTION' ||
					p.status === 'AMENDMENT_PHASE' ||
					p.status === 'VOTING_PHASE' ||
					p.status === 'FINAL'
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

	// Amendment phase derived state
	let activeDr = $derived(
		draftResolutions.find((p) => p.id === committee?.activeDraftResolutionId)
	);
	let canStartAmendmentPhase = $derived(activeDr && activeDr.status === 'DRAFT_RESOLUTION');
	let isInAmendmentPhase = $derived(activeDr && activeDr.status === 'AMENDMENT_PHASE');

	let showPromoteModal = $state(false);
	let promotePaperId = $state<string | null>(null);
	let promotePaperTitle = $state('');
	let showStartAmendmentPhaseModal = $state(false);

	function openPromoteModal(paperId: string, title: string | null) {
		promotePaperId = paperId;
		promotePaperTitle = title || m.untitledPaper();
		showPromoteModal = true;
	}

	async function handlePromote() {
		if (!promotePaperId) return;
		try {
			await client.mutate.promoteToDraftResolution({
				__args: { paperId: promotePaperId },
				id: true,
				status: true,
				documentNumber: true
			});
			showPromoteModal = false;
			toast.success(m.paperPromoted());
		} catch {
			toast.error(m.saveError());
		}
	}

	async function setActiveDr(paperId: string) {
		try {
			await client.mutate.updateCommittee({
				__args: {
					id: page.params.committeeId!,
					activeDraftResolutionId: paperId
				},
				id: true,
				activeDraftResolutionId: true
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	async function clearActiveDr() {
		try {
			await client.mutate.updateCommittee({
				__args: {
					id: page.params.committeeId!,
					clearActiveDraftResolution: true
				},
				id: true,
				activeDraftResolutionId: true
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	async function toggleReEvaluation(open: boolean) {
		try {
			await client.mutate.updateCommittee({
				__args: {
					id: page.params.committeeId!,
					supportReEvaluationOpen: open
				},
				id: true,
				supportReEvaluationOpen: true
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	async function toggleAmendmentSubmission(open: boolean) {
		try {
			await client.mutate.updateCommittee({
				__args: {
					id: page.params.committeeId!,
					amendmentSubmissionOpen: open
				},
				id: true,
				amendmentSubmissionOpen: true
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	async function toggleAmendmentSponsoring(open: boolean) {
		try {
			await client.mutate.updateCommittee({
				__args: {
					id: page.params.committeeId!,
					amendmentSponsoringOpen: open
				},
				id: true,
				amendmentSponsoringOpen: true
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	async function startAmendmentPhase() {
		try {
			await client.mutate.updateCommittee({
				__args: {
					id: page.params.committeeId!,
					currentOperativeIndex: 0
				},
				id: true,
				currentOperativeIndex: true
			});
			showStartAmendmentPhaseModal = false;
			toast.success(m.amendmentPhaseStarted());
		} catch {
			toast.error(m.saveError());
		}
	}

	let showCreatePaperModal = $state(false);
	let createPaperSearchQuery = $state('');

	function getRepresentationName(
		rep: { name?: string | null; alpha3Code?: string | null } | null | undefined
	) {
		return getTranslatedCountryNameFromAlpha3Code(rep?.alpha3Code) ?? rep?.name ?? '';
	}

	let filteredCreatePaperMembers = $derived(
		(createPaperSearchQuery
			? (committee?.members ?? []).filter((member: any) =>
					getRepresentationName(member.representation)
						.toLowerCase()
						.includes(createPaperSearchQuery.toLowerCase())
				)
			: (committee?.members ?? [])
		).sort((a: any, b: any) =>
			getRepresentationName(a.representation).localeCompare(getRepresentationName(b.representation))
		)
	);

	async function handleChairCreatePaper(committeeMemberId: string) {
		if (!committee?.activeAgendaItem) return;
		try {
			await client.mutate.chairCreateResolutionPaper({
				__args: {
					committeeId: page.params.committeeId!,
					agendaItemId: committee.activeAgendaItem.id,
					committeeMemberId,
					title: generatePaperName()
				},
				id: true
			});
			showCreatePaperModal = false;
			toast.success(m.paperCreated());
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
			case 'VOTING_PHASE':
				return 'badge-accent';
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
			case 'VOTING_PHASE':
				return m.votingPhase();
			case 'FINAL':
				return m.finalResolution();
			default:
				return status;
		}
	}

	let isInVotingPhase = $derived(activeDr && activeDr.status === 'VOTING_PHASE');

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
				<!-- Create Working Paper -->
				{#if committee.activeAgendaItem}
					<div class="flex justify-end">
						<button
							class="btn btn-primary btn-sm"
							onclick={() => {
								createPaperSearchQuery = '';
								showCreatePaperModal = true;
							}}
						>
							<i class="fas fa-plus mr-1"></i>
							{m.chairCreateWorkingPaper()}
						</button>
					</div>
				{/if}

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
											<a href="./resolutions/{paper.id}" class="btn btn-ghost btn-sm">
												{m.viewPaper()}
											</a>
											<button
												class="btn btn-primary btn-sm"
												onclick={() => openPromoteModal(paper.id, paper.title)}
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
									(paper.status === 'DRAFT_RESOLUTION' ||
										paper.status === 'AMENDMENT_PHASE' ||
										paper.status === 'VOTING_PHASE')}
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
												<span
													>{m.submittedBy()}: {paper.creator.representation?.name ||
														getTranslatedCountryNameFromAlpha3Code(
															paper.creator.representation?.alpha3Code
														)}</span
												>
											</div>
										</a>
										{#if paper.status === 'DRAFT_RESOLUTION' || paper.status === 'AMENDMENT_PHASE' || paper.status === 'VOTING_PHASE'}
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

						<!-- Amendment Submission toggle -->
						<div class="rounded-lg bg-base-200 p-4">
							<div class="flex items-center justify-between">
								<div>
									<p class="font-semibold">{m.amendmentSubmission()}</p>
									<p class="text-base-content/50 text-sm">
										{#if committee.amendmentSubmissionOpen}
											{m.amendmentSubmissionOpen()}
										{:else}
											{m.amendmentSubmissionClosed()}
										{/if}
									</p>
								</div>
								<input
									type="checkbox"
									class="toggle toggle-warning"
									checked={committee.amendmentSubmissionOpen}
									onchange={() => toggleAmendmentSubmission(!committee.amendmentSubmissionOpen)}
								/>
							</div>
						</div>

						<!-- Amendment Sponsoring toggle -->
						<div class="rounded-lg bg-base-200 p-4">
							<div class="flex items-center justify-between">
								<div>
									<p class="font-semibold">{m.amendmentSponsoring()}</p>
									<p class="text-base-content/50 text-sm">
										{#if committee.amendmentSponsoringOpen}
											{m.amendmentSponsoringOpen()}
										{:else}
											{m.amendmentSponsoringClosed()}
										{/if}
									</p>
								</div>
								<input
									type="checkbox"
									class="toggle toggle-warning"
									checked={committee.amendmentSponsoringOpen}
									onchange={() => toggleAmendmentSponsoring(!committee.amendmentSponsoringOpen)}
								/>
							</div>
						</div>

						{#if canStartAmendmentPhase}
							<div class="divider my-1"></div>
							<div class="flex items-center justify-between">
								<div class="text-sm">
									<span class="font-medium">{activeDr!.documentNumber}</span> — {m.draftResolution()}
								</div>
								<button
									class="btn btn-primary btn-sm"
									onclick={() => (showStartAmendmentPhaseModal = true)}
								>
									<i class="fas fa-gavel mr-1"></i>
									{m.startAmendmentPhase()}
								</button>
							</div>
						{:else if isInVotingPhase}
							<div class="divider my-1"></div>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2 text-sm">
									<span class="badge badge-accent badge-sm">{m.votingPhaseActive()}</span>
									<span class="font-mono">{activeDr!.documentNumber}</span>
								</div>
								<a href="./resolutions/{activeDr!.id}" class="btn btn-ghost btn-xs">
									{m.goToVoting()} →
								</a>
							</div>
						{:else if isInAmendmentPhase}
							<div class="divider my-1"></div>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2 text-sm">
									<span class="badge badge-secondary badge-sm">{m.amendmentPhaseActive()}</span>
									<span class="font-mono">OP {(committee.currentOperativeIndex ?? 0) + 1}</span>
								</div>
								<a href="./resolutions/{activeDr!.id}" class="btn btn-ghost btn-xs">
									{m.goToAmendments()} →
								</a>
							</div>
						{/if}
					</div>
				</BasicCard>

				<!-- Section 4: Voting Controls -->
				<BasicCard title={m.voting()}>
					{#if isInVotingPhase}
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2 text-sm">
								<span class="badge badge-accent badge-sm">{m.votingPhaseActive()}</span>
								<span class="font-mono">{activeDr!.documentNumber}</span>
							</div>
							<a href="./resolutions/{activeDr!.id}" class="btn btn-ghost btn-xs">
								{m.goToVoting()} →
							</a>
						</div>
					{:else if isInAmendmentPhase}
						<div class="flex items-center gap-2 text-sm">
							<i class="fas fa-info-circle text-base-content/40"></i>
							<span class="text-base-content/60">{m.finishAmendmentPhaseFirst()}</span>
						</div>
					{:else if activeDr}
						<div class="flex items-center gap-2 text-sm">
							<i class="fas fa-info-circle text-base-content/40"></i>
							<span class="text-base-content/60">{m.finishAmendmentPhaseFirst()}</span>
						</div>
					{:else}
						<div class="py-4 text-center">
							<p class="text-base-content/40 text-sm">{m.noActiveDrForVoting()}</p>
						</div>
					{/if}
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

	<!-- Start amendment phase confirmation modal -->
	<Modal bind:open={showStartAmendmentPhaseModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.startAmendmentPhase()}</h3>
			<p>{m.confirmStartAmendmentPhase()}</p>
			<div class="flex justify-end gap-2">
				<button class="btn btn-ghost btn-sm" onclick={() => (showStartAmendmentPhaseModal = false)}>
					{m.abort()}
				</button>
				<button class="btn btn-primary btn-sm" onclick={startAmendmentPhase}>
					{m.yes()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Create Working Paper Modal -->
	<Modal bind:open={showCreatePaperModal}>
		<div class="flex items-center justify-between mb-4">
			<h3 class="font-bold text-lg">{m.chairCreateWorkingPaper()}</h3>
			<button class="btn btn-ghost btn-sm" onclick={() => (showCreatePaperModal = false)}>
				<i class="fas fa-times"></i>
			</button>
		</div>
		<p class="text-sm opacity-60 mb-3">{m.selectAuthorDelegation()}</p>
		<input
			class="input input-bordered w-full mb-3"
			placeholder={m.searchMembers()}
			bind:value={createPaperSearchQuery}
		/>
		<div class="max-h-64 overflow-y-auto space-y-1">
			{#each filteredCreatePaperMembers as member (member.id)}
				<button
					class="btn btn-ghost btn-sm w-full justify-start gap-2"
					onclick={() => handleChairCreatePaper(member.id)}
				>
					<Flag representation={member.representation} size="xs" />
					<span>
						{getTranslatedCountryNameFromAlpha3Code(member.representation?.alpha3Code) ??
							member.representation?.name}
					</span>
				</button>
			{/each}
			{#if filteredCreatePaperMembers.length === 0}
				<p class="text-center text-sm opacity-60 py-4">{m.noResults()}</p>
			{/if}
		</div>
	</Modal>
{/if}
