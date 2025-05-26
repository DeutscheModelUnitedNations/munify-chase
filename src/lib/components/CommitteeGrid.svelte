<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import IconInfoBox from './IconInfoBox.svelte';
	import { getCommitteeStatusIcon, getCommitteeStatusText } from '$lib/utils/committeeStatus';
	import { type CommitteeOverviewQuery$result, type MissionControlQuery$result } from '$houdini';
	import AdoptionConfetti from './AdoptionConfetti.svelte';

	interface Props {
		conference:
			| MissionControlQuery$result['findFirstConference']
			| CommitteeOverviewQuery$result['findFirstConference'];
		environment?: 'SPECTATOR' | 'TEAM';
	}

	let { conference, environment = 'SPECTATOR' }: Props = $props();

	const getHref = (committeeId: string) => {
		if (environment === 'TEAM') {
			return `/app/${conference.id}/${committeeId}/setup`;
		} else {
			return `/app/${conference.id}/${committeeId}`;
		}
	};
</script>

<div class="flex h-full w-full flex-wrap gap-4 p-4">
	{#each conference.committees as committee}
		<a
			class="card bg-base-100 relative min-w-md flex-1 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md"
			href={getHref(committee.id)}
		>
			<div class="card-body">
				<div class="mb-4 flex w-full items-end gap-4">
					<h2 class="card-title text-5xl">
						{committee.abbreviation}
					</h2>
					<div>
						{committee.name}
					</div>
				</div>
				<IconInfoBox text={committee.activeAgendaItem?.title ?? '—'} faIcon="podium" />
				{#if environment === 'TEAM'}
					<IconInfoBox text={(committee as any).stateOfDebate ?? '—'} faIcon="diagram-next" />
				{/if}
				<IconInfoBox
					text={getCommitteeStatusText(committee.status)}
					faIcon={getCommitteeStatusIcon(committee.status)}
					committeeStatus={committee.status}
					marqueeOnOverflow={false}
					until={new Date(committee.statusUntil)}
				/>
			</div>
		</a>

		<AdoptionConfetti
			agendaItem={committee.activeAgendaItem?.title ?? '—'}
			committeeName={committee.name}
			lastAdoptionDate={committee.lastResolutionAdoptionDate}
			confettiDurationSec={90}
			showBanner
		/>
	{/each}
</div>
