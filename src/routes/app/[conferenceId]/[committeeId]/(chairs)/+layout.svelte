<script lang="ts">
	import type { Snippet } from 'svelte';
	import ChairNavbar from './ChairNavbar.svelte';
	import type { LayoutData } from './$houdini';
	import * as m from '$lib/paraglide/messages';
	import StatusChangerModal from '$lib/components/committee/StatusChangerModal.svelte';
	import StateOfDebateChangerModal from '$lib/components/committee/StateOfDebateChangerModal.svelte';
	import dayjs from 'dayjs';
	import toast from 'svelte-french-toast';
	import { getCommitteeStatusText } from '$lib/utils/committeeStatus';
	import BellIcon from '$lib/components/toast/BellIcon.svelte';
	import { serverTime } from '$lib/state/serverTime.svelte';

	interface Props {
		children: Snippet;
		data: LayoutData;
	}

	let { data, children }: Props = $props();

	let query = $derived(data?.CommitteeTeamQuery);
	let committee = $derived($query.data?.findFirstCommittee);

	let committeeStatusExpiredAlerted = $state(false);
	let speakersListOvertimeAlerted = $state(false);
	let commentListOvertimeAlerted = $state(false);

	$effect(() => {
		// Toast Effect
		if (!committee) return;

		const interval = setInterval(() => {
			if (dayjs(committee.statusUntil).diff($serverTime) < 0) {
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
					dayjs(speakersList.startTimestamp).diff($serverTime, 'seconds') + speakersList.timeLeft <
					0;
				if (overtime && !speakersListOvertimeAlerted) {
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
</script>

<ChairNavbar title={committee?.abbreviation} />

{@render children()}

<StatusChangerModal
	committeeId={data.committeeId}
	oldStatus={committee?.status}
	oldUntil={committee?.statusUntil}
	oldCustomName={committee?.statusHeadline}
/>

<StateOfDebateChangerModal
	committeeId={data.committeeId}
	oldStateOfDebate={committee?.stateOfDebate}
/>
