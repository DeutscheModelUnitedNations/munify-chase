<script lang="ts">
import { fade } from "svelte/transition";

interface Props {
  stripeColor?: string;
  badgeColor?: string;
  faIcon?: string;
  badgeText?: string;
}

const {
  stripeColor = "base-300",
  badgeColor = "primary",
  faIcon,
  badgeText,
}: Props = $props();
</script>

<div
	class="stripes flex min-h-16 w-full flex-col items-center justify-center gap-2 rounded-lg"
	style="--stripe-color-1: var(--color-{stripeColor})"
	in:fade={{ duration: 500 }}
>
	<div class="badge badge-xl badge-{badgeColor} m-4 shadow-sm">
		{#if faIcon}
			<i class="fa-solid fa-{faIcon.replace('fa-', '')} text-base-content"></i>
		{/if}
		{#if badgeText}
			{badgeText}
		{/if}
	</div>
</div>

<style lang="postcss">
	.stripes {
		--stripe-color-1: #eee;
		--stripe-color-2: transparent;
		--stripe-thickness: 4px;

		/* No fixed width or height */
		background: repeating-linear-gradient(
			-45deg,
			var(--stripe-color-1),
			var(--stripe-color-1) var(--stripe-thickness),
			var(--stripe-color-2) var(--stripe-thickness),
			var(--stripe-color-2) calc(2 * var(--stripe-thickness))
		);
	}
</style>
