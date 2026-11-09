<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { page } from '$app/state';
	import { client } from '#lib/api/rumbleClient/client';
	import Modal from '#lib/components/Modal.svelte';
	import NsaCard from './NsaCard.svelte';

	type Card = { code: string; name: string; nsaName: string | null; cardNumber: number };

	interface Props {
		open: boolean;
		conferenceId: string;
		/** The card shown; a reprint replaces it. */
		card: (Card & { conferenceUserId: string }) | null;
		conferenceTitle: string;
	}

	let { open = $bindable(), conferenceId, card = $bindable(), conferenceTitle }: Props = $props();

	let confirmingReprint = $state(false);
	let error = $state<string | null>(null);

	function openPrint() {
		if (!card) return;
		const url = `/app/${page.params.conferenceId}/attendance/print?id=${encodeURIComponent(card.conferenceUserId)}&autoprint=1`;
		window.open(url, '_blank', 'noopener');
	}

	async function reprint() {
		if (!card) return;
		error = null;
		try {
			card = await client.mutate.reprintNsaCard({
				__args: { conferenceId, conferenceUserId: card.conferenceUserId },
				conferenceUserId: true,
				code: true,
				name: true,
				nsaName: true,
				cardNumber: true
			});
		} catch (err) {
			error = err instanceof Error ? err.message : String(err);
		}
		confirmingReprint = false;
	}
</script>

<Modal bind:open>
	<div class="flex flex-col gap-4">
		<header class="flex flex-wrap items-center justify-between gap-2">
			<h2 class="text-2xl font-bold">{m.qrCard()}</h2>
			<div class="flex flex-wrap gap-2">
				<button class="btn btn-primary" onclick={openPrint}>
					<i aria-hidden="true" class="ph-fill ph-printer mr-1"></i>{m.print()}
				</button>
				{#if confirmingReprint}
					<button class="btn btn-warning" onclick={reprint}>{m.nsaCardReprintConfirm()}</button>
				{:else}
					<button
						class="btn"
						title={m.nsaCardReprintHint()}
						onclick={() => (confirmingReprint = true)}
					>
						<i aria-hidden="true" class="ph-fill ph-arrows-clockwise mr-1"></i>{m.nsaCardReprint()}
					</button>
				{/if}
				<button class="btn btn-ghost" onclick={() => (open = false)}>{m.close()}</button>
			</div>
		</header>

		{#if error}
			<div class="alert alert-error">{error}</div>
		{/if}

		{#if card}
			<div class="mx-auto">
				<NsaCard {card} {conferenceTitle} />
			</div>
		{/if}
	</div>
</Modal>
