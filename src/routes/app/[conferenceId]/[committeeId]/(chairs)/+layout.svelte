<script lang="ts">
	import { type Snippet } from 'svelte';
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

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const committeeId = page.params.committeeId!;

	const committee = await client.liveQuery.committee({
		__args: { id: committeeId },
		id: true,
		abbreviation: true,
		name: true,
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
			window.open('.', '_blank');
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
