<script lang="ts">
	import { m } from '#lib/paraglide/messages';

	interface Props {
		/** Closes the surrounding dialog; without it there is no abort button. */
		abort?: () => void;
		onsubmit: () => void;
		submitLabel: string;
		submitDisabled?: boolean;
	}

	let { abort, onsubmit, submitLabel, submitDisabled = false }: Props = $props();
</script>

<div class="flex w-full gap-2">
	{#if abort}
		<button class="btn btn-error btn-lg" onclick={() => abort()}>
			<i aria-hidden="true" class="ph-fill ph-x mr-2"></i>
			{m.abort()}
		</button>
	{/if}
	<button
		class="btn btn-primary btn-lg w-full flex-1 {submitDisabled ? 'btn-disabled' : ''}"
		onclick={() => {
			onsubmit();
			abort?.();
		}}
	>
		<i aria-hidden="true" class="ph-fill ph-floppy-disk mr-2"></i>
		{submitLabel}
	</button>
</div>
