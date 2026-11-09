<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import MissionControlTile from './MissionControlTile.svelte';
	import type { ListTile } from './insights';

	let { tile }: { tile: Extract<ListTile, { kind: 'votingSessions' }> } = $props();
</script>

<MissionControlTile title={m.missionControlActiveVotes()}>
	<div class="flex min-h-0 flex-1 flex-col justify-center gap-3 overflow-hidden text-2xl">
		{#each tile.committees as committee (committee.id)}
			{#each committee.votingSessions ?? [] as session (session.id)}
				<div class="flex items-center gap-3">
					<i aria-hidden="true" class="ph-fill ph-chart-bar text-primary w-7 flex-none text-center"
					></i>
					<span class="flex-none font-bold">{committee.abbreviation}</span>
					<span class="text-base-content/70 truncate">{session.voteName || session.mode}</span>
				</div>
			{/each}
		{/each}
	</div>
</MissionControlTile>
