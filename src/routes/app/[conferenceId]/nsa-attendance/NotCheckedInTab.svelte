<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import { SvelteMap } from 'svelte/reactivity';

	interface Props {
		conferenceId: string;
	}
	let { conferenceId }: Props = $props();

	let onlyWithHistory = $state(false);

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
			representation: { name: true, faIcon: true }
		}
	});

	const allEvents = await client.liveQuery.nsaPresenceEvents({
		__args: {
			where: { conference: { id: conferenceId } },
			orderBy: { timestamp: 'desc' }
		},
		id: true,
		type: true,
		conferenceUser: { id: true }
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
			const isOut = !latest || latest.type === 'CHECK_OUT';
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
