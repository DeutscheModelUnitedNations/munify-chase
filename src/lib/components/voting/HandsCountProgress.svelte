<script lang="ts">
	import { m } from '#lib/paraglide/messages';

	interface Props {
		countState: 'over' | 'matching' | 'open';
		votesCast: number;
		votesProgress: number;
		presentDelegations: number;
	}

	let { countState, votesCast, votesProgress, presentDelegations }: Props = $props();

	const progressClass = {
		over: 'progress-error',
		matching: 'progress-success',
		open: 'progress-warning'
	};
</script>

<div class="mt-3 flex flex-col gap-1">
	<progress class="progress w-full {progressClass[countState]}" value={votesProgress} max="100"
	></progress>
	<div class="flex justify-between text-sm">
		<span class={countState === 'over' ? 'text-error font-semibold' : 'text-base-content/60'}>
			{votesCast} / {presentDelegations}
		</span>
		{#if countState === 'over'}
			<span class="text-error font-semibold">
				<i aria-hidden="true" class="ph-fill ph-warning"></i>
				+{votesCast - presentDelegations}
				{m.over()}
			</span>
		{:else if countState === 'matching'}
			<span class="text-success font-semibold">
				<i aria-hidden="true" class="ph-fill ph-check-circle"></i>
				{m.matching()}
			</span>
		{/if}
	</div>
</div>
