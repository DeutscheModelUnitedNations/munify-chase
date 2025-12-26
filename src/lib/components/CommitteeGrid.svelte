<script lang="ts">
  import type { committeeOverviewQuery } from '$lib/queries/committeeOverview.svelte';
  import type { missionControlQuery } from '$lib/queries/missionControlQuery.svelte';
  import { getCommitteeStatusIcon, translateCommitteeStatusText } from '$lib/utils/committeeStatus';
  import AdoptionConfetti from './AdoptionConfetti.svelte';
  import IconInfoBox from './IconInfoBox.svelte';

  interface Props {
    conference:
      | Awaited<ReturnType<typeof missionControlQuery>>
      | Awaited<ReturnType<typeof committeeOverviewQuery>>;
    environment?: 'SPECTATOR' | 'TEAM';
  }

  const { conference, environment = 'SPECTATOR' }: Props = $props();

  const getHref = (committeeId: string) => {
    if (environment === 'TEAM') {
      return `/app/${$conference.id}/${committeeId}/setup`;
    } else {
      return `/app/${$conference.id}/${committeeId}`;
    }
  };
</script>

<div class="flex h-full w-full flex-wrap gap-4 p-4">
  {#each $conference.committees.sort( (a, b) => a.abbreviation.localeCompare(b.abbreviation) ) as committee (committee.id)}
    <a
      class="card relative min-w-md flex-1 bg-base-100 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md"
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
          text={translateCommitteeStatusText(committee.status)}
          faIcon={getCommitteeStatusIcon(committee.status)}
          committeeStatus={committee.status}
          marqueeOnOverflow={false}
          until={committee.statusUntil}
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
