<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import type { PageData } from './$houdini';
	import { graphql } from '$houdini';
	import { onMount } from 'svelte';
	import { ParticipantPapersSubscription } from './papersSubscription';
	import { generatePaperName } from '$lib/utils/paperNameGenerator';
	import toast from 'svelte-french-toast';

	let { data }: { data: PageData } = $props();

	let query = $derived(data?.ParticipantPapersQuery);
	let identityQuery = $derived(data?.ParticipantIdentityQuery);
	let layoutQuery = $derived(data?.ParticipantCommitteeLayoutQuery);
	let committee = $derived($layoutQuery.data?.findFirstCommittee);

	let papers = $derived(
		$ParticipantPapersSubscription.data?.findManyResolutionPaper ??
			$query.data?.findManyResolutionPaper ??
			[]
	);

	let conferenceUser = $derived($identityQuery.data?.findManyConferenceUser?.[0]);
	let role = $derived(conferenceUser?.conferenceUserType);
	let myCommitteeMemberId = $derived(conferenceUser?.committeeMemberId);
	let myConferenceUserId = $derived(conferenceUser?.id);
	let isDelegate = $derived(role === 'DELEGATE');

	let activeAgendaItem = $derived(committee?.activeAgendaItem);

	// My papers: created by me, or I'm an editor, or I'm a sponsor
	let myPapers = $derived(
		papers.filter(
			(p) =>
				p.creatorCommitteeMemberId === myCommitteeMemberId ||
				p.editors.some((e) => e.conferenceUserId === myConferenceUserId) ||
				p.sponsors.some((s) => s.committeeMemberId === myCommitteeMemberId)
		)
	);

	// Draft resolutions: status is DRAFT_RESOLUTION or later
	let draftResolutions = $derived(
		papers.filter(
			(p) =>
				p.status === 'DRAFT_RESOLUTION' || p.status === 'AMENDMENT_PHASE' || p.status === 'FINAL'
		)
	);

	onMount(() => {
		ParticipantPapersSubscription.listen({
			committeeId: page.params.committeeId!
		});
	});

	// Create paper mutation
	const CreatePaperMutation = graphql(`
		mutation CreateResolutionPaperMutation($committeeId: ID!, $agendaItemId: ID!, $title: String) {
			createResolutionPaper(committeeId: $committeeId, agendaItemId: $agendaItemId, title: $title) {
				id
			}
		}
	`);

	async function handleCreatePaper() {
		if (!activeAgendaItem) return;
		try {
			const result = await CreatePaperMutation.mutate({
				committeeId: page.params.committeeId!,
				agendaItemId: activeAgendaItem.id,
				title: generatePaperName()
			});
			toast.success(m.paperCreated());
			if (result.data?.createResolutionPaper?.id) {
				goto(
					`/app/${page.params.conferenceId}/participant/${page.params.committeeId}/papers/${result.data.createResolutionPaper.id}`
				);
			}
		} catch {
			toast.error(m.toastCreateError({ targetName: m.workingPaper() }));
		}
	}

	// Redeem share code mutation
	const RedeemShareCodeMutation = graphql(`
		mutation RedeemShareCodeMutation($code: String!) {
			redeemShareCode(code: $code) {
				paperId
				permission
			}
		}
	`);

	let shareCodeInput = $state('');

	async function handleRedeemCode() {
		if (!shareCodeInput.trim()) return;
		try {
			const result = await RedeemShareCodeMutation.mutate({
				code: shareCodeInput.trim().toUpperCase()
			});
			const paperId = result.data?.redeemShareCode?.paperId;
			if (paperId) {
				toast.success(m.codeRedeemed());
				shareCodeInput = '';
				goto(
					`/app/${page.params.conferenceId}/participant/${page.params.committeeId}/papers/${paperId}`
				);
			}
		} catch {
			toast.error(m.invalidShareCode());
		}
	}

	function getStatusBadgeClass(status: string) {
		switch (status) {
			case 'WORKING_PAPER':
				return 'badge-ghost';
			case 'SUBMITTED':
				return 'badge-warning';
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
			case 'WORKING_PAPER':
				return m.workingPaper();
			case 'SUBMITTED':
				return m.submitted();
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

	function timeAgo(dateStr: string | null | undefined) {
		if (!dateStr) return '';
		const date = new Date(dateStr);
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
	<title>{m.papers()} - MUNify CHASE</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-6 p-4">
	<!-- My Papers Section -->
	<div>
		<h2 class="mb-3 text-xl font-bold">{m.myPapers()}</h2>

		<!-- Action row -->
		<div class="mb-4 flex flex-wrap gap-2">
			{#if isDelegate}
				{#if activeAgendaItem}
					<button class="btn btn-primary btn-sm" onclick={handleCreatePaper}>
						<i class="fas fa-plus mr-1"></i>
						{m.createPaper()}
					</button>
				{:else}
					<div class="tooltip" data-tip={m.noActiveAgendaItem()}>
						<button class="btn btn-primary btn-sm" disabled>
							<i class="fas fa-plus mr-1"></i>
							{m.createPaper()}
						</button>
					</div>
				{/if}
			{/if}

			<div class="join">
				<input
					type="text"
					class="input input-sm join-item input-bordered w-32"
					placeholder={m.enterCode()}
					bind:value={shareCodeInput}
					onkeydown={(e) => e.key === 'Enter' && handleRedeemCode()}
				/>
				<button class="btn btn-sm join-item btn-soft" onclick={handleRedeemCode}>
					<i class="fas fa-ticket mr-1"></i>
					{m.redeemShareCode()}
				</button>
			</div>
		</div>

		<!-- Paper cards -->
		{#if myPapers.length === 0}
			<div class="text-base-content/50 py-8 text-center text-sm">
				{m.noPapersYet()}
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each myPapers as paper}
					<a
						href="/app/{page.params.conferenceId}/participant/{page.params
							.committeeId}/papers/{paper.id}"
						class="card bg-base-100 shadow-sm transition-shadow hover:shadow-md"
					>
						<div class="card-body gap-2 p-4">
							<div class="flex items-start justify-between gap-2">
								<h3 class="card-title text-base">
									{#if paper.documentNumber}
										<span class="font-mono">{paper.documentNumber}</span>
									{:else}
										{paper.title || m.untitledPaper()}
									{/if}
								</h3>
								<span
									class="badge badge-soft {getStatusBadgeClass(paper.status)} badge-sm shrink-0"
								>
									{getStatusText(paper.status)}
								</span>
							</div>
							<div class="flex items-center gap-3 text-xs opacity-60">
								<span>
									<i class="fas fa-users mr-1"></i>
									{m.sponsorCount({ count: String(paper.sponsors.length) })}
								</span>
								<span>{timeAgo(paper.updatedAt)}</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Draft Resolutions Section -->
	<div>
		<h2 class="mb-3 text-xl font-bold">{m.draftResolutions()}</h2>

		{#if draftResolutions.length === 0}
			<div class="text-base-content/50 py-8 text-center text-sm">
				{m.noDraftResolutionsYet()}
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each draftResolutions as paper}
					<a
						href="/app/{page.params.conferenceId}/participant/{page.params
							.committeeId}/papers/{paper.id}"
						class="card bg-base-100 shadow-sm transition-shadow hover:shadow-md"
					>
						<div class="card-body gap-2 p-4">
							<div class="flex items-start justify-between gap-2">
								<h3 class="card-title text-base font-mono">
									{paper.documentNumber ?? m.draftResolution()}
								</h3>
								<span
									class="badge badge-soft {getStatusBadgeClass(paper.status)} badge-sm shrink-0"
								>
									{getStatusText(paper.status)}
								</span>
							</div>
							<div class="flex items-center gap-3 text-xs opacity-60">
								<span>
									<i class="fas fa-users mr-1"></i>
									{m.sponsorCount({ count: String(paper.sponsors.length) })}
								</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
