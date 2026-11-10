<script lang="ts">
	import { m } from '#lib/paraglide/messages';

	interface Props {
		/** The current step, from 1 */
		step: number;
		/** Steps can only be jumped to once there is data */
		hasData: boolean;
		onJump: (step: number) => void;
	}

	let { step, hasData, onJump }: Props = $props();

	const labels = $derived([
		m.basicsTitle(),
		m.committees(),
		m.delegations(),
		m.actorsTitle(),
		m.requestTypes(),
		m.editStep()
	]);
</script>

<!-- fallow-ignore-next-line css-broken-reference -- border-b is a Tailwind utility -->
<div class="bg-base-100 border-base-content/10 flex justify-center border-b px-6 py-5">
	<ul class="steps">
		{#each labels as label, i (i)}
			<li class="step" class:step-primary={i + 1 <= step}>
				<button
					type="button"
					class="btn btn-ghost btn-sm h-auto whitespace-normal"
					onclick={() => hasData && onJump(i + 1)}
					disabled={!hasData}
				>
					{label}
				</button>
			</li>
		{/each}
	</ul>
</div>
