import { m } from '$lib/paraglide/messages';
import type { Tour } from '$lib/tours/types';

/** Conference statistics page. Anchors live in PersonalStatsSection and ConferenceStatsSection. */
export const tour: Tour = {
	id: 'statistics',
	steps: [
		{
			title: () => m.tourStatisticsIntroTitle(),
			body: () => m.tourStatisticsIntroBody()
		},
		{
			anchor: 'statistics.personal',
			title: () => m.tourStatisticsPersonalTitle(),
			body: () => m.tourStatisticsPersonalBody(),
			side: 'bottom'
		},
		{
			anchor: 'statistics.timeline',
			title: () => m.tourStatisticsTimelineTitle(),
			body: () => m.tourStatisticsTimelineBody(),
			side: 'top'
		},
		{
			anchor: 'statistics.leaderboard',
			title: () => m.tourStatisticsLeaderboardTitle(),
			body: () => m.tourStatisticsLeaderboardBody(),
			side: 'top'
		},
		{
			anchor: 'statistics.fairness',
			title: () => m.tourStatisticsFairnessTitle(),
			body: () => m.tourStatisticsFairnessBody(),
			side: 'top'
		},
		{
			anchor: 'statistics.voting',
			title: () => m.tourStatisticsVotingTitle(),
			body: () => m.tourStatisticsVotingBody(),
			side: 'top'
		},
		{
			anchor: 'statistics.papers',
			title: () => m.tourStatisticsPapersTitle(),
			body: () => m.tourStatisticsPapersBody(),
			side: 'top'
		},
		{
			anchor: 'statistics.attendance',
			title: () => m.tourStatisticsAttendanceTitle(),
			body: () => m.tourStatisticsAttendanceBody(),
			side: 'top'
		}
	]
};
