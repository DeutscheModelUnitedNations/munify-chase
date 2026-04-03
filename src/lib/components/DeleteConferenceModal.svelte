<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Modal from './Modal.svelte';
	import { graphql, cache } from '$houdini';
	import { invalidateAll } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';

	interface Props {
		open: boolean;
		conferenceId: string;
		conferenceName: string;
	}

	let { open = $bindable(), conferenceId, conferenceName }: Props = $props();

	let confirmInput = $state('');
	let isDeleting = $state(false);

	let canDelete = $derived(confirmInput === conferenceName);

	const DeleteConferenceMutation = graphql(`
		mutation DeleteConference($id: ID!) {
			deleteConference(id: $id)
		}
	`);

	async function handleDelete() {
		if (!canDelete) return;
		isDeleting = true;
		try {
			await toast.promise(
				DeleteConferenceMutation.mutate({ id: conferenceId }),
				promiseToastStrings(conferenceName, 'delete')
			);
			cache.markStale();
			await invalidateAll();
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
