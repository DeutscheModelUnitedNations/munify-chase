<script lang="ts">
	import { client } from '#lib/api/rumbleClient/client';
	import { m } from '#lib/paraglide/messages';
	import { resolve } from '$app/paths';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import NsaQrCardModal from './NsaQrCardModal.svelte';
	import { SvelteMap } from 'svelte/reactivity';

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

	// allEvents is ordered timestamp DESC, so the first event per user is the latest.
	let latestByUser = $derived.by(() => {
		const map = new SvelteMap<string, NonNullable<typeof allEvents>[number]>();
		for (const e of allEvents ?? []) {
			const uid = e.conferenceUser?.id;
			if (uid && !map.has(uid)) map.set(uid, e);
		}
		return map;
	});

	let groupedByOrg = $derived.by(() => {
		const map = new SvelteMap<
			string,
			{ orgId: string; name: string; icon: string | null; users: NsaUser[] }
		>();
		for (const u of nsaUsers ?? []) {
			const rep = u.conferenceMember?.representation;
			const orgId = rep?.id ?? '__unknown__';
			const entry = map.get(orgId) ?? {
				orgId,
				name: rep?.name ?? m.unknown(),
				icon: rep?.icon ?? null,
				users: []
			};
			entry.users.push(u);
			map.set(orgId, entry);
		}
		return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
	});

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

	// CSV export — semicolon-separated for Excel-DE default; \r\n for Windows.
	function exportCsv() {
		const header = ['id', 'name', 'email', 'organization', 'currently_in_committee'];
		const rows: string[][] = [];
		for (const org of groupedByOrg) {
			for (const user of org.users) {
				const latest = latestByUser.get(user.id);
				const inCommittee = latest?.present
					? (committeesById.get(latest.committeeId)?.name ?? '')
					: '';
				rows.push([user.id, user.name ?? '', user.userEmail, org.name, inCommittee]);
			}
		}
		const escape = (v: string) => {
			if (/[";\r\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
			return v;
		};
		const csv = [header, ...rows].map((row) => row.map(escape).join(';')).join('\r\n') + '\r\n';
		const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		const date = new Date().toISOString().slice(0, 10);
		const slug = (conference?.title ?? 'conference').toLowerCase().replace(/[^a-z0-9]+/g, '-');
		a.download = `nsa-laufzettel-${slug}-${date}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-wrap items-center justify-end gap-2">
		{#if conference?.managedByDelegator}
			<span class="text-base-content/60 text-sm">
				<i class="ph-fill ph-link mr-1"></i>{m.nsaCardsFromDelegator()}
			</span>
		{:else}
			<a
				href={resolve('/app/[conferenceId]/attendance/print', { conferenceId })}
				class="btn btn-secondary btn-sm"
				target="_blank"
				rel="noopener"
			>
				<i class="ph-fill ph-printer mr-1"></i>
				{m.printAllCards()}
			</a>
		{/if}
		<button class="btn btn-ghost btn-sm" onclick={exportCsv}>
			<i class="ph-fill ph-file-csv mr-1"></i>
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
					<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
						{#if org.icon}
							<i class="ph-fill ph-{org.icon} text-lg"></i>
						{:else}
							<i class="ph-fill ph-identification-badge text-lg"></i>
						{/if}
						<span class="flex-1">{user.name ?? user.userEmail}</span>
						{#if checkedIn && committee}
							<span class="badge badge-success">
								<i class="ph-fill ph-sign-in mr-1"></i>
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
								<i class="ph-fill ph-qr-code"></i>
							</button>
						{/if}
					</li>
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
