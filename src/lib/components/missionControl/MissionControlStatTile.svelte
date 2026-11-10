<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import MissionControlTile from './MissionControlTile.svelte';
	import type { StatTile } from './insights';
	import { fmtDuration, percentOf } from './missionControlFormat';

	let { tile }: { tile: StatTile } = $props();
</script>

{#snippet stat({
	icon,
	color = 'text-primary',
	value,
	caption,
	small = false
}: {
	icon: string;
	color?: string;
	value: string | number;
	caption: string;
	small?: boolean;
})}
	<div class="flex flex-col items-center justify-center gap-1 p-3 text-center">
		<i aria-hidden="true" class="ph-fill ph-{icon} {color} text-3xl"></i>
		<p class="{small ? 'text-3xl' : 'text-4xl'} font-bold tabular-nums">{value}</p>
		<p class="text-base-content/60 text-base">{caption}</p>
	</div>
{/snippet}

{#snippet headline(icon: string, abbreviation: string, detail: string, tabular: boolean)}
	<i aria-hidden="true" class="ph-fill ph-{icon} text-4xl"></i>
	<p class="truncate text-4xl font-bold">
		{abbreviation}
		<span class="text-base-content/60 text-2xl font-normal" class:tabular-nums={tabular}
			>{detail}</span
		>
	</p>
{/snippet}

{#if tile.kind === 'attendance'}
	<MissionControlTile center>
		<i aria-hidden="true" class="ph-fill ph-users text-base-content/40 text-4xl"></i>
		<p class="text-6xl font-bold tabular-nums">
			{Math.round(percentOf(tile.present, tile.total))}%
		</p>
		<p class="text-base-content/60 text-xl">
			{m.missionControlDelegatesPresent({ present: tile.present, total: tile.total })}
		</p>
	</MissionControlTile>
{:else if tile.kind === 'heartbeat'}
	{@const heartbeat = tile.pulse.heartbeat}
	<MissionControlTile title={m.missionControlHeartbeatTitle()}>
		<div class="grid min-h-0 flex-1 grid-cols-2 gap-3">
			{@render stat({
				icon: 'microphone',
				value: heartbeat.speechesToday,
				caption: m.missionControlSpeechesCaption()
			})}
			{@render stat({
				icon: 'chart-bar',
				value: heartbeat.votesHeldToday,
				caption: m.missionControlVotesCaption()
			})}
			{@render stat({
				icon: 'gavel',
				color: 'text-success',
				value: heartbeat.resolutionsAdoptedToday,
				caption: m.missionControlResolutionsCaption()
			})}
			{@render stat({
				icon: 'clock',
				color: 'text-info',
				value: fmtDuration(heartbeat.debateSecondsToday),
				caption: m.missionControlDebateCaption(),
				small: true
			})}
		</div>
	</MissionControlTile>
{:else if tile.kind === 'busiestCommittee'}
	<MissionControlTile title={m.missionControlBusiestCommittee()} center>
		<i aria-hidden="true" class="ph-fill ph-fire text-warning text-4xl"></i>
		<p class="truncate text-4xl font-bold">{tile.committeeAbbreviation}</p>
	</MissionControlTile>
{:else if tile.kind === 'closestVote'}
	<MissionControlTile title={m.missionControlClosestVote()} center>
		{@render headline(
			'scales text-info',
			tile.committeeAbbreviation,
			`${tile.votesPro}–${tile.votesCon}`,
			true
		)}
	</MissionControlTile>
{:else if tile.kind === 'conferenceOverview'}
	{@const overview = tile.overview}
	<MissionControlTile title={m.missionControlConferenceOverview()}>
		<div class="grid min-h-0 flex-1 grid-cols-2 gap-3">
			{@render stat({
				icon: 'users',
				value: overview.totalDelegates,
				caption: m.missionControlDelegatesCaption()
			})}
			{@render stat({
				icon: 'building',
				value: overview.totalCommittees,
				caption: m.missionControlCommitteesCaption()
			})}
			{@render stat({
				icon: 'microphone',
				value: overview.totalSpeechesAllTime,
				caption: m.missionControlSpeechesAllTimeCaption()
			})}
			{@render stat({
				icon: 'gavel',
				color: 'text-success',
				value: overview.totalResolutionsAdoptedAllTime,
				caption: m.missionControlResolutionsAllTimeCaption()
			})}
		</div>
	</MissionControlTile>
{:else if tile.kind === 'longestSpeechToday'}
	<MissionControlTile title={m.missionControlLongestSpeech()} center>
		{@render headline(
			'hourglass-medium text-warning',
			tile.committeeAbbreviation,
			fmtDuration(tile.durationSeconds),
			false
		)}
	</MissionControlTile>
{:else}
	<MissionControlTile title={m.missionControlPapersAwaitingVote()} center>
		<i aria-hidden="true" class="ph-fill ph-scales text-info text-4xl"></i>
		<p class="text-6xl font-bold tabular-nums">{tile.count}</p>
	</MissionControlTile>
{/if}
