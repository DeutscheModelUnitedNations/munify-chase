<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';

	interface Props {
		conferenceId: string;
	}
	let { conferenceId }: Props = $props();

	// All NSA users in the conference (independent of whether they ever checked
	// in). Each NSA org may have multiple representatives.
	const nsaUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: conferenceId },
				conferenceUserType: 'NON_STATE_ACTOR'
			}
		},
		id: true,
		userEmail: true,
		attendanceCode: true,
		conferenceMember: {
			id: true,
			representation: { id: true, name: true, faIcon: true }
		}
	});

	// Latest event per user → drives "currently in committee X" labels.
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
</script>

<div class="flex flex-col gap-4">
	{#each groupedByOrg as org}
		<BasicCard title={org.name}>
			<ul class="flex flex-col gap-1">
				{#each org.users as user}
					{@const latest = latestByUser.get(user.id)}
					{@const checkedIn = latest?.type === 'CHECK_IN'}
					{@const committee = checkedIn ? committeesById.get(latest.committeeId) : null}
					<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
						{#if org.faIcon}
							<i class="fas {org.faIcon} text-lg"></i>
						{:else}
							<i class="fas fa-user-tag text-lg"></i>
						{/if}
						<span class="flex-1">{user.userEmail}</span>
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
					</li>
				{/each}
			</ul>
		</BasicCard>
	{/each}
</div>
