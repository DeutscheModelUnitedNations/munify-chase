<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { client } from '#lib/api/rumbleClient/client';
	import { nanoid } from '#lib/helpers/nanoid';
	import { isTeam, type ResolutionViewer } from './paperContext';
	import { fetchCommitteeMembers, representationSelection } from './committeeMembers';
	import { createSponsorActions } from './sponsorActions.svelte';
	import { canSponsorAmendment, ownSponsorship } from './sponsors';
	import SponsorEditor from './SponsorEditor.svelte';

	interface Props {
		amendmentId: string;
		committeeId: string;
		sponsoringOpen: boolean;
		viewer: ResolutionViewer;
		proposerMemberId: string | null | undefined;
		amendmentStatus: string | null | undefined;
	}

	let {
		amendmentId,
		committeeId,
		sponsoringOpen,
		viewer,
		proposerMemberId,
		amendmentStatus
	}: Props = $props();

	const sponsorSelection = {
		id: true,
		amendmentId: true,
		committeeMember: { id: true, representation: representationSelection }
	} as const;

	const sponsors = await client.liveQuery.amendmentSponsors({
		__args: { where: { amendment: { id: { eq: amendmentId } } } },
		...sponsorSelection
	});

	const team = $derived(isTeam(viewer));
	const myMemberId = $derived(viewer.committeeMemberId ?? null);
	const canSelfSponsor = $derived(
		canSponsorAmendment({
			team,
			myMemberId,
			proposerMemberId,
			sponsoring: !!ownSponsorship(sponsors, myMemberId),
			sponsoringOpen,
			amendmentStatus
		})
	);

	const members = await fetchCommitteeMembers(committeeId);

	const actions = createSponsorActions({
		addSponsor: (committeeMemberId) =>
			client.mutate.addAmendmentSponsor({
				__args: { id: nanoid(), amendmentId, committeeMemberId },
				...sponsorSelection
			}),
		removeSponsor: (id) => client.mutate.removeAmendmentSponsor({ __args: { id } })
	});
</script>

<div class="border-base-200 mt-2 flex flex-col gap-2 border-t pt-2">
	<SponsorEditor
		{sponsors}
		{members}
		{team}
		{myMemberId}
		{actions}
		{canSelfSponsor}
		selfSponsorLabel={m.sponsorAmendment()}
		selfSponsorClass="btn btn-outline btn-xs self-start"
		compact
	/>
</div>
