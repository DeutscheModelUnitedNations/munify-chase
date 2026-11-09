<script lang="ts">
	import { client } from '#lib/api/rumbleClient/client';
	import { m } from '#lib/paraglide/messages';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import NsaRow from './NsaRow.svelte';
	import AbsentDelegatesCard from './AbsentDelegatesCard.svelte';
	import { absentDelegatesByCommittee, latestEventByUser, nsasNotCheckedIn } from './attendance';

	interface Props {
		conferenceId: string;
	}
	let { conferenceId }: Props = $props();

	let onlyWithHistory = $state(false);

	const nsaUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: { eq: conferenceId } },
				conferenceUserType: 'NON_STATE_ACTOR'
			}
		},
		id: true,
		userEmail: true,
		name: true,
		conferenceMember: {
			representation: { name: true, icon: true }
		}
	});

	const allEvents = await client.liveQuery.presenceEvents({
		__args: {
			where: { committee: { conference: { id: { eq: conferenceId } } } },
			orderBy: { timestamp: 'desc' }
		},
		id: true,
		present: true,
		conferenceUser: { id: true }
	});

	const conference = await client.liveQuery.conference({
		__args: { id: conferenceId },
		id: true,
		committees: {
			id: true,
			name: true,
			abbreviation: true,
			members: {
				id: true,
				present: true,
				representation: {
					id: true,
					name: true,
					icon: true,
					alpha3Code: true,
					type: true
				}
			}
		}
	});

	let absentByCommittee = $derived(absentDelegatesByCommittee(conference?.committees ?? []));
	let latestByUser = $derived(latestEventByUser(allEvents));
	let visible = $derived(nsasNotCheckedIn({ users: nsaUsers, latestByUser, onlyWithHistory }));
</script>

<div class="flex flex-col gap-4">
	<BasicCard>
		<div class="mb-3 flex items-center justify-between">
			<h2 class="text-xl font-bold">{m.notCheckedIn()}</h2>
			<label class="label cursor-pointer gap-2">
				<span class="label-text text-sm">{m.showOnlyWithHistory()}</span>
				<input type="checkbox" class="toggle toggle-sm" bind:checked={onlyWithHistory} />
			</label>
		</div>

		{#if visible.length === 0}
			<p class="text-base-content/60 py-4 text-center text-sm">{m.allNsasCheckedIn()}</p>
		{:else}
			<ul class="flex flex-col gap-1">
				{#each visible as user (user.id)}
					{@const rep = user.conferenceMember?.representation}
					<NsaRow icon={rep?.icon} name={user.name ?? user.userEmail} orgName={rep?.name} />
				{/each}
			</ul>
		{/if}
	</BasicCard>

	<AbsentDelegatesCard groups={absentByCommittee} />
</div>
