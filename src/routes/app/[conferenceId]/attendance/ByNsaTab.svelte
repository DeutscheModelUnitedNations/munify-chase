<script lang="ts">
	import { client } from '#lib/api/rumbleClient/client';
	import { m } from '#lib/paraglide/messages';
	import { resolve } from '$app/paths';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import NsaQrCardModal from './NsaQrCardModal.svelte';
	import NsaRow from './NsaRow.svelte';
	import {
		groupNsaUsersByOrg,
		latestEventByUser,
		nsaSheetFileName,
		nsaSheetRows,
		toCsv
	} from './attendance';

	interface Props {
		conferenceId: string;
	}
	let { conferenceId }: Props = $props();

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
			id: true,
			representation: { id: true, name: true, icon: true }
		}
	});

	const allEvents = await client.liveQuery.presenceEvents({
		__args: {
			where: { committee: { conference: { id: { eq: conferenceId } } } },
			orderBy: { timestamp: 'desc' }
		},
		id: true,
		present: true,
		committeeId: true,
		timestamp: true,
		conferenceUser: { id: true }
	});

	const conference = await client.liveQuery.conference({
		__args: { id: conferenceId },
		title: true,
		managedByDelegator: true,
		committees: { id: true, name: true, abbreviation: true }
	});

	type NsaUser = NonNullable<typeof nsaUsers>[number];

	let committeesById = $derived(new Map((conference?.committees ?? []).map((c) => [c.id, c])));
	let latestByUser = $derived(latestEventByUser(allEvents));
	let groupedByOrg = $derived(groupNsaUsersByOrg({ users: nsaUsers, unknownName: m.unknown() }));

	let qrModalOpen = $state(false);
	let qrCard = $state<{
		conferenceUserId: string;
		code: string;
		name: string;
		nsaName: string | null;
		cardNumber: number;
	} | null>(null);

	/** The card as it is now, signed by this instance (only for a conference of its own). */
	async function openQrFor(user: NsaUser) {
		const [card] = await client.mutate.issueNsaCards({
			__args: { conferenceId, conferenceUserIds: [user.id] },
			conferenceUserId: true,
			code: true,
			name: true,
			nsaName: true,
			cardNumber: true
		});
		if (!card) return;
		qrCard = card;
		qrModalOpen = true;
	}

	function exportCsv() {
		const rows = nsaSheetRows({
			orgs: groupedByOrg,
			latestByUser,
			committeeNames: new Map([...committeesById].map(([id, c]) => [id, c.name]))
		});
		const blob = new Blob(['\uFEFF' + toCsv(rows)], { type: 'text/csv;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = nsaSheetFileName({ title: conference?.title, date: new Date() });
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-wrap items-center justify-end gap-2">
		{#if conference?.managedByDelegator}
			<span class="text-base-content/60 text-sm">
				<i aria-hidden="true" class="ph-fill ph-link mr-1"></i>{m.nsaCardsFromDelegator()}
			</span>
		{:else}
			<a
				href={resolve('/app/[conferenceId]/attendance/print', { conferenceId })}
				class="btn btn-secondary btn-sm"
				target="_blank"
				rel="noopener"
			>
				<i aria-hidden="true" class="ph-fill ph-printer mr-1"></i>
				{m.printAllCards()}
			</a>
		{/if}
		<button class="btn btn-ghost btn-sm" onclick={exportCsv}>
			<i aria-hidden="true" class="ph-fill ph-file-csv mr-1"></i>
			{m.exportCsv()}
		</button>
	</div>

	{#each groupedByOrg as org (org.orgId)}
		<BasicCard title={org.name}>
			<ul class="flex flex-col gap-1">
				{#each org.users as user (user.id)}
					{@const latest = latestByUser.get(user.id)}
					{@const checkedIn = latest?.present}
					{@const committee = checkedIn ? committeesById.get(latest.committeeId) : null}
					<NsaRow icon={org.icon} name={user.name ?? user.userEmail}>
						{#if checkedIn && committee}
							<span class="badge badge-success">
								<i aria-hidden="true" class="ph-fill ph-sign-in mr-1"></i>
								{committee.abbreviation ?? committee.name}
							</span>
						{:else}
							<span class="badge badge-ghost">{m.notCheckedIn()}</span>
						{/if}
						{#if !conference?.managedByDelegator}
							<button
								class="btn btn-ghost btn-sm"
								onclick={() => openQrFor(user)}
								aria-label={m.qrCard()}
								title={m.qrCard()}
							>
								<i aria-hidden="true" class="ph-fill ph-qr-code"></i>
							</button>
						{/if}
					</NsaRow>
				{/each}
			</ul>
		</BasicCard>
	{/each}
</div>

<NsaQrCardModal
	bind:open={qrModalOpen}
	bind:card={qrCard}
	{conferenceId}
	conferenceTitle={conference?.title ?? ''}
/>
