<script lang="ts">
	import Modal from '../Modal.svelte';
	import { m } from '$lib/paraglide/messages';
	import StatusChanger from './StatusChanger.svelte';
	import hotkeys from 'hotkeys-js';
	import type { CommitteestatusEnum } from '$lib/api/rumbleClient/client';

	interface Props {
		committeeId: string;
		oldStatus?: CommitteestatusEnum;
		oldUntil?: Date;
		oldCustomName?: string;
		hasModeratedCaucus?: boolean;
	}

	let { committeeId, oldStatus, oldUntil, oldCustomName, hasModeratedCaucus }: Props = $props();

	let open = $state(false);

	$effect(() => {
		hotkeys('alt+s, esc', (event, handler) => {
			event.preventDefault();
			switch (handler.key) {
				case 'alt+s':
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
	<StatusChanger
		{committeeId}
		{oldStatus}
		{oldUntil}
		{oldCustomName}
		abort={() => (open = false)}
	/>
</Modal>
