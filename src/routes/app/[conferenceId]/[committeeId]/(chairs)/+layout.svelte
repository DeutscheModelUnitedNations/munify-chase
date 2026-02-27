<script lang="ts">
  import dayjs from 'dayjs';
  import hotkeys from 'hotkeys-js';
  import { onDestroy, onMount, type Snippet } from 'svelte';
  import toast from 'svelte-french-toast';
  import AdoptionConfetti from '$lib/components/AdoptionConfetti.svelte';
  import StateOfDebateChangerModal from '$lib/components/committee/StateOfDebateChangerModal.svelte';
  import StatusChangerModal from '$lib/components/committee/StatusChangerModal.svelte';
  import BellIcon from '$lib/components/toast/BellIcon.svelte';
  import * as m from '$lib/paraglide/messages';
  import { serverTime } from '$lib/state/serverTime.svelte';
  import { translateCommitteeStatusText } from '$lib/utils/committeeStatus';
  import ChairNavbar from './ChairNavbar.svelte';
  import { committeeTeamQuery } from '$lib/queries/committeeTeamQuery.svelte';

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();

  const committee = await committeeTeamQuery();

  let committeeStatusExpiredAlerted = $state(false);
  let speakersListOvertimeAlerted = $state(false);
  let commentListOvertimeAlerted = $state(false);

  $effect(() => {
    // Toast Effect
    if (!committee) return;

    const interval = setInterval(() => {
      if (dayjs(committee.statusUntil).diff(serverTime.value) < 0) {
        if (!committeeStatusExpiredAlerted) {
          toast.error(
            m.committeeStatusExpired({
              status: translateCommitteeStatusText(committee.status, committee.statusHeadline)
            }),
            {
              icon: BellIcon,
              duration: 10000
            }
          );
          committeeStatusExpiredAlerted = true;
        }
      } else {
        committeeStatusExpiredAlerted = false;
      }

      for (const speakersList of committee.activeAgendaItem?.speakersList ?? []) {
        const overtime =
          dayjs(speakersList.startTimestamp).diff(serverTime.value, 'seconds') +
            speakersList.timeLeft <
          0;

        //	XAND only fire if both are false. Both true can be ignored, case should not happen.
        if (overtime && speakersListOvertimeAlerted === commentListOvertimeAlerted) {
          toast.error(m.speakersListOvertime(), {
            icon: BellIcon
          });
          if (speakersList.type === 'SPEAKERS_LIST') {
            speakersListOvertimeAlerted = true;
          } else if (speakersList.type === 'COMMENT_LIST') {
            commentListOvertimeAlerted = true;
          }
        } else if (!overtime) {
          if (speakersList.type === 'SPEAKERS_LIST') {
            speakersListOvertimeAlerted = false;
          } else if (speakersList.type === 'COMMENT_LIST') {
            commentListOvertimeAlerted = false;
          }
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  onMount(() => {
    hotkeys('alt+p', (event) => {
      event.preventDefault();
      window.open('.', '_blank');
    });
  });

  onDestroy(() => {
    hotkeys.unbind('alt+p');
  });
</script>

<svelte:head>
  <title
    >{committee?.abbreviation ?? 'N/A'}
    {m.chairControls()} - MUNify CHASE</title
  >
</svelte:head>

<ChairNavbar title={committee?.abbreviation} />

{@render children()}

<StatusChangerModal
  committeeId={committee.id}
  oldStatus={committee?.status}
  oldUntil={committee?.statusUntil}
  oldCustomName={committee?.statusHeadline}
/>

<StateOfDebateChangerModal committeeId={committee.id} oldStateOfDebate={committee?.stateOfDebate} />

<AdoptionConfetti
  lastAdoptionDate={committee?.lastResolutionAdoptionDate}
  agendaItem={committee?.activeAgendaItem?.title ?? m.unknown()}
  committeeName={committee?.name ?? m.unknown()}
  confettiDurationSec={20}
/>
