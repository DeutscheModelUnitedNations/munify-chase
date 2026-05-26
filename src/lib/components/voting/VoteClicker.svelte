<script lang="ts">
	interface Props {
		active: boolean;
		value: number;
	}

	let { active, value = $bindable() }: Props = $props();
</script>

<div class="flex flex-col items-center gap-2">
	<button
		class="btn btn-lg"
		aria-label="increase-vote"
		onclick={() => (value += 1)}
		disabled={!active}
	>
		<i class="fas fa-arrow-up"></i>
	</button>
	<!-- <div class="countdown font-mono text-5xl">
		<span style="--value:{value};" aria-live="polite" aria-label={value.toString()}>{value}</span>
	</div>-->
	<input
		class="input input-xl text-center font-mono text-2xl"
		type="text"
		inputmode="numeric"
		disabled={!active}
		bind:value
		oninput={(e) => (value = parseInt((e.target as HTMLInputElement).value) || 0)}
	/>
	<button
		class="btn btn-lg"
		aria-label="decrease-vote"
		onclick={() => (value -= 1)}
		disabled={!active}
	>
		<i class="fas fa-arrow-down"></i>
	</button>
</div>
