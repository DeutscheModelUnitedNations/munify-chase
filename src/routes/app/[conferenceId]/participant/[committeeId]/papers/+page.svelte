<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import { workingPaperName } from '$lib/helpers/paperName';
	import { m } from '$lib/paraglide/messages';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import {
		statusLabel,
		statusBadgeClass,
		type PaperStatus
	} from '$lib/components/resolutions/paperContext';
	import Flag from '$lib/components/Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import toast from 'svelte-french-toast';

	const conferenceId = $derived(page.params.conferenceId!);
	const committeeId = $derived(page.params.committeeId!);

	const currentUser = await getCurrentUser();
	const conferenceUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: { user: { id: currentUser.id ?? '' }, conference: { id: page.params.conferenceId } }
		},
		id: true,
		conferenceUserType: true,
		committeeMemberId: true
	});
	const viewer = $derived(conferenceUsers?.[0]);
	const myMemberId = $derived(viewer?.committeeMemberId ?? null);
	const myConfUserId = $derived(viewer?.id ?? '');

	const committee = await client.liveQuery.committee({
		__args: { id: committeeId },
		id: true,
		activeAgendaItem: { id: true, title: true }
	});

	const papers = await client.liveQuery.resolutionPapers({
		__args: { where: { committee: { id: committeeId } } },
		id: true,
		title: true,
		status: true,
		documentNumber: true,
		creatorCommitteeMember: {
			id: true,
			representation: {
				id: true,
				name: true,
				type: true,
				alpha2Code: true,
				alpha3Code: true,
				faIcon: true
			}
		},
		editors: { id: true, conferenceUser: { id: true } },
		sponsors: { id: true }
	});

	const PUBLISHED: PaperStatus[] = ['DRAFT_RESOLUTION', 'AMENDMENT_PHASE', 'VOTING_PHASE', 'FINAL'];

	const myPapers = $derived(
		(papers ?? []).filter(
			(p) =>
				p.status === 'WORKING_PAPER' &&
				((myMemberId && p.creatorCommitteeMember?.id === myMemberId) ||
					(p.editors ?? []).some((e) => e.conferenceUser?.id === myConfUserId))
		)
	);
	const submittedPapers = $derived((papers ?? []).filter((p) => p.status === 'SUBMITTED'));
	const published = $derived(
		(papers ?? []).filter((p) => PUBLISHED.includes(p.status as PaperStatus))
	);

	function paperHref(paperId: string) {
		return resolve('/app/[conferenceId]/participant/[committeeId]/papers/[paperId]', {
			conferenceId,
			committeeId,
			paperId
		});
	}

	let creating = $state(false);
	async function createPaper() {
		if (!committee?.activeAgendaItem) {
			toast.error(m.selectActiveAgendaItemFirst());
			return;
		}
		creating = true;
		try {
			const id = nanoid();
			const created = await client.mutate.createResolutionPaper({
				__args: { id, committeeId, agendaItemId: committee.activeAgendaItem.id },
				id: true
			});
			if (created) await goto(paperHref(created.id));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to create paper');
		} finally {
			creating = false;
		}
	}

	let code = $state('');
	let redeeming = $state(false);
	async function redeem() {
		if (!code.trim()) return;
		redeeming = true;
		try {
			const res = await client.mutate.redeemPaperShareCode({
				__args: { code: code.trim().toUpperCase() },
				id: true,
				paper: { id: true }
			});
			toast.success(m.codeRedeemed());
			code = '';
			if (res?.paper?.id) await goto(paperHref(res.paper.id));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Invalid code');
		} finally {
			redeeming = false;
		}
	}
</script>

<div class="flex flex-col gap-4 p-4">
	<!-- Create + redeem -->
	<div class="grid gap-3 sm:grid-cols-2">
		<button
			class="btn btn-primary"
			disabled={creating || !committee?.activeAgendaItem}
			onclick={createPaper}
		>
			{#if creating}<i class="fas fa-spinner fa-spin"></i>{:else}<i class="fas fa-plus"></i>{/if}
			{m.newWorkingPaper()}
		</button>
		<div class="join">
			<input
				class="input input-bordered join-item w-full font-mono uppercase"
				placeholder={m.enterShareCode()}
				bind:value={code}
			/>
			<button class="btn join-item" disabled={redeeming || !code.trim()} onclick={redeem}>
				{#if redeeming}<i class="fas fa-spinner fa-spin"></i>{:else}<i class="fas fa-ticket"
					></i>{/if}
				{m.redeem()}
			</button>
		</div>
	</div>

	<!-- My papers -->
	<section class="flex flex-col gap-2">
		<h2 class="font-bold">{m.myPapers()}</h2>
		{#if !myPapers.length}
			<p class="text-base-content/50 text-sm">{m.noPapersYet()}</p>
		{:else}
			{#each myPapers as p (p.id)}
				<a href={paperHref(p.id)} class="card bg-base-100 hover:bg-base-200 transition">
					<div class="card-body flex-row items-center gap-3 p-3">
						<div class="flex min-w-0 flex-1 flex-col">
							<span class="font-medium">{p.title || workingPaperName(p.id)}</span>
							{#if p.creatorCommitteeMember?.representation}
								{@const rep = p.creatorCommitteeMember.representation}
								<div class="text-base-content/60 mt-1 flex items-center gap-1 text-sm">
									<Flag size="xs" representation={rep} />
									<span>{rep.name ?? getTranslatedCountryNameFromAlpha3Code(rep.alpha3Code)}</span>
								</div>
							{/if}
						</div>
						<span class="badge badge-sm {statusBadgeClass(p.status as PaperStatus)}">
							{statusLabel(p.status as PaperStatus)}
						</span>
						<i class="fas fa-chevron-right opacity-50"></i>
					</div>
				</a>
			{/each}
		{/if}
	</section>

	<!-- Submitted papers (visible to all committee members) -->
	<section class="flex flex-col gap-2">
		<h2 class="font-bold">{m.submittedPapers()}</h2>
		{#if !submittedPapers.length}
			<p class="text-base-content/50 text-sm">{m.noSubmittedPapers()}</p>
		{:else}
			{#each submittedPapers as p (p.id)}
				<a href={paperHref(p.id)} class="card bg-base-100 hover:bg-base-200 transition">
					<div class="card-body flex-row items-center gap-3 p-3">
						<div class="flex min-w-0 flex-1 flex-col">
							<span class="font-medium">{p.title || workingPaperName(p.id)}</span>
							{#if p.creatorCommitteeMember?.representation}
								{@const rep = p.creatorCommitteeMember.representation}
								<div class="text-base-content/60 mt-1 flex items-center gap-1 text-sm">
									<Flag size="xs" representation={rep} />
									<span>{rep.name ?? getTranslatedCountryNameFromAlpha3Code(rep.alpha3Code)}</span>
								</div>
							{/if}
						</div>
						<span class="badge badge-ghost gap-1"
							><i class="fas fa-handshake"></i>{p.sponsors?.length ?? 0}</span
						>
						<span class="badge badge-sm {statusBadgeClass(p.status as PaperStatus)}">
							{statusLabel(p.status as PaperStatus)}
						</span>
						<i class="fas fa-chevron-right opacity-50"></i>
					</div>
				</a>
			{/each}
		{/if}
	</section>

	<!-- Published draft resolutions -->
	<section class="flex flex-col gap-2">
		<h2 class="font-bold">{m.draftResolutions()}</h2>
		{#if !published.length}
			<p class="text-base-content/50 text-sm">{m.noDraftResolutionsYet()}</p>
		{:else}
			{#each published as p (p.id)}
				<a href={paperHref(p.id)} class="card bg-base-100 hover:bg-base-200 transition">
					<div class="card-body flex-row items-center gap-3 p-3">
						<div class="flex min-w-0 flex-1 flex-col">
							<span class="font-medium"
								>{p.documentNumber || p.title || workingPaperName(p.id)}</span
							>
							{#if p.creatorCommitteeMember?.representation}
								{@const rep = p.creatorCommitteeMember.representation}
								<div class="text-base-content/60 mt-1 flex items-center gap-1 text-sm">
									<Flag size="xs" representation={rep} />
									<span>{rep.name ?? getTranslatedCountryNameFromAlpha3Code(rep.alpha3Code)}</span>
								</div>
							{/if}
						</div>
						<span class="badge badge-ghost gap-1"
							><i class="fas fa-handshake"></i>{p.sponsors?.length ?? 0}</span
						>
						<span class="badge badge-sm {statusBadgeClass(p.status as PaperStatus)}">
							{statusLabel(p.status as PaperStatus)}
						</span>
						<i class="fas fa-chevron-right opacity-50"></i>
					</div>
				</a>
			{/each}
		{/if}
	</section>
</div>
