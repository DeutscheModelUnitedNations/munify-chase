<script lang="ts">
	import { type Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { client } from '#lib/api/rumbleClient/client';
	import ChairNavbar from './ChairNavbar.svelte';
	import * as m from '#lib/paraglide/messages';
	import StatusChangerModal from '#lib/components/committee/StatusChangerModal.svelte';
	import StateOfDebateChangerModal from '#lib/components/committee/StateOfDebateChangerModal.svelte';
	import dayjs from 'dayjs';
	import toast from 'svelte-french-toast';
	import { getCommitteeStatusText } from '#lib/utils/committeeStatus';
	import BellIcon from '#lib/components/toast/BellIcon.svelte';
	import RequestNotificationToast from '#lib/components/requests/RequestNotificationToast.svelte';
	import { notificationRequesterLabel } from './requesters';
	import { alertTick, type AlertState, type ChairAlert } from './chairAlerts';
	import { syncRequestToasts } from './requestToasts';
	import ChairDock from './ChairDock.svelte';
	import { speakersListSelection } from '../../selections';
	import { getServerTime } from '#lib/state/serverTime.svelte';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import VotingModal from '#lib/components/voting/VotingModal.svelte';
	import AdoptionConfetti from '#lib/components/AdoptionConfetti.svelte';
	import { openPresentationWindow } from '#lib/state/presentationWindow.svelte';
	import { isLocalConferenceActive } from '#lib/state/localDemo.svelte';
	import { SvelteSet, SvelteMap } from 'svelte/reactivity';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const committeeId = page.params.committeeId!;
	const conferenceId = page.params.conferenceId!;

	const committee = await client.liveQuery.committee({
		__args: { id: committeeId },
		id: true,
		abbreviation: true,
		name: true,
		activeDraftResolutionId: true,
		stateOfDebate: true,
		status: true,
		statusHeadline: true,
		statusUntil: true,
		totalPresent: true,
		simpleMajority: true,
		twoThirdsMajority: true,
		whiteboardContent: true,
		allowDelegationsToAddThemselvesToSpeakersList: true,
		allowRequests: true,
		activeAgendaItem: {
			id: true,
			title: true,
			speakersList: { ...speakersListSelection, phase: true }
		},
		agendaItems: {
			id: true,
			title: true
		},
		members: {
			id: true,
			present: true,
			representation: {
				id: true,
				type: true,
				name: true,
				regionalGroup: true,
				alpha2Code: true,
				alpha3Code: true,
				icon: true
			}
		},
		lastResolutionAdoptionDate: true,
		conference: {
			id: true,
			title: true,
			hasModeratedCaucus: true,
			uniqueConferenceMembers: {
				id: true,
				representation: {
					id: true,
					type: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					icon: true
				}
			}
		}
	});

	// Persistent notifications for incoming requests - kept separate from the
	// `committee` query above so it can be watched in its own effect below
	// regardless of which chair tab is open.
	const pendingRequestsForNotifications = await client.liveQuery.requests({
		__args: {
			where: { committeeId: { eq: committeeId }, status: 'PENDING' },
			orderBy: { createdAt: 'asc' }
		},
		id: true,
		requestType: { name: true, icon: true },
		conferenceUser: {
			name: true,
			userEmail: true,
			committeeMember: { id: true, representation: { name: true, alpha3Code: true } },
			conferenceMember: { id: true, representation: { name: true, alpha3Code: true } }
		},
		// Set instead of conferenceUser on requests the chairs added themselves
		committeeMember: { id: true, representation: { name: true, alpha3Code: true } },
		conferenceMember: { id: true, representation: { name: true, alpha3Code: true } }
	});

	const dockItems = $derived([
		{
			icon: 'gear-six',
			label: () => m.setup(),
			href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/setup', {
				conferenceId,
				committeeId
			}),
			key: 'setup'
		},
		{
			icon: 'users',
			label: () => m.presence(),
			href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/presence', {
				conferenceId,
				committeeId
			}),
			key: 'presence'
		},
		{
			icon: 'lectern',
			label: () => m.speakersList(),
			href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/speakers-list', {
				conferenceId,
				committeeId
			}),
			key: 'speakers-list'
		},
		{
			icon: 'box-arrow-down',
			label: () => m.voting(),
			href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/voting', {
				conferenceId,
				committeeId
			}),
			key: 'voting'
		},
		// Requests are opt-in per committee (toggled on the setup page) - keep the tab
		// out of the dock entirely when off rather than showing an always-empty queue.
		...(committee?.allowRequests
			? [
					{
						icon: 'hand',
						label: () => m.requests(),
						href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/requests', {
							conferenceId,
							committeeId
						}),
						key: 'requests'
					}
				]
			: []),
		// The resolutions feature (drafting, clause votes, amendments) has no offline
		// equivalent — hide it entirely for the offline demo conference.
		...(isLocalConferenceActive()
			? []
			: [
					{
						icon: 'file-text',
						label: () => m.resolutions(),
						href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions', {
							conferenceId,
							committeeId
						}),
						key: 'resolutions'
					}
				])
	]);

	function isActive(key: string) {
		return page.route.id?.includes(key) ?? false;
	}

	function openPresentation() {
		openPresentationWindow(
			resolve('/app/[conferenceId]/[committeeId]/(presentation)', {
				conferenceId,
				committeeId
			}),
			committeeId
		);
	}

	// Shortcuts follow the current dockItems order (rather than fixed routes) so the ⌥N
	// shown on each dock icon always matches what alt+N actually navigates to, even though
	// the "requests" and "resolutions" entries are conditionally present.
	registerCommands(() => [
		...dockItems.map((item, i) => ({
			id: `navigation.chair.${item.key}`,
			title: item.label,
			group: 'navigation' as const,
			icon: item.icon,
			shortcut: `alt+${i + 1}`,
			visible: () => !isActive(item.key),
			run: () => goto(item.href)
		})),
		{
			id: 'navigation.chair.active-draft',
			title: m.activeDraftResolution,
			group: 'navigation',
			icon: 'note-pencil',
			visible: () => !!committee?.activeDraftResolutionId && !isLocalConferenceActive(),
			run: () =>
				goto(
					resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions/[paperId]', {
						conferenceId,
						committeeId,
						paperId: committee!.activeDraftResolutionId!
					})
				)
		},
		{
			id: 'chair.presentation',
			title: m.openPresentation,
			group: 'global',
			icon: 'presentation',
			shortcut: 'alt+p',
			run: openPresentation
		}
	]);

	let speakersList = $derived(
		committee?.activeAgendaItem?.speakersList.find((item) => item.type === 'SPEAKERS_LIST')
	);
	let commentList = $derived(
		committee?.activeAgendaItem?.speakersList.find((item) => item.type === 'COMMENT_LIST')
	);

	let alertState: AlertState = { status: false, speakersList: false, commentList: false };

	const alertToasts: Record<ChairAlert, () => void> = {
		statusExpired: () =>
			toast.error(
				m.committeeStatusExpired({
					status: getCommitteeStatusText(committee!.status, committee!.statusHeadline)
				}),
				{ icon: BellIcon, duration: 10000 }
			),
		listOvertime: () => toast.error(m.speakersListOvertime(), { icon: BellIcon })
	};

	function checkTimers(c: NonNullable<typeof committee>) {
		const now = getServerTime();
		const tick = alertTick({
			state: alertState,
			statusExpired: dayjs(c.statusUntil).diff(now) < 0,
			lists: (c.activeAgendaItem?.speakersList ?? []).map((list) => ({
				type: list.type,
				overtime: dayjs(list.startTimestamp).diff(now, 'seconds') + list.timeLeft < 0
			}))
		});
		alertState = tick.state;
		for (const alert of tick.alerts) alertToasts[alert]();
	}

	$effect(() => {
		// Toast Effect
		if (!committee) return;
		const c = committee;
		const interval = setInterval(() => checkTimers(c), 1000);
		return () => clearInterval(interval);
	});

	// Persistent per-request notifications. Every id we've ever toasted for is
	// kept in `notifiedRequestIds` so a manual dismiss never gets re-shown; the
	// open toast for a request is additionally tracked in `openRequestToastIds`
	// so it can be auto-dismissed once the request is resolved/withdrawn (by
	// this chair or another) without requiring the chair to close it by hand.
	const notifiedRequestIds = new SvelteSet<string>();
	const openRequestToastIds = new SvelteMap<string, string>();
	let requestNotificationsInitialized = false;

	type PendingRequest = NonNullable<typeof pendingRequestsForNotifications>[number];

	function showRequestToast(req: PendingRequest) {
		notifiedRequestIds.add(req.id);
		// svelte-french-toast's `Renderable` type still expects a Svelte 4 class
		// component; it renders Svelte 5 components (like this one) fine at runtime.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const toastId = toast(RequestNotificationToast as any, {
			icon: BellIcon,
			duration: Infinity,
			props: {
				requestTypeName: req.requestType?.name ?? '',
				requesterLabel: notificationRequesterLabel(req),
				conferenceId,
				committeeId
			}
		});
		openRequestToastIds.set(req.id, toastId);
	}

	$effect(() => {
		requestNotificationsInitialized = syncRequestToasts({
			pending: pendingRequestsForNotifications ?? [],
			notified: notifiedRequestIds,
			open: openRequestToastIds,
			initialized: requestNotificationsInitialized,
			show: showRequestToast,
			dismiss: (toastId) => toast.dismiss(toastId)
		});
	});
</script>

<svelte:head>
	<title>{committee?.abbreviation ?? 'N/A'} {m.chairControls()} - MUNify CHASE</title>
</svelte:head>

<ChairNavbar
	title={committee?.abbreviation}
	conferenceTitle={committee?.conference?.title}
	{speakersList}
	{commentList}
/>

<main id="main-content" tabindex="-1" class="pb-16">
	{@render children()}
</main>

<StatusChangerModal
	{committeeId}
	oldStatus={committee?.status}
	oldUntil={committee?.statusUntil}
	oldCustomName={committee?.statusHeadline}
/>

<StateOfDebateChangerModal {committeeId} oldStateOfDebate={committee?.stateOfDebate} />

{#if committee}
	<VotingModal {committee} />
{/if}

<AdoptionConfetti
	lastAdoptionDate={committee?.lastResolutionAdoptionDate}
	confettiDurationSec={45}
/>

<ChairDock
	items={dockItems}
	{conferenceId}
	{committeeId}
	activeDraftResolutionId={isLocalConferenceActive() ? null : committee?.activeDraftResolutionId}
	pendingRequests={pendingRequestsForNotifications?.length ?? 0}
/>
