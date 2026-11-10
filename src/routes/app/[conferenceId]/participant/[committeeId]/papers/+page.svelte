<script lang="ts">
	import { errorMessage } from '#lib/helpers/errorMessage';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { client } from '#lib/api/rumbleClient/client';
	import { nanoid } from '#lib/helpers/nanoid';
	import { m } from '#lib/paraglide/messages';
	import { getCurrentUser } from '#lib/state/currentUser.svelte';
	import PaperListSection from './PaperListSection.svelte';
	import {
		paperLabel,
		paperListSelection,
		paperTitle,
		participantPaperGroups,
		createPaperAndOpen
	} from '../../../papers';
	import CreatePaperButton from '../../../CreatePaperButton.svelte';
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
	function createPaper() {
		return createPaperAndOpen({
			agendaItemId: committee?.activeAgendaItem?.id,
			create: (agendaItemId) =>
				client.mutate.createResolutionPaper({
					__args: { id: nanoid(), committeeId, agendaItemId },
					id: true
				}),
			open: (paperId) => goto(paperHref(paperId)),
			setCreating: (value) => (creating = value),
			onError: (message) => toast.error(message)
		});
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
			toast.error(errorMessage(err, 'Invalid code'));
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
		<CreatePaperButton
			label={m.newWorkingPaper()}
			data-tour="papers.new"
			{creating}
			hasAgendaItem={!!committee?.activeAgendaItem}
			onclick={createPaper}
		/>
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
