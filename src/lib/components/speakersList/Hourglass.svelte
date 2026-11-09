<script lang="ts">
	import { blur } from 'svelte/transition';

	export type HourglassStatus = 'active' | 'paused' | 'overtime';

	interface Props {
		status: HourglassStatus;
	}

	let { status }: Props = $props();

	let activeIcon = $state('hourglass-high');

	$effect(() => {
		if (status !== 'active') {
			return;
		}
		const animation = setInterval(() => {
			setTimeout(() => {
				activeIcon = 'hourglass-medium';
			}, 500);
			setTimeout(() => {
				activeIcon = 'hourglass-low';
			}, 1000);
			setTimeout(() => {
				activeIcon += ' hourglass-animation';
			}, 1500);
			setTimeout(() => {
				activeIcon = 'hourglass-high';
			}, 2000);
		}, 2000);
		return () => clearInterval(animation);
	});
</script>

<div class="relative h-10 w-10 text-2xl">
	{#if status === 'active'}
		<div class="absolute inset-0 flex items-center justify-center">
			<i class="ph-duotone ph-{activeIcon}" in:blur={{ duration: 500 }} out:blur={{ duration: 500 }}
			></i>
		</div>
	{:else if status === 'paused'}
		<div class="absolute inset-0 flex items-center justify-center">
			<i class="ph-duotone ph-pause-circle" in:blur={{ duration: 500 }} out:blur={{ duration: 500 }}
			></i>
		</div>
	{:else if status === 'overtime'}
		<div class="absolute inset-0 flex items-center justify-center">
			<i
				class="ph-fill ph-bell icon-shake text-error"
				in:blur={{ duration: 500 }}
				out:blur={{ duration: 500 }}
			></i>
		</div>
	{/if}
</div>

<style lang="postcss">
	@keyframes hourglass-animation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(180deg);
		}
	}

	.hourglass-animation {
		animation: hourglass-animation 0.5s ease-in-out;
	}
</style>
