<script lang="ts">
	import { onMount } from 'svelte';
	import MissionControlGrid, {
		type MissionControlConference
	} from '$lib/components/missionControl/MissionControlGrid.svelte';
	import type { InsightPulse } from '$lib/components/missionControl/insights';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
	import {
		buildConferenceNavItems,
		roleBadgeClassFor,
		roleLabelFor
	} from '$lib/components/navbar/conferenceNavItems';
	import { client } from '$lib/api/rumbleClient/client';
	import { page } from '$app/state';
	import AdoptionConfetti from '$lib/components/AdoptionConfetti.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import { getCurrentUser } from '$lib/state/currentUser.svelte';

	const currentUser = await getCurrentUser();
	const userId = currentUser.id ?? '';
	const userDisplayName =
		[currentUser.givenName, currentUser.familyName].filter(Boolean).join(' ').trim() ||
		currentUser.preferredUsername ||
		currentUser.email ||
		'';

	// Role check first — redirect participants before making the heavy conference query.
	const [conferenceUsersEarly, isGlobalAdmin] = await Promise.all([
		client.query.conferenceUsers({
			__args: {
				where: {
					conference: { id: { eq: page.params.conferenceId } },
					user: { id: { eq: userId } }
				}
			},
			id: true,
			conferenceUserType: true
		}),
		client.query.isGlobalAdmin()
	]);
	const earlyRole = conferenceUsersEarly?.[0]?.conferenceUserType;
	if (!isGlobalAdmin && earlyRole !== 'ADMIN' && earlyRole !== 'TEAM') {
		goto(
			resolve('/app/[conferenceId]/participant', {
				conferenceId: page.params.conferenceId!
			}),
			{ replaceState: true }
		);
	}

	const conference = await client.liveQuery.conference({
		__args: { id: page.params.conferenceId! },
		id: true,
		title: true,
		committees: {
			id: true,
			name: true,
			abbreviation: true,
			activeAgendaItem: {
				id: true,
				title: true,
				speakersList: {
					isClosed: true,
					startTimestamp: true,
					speakers: {
						id: true,
						position: true,
						overwriteName: true,
						committeeMember: {
							id: true,
							representation: {
								name: true,
								alpha2Code: true,
								alpha3Code: true,
								faIcon: true,
								type: true
							}
						},
						conferenceMember: {
							id: true,
							representation: {
								name: true,
								alpha2Code: true,
								alpha3Code: true,
								faIcon: true,
								type: true
							}
						}
					}
				}
			},
			status: true,
			statusHeadline: true,
			statusUntil: true,
			stateOfDebate: true,
			lastResolutionAdoptionDate: true,
			totalPresent: true,
			members: { id: true, present: true, representation: { type: true } },
			votingSessions: {
				__args: { where: { completedAt: { isNull: true } } },
				id: true,
				mode: true,
				voteName: true,
				createdAt: true
			}
		}
	});

	// Aggregate conference-wide "pulse" stats — not a live-subscribed field,
	// so we poll it on the same cadence as the insight-tile rotation.
	let pulse = $state<InsightPulse | null>(null);
	async function refreshPulse() {
		pulse = (await client.query.missionControlPulse({
			__args: { conferenceId: page.params.conferenceId! },
			heartbeat: {
				speechesToday: true,
				votesHeldToday: true,
				resolutionsAdoptedToday: true,
				debateSecondsToday: true
			},
			busiestCommittee: {
				committeeAbbreviation: true,
				committeeName: true,
				interventionCount: true
			},
			closestVote: {
				committeeAbbreviation: true,
				committeeName: true,
				voteName: true,
				votesPro: true,
				votesCon: true,
				margin: true
			},
			recentAdoptions: {
				committeeAbbreviation: true,
				committeeName: true,
				paperTitle: true,
				documentNumber: true,
				agendaItemTitle: true,
				adoptedAt: true
			},
			committeeActivityLeaderboard: {
				committeeAbbreviation: true,
				committeeName: true,
				totalSpeakingSeconds: true,
				speechCount: true,
				voteCount: true
			},
			speakingByRegion: {
				group: true,
				totalSeconds: true,
				delegationCount: true,
				speechCount: true
			},
			conferenceOverview: {
				totalDelegates: true,
				totalCommittees: true,
				totalSpeechesAllTime: true,
				totalResolutionsAdoptedAllTime: true
			},
			resolutionFunnel: {
				status: true,
				count: true
			},
			speakingByRepresentationType: {
				representationType: true,
				totalSeconds: true,
				delegationCount: true
			},
			longestSpeechToday: {
				committeeAbbreviation: true,
				committeeName: true,
				durationSeconds: true
			},
			amendmentActivity: {
				status: true,
				count: true
			},
			voteOutcomesToday: {
				outcome: true,
				count: true
			},
			papersAwaitingVote: true,
			papersPerCommittee: {
				committeeAbbreviation: true,
				committeeName: true,
				paperCount: true
			}
		})) as unknown as InsightPulse | null;
	}
	onMount(() => {
		refreshPulse();
		const id = setInterval(refreshPulse, 60_000);
		return () => clearInterval(id);
	});

	const adoptingCommittee = $derived(
		(conference?.committees ?? [])
			.filter((c) => c.lastResolutionAdoptionDate != null)
			.sort(
				(a, b) =>
					new Date(b.lastResolutionAdoptionDate!).getTime() -
					new Date(a.lastResolutionAdoptionDate!).getTime()
			)[0] ?? null
	);
	const mostRecentAdoption = $derived(adoptingCommittee?.lastResolutionAdoptionDate ?? null);

	const conferenceUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: { eq: page.params.conferenceId } },
				user: { id: { eq: userId } }
			}
		},
		id: true,
		conferenceUserType: true
	});

	let currentUserRole = $derived(conferenceUsers?.[0]);
	let role = $derived(currentUserRole?.conferenceUserType);

	let menubarItems = $derived(
		buildConferenceNavItems({
			role,
			conferenceId: page.params.conferenceId!,
			activeRouteId: page.route.id,
			activePathname: page.url.pathname,
			isGlobalAdmin: !!isGlobalAdmin
		})
	);
</script>

<svelte:head>
	<title>{m.missionControl()} - MUNify CHASE</title>
</svelte:head>

<div class="navbar bg-base-100 shadow-sm">
	<h1 class=" ml-4 flex-1 text-3xl font-bold">{m.missionControl()}</h1>
	<div class="flex-none">
		<CurrentTime />
	</div>
	<div class="flex-none">
		<NavbarBurgerMenu
			items={menubarItems}
			user={{
				name: userDisplayName,
				email: currentUser.email ?? undefined,
				givenName: currentUser.givenName ?? undefined,
				familyName: currentUser.familyName ?? undefined
			}}
			roleLabel={roleLabelFor(role)}
			roleBadgeClass={roleBadgeClassFor(role)}
			conferenceTitle={conference?.title}
			conferenceId={page.params.conferenceId}
			committees={role === 'ADMIN' || role === 'TEAM' ? (conference?.committees ?? []) : []}
			dashboardHref="/app"
			signOutHref="/logout"
		/>
	</div>
</div>

<AdoptionConfetti
	lastAdoptionDate={mostRecentAdoption}
	confettiDurationSec={45}
	showBanner
	committeeName={adoptingCommittee?.name ?? adoptingCommittee?.abbreviation ?? ''}
	agendaItem={adoptingCommittee?.activeAgendaItem?.title ?? ''}
/>

{#if conference}
	<MissionControlGrid conference={conference as unknown as MissionControlConference} {pulse} />
{/if}
