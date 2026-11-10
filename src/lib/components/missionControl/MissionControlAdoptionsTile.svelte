<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import MissionControlTile from './MissionControlTile.svelte';
	import type { ListTile } from './insights';

	let { tile }: { tile: Extract<ListTile, { kind: 'adoptions' }> } = $props();
</script>

<MissionControlTile title={m.missionControlRecentAdoptions()}>
	<div class="flex min-h-0 flex-1 flex-col justify-center gap-3 overflow-hidden text-2xl">
		{#each tile.pulse.recentAdoptions.slice(0, 3) as adoption, idx (idx)}
			<div class="flex items-center gap-3">
				<i aria-hidden="true" class="ph-fill ph-gavel text-success w-7 flex-none text-center"></i>
				<div class="min-w-0 leading-tight">
					<div class="flex items-baseline gap-2">
						<span class="flex-none font-bold">{adoption.committeeAbbreviation}</span>
						<span class="truncate"
							>{adoption.documentNumber || adoption.paperTitle || m.unknown()}</span
						>
					</div>
					<p class="text-base-content/60 truncate text-xl">
						{adoption.agendaItemTitle}
					</p>
				</div>
			</div>
		{/each}
	</div>
</MissionControlTile>
