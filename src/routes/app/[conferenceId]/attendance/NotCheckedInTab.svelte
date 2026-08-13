<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import Flag from '$lib/components/Flag.svelte';

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
		attendanceCode: true,
		conferenceMember: {
			representation: { name: true, faIcon: true }
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
					faIcon: true,
					alpha3Code: true,
					type: true
				}
			}
		}
	});

	let absentByCommittee = $derived.by(() => {
		const groups: {
			committeeId: string;
			name: string;
			abbreviation: string | null;
			absent: {
				id: string;
				name: string;
				alpha3Code?: string | null;
				faIcon?: string | null;
			}[];
		}[] = [];
		for (const c of conference?.committees ?? []) {
			const absent = (c.members ?? [])
				.filter((mem) => mem.representation?.type === 'DELEGATION' && mem.present === false)
				.map((mem) => ({
					id: mem.id,
					name: mem.representation?.name ?? '',
					alpha3Code: mem.representation?.alpha3Code ?? null,
					faIcon: mem.representation?.faIcon ?? null
				}))
				.sort((a, b) => a.name.localeCompare(b.name));
			if (absent.length === 0) continue;
			groups.push({
				committeeId: c.id,
				name: c.name,
				abbreviation: c.abbreviation ?? null,
				absent
			});
		}
		return groups;
	});

	type NsaUser = NonNullable<typeof nsaUsers>[number];

	// allEvents is ordered timestamp DESC, so the first event per user is the latest.
	let latestByUser = $derived.by(() => {
		const map = new SvelteMap<string, NonNullable<typeof allEvents>[number]>();
		for (const e of allEvents ?? []) {
			const uid = e.conferenceUser?.id;
			if (uid && !map.has(uid)) map.set(uid, e);
		}
		return map;
	});

	let visible = $derived.by(() => {
		const out: NsaUser[] = [];
		for (const u of nsaUsers ?? []) {
			const latest = latestByUser.get(u.id);
			const isOut = !latest || !latest.present;
			if (!isOut) continue;
			if (onlyWithHistory && !latest) continue;
			out.push(u);
		}
		return out.sort((a, b) => {
			const aName = a.name ?? a.conferenceMember?.representation?.name ?? a.userEmail;
			const bName = b.name ?? b.conferenceMember?.representation?.name ?? b.userEmail;
			return aName.localeCompare(bName);
		});
	});
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
					<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
						{#if rep?.faIcon}
							<i class="fas {rep.faIcon} text-lg"></i>
						{:else}
							<i class="fas fa-user-tag text-lg"></i>
						{/if}
						<span class="flex-1">{user.name ?? user.userEmail}</span>
						{#if rep?.name}
							<span class="text-base-content/60 text-sm">{rep.name}</span>
						{/if}
						{#if user.attendanceCode}
							<code class="bg-base-200 rounded px-2 py-1 font-mono text-sm">
								{user.attendanceCode}
							</code>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</BasicCard>

	<BasicCard title={m.absentDelegates()}>
		{#if absentByCommittee.length === 0}
			<p class="text-base-content/60 py-4 text-center text-sm">{m.allDelegatesPresent()}</p>
		{:else}
			<div class="flex flex-col gap-4">
				{#each absentByCommittee as group (group.committeeId)}
					<div>
						<div class="mb-2 flex items-baseline gap-2">
							<h3 class="font-semibold">{group.name}</h3>
							{#if group.abbreviation}
								<span class="text-base-content/60 text-sm">({group.abbreviation})</span>
							{/if}
							<span class="badge badge-sm badge-ghost ml-auto tabular-nums"
								>{group.absent.length}</span
							>
						</div>
						<ul class="flex flex-col gap-1">
							{#each group.absent as member (member.id)}
								<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
									{#if member.faIcon}
										<Flag size="xs" representation={{ type: 'NSA', faIcon: member.faIcon }} />
									{:else if member?.alpha3Code}
										<Flag
											size="xs"
											representation={{ type: 'DELEGATION', alpha3Code: member.alpha3Code }}
										/>
									{:else}
										<i class="fas fa-user text-lg"></i>
									{/if}
									<span class="flex-1">{member.name}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		{/if}
	</BasicCard>
</div>
