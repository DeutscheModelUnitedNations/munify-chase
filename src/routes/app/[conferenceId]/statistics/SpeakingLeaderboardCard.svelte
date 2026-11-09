<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import RepCell from './RepCell.svelte';
	import { commentLeaders, fmtTime, type SpeakingRow } from './conferenceStats';

	interface Props {
		speaking: SpeakingRow[];
		comments: SpeakingRow[];
	}
	let { speaking, comments }: Props = $props();

	let mode = $state<'speaking' | 'comments'>('speaking');

	const modes = [
		{ id: 'speaking', icon: 'microphone', label: m.formalSpeeches },
		{ id: 'comments', icon: 'chat-dots', label: m.commentInterventions }
	] as const;
</script>

<BasicCard
	data-tour="statistics.leaderboard"
	title={mode === 'speaking' ? m.delegationSpeakingLeaderboard() : m.commentLeaderboard()}
>
	<div class="mb-4 flex items-center gap-2">
		<div class="join">
			{#each modes as option (option.id)}
				<button
					class="join-item btn btn-sm {mode === option.id ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => (mode = option.id)}
				>
					<i aria-hidden="true" class="ph-fill ph-{option.icon}"></i>
					{option.label()}
				</button>
			{/each}
		</div>
	</div>

	{#if mode === 'speaking'}
		<table class="table table-sm w-full">
			<thead>
				<tr>
					<th class="w-8">#</th>
					<th>{m.delegation()}</th>
					<th class="text-right">{m.totalSpeakingTime()}</th>
					<th class="text-right">{m.formalSpeeches()}</th>
					<th class="text-right">{m.commentInterventions()}</th>
				</tr>
			</thead>
			<tbody>
				{#each speaking.slice(0, 20) as row, i (row.representationId)}
					<tr>
						<td class="text-base-content/40 tabular-nums">{i + 1}</td>
						<RepCell {row} />
						<td class="text-right font-mono text-sm tabular-nums">{fmtTime(row.totalSeconds)}</td>
						<td class="text-right tabular-nums">{row.speechCount}</td>
						<td class="text-right tabular-nums">{row.commentCount}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<table class="table table-sm w-full">
			<thead>
				<tr>
					<th class="w-8">#</th>
					<th>{m.delegation()}</th>
					<th class="text-right">{m.commentInterventions()}</th>
					<th class="text-right">{m.totalSpeakingTime()}</th>
				</tr>
			</thead>
			<tbody>
				{#each commentLeaders(comments) as row, i (row.representationId)}
					<tr>
						<td class="text-base-content/40 tabular-nums">{i + 1}</td>
						<RepCell {row} />
						<td class="text-right tabular-nums">{row.commentCount}</td>
						<td class="text-right font-mono text-sm tabular-nums">{fmtTime(row.totalSeconds)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</BasicCard>
