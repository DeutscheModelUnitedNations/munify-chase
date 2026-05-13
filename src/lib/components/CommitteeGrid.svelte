<script module lang="ts">
	import type { CommitteestatusEnum } from '$lib/api/rumbleClient/client';

	export interface ConferenceData {
		id: string;
		committees: Array<{
			id: string;
			abbreviation: string;
			name: string;
			status: CommitteestatusEnum;
			statusUntil: Date;
			stateOfDebate?: string | null;
			activeAgendaItem?: { title?: string | null } | null;
			lastResolutionAdoptionDate?: Date | null;
		}>;
	}
</script>

<script lang="ts">
	import { resolve } from '$app/paths';
	import IconInfoBox from './IconInfoBox.svelte';
	import { getCommitteeStatusIcon, getCommitteeStatusText } from '$lib/utils/committeeStatus';
	import AdoptionConfetti from './AdoptionConfetti.svelte';

	interface Props {
		conference: ConferenceData;
		environment?: 'SPECTATOR' | 'TEAM' | 'PARTICIPANT';
	}

	let { conference, environment = 'SPECTATOR' }: Props = $props();

	const getHref = (committeeId: string) => {
		if (environment === 'TEAM') {
			return resolve('/app/[conferenceId]/[committeeId]/(chairs)/setup', {
				conferenceId: conference.id,
				committeeId
			});
		} else if (environment === 'PARTICIPANT') {
			return resolve('/app/[conferenceId]/participant/[committeeId]', {
				conferenceId: conference.id,
				committeeId
			});
		} else {
			return resolve('/app/[conferenceId]/[committeeId]', {
				conferenceId: conference.id,
				committeeId
			});
		}
	};
</script>

<div class="flex h-full w-full flex-wrap gap-4 p-4">
	{#each conference.committees.toSorted( (a, b) => a.abbreviation.localeCompare(b.abbreviation) ) as committee (committee.id)}
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
					<IconInfoBox text={committee.stateOfDebate ?? '—'} faIcon="diagram-next" />
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
