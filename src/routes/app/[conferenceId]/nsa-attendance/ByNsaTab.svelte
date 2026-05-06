<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import NsaQrCardModal from './NsaQrCardModal.svelte';

	interface Props {
		conferenceId: string;
	}
	let { conferenceId }: Props = $props();

	const nsaUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: conferenceId },
				conferenceUserType: 'NON_STATE_ACTOR'
			}
		},
		id: true,
		userEmail: true,
		name: true,
		attendanceCode: true,
		conferenceMember: {
			id: true,
			representation: { id: true, name: true, faIcon: true }
		}
	});

	const latestEvents = await client.liveQuery.latestNsaPresenceEvents({
		__args: { conferenceId },
		id: true,
		type: true,
		committeeId: true,
		timestamp: true,
		conferenceUser: { id: true }
	});

	const conference = await client.liveQuery.conference({
		__args: { id: conferenceId },
		title: true,
		committees: { id: true, name: true, abbreviation: true }
	});

	let committeesById = $derived(new Map((conference?.committees ?? []).map((c: any) => [c.id, c])));

	let latestByUser = $derived(
		new Map((latestEvents ?? []).map((e: any) => [e.conferenceUser?.id, e]))
	);

	let groupedByOrg = $derived.by(() => {
		const map = new Map<
			string,
			{ orgId: string; name: string; faIcon: string | null; users: any[] }
		>();
		for (const u of nsaUsers ?? []) {
			const rep = u.conferenceMember?.representation;
			const orgId = rep?.id ?? '__unknown__';
			const entry = map.get(orgId) ?? {
				orgId,
				name: rep?.name ?? m.unknown(),
				faIcon: rep?.faIcon ?? null,
				users: []
			};
			entry.users.push(u);
			map.set(orgId, entry);
		}
		return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
	});

	let qrModalOpen = $state(false);
	let qrTarget = $state<{
		id: string;
		userEmail: string;
		name: string | null;
		attendanceCode: string | null;
		orgName: string | null;
	} | null>(null);

	function openQrFor(user: any, orgName: string) {
		qrTarget = {
			id: user.id,
			userEmail: user.userEmail,
			name: user.name ?? null,
			attendanceCode: user.attendanceCode,
			orgName
		};
		qrModalOpen = true;
	}

	// CSV export — semicolon-separated for Excel-DE default; \r\n for Windows.
	function exportCsv() {
		const header = [
			'id',
			'name',
			'attendance_code',
			'email',
			'organization',
			'currently_in_committee'
		];
		const rows: string[][] = [];
		for (const org of groupedByOrg) {
			for (const user of org.users) {
				const latest = latestByUser.get(user.id);
				const inCommittee =
					latest?.type === 'CHECK_IN' ? (committeesById.get(latest.committeeId)?.name ?? '') : '';
				rows.push([
					user.id,
					user.name ?? '',
					user.attendanceCode ?? '',
					user.userEmail,
					org.name,
					inCommittee
				]);
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
		<a
			href="/app/{conferenceId}/nsa-attendance/print"
			class="btn btn-secondary btn-sm"
			target="_blank"
			rel="noopener"
		>
			<i class="fas fa-print mr-1"></i>
			{m.printAllCards()}
		</a>
		<button class="btn btn-ghost btn-sm" onclick={exportCsv}>
			<i class="fas fa-file-csv mr-1"></i>
			{m.exportCsv()}
		</button>
	</div>

	{#each groupedByOrg as org (org.orgId)}
		<BasicCard title={org.name}>
			<ul class="flex flex-col gap-1">
				{#each org.users as user (user.id)}
					{@const latest = latestByUser.get(user.id)}
					{@const checkedIn = latest?.type === 'CHECK_IN'}
					{@const committee = checkedIn ? committeesById.get(latest.committeeId) : null}
					<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
						{#if org.faIcon}
							<i class="fas {org.faIcon} text-lg"></i>
						{:else}
							<i class="fas fa-user-tag text-lg"></i>
						{/if}
						<span class="flex-1">{user.name ?? user.userEmail}</span>
						{#if user.attendanceCode}
							<code class="bg-base-200 rounded px-2 py-1 font-mono text-sm">
								{user.attendanceCode}
							</code>
						{/if}
						{#if checkedIn && committee}
							<span class="badge badge-success">
								<i class="fas fa-arrow-right-to-bracket mr-1"></i>
								{committee.abbreviation ?? committee.name}
							</span>
						{:else}
							<span class="badge badge-ghost">{m.notCheckedIn()}</span>
						{/if}
						<button
							class="btn btn-ghost btn-sm"
							onclick={() => openQrFor(user, org.name)}
							aria-label={m.qrCard()}
							title={m.qrCard()}
						>
							<i class="fas fa-qrcode"></i>
						</button>
					</li>
				{/each}
			</ul>
		</BasicCard>
	{/each}
</div>

<NsaQrCardModal
	bind:open={qrModalOpen}
	nsaUser={qrTarget}
	conferenceTitle={conference?.title ?? ''}
/>
