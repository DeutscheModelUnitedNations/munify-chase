<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import IconInfoBox from '#lib/components/IconInfoBox.svelte';
	import Majorities from '#lib/components/Majorities.svelte';
	import { getCommitteeStatusIcon, getCommitteeStatusText } from '#lib/utils/committeeStatus';

	type Status = Parameters<typeof getCommitteeStatusText>[0];

	interface Props {
		committee: {
			status: Status;
			statusHeadline?: string | null;
			statusUntil: Date | string;
			totalPresent: number;
			simpleMajority: number;
			twoThirdsMajority: number;
		};
		agendaItemTitle: string | null | undefined;
		minAmendmentSponsors: number;
	}

	let { committee, agendaItemTitle, minAmendmentSponsors }: Props = $props();
</script>

<!-- Committee Status Card -->
<div class="card bg-base-100 shadow-sm" data-tour="committee.status">
	<div class="card-body gap-2 p-4">
		<IconInfoBox text={agendaItemTitle ?? '—'} icon="lectern" />
		<IconInfoBox
			text={getCommitteeStatusText(committee.status)}
			icon={getCommitteeStatusIcon(committee.status)}
			committeeStatus={committee.status}
			until={new Date(committee.statusUntil)}
		/>
		{#if committee.statusHeadline}
			<div class="text-sm opacity-70">{committee.statusHeadline}</div>
		{/if}
	</div>
</div>
<div class="card bg-base-100 shadow-sm" data-tour="committee.majorities">
	<div class="card-body gap-2 p-4">
		<h2 class="card-title text-lg">{m.majorities()}</h2>
		<Majorities
			totalPresent={committee.totalPresent}
			simpleMajority={committee.simpleMajority}
			twoThirdsMajority={committee.twoThirdsMajority}
			{minAmendmentSponsors}
		/>
	</div>
</div>
