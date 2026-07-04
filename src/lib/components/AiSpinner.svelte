<script lang="ts">
	interface Props {
		size?: 'xs' | 'sm' | 'md';
	}
	let { size = 'xs' }: Props = $props();
</script>

<!-- Robot icon with a spinning orbit arc to signal an active AI process -->
<span class="ai-spinner ai-spinner--{size}" aria-label="AI processing" role="status">
	<i class="fas fa-robot"></i>
</span>

<style>
	.ai-spinner {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		position: relative;
		flex-shrink: 0;
	}

	.ai-spinner i {
		animation: ai-pulse 1.8s ease-in-out infinite;
		position: relative;
		z-index: 1;
	}

	/* spinning orbit arc */
	.ai-spinner::after {
		content: '';
		position: absolute;
		inset: -3px;
		border-radius: 50%;
		border: 1.5px solid currentColor;
		border-top-color: transparent;
		border-left-color: transparent;
		opacity: 0.55;
		animation: ai-orbit 0.9s linear infinite;
	}

	.ai-spinner--xs {
		font-size: 0.55rem;
		width: 1rem;
		height: 1rem;
	}

	.ai-spinner--sm {
		font-size: 0.75rem;
		width: 1.35rem;
		height: 1.35rem;
	}

	.ai-spinner--md {
		font-size: 1rem;
		width: 1.75rem;
		height: 1.75rem;
	}

	@keyframes ai-orbit {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes ai-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.35;
		}
	}
</style>
