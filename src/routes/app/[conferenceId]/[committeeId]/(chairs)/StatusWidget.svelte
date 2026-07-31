<script lang="ts">
	import IconInfoBox from '$lib/components/IconInfoBox.svelte';
	import { getCommitteeStatusIcon, getCommitteeStatusText } from '$lib/utils/committeeStatus';
	import type { CommitteestatusEnum } from '$lib/api/rumbleClient/client';

	interface Props {
		committee?: {
			activeAgendaItem?: { title?: string | null } | null;
			stateOfDebate?: string | null;
			statusHeadline: string;
			status: CommitteestatusEnum;
			statusUntil: Date;
		} | null;
	}

	let { committee }: Props = $props();
</script>

<IconInfoBox text={committee?.activeAgendaItem?.title || '—'} faIcon="podium" />
<IconInfoBox text={committee?.stateOfDebate || '—'} faIcon="diagram-next" />
<IconInfoBox
	text={(committee?.statusHeadline.length || 0) > 0
		? committee!.statusHeadline
		: getCommitteeStatusText(committee?.status || 'FORMAL')}
	faIcon={getCommitteeStatusIcon(committee?.status || 'FORMAL')}
	committeeStatus={committee?.status}
	until={new Date(committee?.statusUntil || Date.now())}
/>
