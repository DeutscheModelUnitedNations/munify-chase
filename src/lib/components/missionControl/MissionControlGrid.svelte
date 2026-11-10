<script module lang="ts">
	import type { InsightCommittee } from './insights';

	export interface MissionControlConference {
		id: string;
		committees: InsightCommittee[];
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	// Imported from its own subpath, not the package's barrel export — the
	// barrel also re-exports CodeEditor/DiffView, which pull in an optional
	// peer dep (@wooorm/starry-night) we don't have installed and don't need,
	// breaking the production build's static resolution.
	import Masonry from 'svelte-widgets/Masonry.svelte';
	import { resolve } from '$app/paths';
	import { m } from '#lib/paraglide/messages';
	import IconInfoBox from '../IconInfoBox.svelte';
	import MissionControlListTile from './MissionControlListTile.svelte';
	import MissionControlChartTile from './MissionControlChartTile.svelte';
	import MissionControlStatTile from './MissionControlStatTile.svelte';
	import { shuffled } from './missionControlFormat';
	import { getCommitteeStatusIcon, getCommitteeStatusText } from '#lib/utils/committeeStatus';
	import { getServerTime } from '#lib/state/serverTime.svelte';
	import {
		buildInsightTiles,
		committeesOnBreak,
		committeesRunning,
		isChartTile,
		isListTile,
		isStatTile,
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
</script>

<!--
	Everything — every committee, then the rotating conference-wide insight
	tiles — flows into a single Masonry list (see masonryEntries above) so
	varying tile heights pack without the empty gaps a CSS grid's shared
	per-row track height would leave. Committees always come first (that's
	the navigation-critical info); stats follow.
-->
{#snippet committeeCard(committee: InsightCommittee, dueSoon: boolean)}
	<!-- A primary border and an explicit Open button mark the card as the way into the
	     committee, the hover lift alone was too subtle -->
	<a
		class="card bg-base-100 border-primary/40 hover:border-primary group relative flex w-full cursor-pointer flex-col border-2 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg {dueSoon
			? 'mission-control-due-soon'
			: ''}"
		href={getHref(committee.id)}
	>
		<span
			class="btn btn-primary btn-sm pointer-events-none absolute top-4 right-4 gap-2 transition-transform group-hover:scale-105"
			aria-hidden="true"
		>
			{m.open()}
			<i aria-hidden="true" class="ph-fill ph-sign-in"></i>
		</span>
		<div class="card-body flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-5">
			<div class="mb-1 flex w-full min-w-0 shrink-0 flex-col gap-1 pr-24">
				<h2
					class="card-title text-5xl"
					style="view-transition-name: committee-abbr-{committee.id};"
				>
					{committee.abbreviation}
				</h2>
				<div class="text-base-content/60 truncate text-xl">
					{committee.name}
				</div>
			</div>
			<div class="flex min-h-0 flex-1 flex-col justify-end gap-3">
				<IconInfoBox
					text={committee.activeAgendaItem?.title ?? '—'}
					icon="lectern"
					textClass="text-2xl"
				/>
				<IconInfoBox text={committee.stateOfDebate || '—'} icon="steps" textClass="text-2xl" />
				<!-- Same text as the presentation view: the chairs' own headline when set -->
				<IconInfoBox
					text={committee.statusHeadline || getCommitteeStatusText(committee.status)}
					icon={getCommitteeStatusIcon(committee.status)}
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
	{#if isListTile(tile)}
		<MissionControlListTile {tile} />
	{:else if isChartTile(tile)}
		<MissionControlChartTile {tile} {tick} />
	{:else if isStatTile(tile)}
		<MissionControlStatTile {tile} />
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
