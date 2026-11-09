<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { client } from '#lib/api/rumbleClient/client';
	import { nanoid } from '#lib/helpers/nanoid';
	import { isTeam, type PaperStatus, type ResolutionViewer } from './paperContext';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import { fetchCommitteeMembers, representationSelection } from './committeeMembers';
	import { createSponsorActions } from './sponsorActions.svelte';
	import { canSponsorPaper, ownSponsorship } from './sponsors';
	import SponsorEditor from './SponsorEditor.svelte';

	interface Props {
		paperId: string;
		committeeId: string;
		paperStatus: PaperStatus;
		viewer: ResolutionViewer;
	}

	let { paperId, committeeId, paperStatus, viewer }: Props = $props();

	const sponsors = await client.liveQuery.paperSponsors({
		__args: { where: { paper: { id: { eq: paperId } } } },
		id: true,
		committeeMember: { id: true, representation: representationSelection }
	});

	const team = $derived(isTeam(viewer));
	const myMemberId = $derived(viewer.committeeMemberId ?? null);
	const iSponsor = $derived(ownSponsorship(sponsors, myMemberId));
	const canSelfSponsor = $derived(
		canSponsorPaper({ team, myMemberId, sponsoring: !!iSponsor, paperStatus })
	);

	// Chair-only member picker (queried always; shown only to team).
	const members = await fetchCommitteeMembers(committeeId);

	const actions = createSponsorActions({
		addSponsor: (committeeMemberId) =>
			client.mutate.addPaperSponsor({
				__args: { id: nanoid(), paperId, committeeMemberId },
				id: true
			}),
		removeSponsor: (id) => client.mutate.removePaperSponsor({ __args: { id } })
	});

	// A participant's own sponsorship, while the sponsors dialog is open
	registerCommands(() => [
		{
			id: 'paper.participant.sponsor',
			title: m.sponsorThisPaper,
			group: 'page',
			icon: 'handshake',
			visible: () => canSelfSponsor,
			enabled: () => !actions.busy,
			run: () => actions.add()
		},
		{
			id: 'paper.participant.unsponsor',
			title: m.commandWithdrawSponsorship,
			group: 'page',
			icon: 'x',
			visible: () => !team && !!iSponsor,
			run: () => actions.remove(iSponsor!.id)
		}
	]);
</script>

<div class="flex flex-col gap-3">
	<SponsorEditor
		{sponsors}
		{members}
		{team}
		{myMemberId}
		{actions}
		{canSelfSponsor}
		selfSponsorLabel={m.sponsorThisPaper()}
		selfSponsorClass="btn btn-primary btn-sm"
	/>
</div>
