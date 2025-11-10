<script lang="ts">
import type { CommitteeTeamQuery$result } from "$houdini";
import IconInfoBox from "$lib/components/IconInfoBox.svelte";
import { m } from "$lib/paraglide/messages";
import {
  getCommitteeStatusIcon,
  getCommitteeStatusText,
} from "$lib/utils/committeeStatus";

interface Props {
  committee?: CommitteeTeamQuery$result["findFirstCommittee"] | null;
}

const { committee }: Props = $props();
</script>

<IconInfoBox text={committee?.activeAgendaItem?.title || '—'} faIcon="podium" />
<IconInfoBox text={committee?.stateOfDebate || '—'} faIcon="diagram-next" />
<IconInfoBox
	text={(committee?.statusHeadline.length || 0) > 0
		? committee!.statusHeadline
		: getCommitteeStatusText(committee?.status || 'FORMAL')}
	faIcon={getCommitteeStatusIcon(committee?.status || 'FORMAL')}
	committeeStatus={committee?.status}
	marqueeOnOverflow={false}
	until={new Date(committee?.statusUntil || Date.now())}
/>
