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
	import { getServerTime } from '$lib/state/serverTime.svelte';
	import hotkeys from 'hotkeys-js';
	import VotingModal from '$lib/components/voting/VotingModal.svelte';
	import { openPresentationWindow } from '$lib/state/presentationWindow.svelte';

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
		{
			icon: 'fa-file-lines',
			label: () => m.resolutions(),
			href: resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions', {
				conferenceId,
				committeeId
			}),
			key: 'resolutions'
		}
	]);

	function isActive(key: string) {
		return page.route.id?.includes(key) ?? false;
	}

	$effect(() => {
		hotkeys('alt+1, alt+2, alt+3, alt+4, alt+5', (event, handler) => {
			event.preventDefault();
			switch (handler.key) {
				case 'alt+1':
					goto(
						resolve('/app/[conferenceId]/[committeeId]/(chairs)/setup', {
							conferenceId,
							committeeId
						})
					);
					break;
				case 'alt+2':
					goto(
						resolve('/app/[conferenceId]/[committeeId]/(chairs)/presence', {
							conferenceId,
							committeeId
						})
					);
					break;
				case 'alt+3':
					goto(
						resolve('/app/[conferenceId]/[committeeId]/(chairs)/speakers-list', {
							conferenceId,
							committeeId
						})
					);
					break;
				case 'alt+4':
					goto(
						resolve('/app/[conferenceId]/[committeeId]/(chairs)/voting', {
							conferenceId,
							committeeId
						})
					);
					break;
				case 'alt+5':
					goto(
						resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions', {
							conferenceId,
							committeeId
						})
					);
					break;
			}
		});
		return () => hotkeys.unbind('alt+1, alt+2, alt+3, alt+4, alt+5');
	});

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

<ChairNavbar title={committee?.abbreviation} conferenceTitle={committee?.conference?.title} />

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

<!-- TODO: enable AdoptionConfetti once resolution adoption feature is implemented -->
<!-- <AdoptionConfetti
	lastAdoptionDate={committee?.lastResolutionAdoptionDate}
	agendaItem={committee?.activeAgendaItem?.title ?? m.unknown()}
	committeeName={committee?.name ?? m.unknown()}
	confettiDurationSec={20}
/> -->

<!-- Bottom dock -->
<div class="dock dock-md lg:dock-lg md:justify-center md:gap-4">
	{#each dockItems as item, i (item.key)}
		<a href={item.href} class="group relative {isActive(item.key) && !(item.key === 'resolutions' && committee?.activeDraftResolutionId && page.url.pathname.includes(committee.activeDraftResolutionId)) ? 'dock-active' : ''}">
			<i class="fa-duotone {item.icon} size-[1.2em]"></i>
			<span class="dock-label">{item.label()}</span>
			<kbd
				class="kbd kbd-sm absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-base-100/80 px-2 py-1 z-10"
				>⌥{i + 1}</kbd
			>
		</a>
	{/each}
	{#if committee?.activeDraftResolutionId}
		<a
			href={resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions/[paperId]', {
				conferenceId,
				committeeId,
				paperId: committee.activeDraftResolutionId
			})}
			class="group relative {page.url.pathname.includes(committee.activeDraftResolutionId) ? 'dock-active' : ''}"
		>
			<i class="fa-duotone fa-file-pen size-[1.2em]"></i>
			<span class="dock-label">{m.activeDraftResolution()}</span>
		</a>
	{/if}
</div>
