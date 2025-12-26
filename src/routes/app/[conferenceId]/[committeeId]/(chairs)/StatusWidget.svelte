<script lang="ts">
  import IconInfoBox from "$lib/components/IconInfoBox.svelte";
  import { m } from "$lib/paraglide/messages";
  import { committeeTeamQuery } from "$lib/queries/committeeTeamQuery.svelte";
  import {
    getCommitteeStatusIcon,
    translateCommitteeStatusText,
  } from "$lib/utils/committeeStatus";

  interface Props {
    committee?: Awaited<ReturnType<typeof committeeTeamQuery>> | null;
  }

  const { committee }: Props = $props();
</script>

<IconInfoBox
  text={$committee?.activeAgendaItem?.title || "—"}
  faIcon="podium"
/>
<IconInfoBox text={$committee?.stateOfDebate || "—"} faIcon="diagram-next" />
<IconInfoBox
  text={($committee?.statusHeadline.length || 0) > 0
    ? $committee!.statusHeadline
    : translateCommitteeStatusText($committee?.status || "FORMAL")}
  faIcon={getCommitteeStatusIcon($committee?.status || "FORMAL")}
  committeeStatus={$committee?.status}
  marqueeOnOverflow={false}
  until={new Date($committee?.statusUntil || Date.now())}
/>
