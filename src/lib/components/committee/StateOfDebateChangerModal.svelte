<script lang="ts">
	import Modal from '../Modal.svelte';
	import hotkeys from 'hotkeys-js';
	import StateOfDebateChanger from './StateOfDebateChanger.svelte';

	interface Props {
		committeeId: string;
		oldStateOfDebate?: string | null;
	}

	let { committeeId, oldStateOfDebate }: Props = $props();

	let open = $state(false);

	$effect(() => {
		hotkeys('alt+d, esc', (event, handler) => {
			event.preventDefault();
			switch (handler.key) {
				case 'alt+d':
					open = !open;
					break;
				case 'esc':
					open = false;
					break;
			}
		});
	});
</script>

<Modal bind:open>
	<StateOfDebateChanger {committeeId} {oldStateOfDebate} abort={() => (open = false)} />
</Modal>
