<script lang="ts">
	import { type Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';
	import ChairNavbar from './ChairNavbar.svelte';
	import * as m from '$lib/paraglide/messages';
	import StatusChangerModal from '$lib/components/committee/StatusChangerModal.svelte';
	import StateOfDebateChangerModal from '$lib/components/committee/StateOfDebateChangerModal.svelte';
	import dayjs from 'dayjs';
	import toast from 'svelte-french-toast';
	import { getCommitteeStatusText } from '$lib/utils/committeeStatus';
	import BellIcon from '$lib/components/toast/BellIcon.svelte';
	import RequestNotificationToast from '$lib/components/requests/RequestNotificationToast.svelte';
	import { getServerTime } from '$lib/state/serverTime.svelte';
	import hotkeys from 'hotkeys-js';
	import VotingModal from '$lib/components/voting/VotingModal.svelte';
	import AdoptionConfetti from '$lib/components/AdoptionConfetti.svelte';
	import { openPresentationWindow } from '$lib/state/presentationWindow.svelte';
	import { isLocalConferenceActive } from '$lib/state/localDemo.svelte';
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
			speakersList: {
				id: true,
				type: true,
				isClosed: true,
				speakingTime: true,
				startTimestamp: true,
				timeLeft: true,
				phase: true,
				speakers: {
					id: true,
					position: true,
					overwriteName: true,
					committeeMember: {
						id: true,
						representation: {
							id: true,
							type: true,
							name: true,
							regionalGroup: true,
							alpha2Code: true,
							alpha3Code: true,
							faIcon: true
						},
						present: true
					},
					conferenceMember: {
						id: true,
						representation: {
							id: true,
							type: true,
							name: true,
							regionalGroup: true,
							alpha2Code: true,
							alpha3Code: true,
							faIcon: true
						}
					}
				}
			}
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
				faIcon: true
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
					faIcon: true
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
		requestType: { name: true, faIcon: true },
		conferenceUser: {
			committeeMember: { representation: { name: true } },
			conferenceMember: { representation: { name: true } }
		}
	});

	const dockItems = $derived([
		{
			icon: 'fa-gears',
			label: () => m.setup(),
			href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/setup', {
				conferenceId,
				committeeId
			}),
			key: 'setup'
		},
		{
			icon: 'fa-users',
			label: () => m.presence(),
			href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/presence', {
				conferenceId,
				committeeId
			}),
			key: 'presence'
		},
		{
			icon: 'fa-podium',
			label: () => m.speakersList(),
			href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/speakers-list', {
				conferenceId,
				committeeId
			}),
			key: 'speakers-list'
		},
		{
			icon: 'fa-box-ballot',
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
						icon: 'fa-hand',
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
						icon: 'fa-file-lines',
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

	// Bound to the current dockItems order (rather than fixed routes) so the ⌥N shown
	// on each dock icon always matches what alt+N actually navigates to, even though
	// the "requests" and "resolutions" entries are conditionally present.
	$effect(() => {
		const keys = dockItems.map((_, i) => `alt+${i + 1}`).join(', ');
		if (!keys) return;
		hotkeys(keys, (event, handler) => {
			event.preventDefault();
			const index = Number(handler.key.replace('alt+', '')) - 1;
			const item = dockItems[index];
			if (item) goto(item.href);
		});
		return () => hotkeys.unbind(keys);
	});

	let speakersList = $derived(
		committee?.activeAgendaItem?.speakersList.find((item) => item.type === 'SPEAKERS_LIST')
	);
	let commentList = $derived(
		committee?.activeAgendaItem?.speakersList.find((item) => item.type === 'COMMENT_LIST')
	);

	let committeeStatusExpiredAlerted = $state(false);
	let speakersListOvertimeAlerted = $state(false);
	let commentListOvertimeAlerted = $state(false);

	$effect(() => {
		// Toast Effect
		if (!committee) return;

		const interval = setInterval(() => {
			if (dayjs(committee.statusUntil).diff(getServerTime()) < 0) {
				if (!committeeStatusExpiredAlerted) {
					toast.error(
						m.committeeStatusExpired({
							status: getCommitteeStatusText(committee.status, committee.statusHeadline)
						}),
						{
							icon: BellIcon,
							duration: 10000
						}
					);
					committeeStatusExpiredAlerted = true;
				}
			} else {
				committeeStatusExpiredAlerted = false;
			}

			for (const speakersList of committee.activeAgendaItem?.speakersList ?? []) {
				const overtime =
					dayjs(speakersList.startTimestamp).diff(getServerTime(), 'seconds') +
						speakersList.timeLeft <
					0;

				//	XAND only fire if both are false. Both true can be ignored, case should not happen.
				if (overtime && speakersListOvertimeAlerted === commentListOvertimeAlerted) {
					toast.error(m.speakersListOvertime(), {
						icon: BellIcon
					});
					if (speakersList.type === 'SPEAKERS_LIST') {
						speakersListOvertimeAlerted = true;
					} else if (speakersList.type === 'COMMENT_LIST') {
						commentListOvertimeAlerted = true;
					}
				} else if (!overtime) {
					if (speakersList.type === 'SPEAKERS_LIST') {
						speakersListOvertimeAlerted = false;
					} else if (speakersList.type === 'COMMENT_LIST') {
						commentListOvertimeAlerted = false;
					}
				}
			}
		}, 1000);
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

	function requesterLabelForNotification(
		conferenceUser: NonNullable<
			NonNullable<typeof pendingRequestsForNotifications>[number]['conferenceUser']
		> | null
	) {
		const rep =
			conferenceUser?.committeeMember?.representation ??
			conferenceUser?.conferenceMember?.representation;
		return rep?.name ?? m.unknown();
	}

	$effect(() => {
		const list = pendingRequestsForNotifications ?? [];
		const currentIds = new Set(list.map((req) => req.id));

		if (!requestNotificationsInitialized) {
			// Don't retroactively toast for requests that were already pending
			// before this chair opened the committee.
			for (const id of currentIds) notifiedRequestIds.add(id);
			requestNotificationsInitialized = true;
			return;
		}

		for (const req of list) {
			if (notifiedRequestIds.has(req.id)) continue;
			notifiedRequestIds.add(req.id);
			// svelte-french-toast's `Renderable` type still expects a Svelte 4 class
			// component; it renders Svelte 5 components (like this one) fine at runtime.
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const toastId = toast(RequestNotificationToast as any, {
				icon: BellIcon,
				duration: Infinity,
				props: {
					requestTypeName: req.requestType?.name ?? '',
					requesterLabel: requesterLabelForNotification(req.conferenceUser),
					conferenceId,
					committeeId
				}
			});
			openRequestToastIds.set(req.id, toastId);
		}

		for (const [id, toastId] of openRequestToastIds) {
			if (!currentIds.has(id)) {
				toast.dismiss(toastId);
				openRequestToastIds.delete(id);
			}
		}
	});

	$effect(() => {
		hotkeys('alt+p', (event) => {
			event.preventDefault();
			openPresentationWindow(
				resolve('/app/[conferenceId]/[committeeId]/(presentation)', {
					conferenceId,
					committeeId
				}),
				committeeId
			);
		});
		return () => hotkeys.unbind('alt+p');
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

<div class="pb-16">
	{@render children()}
</div>

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

<!-- Bottom dock -->
<div class="dock dock-md lg:dock-lg md:justify-center md:gap-4">
	{#each dockItems as item, i (item.key)}
		<a
			href={item.href}
			class="group relative {isActive(item.key) &&
			!(
				item.key === 'resolutions' &&
				committee?.activeDraftResolutionId &&
				page.url.pathname.includes(committee.activeDraftResolutionId)
			)
				? 'dock-active'
				: ''}"
		>
			<span class="relative inline-flex">
				<i class="fa-duotone {item.icon} size-[1.2em]"></i>
				{#if item.key === 'requests' && (pendingRequestsForNotifications?.length ?? 0) > 0}
					<span class="absolute -top-1 -right-1 flex size-2.5">
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75"
						></span>
						<span class="relative inline-flex size-2.5 rounded-full bg-error"></span>
					</span>
				{/if}
			</span>
			<span class="dock-label">{item.label()}</span>
			<kbd
				class="kbd kbd-sm absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-base-100/80 px-2 py-1 z-10"
				>⌥{i + 1}</kbd
			>
		</a>
	{/each}
	{#if committee?.activeDraftResolutionId && !isLocalConferenceActive()}
		<a
			href={resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions/[paperId]', {
				conferenceId,
				committeeId,
				paperId: committee.activeDraftResolutionId
			})}
			class="group relative {page.url.pathname.includes(committee.activeDraftResolutionId)
				? 'dock-active'
				: ''}"
		>
			<i class="fa-duotone fa-file-pen size-[1.2em]"></i>
			<span class="dock-label">{m.activeDraftResolution()}</span>
		</a>
	{/if}
</div>
