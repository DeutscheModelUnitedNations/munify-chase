<script lang="ts">
	import Modal from '../Modal.svelte';
	import StatusChanger from './StatusChanger.svelte';
	import hotkeys from 'hotkeys-js';
	import { registerCommands } from '$lib/commands/registry.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { CommitteestatusEnum } from '$lib/api/rumbleClient/client';

	interface Props {
		committeeId: string;
		oldStatus?: CommitteestatusEnum;
		oldUntil?: Date;
		oldCustomName?: string;
	}

	let { committeeId, oldStatus, oldUntil, oldCustomName }: Props = $props();

	let open = $state(false);

	registerCommands(() => [
		{
			id: 'chair.status',
			title: m.setStatus,
			group: 'page',
			icon: 'traffic-light',
			shortcut: 'alt+s',
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
	<StatusChanger
		{committeeId}
		{oldStatus}
		{oldUntil}
		{oldCustomName}
		abort={() => (open = false)}
	/>
</Modal>
