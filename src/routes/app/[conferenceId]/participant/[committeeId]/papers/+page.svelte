<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { client } from '#lib/api/rumbleClient/client';
	import { nanoid } from '#lib/helpers/nanoid';
	import { m } from '#lib/paraglide/messages';
	import { getCurrentUser } from '#lib/state/currentUser.svelte';
	import PaperListSection from './PaperListSection.svelte';
	import {
		errorMessage,
		paperLabel,
		paperListSelection,
		paperTitle,
		participantPaperGroups
	} from '../../../papers';
	import toast from 'svelte-french-toast';
	import { registerCommands } from '#lib/commands/registry.svelte';

	const conferenceId = $derived(page.params.conferenceId!);
	const committeeId = $derived(page.params.committeeId!);

	const currentUser = await getCurrentUser();
	const conferenceUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				user: { id: { eq: currentUser.id ?? '' } },
				conference: { id: { eq: page.params.conferenceId } }
			}
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
		__args: { where: { committee: { id: { eq: committeeId } } } },
		...paperListSelection,
		editors: { id: true, conferenceUser: { id: true } }
	});

	const groups = $derived(
		participantPaperGroups({ papers, myMemberId, myConferenceUserId: myConfUserId })
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
			toast.error(errorMessage({ err, fallback: 'Failed to create paper' }));
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
			await client.mutate.redeemPaperShareCode({
				__args: { code: code.trim().toUpperCase() }
			});
			toast.success(m.codeRedeemed());
			code = '';
		} catch (err) {
			toast.error(errorMessage({ err, fallback: 'Invalid code' }));
		} finally {
			redeeming = false;
		}
	}

	let codeInput = $state<HTMLInputElement>();

	registerCommands(() => [
		{
			id: 'participant.papers.new',
			title: m.newWorkingPaper,
			group: 'page',
			icon: 'plus',
			enabled: () => !creating && !!committee?.activeAgendaItem,
			run: createPaper
		},
		{
			id: 'participant.papers.share-code',
			title: m.enterShareCode,
			keywords: [m.redeem()],
			group: 'page',
			icon: 'ticket',
			run: () => codeInput?.focus()
		}
	]);
</script>

<div class="flex flex-col gap-4 p-4">
	<!-- Create + redeem -->
	<div class="grid gap-3 sm:grid-cols-2">
		<button
			class="btn btn-primary"
			data-tour="papers.new"
			disabled={creating || !committee?.activeAgendaItem}
			onclick={createPaper}
		>
			{#if creating}<i aria-hidden="true" class="ph-fill ph-spinner-gap animate-spin"></i>{:else}<i
					aria-hidden="true"
					class="ph-fill ph-plus"
				></i>{/if}
			{m.newWorkingPaper()}
		</button>
		<div class="join" data-tour="papers.redeem">
			<input
				class="input input-bordered join-item w-full font-mono uppercase"
				placeholder={m.enterShareCode()}
				bind:this={codeInput}
				bind:value={code}
			/>
			<button class="btn join-item" disabled={redeeming || !code.trim()} onclick={redeem}>
				{#if redeeming}<i aria-hidden="true" class="ph-fill ph-spinner-gap animate-spin"
					></i>{:else}<i aria-hidden="true" class="ph-fill ph-ticket"></i>{/if}
				{m.redeem()}
			</button>
		</div>
	</div>

	<PaperListSection
		title={m.myPapers()}
		emptyText={m.noPapersYet()}
		data-tour="papers.mine"
		papers={groups.mine}
		label={paperTitle}
		href={paperHref}
	/>

	<!-- Submitted papers (visible to all committee members) -->
	<PaperListSection
		title={m.submittedPapers()}
		emptyText={m.noSubmittedPapers()}
		data-tour="papers.submitted"
		papers={groups.submitted}
		label={paperTitle}
		href={paperHref}
		showSponsors
	/>

	<!-- Published draft resolutions -->
	<PaperListSection
		title={m.draftResolutions()}
		emptyText={m.noDraftResolutionsYet()}
		data-tour="papers.published"
		papers={groups.published}
		label={paperLabel}
		href={paperHref}
		showSponsors
	/>
</div>
