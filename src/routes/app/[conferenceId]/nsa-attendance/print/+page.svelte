<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import NsaCard from '../NsaCard.svelte';
	import { onMount } from 'svelte';

	const conferenceId = page.params.conferenceId!;
	const filterId = page.url.searchParams.get('id');

	const conference = await client.liveQuery.conference({
		__args: { id: conferenceId },
		title: true
	});

	const nsaUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: conferenceId },
				conferenceUserType: 'NON_STATE_ACTOR'
			}
		},
		id: true,
		userEmail: true,
		name: true,
		attendanceCode: true,
		conferenceMember: { representation: { id: true, name: true } }
	});

	let cards = $derived(
		(nsaUsers ?? [])
			.filter((u) => !filterId || u.id === filterId)
			.map((u) => ({
				id: u.id,
				userEmail: u.userEmail,
				name: u.name ?? null,
				attendanceCode: u.attendanceCode,
				orgName: u.conferenceMember?.representation?.name ?? null
			}))
	);

	onMount(() => {
		// Auto-print on demand via ?autoprint=1 — caller can decide.
		const url = new URL(window.location.href);
		if (url.searchParams.get('autoprint') === '1') {
			setTimeout(() => window.print(), 600);
		}
	});
</script>

<svelte:head>
	<title>{m.printAllCards()} — {conference?.title ?? ''}</title>
</svelte:head>

<div class="no-print sticky top-0 z-10 flex items-center gap-3 bg-base-100 p-4 shadow-sm">
	<h1 class="flex-1 text-xl font-bold">{m.printAllCards()}</h1>
	<span class="text-base-content/60 text-sm">
		{cards.length}
		{m.cards()}
	</span>
	<button class="btn btn-primary" onclick={() => window.print()}>
		<i class="fas fa-print mr-2"></i>{m.print()}
	</button>
</div>

<div class="cards-grid p-6">
	{#each cards as card (card.id)}
		<NsaCard nsaUser={card} conferenceTitle={conference?.title ?? ''} />
	{/each}
</div>

<style>
	.cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, 85mm);
		gap: 5mm;
		justify-content: center;
		background: #f3f4f6;
	}

	@media print {
		:global(body) {
			background: white;
		}
		.no-print {
			display: none !important;
		}
		.cards-grid {
			grid-template-columns: repeat(2, 85mm);
			gap: 5mm;
			padding: 0;
			background: white;
		}
	}

	@page {
		size: A4;
		margin: 8mm;
	}
</style>
