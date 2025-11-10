<script lang="ts">
import dayjs from "dayjs";
import hotkeys from "hotkeys-js";
import { onDestroy, onMount, type Snippet } from "svelte";
import toast from "svelte-french-toast";
import AdoptionConfetti from "$lib/components/AdoptionConfetti.svelte";
import StateOfDebateChangerModal from "$lib/components/committee/StateOfDebateChangerModal.svelte";
import StatusChangerModal from "$lib/components/committee/StatusChangerModal.svelte";
import BellIcon from "$lib/components/toast/BellIcon.svelte";
import * as m from "$lib/paraglide/messages";
import { serverTime } from "$lib/state/serverTime.svelte";
import { getCommitteeStatusText } from "$lib/utils/committeeStatus";
import type { LayoutData } from "./$houdini";
import ChairNavbar from "./ChairNavbar.svelte";

interface Props {
  children: Snippet;
  data: LayoutData;
}

const { data, children }: Props = $props();

const query = $derived(data?.CommitteeTeamQuery);
const committee = $derived($query.data?.findFirstCommittee);

let committeeStatusExpiredAlerted = $state(false);
let speakersListOvertimeAlerted = $state(false);
let commentListOvertimeAlerted = $state(false);

$effect(() => {
  // Toast Effect
  if (!committee) return;

  const interval = setInterval(() => {
    if (dayjs(committee.statusUntil).diff($serverTime) < 0) {
      if (!committeeStatusExpiredAlerted) {
        toast.error(
          m.committeeStatusExpired({
            status: getCommitteeStatusText(
              committee.status,
              committee.statusHeadline,
            ),
          }),
          {
            icon: BellIcon,
            duration: 10000,
          },
        );
        committeeStatusExpiredAlerted = true;
      }
    } else {
      committeeStatusExpiredAlerted = false;
    }

    for (const speakersList of committee.activeAgendaItem?.speakersList ?? []) {
      const overtime =
        dayjs(speakersList.startTimestamp).diff($serverTime, "seconds") +
          speakersList.timeLeft <
        0;

      //	XAND only fire if both are false. Both true can be ignored, case should not happen.
      if (
        overtime &&
        speakersListOvertimeAlerted === commentListOvertimeAlerted
      ) {
        toast.error(m.speakersListOvertime(), {
          icon: BellIcon,
        });
        if (speakersList.type === "SPEAKERS_LIST") {
          speakersListOvertimeAlerted = true;
        } else if (speakersList.type === "COMMENT_LIST") {
          commentListOvertimeAlerted = true;
        }
      } else if (!overtime) {
        if (speakersList.type === "SPEAKERS_LIST") {
          speakersListOvertimeAlerted = false;
        } else if (speakersList.type === "COMMENT_LIST") {
          commentListOvertimeAlerted = false;
        }
      }
    }
  }, 1000);
  return () => clearInterval(interval);
});

onMount(() => {
  hotkeys("alt+p", (event) => {
    event.preventDefault();
    window.open(".", "_blank");
  });
});

onDestroy(() => {
  hotkeys.unbind("alt+p");
});
</script>

<svelte:head>
	<title>{committee?.abbreviation ?? 'N/A'} {m.chairControls()} - MUNify CHASE</title>
</svelte:head>

<ChairNavbar title={committee?.abbreviation} />

{@render children()}

<StatusChangerModal
	committeeId={data.committeeId}
	oldStatus={committee?.status}
	oldUntil={committee?.statusUntil}
	oldCustomName={committee?.statusHeadline}
/>

<StateOfDebateChangerModal
	committeeId={data.committeeId}
	oldStateOfDebate={committee?.stateOfDebate}
/>

<AdoptionConfetti
	lastAdoptionDate={committee?.lastResolutionAdoptionDate}
	agendaItem={committee?.activeAgendaItem?.title ?? m.unknown()}
	committeeName={committee?.name ?? m.unknown()}
	confettiDurationSec={20}
/>
