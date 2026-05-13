<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Modal from './Modal.svelte';
	import toast from 'svelte-french-toast';

	interface Props {
		open: boolean;
		conferenceId: string;
		conferenceName: string;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let { open = $bindable(), conferenceId, conferenceName }: Props = $props();

	let confirmInput = $state('');
	let isDeleting = $state(false);

	let canDelete = $derived(confirmInput === conferenceName);

	async function handleDelete() {
		if (!canDelete) return;
		isDeleting = true;
		try {
			// TODO: deleteConference not available in Rumble client yet
			toast.error('deleteConference is not yet available');
			open = false;
		} finally {
			isDeleting = false;
		}
	}

	$effect(() => {
		if (!open) {
			confirmInput = '';
		}
	});
</script>

<Modal bind:open>
	<h3 class="text-lg font-bold text-error">{m.deleteConference()}</h3>
	<p class="mt-2 text-sm">{m.deleteConferenceWarning()}</p>
	<p class="mt-4 text-sm font-semibold">{m.deleteConferenceConfirmation()}</p>
	<p class="mt-1 text-sm font-mono text-warning">{conferenceName}</p>
	<input
		type="text"
		class="input input-bordered w-full mt-2"
		bind:value={confirmInput}
		placeholder={conferenceName}
	/>
	<div class="modal-action">
		<button class="btn" onclick={() => (open = false)}>{m.cancel()}</button>
		<button class="btn btn-error" disabled={!canDelete || isDeleting} onclick={handleDelete}>
			{#if isDeleting}
				<span class="loading loading-spinner loading-sm"></span>
			{/if}
			{m.deleteConference()}
		</button>
	</div>
</Modal>
