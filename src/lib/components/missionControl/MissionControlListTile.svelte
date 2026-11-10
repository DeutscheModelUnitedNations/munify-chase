<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import Flag from '../Flag.svelte';
	import MissionControlTile from './MissionControlTile.svelte';
	import MissionControlBarList from './MissionControlBarList.svelte';
	import MissionControlVotesTile from './MissionControlVotesTile.svelte';
	import MissionControlAdoptionsTile from './MissionControlAdoptionsTile.svelte';
	import MissionControlSpeakersTile from './MissionControlSpeakersTile.svelte';
	import type { ListTile } from './insights';
	import { fmtDuration } from './missionControlFormat';

	let { tile }: { tile: ListTile } = $props();
</script>

{#if tile.kind === 'votingSessions'}
	<MissionControlVotesTile {tile} />
{:else if tile.kind === 'speakingPulse'}
	<MissionControlTile title={m.missionControlSpeakingNow()}>
		<div class="flex min-h-0 flex-1 flex-col justify-center gap-3 overflow-hidden text-2xl">
			{#each tile.speakers as speaker (speaker.committee.id)}
				<div class="flex items-center gap-3">
					<Flag size="sm" representation={speaker.representation} />
					<span class="flex-none font-bold">{speaker.committee.abbreviation}</span>
					<span class="text-base-content/70 truncate">{speaker.label}</span>
				</div>
			{/each}
		</div>
	</MissionControlTile>
{:else if tile.kind === 'adoptions'}
	<MissionControlAdoptionsTile {tile} />
{:else if tile.kind === 'speakersListSpotlight'}
	<MissionControlSpeakersTile {tile} />
{:else if tile.kind === 'committeeActivity'}
	<MissionControlTile title={m.missionControlCommitteeActivity()}>
		<MissionControlBarList
			items={tile.entries.map((entry) => ({
				key: entry.committeeAbbreviation,
				label: entry.committeeAbbreviation,
				value: entry.totalSpeakingSeconds,
				valueLabel: fmtDuration(entry.totalSpeakingSeconds),
				icon: 'chart-line'
			}))}
		/>
	</MissionControlTile>
{:else}
	<MissionControlTile title={m.missionControlPapersPerCommittee()}>
		<MissionControlBarList
			barColorClass="bg-success"
			items={tile.entries.map((entry) => ({
				key: entry.committeeAbbreviation,
				label: entry.committeeAbbreviation,
				value: entry.paperCount,
				valueLabel: String(entry.paperCount),
				icon: 'folder-open'
			}))}
		/>
	</MissionControlTile>
{/if}
