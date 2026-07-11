<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';

	interface Props {
		conferenceUserId: string;
	}
	let { conferenceUserId }: Props = $props();

	const events = await client.liveQuery.presenceEvents({
		__args: {
			where: { conferenceUserId },
			orderBy: { timestamp: 'desc' }
		},
		id: true,
		present: true,
		timestamp: true,
		committee: { id: true, name: true, abbreviation: true }
	});

	function fmt(ts: string | Date) {
		const d = ts instanceof Date ? ts : new Date(ts);
		return d.toLocaleString();
	}
</script>

<BasicCard title={m.myAttendance()}>
	{#if (events ?? []).length === 0}
		<p class="text-base-content/60 py-4 text-center text-sm">{m.noEventsYet()}</p>
	{:else}
		<ul class="flex flex-col gap-1">
			{#each events ?? [] as ev (ev.id)}
				<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
					<i
						class="fas {ev.present
							? 'fa-arrow-right-to-bracket text-success'
							: 'fa-arrow-right-from-bracket text-warning'} text-lg"
					></i>
					<span class="flex-1">{ev.committee?.name ?? '?'}</span>
					<span class="text-base-content/70 text-sm">{fmt(ev.timestamp)}</span>
				</li>
			{/each}
		</ul>
	{/if}
</BasicCard>
