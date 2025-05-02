<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import IconInfoBox from './IconInfoBox.svelte';
	import { getCommitteeStatusIcon, getCommitteeStatusText } from '$lib/utils/committeeStatus';
	import { type MissionControlQuery$result } from '$houdini';

	interface Props {
		conference: MissionControlQuery$result['findFirstConference'];
	}

	let { conference }: Props = $props();
</script>

<div class="flex h-full w-full flex-wrap gap-4 p-4">
	{#each conference.committees as committee}
		<div class="card bg-base-100 relative min-w-md flex-1 shadow-sm">
			<div class="card-body">
				<h2 class="card-title font-mono text-4xl">
					{committee.abbreviation}
				</h2>
				<IconInfoBox text={committee.activeAgendaItem?.title ?? '—'} faIcon="podium" />
				<IconInfoBox text={committee.stateOfDebate ?? '—'} faIcon="diagram-next" />
				<IconInfoBox
					text={getCommitteeStatusText(committee.status)}
					faIcon={getCommitteeStatusIcon(committee.status)}
					committeeStatus={committee.status}
					marqueeOnOverflow={false}
					until={new Date(committee.statusUntil)}
				/>
			</div>
		</div>
	{/each}
</div>
