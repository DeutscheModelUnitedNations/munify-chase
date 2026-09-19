<script module lang="ts">
	import type { InsightCommittee } from './insights';

	export interface MissionControlConference {
		id: string;
		committees: InsightCommittee[];
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { Masonry } from 'svelte-widgets';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';
	import IconInfoBox from '../IconInfoBox.svelte';
	import Flag from '../Flag.svelte';
	import MissionControlTile from './MissionControlTile.svelte';
	import MissionControlBarList from './MissionControlBarList.svelte';
	import MissionControlChart, { type MissionControlChartKind } from './MissionControlChart.svelte';
	import { getCommitteeStatusIcon, getCommitteeStatusText } from '$lib/utils/committeeStatus';
	import { translateRegionalGroupEnum } from '$lib/utils/enumTranslationHelper';
	import type { RegionalgroupEnum } from '$lib/api/rumbleClient/client';
	import { getServerTime } from '$lib/state/serverTime.svelte';
	import {
		buildInsightTiles,
		committeesOnBreak,
		committeesRunning,
		speakerLabel,
		type InsightTile,
		type InsightPulse
	} from './insights';

	interface Props {
		conference: MissionControlConference;
		pulse: InsightPulse | null;
	}

	let { conference, pulse }: Props = $props();

	const running = $derived(committeesRunning(conference.committees));
	const onBreak = $derived(committeesOnBreak(conference.committees));

	const getHref = (committeeId: string) =>
		resolve('/app/[conferenceId]/[committeeId]/(chairs)/setup', {
			conferenceId: conference.id,
			committeeId
		});

	// A committee "on a break" gets a blinking warning border once its status is
	// about to run out or already has — that's the info someone walking past
	// actually needs (when to head back), independent of the insight-tile rotation.
	const WARNING_THRESHOLD_MS = 2 * 60 * 1000;
	function isDueSoon(committee: InsightCommittee) {
		const remainingMs = new Date(committee.statusUntil).getTime() - getServerTime().valueOf();
		return remainingMs <= WARNING_THRESHOLD_MS;
	}

	// ─── Rotating insight tiles ─────────────────────────────────────────────
	// Every tile buildInsightTiles produces already only exists because it has
	// real data to show (see its per-tile guards) — so all of them stay on
	// screen all the time now, nothing is hidden. The rotation just reshuffles
	// their order every 45s for visual variety on a hallway display that's
	// glanced at rather than read start-to-end; Masonry FLIP-animates tiles
	// into their new spot rather than swapping visibility. Seeded by `tick`
	// (not Math.random()) so the order only changes on rotation, not on every
	// unrelated data refresh.
	const pool = $derived(buildInsightTiles(conference.committees, pulse));
	const ROTATE_MS = 45_000;
	let tick = $state(0);

	onMount(() => {
		const id = setInterval(() => (tick += 1), ROTATE_MS);
		return () => clearInterval(id);
	});

	function seededRandom(seed: number) {
		let s = seed % 2147483647;
		if (s <= 0) s += 2147483646;
		return () => {
			s = (s * 16807) % 2147483647;
			return (s - 1) / 2147483646;
		};
	}

	function shuffled<T>(items: T[], seed: number): T[] {
		const rand = seededRandom(seed + 1);
		const copy = [...items];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(rand() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	}

	const tiles = $derived.by(() => (pool.length === 0 ? [] : shuffled(pool, tick)));

	// ─── Masonry entries ────────────────────────────────────────────────────
	// Committees and insight tiles are two different shapes, so they're merged
	// into one discriminated-union list with a stable `id` per entry — Masonry
	// keys and FLIP-animates items by `id`, tracking each committee/tile across
	// rotations and data refreshes independently of its position in the array.
	type MasonryEntry =
		| { id: string; kind: 'committee'; committee: InsightCommittee; dueSoon: boolean }
		| { id: string; kind: 'tile'; tile: InsightTile };

	const masonryEntries = $derived.by((): MasonryEntry[] => [
		...running.map((committee): MasonryEntry => ({
			id: `committee-${committee.id}`,
			kind: 'committee',
			committee,
			dueSoon: false
		})),
		...onBreak.map((committee): MasonryEntry => ({
			id: `committee-${committee.id}`,
			kind: 'committee',
			committee,
			dueSoon: isDueSoon(committee)
		})),
		...tiles.map((tile): MasonryEntry => ({ id: `tile-${tile.key}`, kind: 'tile', tile }))
	]);

	function fmtDuration(totalSeconds: number): string {
		const h = Math.floor(totalSeconds / 3600);
		const min = Math.floor((totalSeconds % 3600) / 60);
		return h > 0 ? `${h}h ${String(min).padStart(2, '0')}m` : `${min}m`;
	}

	function paperStatusLabel(status: string): string {
		switch (status) {
			case 'WORKING_PAPER':
				return m.workingPaper();
			case 'SUBMITTED':
				return m.submitted();
			case 'DRAFT_RESOLUTION':
				return m.draftResolution();
			case 'AMENDMENT_PHASE':
				return m.amendmentPhase();
			case 'VOTING_PHASE':
				return m.votingPhase();
			case 'FINAL':
				return m.final();
			default:
				return status;
		}
	}

	function representationTypeLabel(type: string): string {
		switch (type) {
			case 'DELEGATION':
				return m.delegation();
			case 'NSA':
				return m.nonStateActor();
			case 'UN':
				return m.unActor();
			default:
				return type;
		}
	}

	function amendmentStatusLabel(status: string): string {
		switch (status) {
			case 'PENDING':
				return m.pending();
			case 'SUBMITTED':
				return m.submitted();
			case 'CONSENSUS_ADOPTED':
				return m.consensusAdopted();
			case 'ACCEPTED':
				return m.accepted();
			case 'REJECTED':
				return m.rejected();
			case 'WITHDRAWN':
				return m.withdrawn();
			default:
				return status;
		}
	}

	// Each chart-shaped tile picks its diagram type from a small pool suited to
	// its data (an ordered funnel reads better as a bar than a pie, for
	// instance), reseeded on every rotation tick alongside the tile shuffle —
	// so the same stat doesn't always render as the same chart.
	function hashString(s: string): number {
		let h = 0;
		for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
		return Math.abs(h);
	}
	const CHART_TYPE_POOLS: Record<string, MissionControlChartKind[]> = {
		resolutionFunnel: ['bar', 'doughnut', 'polarArea'],
		speakingByRegion: ['doughnut', 'polarArea', 'pie'],
		speakingByRepresentationType: ['pie', 'doughnut', 'polarArea'],
		amendmentActivity: ['polarArea', 'bar', 'doughnut']
	};
	function chartTypeFor(kind: string, key: string): MissionControlChartKind {
		const pool = CHART_TYPE_POOLS[kind] ?? ['doughnut'];
		return pool[(hashString(key) + tick) % pool.length];
	}
</script>

<!--
	Everything — every committee, then the rotating conference-wide insight
	tiles — flows into a single Masonry list (see masonryEntries above) so
	varying tile heights pack without the empty gaps a CSS grid's shared
	per-row track height would leave. Committees always come first (that's
	the navigation-critical info); stats follow.
-->
{#snippet committeeCard(committee: InsightCommittee, dueSoon: boolean)}
	<a
		class="card bg-base-100 relative flex w-full flex-col shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md {dueSoon
			? 'mission-control-due-soon'
			: ''}"
		href={getHref(committee.id)}
	>
		<i
			class="fas fa-arrow-right-to-bracket text-base-content/25 absolute top-4 right-4 text-xl"
			aria-hidden="true"
		></i>
		<div class="card-body flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-5">
			<div class="mb-1 flex w-full min-w-0 shrink-0 items-baseline gap-3 pr-8">
				<h2 class="card-title text-5xl">
					{committee.abbreviation}
				</h2>
				<div class="text-base-content/60 truncate text-xl">
					{committee.name}
				</div>
			</div>
			<div class="flex min-h-0 flex-1 flex-col justify-end gap-3">
				<IconInfoBox
					text={committee.activeAgendaItem?.title ?? '—'}
					faIcon="podium"
					textClass="text-2xl"
				/>
				<IconInfoBox
					text={getCommitteeStatusText(committee.status)}
					faIcon={getCommitteeStatusIcon(committee.status)}
					committeeStatus={committee.status}
					until={new Date(committee.statusUntil)}
					textClass="text-2xl"
					subTextClass="text-base"
				/>
			</div>
		</div>
	</a>
{/snippet}

{#snippet tileCard(tile: InsightTile)}
	{#if tile.kind === 'votingSessions'}
		<MissionControlTile title={m.missionControlActiveVotes()}>
			<div class="flex min-h-0 flex-1 flex-col justify-center gap-3 overflow-hidden text-2xl">
				{#each tile.committees as committee (committee.id)}
					{#each committee.votingSessions ?? [] as session (session.id)}
						<div class="flex items-center gap-3">
							<i class="fas fa-square-poll-vertical text-primary w-7 flex-none text-center"></i>
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
	{:else if tile.kind === 'attendance'}
		<MissionControlTile center>
			<i class="fas fa-users text-base-content/40 text-4xl"></i>
			<p class="text-6xl font-bold tabular-nums">
				{tile.total > 0 ? Math.round((tile.present / tile.total) * 100) : 0}%
			</p>
			<p class="text-base-content/60 text-xl">
				{m.missionControlDelegatesPresent({ present: tile.present, total: tile.total })}
			</p>
		</MissionControlTile>
	{:else if tile.kind === 'adoptions'}
		<MissionControlTile title={m.missionControlRecentAdoptions()}>
			<div class="flex min-h-0 flex-1 flex-col justify-center gap-3 overflow-hidden text-2xl">
				{#each tile.pulse.recentAdoptions.slice(0, 3) as adoption, idx (idx)}
					<div class="flex items-center gap-3">
						<i class="fas fa-gavel text-success w-7 flex-none text-center"></i>
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
	{:else if tile.kind === 'heartbeat'}
		<MissionControlTile title={m.missionControlHeartbeatTitle()}>
			<div class="grid min-h-0 flex-1 grid-cols-2 gap-3">
				<div class="flex flex-col items-center justify-center gap-1 p-3 text-center">
					<i class="fas fa-microphone text-primary text-3xl"></i>
					<p class="text-4xl font-bold tabular-nums">{tile.pulse.heartbeat.speechesToday}</p>
					<p class="text-base-content/60 text-base">{m.missionControlSpeechesCaption()}</p>
				</div>
				<div class="flex flex-col items-center justify-center gap-1 p-3 text-center">
					<i class="fas fa-square-poll-vertical text-primary text-3xl"></i>
					<p class="text-4xl font-bold tabular-nums">{tile.pulse.heartbeat.votesHeldToday}</p>
					<p class="text-base-content/60 text-base">{m.missionControlVotesCaption()}</p>
				</div>
				<div class="flex flex-col items-center justify-center gap-1 p-3 text-center">
					<i class="fas fa-gavel text-success text-3xl"></i>
					<p class="text-4xl font-bold tabular-nums">
						{tile.pulse.heartbeat.resolutionsAdoptedToday}
					</p>
					<p class="text-base-content/60 text-base">{m.missionControlResolutionsCaption()}</p>
				</div>
				<div class="flex flex-col items-center justify-center gap-1 p-3 text-center">
					<i class="fas fa-clock text-info text-3xl"></i>
					<p class="text-3xl font-bold tabular-nums">
						{fmtDuration(tile.pulse.heartbeat.debateSecondsToday)}
					</p>
					<p class="text-base-content/60 text-base">{m.missionControlDebateCaption()}</p>
				</div>
			</div>
		</MissionControlTile>
	{:else if tile.kind === 'busiestCommittee'}
		<MissionControlTile title={m.missionControlBusiestCommittee()} center>
			<i class="fas fa-fire text-warning text-4xl"></i>
			<p class="truncate text-4xl font-bold">{tile.committeeAbbreviation}</p>
		</MissionControlTile>
	{:else if tile.kind === 'closestVote'}
		<MissionControlTile title={m.missionControlClosestVote()} center>
			<i class="fas fa-scale-balanced text-info text-4xl"></i>
			<p class="truncate text-4xl font-bold">
				{tile.committeeAbbreviation}
				<span class="text-base-content/60 text-2xl font-normal tabular-nums"
					>{tile.votesPro}–{tile.votesCon}</span
				>
			</p>
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
	{:else if tile.kind === 'speakingByRegion'}
		<MissionControlTile title={m.missionControlSpeakingByRegion()}>
			<MissionControlChart
				kind={chartTypeFor('speakingByRegion', tile.key)}
				slices={tile.entries.slice(0, 5).map((entry) => ({
					key: entry.group,
					label: translateRegionalGroupEnum(entry.group as RegionalgroupEnum) || m.unknown(),
					value: entry.totalSeconds,
					valueLabel: fmtDuration(entry.totalSeconds)
				}))}
			/>
		</MissionControlTile>
	{:else if tile.kind === 'speakersListSpotlight'}
		<MissionControlTile title={m.missionControlSpeakersListTitle()}>
			<div class="mb-1 flex shrink-0 items-baseline gap-3">
				<span class="text-3xl font-bold">{tile.committee.abbreviation}</span>
				<span class="text-base-content/60 truncate text-lg">{tile.committee.name}</span>
			</div>
			<div class="flex min-h-0 flex-1 flex-col justify-start gap-2 overflow-hidden text-2xl">
				{#each tile.speakers.slice(0, 8) as speaker, idx (speaker.id)}
					{@const representation =
						speaker.committeeMember?.representation ?? speaker.conferenceMember?.representation}
					{@const label = speakerLabel(speaker, representation)}
					<div class="flex items-center gap-3 {idx === 0 ? 'text-primary' : ''}">
						{#if idx === 0}
							<i class="fas fa-microphone w-7 flex-none text-center"></i>
						{:else}
							<span class="text-base-content/40 w-7 flex-none text-center font-mono text-xl"
								>{idx}</span
							>
						{/if}
						<Flag size="sm" {representation} />
						<span class="truncate {idx === 0 ? 'font-bold' : ''}">{label}</span>
					</div>
				{/each}
			</div>
		</MissionControlTile>
	{:else if tile.kind === 'conferenceOverview'}
		<MissionControlTile title={m.missionControlConferenceOverview()}>
			<div class="grid min-h-0 flex-1 grid-cols-2 gap-3">
				<div class="flex flex-col items-center justify-center gap-1 p-3 text-center">
					<i class="fas fa-users text-primary text-3xl"></i>
					<p class="text-4xl font-bold tabular-nums">{tile.overview.totalDelegates}</p>
					<p class="text-base-content/60 text-base">{m.missionControlDelegatesCaption()}</p>
				</div>
				<div class="flex flex-col items-center justify-center gap-1 p-3 text-center">
					<i class="fas fa-building text-primary text-3xl"></i>
					<p class="text-4xl font-bold tabular-nums">{tile.overview.totalCommittees}</p>
					<p class="text-base-content/60 text-base">{m.missionControlCommitteesCaption()}</p>
				</div>
				<div class="flex flex-col items-center justify-center gap-1 p-3 text-center">
					<i class="fas fa-microphone text-primary text-3xl"></i>
					<p class="text-4xl font-bold tabular-nums">{tile.overview.totalSpeechesAllTime}</p>
					<p class="text-base-content/60 text-base">
						{m.missionControlSpeechesAllTimeCaption()}
					</p>
				</div>
				<div class="flex flex-col items-center justify-center gap-1 p-3 text-center">
					<i class="fas fa-gavel text-success text-3xl"></i>
					<p class="text-4xl font-bold tabular-nums">
						{tile.overview.totalResolutionsAdoptedAllTime}
					</p>
					<p class="text-base-content/60 text-base">
						{m.missionControlResolutionsAllTimeCaption()}
					</p>
				</div>
			</div>
		</MissionControlTile>
	{:else if tile.kind === 'resolutionFunnel'}
		<MissionControlTile title={m.missionControlResolutionFunnel()}>
			<MissionControlChart
				kind={chartTypeFor('resolutionFunnel', tile.key)}
				slices={tile.entries.map((entry) => ({
					key: entry.status,
					label: paperStatusLabel(entry.status),
					value: entry.count,
					valueLabel: String(entry.count)
				}))}
			/>
		</MissionControlTile>
	{:else if tile.kind === 'speakingByRepresentationType'}
		<MissionControlTile title={m.missionControlSpeakingByType()}>
			<MissionControlChart
				kind={chartTypeFor('speakingByRepresentationType', tile.key)}
				slices={tile.entries.map((entry) => ({
					key: entry.representationType,
					label: representationTypeLabel(entry.representationType),
					value: entry.totalSeconds,
					valueLabel: fmtDuration(entry.totalSeconds)
				}))}
			/>
		</MissionControlTile>
	{:else if tile.kind === 'longestSpeechToday'}
		<MissionControlTile title={m.missionControlLongestSpeech()} center>
			<i class="fas fa-hourglass-half text-warning text-4xl"></i>
			<p class="truncate text-4xl font-bold">
				{tile.committeeAbbreviation}
				<span class="text-base-content/60 text-2xl font-normal"
					>{fmtDuration(tile.durationSeconds)}</span
				>
			</p>
		</MissionControlTile>
	{:else if tile.kind === 'amendmentActivity'}
		<MissionControlTile title={m.missionControlAmendmentActivity()}>
			<MissionControlChart
				kind={chartTypeFor('amendmentActivity', tile.key)}
				slices={tile.entries.map((entry) => ({
					key: entry.status,
					label: amendmentStatusLabel(entry.status),
					value: entry.count,
					valueLabel: String(entry.count)
				}))}
			/>
		</MissionControlTile>
	{:else if tile.kind === 'voteOutcomesToday'}
		{@const total = tile.entries.reduce((acc, entry) => acc + entry.count, 0)}
		<MissionControlTile title={m.missionControlVoteOutcomesToday()}>
			<div class="flex min-h-0 flex-1 flex-col justify-center gap-5">
				<div class="bg-base-200 flex h-4 w-full overflow-hidden rounded-full">
					{#each tile.entries as entry (entry.outcome)}
						<div
							class={entry.outcome === 'ADOPTED' ? 'bg-success' : 'bg-error'}
							style="width: {total > 0 ? (entry.count / total) * 100 : 0}%"
						></div>
					{/each}
				</div>
				<div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-2xl">
					{#each tile.entries as entry (entry.outcome)}
						<div class="flex items-center gap-2">
							<span
								class="h-3 w-3 flex-none rounded-full {entry.outcome === 'ADOPTED'
									? 'bg-success'
									: 'bg-error'}"
							></span>
							<span class="font-bold"
								>{entry.outcome === 'ADOPTED' ? m.adopted() : m.rejected()}</span
							>
							<span class="text-base-content/70">{entry.count}</span>
						</div>
					{/each}
				</div>
			</div>
		</MissionControlTile>
	{:else if tile.kind === 'papersAwaitingVote'}
		<MissionControlTile title={m.missionControlPapersAwaitingVote()} center>
			<i class="fas fa-scale-balanced text-info text-4xl"></i>
			<p class="text-6xl font-bold tabular-nums">{tile.count}</p>
		</MissionControlTile>
	{:else if tile.kind === 'papersPerCommittee'}
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
{/snippet}

<Masonry
	items={masonryEntries}
	gap={16}
	min_col_width={320}
	max_col_width={420}
	order="balanced-stable"
	class="p-4"
	column_props={{ style: 'grid-template-columns: minmax(0, 1fr);' }}
>
	{#snippet children({ item })}
		{#if item.kind === 'committee'}
			{@render committeeCard(item.committee, item.dueSoon)}
		{:else}
			{@render tileCard(item.tile)}
		{/if}
	{/snippet}
</Masonry>

<style>
	@keyframes mission-control-blink {
		0%,
		100% {
			box-shadow: 0 0 0 3px var(--color-error);
		}
		50% {
			box-shadow: 0 0 0 3px transparent;
		}
	}
	.mission-control-due-soon {
		animation: mission-control-blink 1.2s ease-in-out infinite;
	}
	@media (prefers-reduced-motion: reduce) {
		.mission-control-due-soon {
			animation: none;
			box-shadow: 0 0 0 3px var(--color-error);
		}
	}
</style>
