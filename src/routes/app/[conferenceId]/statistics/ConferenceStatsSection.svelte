<script lang="ts">
	import { client } from '#lib/api/rumbleClient/client';
	import { m } from '#lib/paraglide/messages';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import AttendanceTrendChart from './AttendanceTrendChart.svelte';
	import type { TrendPoint } from './AttendanceTrendChart.svelte';
	import SpeakingActivityChart from './SpeakingActivityChart.svelte';
	import type { TimelineBucket } from './SpeakingActivityChart.svelte';
	import SpeakingLeaderboardCard from './SpeakingLeaderboardCard.svelte';
	import NsaActivityCard from './NsaActivityCard.svelte';
	import FairnessSection from './FairnessSection.svelte';
	import CommitteeActivityCard from './CommitteeActivityCard.svelte';
	import VotingSection from './VotingSection.svelte';
	import PapersSection from './PapersSection.svelte';
	import {
		hasRows,
		type AlignmentRow,
		type AmendmentRow,
		type CommitteeRow,
		type ContrarianRow,
		type FairnessData,
		type RegionRow,
		type SponsorRow,
		type SpeakingRow
	} from './conferenceStats';

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

	const hasTimeline = $derived(hasRows(stats?.speakingTimeline));
	const hasVoting = $derived(hasRows(stats?.mostContrarian) || hasRows(stats?.votingAlignment));
	const hasPaperStats = $derived(
		hasRows(stats?.amendmentSuccessRate) || hasRows(stats?.paperSponsorLeaderboard)
	);
</script>

{#if stats}
	{#if hasTimeline}
		<BasicCard title="Conference Speaking Activity" data-tour="statistics.timeline">
			<SpeakingActivityChart buckets={stats.speakingTimeline ?? []} />
		</BasicCard>
	{/if}

	{#if hasRows(stats.speakingLeaderboard)}
		<SpeakingLeaderboardCard
			speaking={stats.speakingLeaderboard ?? []}
			comments={stats.commentLeaderboard ?? []}
		/>
	{/if}

	{#if hasRows(stats.nsaLeaderboard)}
		<NsaActivityCard rows={stats.nsaLeaderboard ?? []} />
	{/if}

	<FairnessSection regions={stats.speakingByRegion} fairness={stats.speakingFairness} />

	{#if hasRows(stats.committeeActivity)}
		<CommitteeActivityCard rows={stats.committeeActivity ?? []} />
	{/if}

	{#if hasVoting}
		<VotingSection contrarian={stats.mostContrarian} alignment={stats.votingAlignment} />
	{/if}

	{#if hasPaperStats}
		<PapersSection amendments={stats.amendmentSuccessRate} sponsors={stats.paperSponsorLeaderboard} />
	{/if}

	{#if hasRows(stats.attendanceTrend)}
		<BasicCard title={m.attendanceTrend()} data-tour="statistics.attendance">
			<AttendanceTrendChart points={stats.attendanceTrend ?? []} />
		</BasicCard>
	{/if}
{/if}
