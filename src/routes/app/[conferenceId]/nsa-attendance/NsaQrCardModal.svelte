<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Modal from '$lib/components/Modal.svelte';
	import NsaCard from './NsaCard.svelte';

	interface Props {
		open: boolean;
		nsaUser: {
			id: string;
			userEmail: string;
			attendanceCode: string | null;
			orgName: string | null;
		} | null;
		conferenceTitle: string;
	}

	let { open = $bindable(), nsaUser, conferenceTitle }: Props = $props();
</script>

<Modal bind:open>
	<div class="flex flex-col gap-4">
		<header class="no-print flex items-center justify-between">
			<h2 class="text-2xl font-bold">{m.qrCard()}</h2>
			<div class="flex gap-2">
				<button class="btn btn-primary" onclick={() => window.print()}>
					<i class="fas fa-print mr-1"></i>{m.print()}
				</button>
				<button class="btn btn-ghost" onclick={() => (open = false)}>{m.close()}</button>
			</div>
		</header>

		{#if nsaUser}
			<div class="print-area mx-auto">
				<NsaCard {nsaUser} {conferenceTitle} />
			</div>
		{/if}
	</div>
</Modal>

<style>
	@media print {
		:global(body *) {
			visibility: hidden;
		}
		:global(.print-area),
		:global(.print-area *) {
			visibility: visible;
		}
		:global(.print-area) {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
		}
		:global(.no-print) {
			display: none !important;
		}
	}
</style>
