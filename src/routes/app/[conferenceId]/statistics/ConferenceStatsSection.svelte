<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import AttendanceTrendChart from './AttendanceTrendChart.svelte';
	import type { TrendPoint } from './AttendanceTrendChart.svelte';
	import SpeakingActivityChart from './SpeakingActivityChart.svelte';
	import type { TimelineBucket } from './SpeakingActivityChart.svelte';
	import { getCountryNameFromCode } from '$lib/utils/nationTranslationHelper.svelte';

	interface Props {
		conferenceId: string;
	}
	let { conferenceId }: Props = $props();

	const raw = await client.query.conferenceStats({
		__args: { conferenceId },
		speakingLeaderboard: {
			representationId: true,
			representationName: true,
			alpha2Code: true,
			regionalGroup: true,
			representationType: true,
			totalSeconds: true,
			speechCount: true,
			commentCount: true
		},
		commentLeaderboard: {
			representationId: true,
			representationName: true,
			alpha2Code: true,
			representationType: true,
			commentCount: true,
			speechCount: true,
			totalSeconds: true
		},
		nsaLeaderboard: {
			representationId: true,
			representationName: true,
			alpha2Code: true,
			representationType: true,
			totalSeconds: true,
			speechCount: true,
			commentCount: true
		},
		speakingByRegion: {
			group: true,
			totalSeconds: true,
			delegationCount: true,
			speechCount: true
		},
		committeeActivity: {
			committeeId: true,
			committeeName: true,
			committeeAbbreviation: true,
			totalSpeakingSeconds: true,
			speechCount: true,
			voteCount: true
		},
		speakingFairness: {
			gini: true,
			stdDevSeconds: true
		},
		mostContrarian: {
			representationId: true,
			representationName: true,
			alpha2Code: true,
			contraryVotes: true,
			totalVotes: true
		},
		votingAlignment: {
			representation1Id: true,
			representation1Name: true,
			representation1Alpha2Code: true,
			representation2Id: true,
			representation2Name: true,
			representation2Alpha2Code: true,
			agreementRate: true,
			votesCompared: true
		},
		amendmentSuccessRate: {
			representationId: true,
			representationName: true,
			alpha2Code: true,
			total: true,
			accepted: true
		},
		paperSponsorLeaderboard: {
			representationId: true,
			representationName: true,
			alpha2Code: true,
			sponsorships: true
		},
		attendanceTrend: {
			date: true,
			uniqueUsersPresent: true
		},
		speakingTimeline: {
			bucket: true,
			totalSeconds: true
		}
	});

	// Cast away generated function types — at runtime these are plain arrays/objects
	type SpeakingRow = {
		representationId: string;
		representationName: string | null;
		alpha2Code: string | null;
		regionalGroup?: string | null;
		representationType?: string | null;
		totalSeconds: number;
		speechCount: number;
		commentCount: number;
	};
	type RegionRow = {
		group: string;
		totalSeconds: number;
		delegationCount: number;
		speechCount: number;
	};
	type CommitteeRow = {
		committeeId: string;
		committeeName: string;
		committeeAbbreviation: string;
		totalSpeakingSeconds: number;
		speechCount: number;
		voteCount: number;
	};
	type FairnessData = { gini: number; stdDevSeconds: number };
	type ContrarianRow = {
		representationId: string;
		representationName: string | null;
		alpha2Code: string | null;
		contraryVotes: number;
		totalVotes: number;
	};
	type AlignmentRow = {
		representation1Id: string;
		representation1Name: string | null;
		representation1Alpha2Code: string | null;
		representation2Id: string;
		representation2Name: string | null;
		representation2Alpha2Code: string | null;
		agreementRate: number;
		votesCompared: number;
	};
	type AmendmentRow = {
		representationId: string;
		representationName: string | null;
		alpha2Code: string | null;
		total: number;
		accepted: number;
	};
	type SponsorRow = {
		representationId: string;
		representationName: string | null;
		alpha2Code: string | null;
		sponsorships: number;
	};

	const stats = raw as
		| {
				speakingLeaderboard: SpeakingRow[];
				commentLeaderboard: SpeakingRow[];
				nsaLeaderboard: SpeakingRow[];
				speakingByRegion: RegionRow[];
				committeeActivity: CommitteeRow[];
				speakingFairness: FairnessData;
				mostContrarian: ContrarianRow[];
				votingAlignment: AlignmentRow[];
				amendmentSuccessRate: AmendmentRow[];
				paperSponsorLeaderboard: SponsorRow[];
				attendanceTrend: TrendPoint[];
				speakingTimeline: TimelineBucket[];
		  }
		| null
		| undefined;

	/** Country name from representation.name or alpha2 lookup; falls back to a short ID fragment. */
	function repLabel(name: string | null, alpha2: string | null, id: string): string {
		return name ?? getCountryNameFromCode(alpha2) ?? id.slice(0, 8);
	}

	const REGION_LABELS: Record<string, string> = {
		AFRICA: 'Africa',
		ASIA_PACIFIC: 'Asia-Pacific',
		EASTERN_EUROPE: 'Eastern Europe',
		LATIN_AMERICA_CARIBBEAN: 'Latin America & Caribbean',
		WESTERN_EUROPE_OTHERS: 'Western Europe & Others',
		OTHER: 'Other'
	};

	function regionLabel(group: string): string {
		return REGION_LABELS[group] ?? group;
	}

	function fmtTime(s: number): string {
		if (s <= 0) return '0s';
		const h = Math.floor(s / 3600);
		const min = Math.floor((s % 3600) / 60);
		if (h > 0) return `${h}h ${String(min).padStart(2, '0')}m`;
		return `${min}m ${String(s % 60).padStart(2, '0')}s`;
	}

	function pct(n: number, d: number): string {
		return d > 0 ? `${Math.round((n / d) * 100)}%` : '—';
	}

	type LeaderboardMode = 'speaking' | 'comments';
	let leaderboardMode = $state<LeaderboardMode>('speaking');

	const hasNsa = $derived((stats?.nsaLeaderboard?.length ?? 0) > 0);
	const hasTimeline = $derived((stats?.speakingTimeline?.length ?? 0) > 0);
	const hasVoting = $derived(
		(stats?.mostContrarian?.length ?? 0) > 0 || (stats?.votingAlignment?.length ?? 0) > 0
	);
	const hasAmendments = $derived((stats?.amendmentSuccessRate?.length ?? 0) > 0);
	const hasPapers = $derived((stats?.paperSponsorLeaderboard?.length ?? 0) > 0);
	const hasTrend = $derived((stats?.attendanceTrend?.length ?? 0) > 0);
</script>

{#if stats}
	<!-- ── Speaking Activity Timeline ────────────────────────────── -->
	{#if hasTimeline}
		<BasicCard title="Conference Speaking Activity">
			<SpeakingActivityChart buckets={stats.speakingTimeline ?? []} />
		</BasicCard>
	{/if}

	<!-- ── Delegation Leaderboard (speaking / comments toggle) ───── -->
	{#if (stats.speakingLeaderboard?.length ?? 0) > 0}
		<BasicCard
			title={leaderboardMode === 'speaking'
				? m.delegationSpeakingLeaderboard()
				: m.commentLeaderboard()}
		>
			<div class="mb-4 flex items-center gap-2">
				<div class="join">
					<button
						class="join-item btn btn-sm {leaderboardMode === 'speaking'
							? 'btn-primary'
							: 'btn-ghost'}"
						onclick={() => (leaderboardMode = 'speaking')}
					>
						<i class="fa-solid fa-microphone"></i>
						{m.formalSpeeches()}
					</button>
					<button
						class="join-item btn btn-sm {leaderboardMode === 'comments'
							? 'btn-primary'
							: 'btn-ghost'}"
						onclick={() => (leaderboardMode = 'comments')}
					>
						<i class="fa-solid fa-comment-dots"></i>
						{m.commentInterventions()}
					</button>
				</div>
			</div>

			{#if leaderboardMode === 'speaking'}
				<table class="table table-sm w-full">
					<thead>
						<tr>
							<th class="w-8">#</th>
							<th>{m.delegation()}</th>
							<th class="text-right">{m.totalSpeakingTime()}</th>
							<th class="text-right">{m.formalSpeeches()}</th>
							<th class="text-right">{m.commentInterventions()}</th>
						</tr>
					</thead>
					<tbody>
						{#each (stats.speakingLeaderboard ?? []).slice(0, 20) as row, i}
							<tr>
								<td class="text-base-content/40 tabular-nums">{i + 1}</td>
								<td>
									<div class="flex items-center gap-2">
										<Flag size="xs" representation={{ alpha2Code: row.alpha2Code }} />
										<span class="text-sm"
											>{repLabel(
												row.representationName,
												row.alpha2Code,
												row.representationId
											)}</span
										>
									</div>
								</td>
								<td class="text-right font-mono text-sm tabular-nums"
									>{fmtTime(row.totalSeconds)}</td
								>
								<td class="text-right tabular-nums">{row.speechCount}</td>
								<td class="text-right tabular-nums">{row.commentCount}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<table class="table table-sm w-full">
					<thead>
						<tr>
							<th class="w-8">#</th>
							<th>{m.delegation()}</th>
							<th class="text-right">{m.commentInterventions()}</th>
							<th class="text-right">{m.totalSpeakingTime()}</th>
						</tr>
					</thead>
					<tbody>
						{#each (stats.commentLeaderboard ?? [])
							.filter((r) => r.commentCount > 0)
							.slice(0, 20) as row, i}
							<tr>
								<td class="text-base-content/40 tabular-nums">{i + 1}</td>
								<td>
									<div class="flex items-center gap-2">
										<Flag size="xs" representation={{ alpha2Code: row.alpha2Code }} />
										<span class="text-sm"
											>{repLabel(
												row.representationName,
												row.alpha2Code,
												row.representationId
											)}</span
										>
									</div>
								</td>
								<td class="text-right tabular-nums">{row.commentCount}</td>
								<td class="text-right font-mono text-sm tabular-nums"
									>{fmtTime(row.totalSeconds)}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</BasicCard>
	{/if}

	<!-- ── NSA Activity ─────────────────────────────────────────── -->
	{#if hasNsa}
		<BasicCard title="Non-State Actor Activity">
			<div class="overflow-x-auto">
				<table class="table table-sm w-full">
					<thead>
						<tr>
							<th>#</th>
							<th>Organization</th>
							<th class="text-right">{m.totalSpeakingTime()}</th>
							<th class="text-right">{m.formalSpeeches()}</th>
							<th class="text-right">{m.commentInterventions()}</th>
						</tr>
					</thead>
					<tbody>
						{#each (stats.nsaLeaderboard ?? []).slice(0, 15) as row, i}
							<tr>
								<td class="text-base-content/40 tabular-nums">{i + 1}</td>
								<td class="truncate text-sm"
									>{repLabel(row.representationName, row.alpha2Code, row.representationId)}</td
								>
								<td class="text-right font-mono text-sm tabular-nums"
									>{fmtTime(row.totalSeconds)}</td
								>
								<td class="text-right tabular-nums">{row.speechCount}</td>
								<td class="text-right tabular-nums">{row.commentCount}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</BasicCard>
	{/if}

	<!-- ── Speaking Fairness + By Region ────────────────────────── -->
	<div class="grid items-stretch gap-4 lg:grid-cols-5">
		{#if (stats.speakingByRegion?.length ?? 0) > 0}
			<div class="lg:col-span-3">
				<BasicCard title={m.speakingByRegion()} className="h-full">
					<div class="overflow-x-auto">
						<table class="table table-sm w-full">
							<thead>
								<tr>
									<th>Region</th>
									<th class="text-right">{m.totalSpeakingTime()}</th>
									<th class="text-right">Delegations</th>
									<th class="text-right">{m.formalSpeeches()}</th>
								</tr>
							</thead>
							<tbody>
								{#each stats.speakingByRegion ?? [] as row}
									<tr>
										<td class="text-sm">{regionLabel(row.group)}</td>
										<td class="text-right font-mono text-sm tabular-nums"
											>{fmtTime(row.totalSeconds)}</td
										>
										<td class="text-right tabular-nums">{row.delegationCount}</td>
										<td class="text-right tabular-nums">{row.speechCount}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</BasicCard>
			</div>
		{/if}

		<div class="lg:col-span-2">
			<BasicCard title={m.speakingDistributionFairness()} className="h-full">
				<div class="flex flex-col gap-3 py-2">
					<div class="flex items-start justify-between gap-4">
						<div>
							<p class="text-base-content/60 text-sm">{m.giniCoefficient()}</p>
							<p class="font-mono text-3xl font-bold">
								{(stats.speakingFairness?.gini ?? 0).toFixed(3)}
							</p>
						</div>
						<div class="text-right shrink-0">
							<p class="text-base-content/60 text-sm">Std. deviation</p>
							<p class="font-mono text-3xl font-bold">
								{fmtTime(stats.speakingFairness?.stdDevSeconds ?? 0)}
							</p>
						</div>
					</div>
					<p class="text-base-content/40 text-xs">
						The Gini coefficient measures speaking-time inequality across all delegations — like an
						economic inequality index, but for floor time.
						<span class="font-medium">0</span> means every delegation spoke for exactly the same
						amount of time;
						<span class="font-medium">1</span> means a single delegation took all the floor time. A value
						below 0.4 is generally considered healthy debate participation.
					</p>
				</div>
			</BasicCard>
		</div>
	</div>

	<!-- ── Committee Activity ────────────────────────────────────── -->
	{#if (stats.committeeActivity?.length ?? 0) > 0}
		<BasicCard title={m.committeeActivityStats()}>
			<div class="overflow-x-auto">
				<table class="table table-sm w-full">
					<thead>
						<tr>
							<th>Committee</th>
							<th class="text-right">{m.totalSpeakingTime()}</th>
							<th class="text-right">{m.formalSpeeches()}</th>
							<th class="text-right">Voting sessions</th>
						</tr>
					</thead>
					<tbody>
						{#each (stats.committeeActivity ?? []).sort((a, b) => b.totalSpeakingSeconds - a.totalSpeakingSeconds) as row}
							<tr>
								<td>
									<span class="font-medium">{row.committeeAbbreviation}</span>
									<span class="text-base-content/40 ml-1 text-xs">{row.committeeName}</span>
								</td>
								<td class="text-right font-mono text-sm tabular-nums"
									>{fmtTime(row.totalSpeakingSeconds)}</td
								>
								<td class="text-right tabular-nums">{row.speechCount}</td>
								<td class="text-right tabular-nums">{row.voteCount}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</BasicCard>
	{/if}

	<!-- ── Voting ────────────────────────────────────────────────── -->
	{#if hasVoting}
		<div class="grid gap-4 lg:grid-cols-2">
			{#if (stats.mostContrarian?.length ?? 0) > 0}
				<BasicCard title={m.mostContrarianVoters()}>
					<div class="overflow-x-auto">
						<table class="table table-sm w-full">
							<thead>
								<tr>
									<th>#</th>
									<th>{m.delegation()}</th>
									<th class="text-right">{m.contraryVotes()}</th>
									<th class="text-right">Rate</th>
								</tr>
							</thead>
							<tbody>
								{#each (stats.mostContrarian ?? []).slice(0, 10) as row, i}
									<tr>
										<td class="text-base-content/40 tabular-nums">{i + 1}</td>
										<td>
											<div class="flex items-center gap-2">
												<Flag size="xs" representation={{ alpha2Code: row.alpha2Code }} />
												<span class="truncate text-sm"
													>{repLabel(
														row.representationName,
														row.alpha2Code,
														row.representationId
													)}</span
												>
											</div>
										</td>
										<td class="text-right tabular-nums">{row.contraryVotes}</td>
										<td class="text-right tabular-nums">{pct(row.contraryVotes, row.totalVotes)}</td
										>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</BasicCard>
			{/if}

			{#if (stats.votingAlignment?.length ?? 0) > 0}
				<BasicCard title={m.votingAlignmentLeaderboard()}>
					<div class="overflow-x-auto">
						<table class="table table-sm w-full">
							<thead>
								<tr>
									<th>#</th>
									<th>Pair</th>
									<th class="text-right">Agreement</th>
									<th class="text-right">Votes</th>
								</tr>
							</thead>
							<tbody>
								{#each (stats.votingAlignment ?? []).slice(0, 10) as row, i}
									<tr>
										<td class="text-base-content/40 tabular-nums">{i + 1}</td>
										<td class="text-sm">
											{repLabel(
												row.representation1Name,
												row.representation1Alpha2Code,
												row.representation1Id
											)}
											<span class="text-base-content/30 mx-1">×</span>
											{repLabel(
												row.representation2Name,
												row.representation2Alpha2Code,
												row.representation2Id
											)}
										</td>
										<td class="text-right">
											<span class="font-mono tabular-nums"
												>{Math.round(row.agreementRate * 100)}%</span
											>
										</td>
										<td class="text-right tabular-nums">{row.votesCompared}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</BasicCard>
			{/if}
		</div>
	{/if}

	<!-- ── Resolutions ───────────────────────────────────────────── -->
	{#if hasAmendments || hasPapers}
		<div class="grid gap-4 lg:grid-cols-2">
			{#if hasAmendments}
				<BasicCard title={m.amendmentSuccessRate()}>
					<div class="overflow-x-auto">
						<table class="table table-sm w-full">
							<thead>
								<tr>
									<th>{m.delegation()}</th>
									<th class="text-right">Proposed</th>
									<th class="text-right">{m.amendmentStatusAccepted()}</th>
									<th class="text-right">Rate</th>
								</tr>
							</thead>
							<tbody>
								{#each (stats.amendmentSuccessRate ?? []).slice(0, 15) as row}
									<tr>
										<td>
											<div class="flex items-center gap-2">
												<Flag size="xs" representation={{ alpha2Code: row.alpha2Code }} />
												<span class="truncate text-sm"
													>{repLabel(
														row.representationName,
														row.alpha2Code,
														row.representationId
													)}</span
												>
											</div>
										</td>
										<td class="text-right tabular-nums">{row.total}</td>
										<td class="text-right tabular-nums text-success">{row.accepted}</td>
										<td class="text-right tabular-nums">{pct(row.accepted, row.total)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</BasicCard>
			{/if}

			{#if hasPapers}
				<BasicCard title={m.topPaperSponsors()}>
					<div class="overflow-x-auto">
						<table class="table table-sm w-full">
							<thead>
								<tr>
									<th>#</th>
									<th>{m.delegation()}</th>
									<th class="text-right">{m.papersSponsored()}</th>
								</tr>
							</thead>
							<tbody>
								{#each (stats.paperSponsorLeaderboard ?? []).slice(0, 15) as row, i}
									<tr>
										<td class="text-base-content/40 tabular-nums">{i + 1}</td>
										<td>
											<div class="flex items-center gap-2">
												<Flag size="xs" representation={{ alpha2Code: row.alpha2Code }} />
												<span class="truncate text-sm"
													>{repLabel(
														row.representationName,
														row.alpha2Code,
														row.representationId
													)}</span
												>
											</div>
										</td>
										<td class="text-right tabular-nums">{row.sponsorships}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</BasicCard>
			{/if}
		</div>
	{/if}

	<!-- ── Attendance Trend ──────────────────────────────────────── -->
	{#if hasTrend}
		<BasicCard title={m.attendanceTrend()}>
			<AttendanceTrendChart points={stats.attendanceTrend ?? []} />
		</BasicCard>
	{/if}
{/if}
