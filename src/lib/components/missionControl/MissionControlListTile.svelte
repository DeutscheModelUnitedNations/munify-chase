<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import Flag from '../Flag.svelte';
	import MissionControlTile from './MissionControlTile.svelte';
	import MissionControlBarList from './MissionControlBarList.svelte';
	import { speakerLabel, type InsightSpeaker, type ListTile } from './insights';
	import { fmtDuration } from './missionControlFormat';

	let { tile }: { tile: ListTile } = $props();

	const representationOf = (speaker: InsightSpeaker) =>
		speaker.committeeMember?.representation ?? speaker.conferenceMember?.representation;
</script>

{#if tile.kind === 'votingSessions'}
	<MissionControlTile title={m.missionControlActiveVotes()}>
		<div class="flex min-h-0 flex-1 flex-col justify-center gap-3 overflow-hidden text-2xl">
			{#each tile.committees as committee (committee.id)}
				{#each committee.votingSessions ?? [] as session (session.id)}
					<div class="flex items-center gap-3">
						<i
							aria-hidden="true"
							class="ph-fill ph-chart-bar text-primary w-7 flex-none text-center"
						></i>
						<span class="flex-none font-bold">{committee.abbreviation}</span>
						<span class="text-base-content/70 truncate">{session.voteName || session.mode}</span>
					</div>
				{/each}
			{/each}
		</div>
	</MissionControlTile>
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
	<MissionControlTile title={m.missionControlRecentAdoptions()}>
		<div class="flex min-h-0 flex-1 flex-col justify-center gap-3 overflow-hidden text-2xl">
			{#each tile.pulse.recentAdoptions.slice(0, 3) as adoption, idx (idx)}
				<div class="flex items-center gap-3">
					<i aria-hidden="true" class="ph-fill ph-gavel text-success w-7 flex-none text-center"></i>
					<div class="min-w-0 leading-tight">
						<div class="flex items-baseline gap-2">
							<span class="flex-none font-bold">{adoption.committeeAbbreviation}</span>
							<span class="truncate"
								>{adoption.documentNumber || adoption.paperTitle || m.unknown()}</span
							>
						</div>
						<p class="text-base-content/60 truncate text-xl">
							{adoption.agendaItemTitle}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</MissionControlTile>
{:else if tile.kind === 'speakersListSpotlight'}
	<MissionControlTile title={m.missionControlSpeakersListTitle()}>
		<div class="mb-1 flex shrink-0 flex-col gap-0.5">
			<span class="text-3xl font-bold">{tile.committee.abbreviation}</span>
			<span class="text-base-content/60 truncate text-lg">{tile.committee.name}</span>
		</div>
		<div class="flex min-h-0 flex-1 flex-col justify-start gap-2 overflow-hidden text-2xl">
			{#each tile.speakers.slice(0, 8) as speaker, idx (speaker.id)}
				{@const representation = representationOf(speaker)}
				{@const current = idx === 0}
				<div class="flex items-center gap-3" class:text-primary={current}>
					{#if current}
						<i aria-hidden="true" class="ph-fill ph-microphone w-7 flex-none text-center"></i>
					{:else}
						<span class="text-base-content/40 w-7 flex-none text-center font-mono text-xl"
							>{idx}</span
						>
					{/if}
					<Flag size="sm" {representation} />
					<span class="truncate" class:font-bold={current}
						>{speakerLabel(speaker, representation)}</span
					>
				</div>
			{/each}
		</div>
	</MissionControlTile>
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
