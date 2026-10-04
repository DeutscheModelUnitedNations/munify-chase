<script lang="ts">
	import Modal from '../Modal.svelte';
	import hotkeys from 'hotkeys-js';
	import { registerCommands } from '$lib/commands/registry.svelte';
	import { m } from '$lib/paraglide/messages';
	import StateOfDebateChanger from './StateOfDebateChanger.svelte';

	interface Props {
		committeeId: string;
		oldStateOfDebate?: string | null;
	}

	let { committeeId, oldStateOfDebate }: Props = $props();

	let open = $state(false);

	registerCommands(() => [
		{
			id: 'chair.state-of-debate',
			title: m.commandChangeStateOfDebate,
			group: 'page',
			icon: 'comments',
			shortcut: 'alt+d',
			run: () => (open = !open)
		}
	]);

	// Esc only closes the dialog, so it stays a local binding
	$effect(() => {
		hotkeys('esc', (event) => {
			event.preventDefault();
			open = false;
		});
	});
</script>

<Modal bind:open>
	<StateOfDebateChanger {committeeId} {oldStateOfDebate} abort={() => (open = false)} />
</Modal>
