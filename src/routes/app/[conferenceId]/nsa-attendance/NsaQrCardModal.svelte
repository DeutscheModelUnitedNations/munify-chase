<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import Modal from '$lib/components/Modal.svelte';
	import NsaCard from './NsaCard.svelte';

	interface Props {
		open: boolean;
		nsaUser: {
			id: string;
			userEmail: string;
			name: string | null;
			attendanceCode: string | null;
			orgName: string | null;
		} | null;
		conferenceTitle: string;
	}

	let { open = $bindable(), nsaUser, conferenceTitle }: Props = $props();

	function openPrint() {
		if (!nsaUser) return;
		const url = `/app/${page.params.conferenceId}/nsa-attendance/print?id=${encodeURIComponent(nsaUser.id)}&autoprint=1`;
		window.open(url, '_blank', 'noopener');
	}
</script>

<Modal bind:open>
	<div class="flex flex-col gap-4">
		<header class="flex items-center justify-between">
			<h2 class="text-2xl font-bold">{m.qrCard()}</h2>
			<div class="flex gap-2">
				<button class="btn btn-primary" onclick={openPrint}>
					<i class="fas fa-print mr-1"></i>{m.print()}
				</button>
				<button class="btn btn-ghost" onclick={() => (open = false)}>{m.close()}</button>
			</div>
		</header>

		{#if nsaUser}
			<div class="mx-auto">
				<NsaCard {nsaUser} {conferenceTitle} />
			</div>
		{/if}
	</div>
</Modal>
