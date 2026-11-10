<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import Flag from '../Flag.svelte';
	import MissionControlTile from './MissionControlTile.svelte';
	import { speakerLabel, type InsightSpeaker, type ListTile } from './insights';

	let { tile }: { tile: Extract<ListTile, { kind: 'speakersListSpotlight' }> } = $props();

	const representationOf = (speaker: InsightSpeaker) =>
		speaker.committeeMember?.representation ?? speaker.conferenceMember?.representation;
</script>

<MissionControlTile title={m.missionControlSpeakersListTitle()}>
	<div class="mb-1 flex shrink-0 flex-col gap-0.5">
		<span class="text-3xl font-bold">{tile.committee.abbreviation}</span>
		<span class="text-base-content/60 truncate text-lg">{tile.committee.name}</span>
	</div>
	<div class="flex min-h-0 flex-1 flex-col justify-start gap-2 overflow-hidden text-2xl">
		{#each tile.speakers.slice(0, 8) as speaker, idx (speaker.id)}
			{@const representation = representationOf(speaker)}
			{@const current = idx === 0}
			<div class="flex items-center gap-3" class:text-primary={current}>
				{#if current}
					<i aria-hidden="true" class="ph-fill ph-microphone w-7 flex-none text-center"></i>
				{:else}
					<span class="text-base-content/40 w-7 flex-none text-center font-mono text-xl">{idx}</span
					>
				{/if}
				<Flag size="sm" {representation} />
				<span class="truncate" class:font-bold={current}
					>{speakerLabel(speaker, representation)}</span
				>
			</div>
		{/each}
	</div>
</MissionControlTile>
