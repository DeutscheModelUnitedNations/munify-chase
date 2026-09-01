<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Modal from './Modal.svelte';

	interface Props {
		open: boolean;
		title: string;
		message: string;
		confirmLabel?: string;
		cancelLabel?: string;
		danger?: boolean;
		onConfirm: () => void | Promise<void>;
	}

	let {
		open = $bindable(),
		title,
		message,
		confirmLabel,
		cancelLabel,
		danger = true,
		onConfirm
	}: Props = $props();

	let loading = $state(false);

	async function handleConfirm() {
		loading = true;
		try {
			await onConfirm();
			open = false;
		} finally {
			loading = false;
		}
	}
</script>

<Modal bind:open>
	<h3 class="text-lg font-bold {danger ? 'text-error' : ''}">{title}</h3>
	<p class="mt-2 text-sm">{message}</p>
	<div class="modal-action">
		<button class="btn" onclick={() => (open = false)} disabled={loading}>
			{cancelLabel ?? m.cancel()}
		</button>
		<button
			class="btn {danger ? 'btn-error' : 'btn-primary'}"
			disabled={loading}
			onclick={handleConfirm}
		>
			{#if loading}
				<span class="loading loading-spinner loading-sm"></span>
			{/if}
			{confirmLabel ?? m.confirm()}
		</button>
	</div>
</Modal>
