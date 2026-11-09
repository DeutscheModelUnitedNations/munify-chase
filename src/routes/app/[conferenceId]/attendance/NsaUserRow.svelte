<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import NsaRow from './NsaRow.svelte';

	interface Props {
		/** The organisation's Phosphor icon */
		icon?: string | null;
		name: string;
		/** The committee the person is checked in to, none when checked out or never in */
		committee: { name: string; abbreviation?: string | null } | null | undefined;
		/** Opens the person's QR card, no button when the cards come from DELEGATOR */
		onQr?: () => void;
	}

	let { icon, name, committee, onQr }: Props = $props();
</script>

<NsaRow {icon} {name}>
	{#if committee}
		<span class="badge badge-success">
			<i aria-hidden="true" class="ph-fill ph-sign-in mr-1"></i>
			{committee.abbreviation ?? committee.name}
		</span>
	{:else}
		<span class="badge badge-ghost">{m.notCheckedIn()}</span>
	{/if}
	{#if onQr}
		<button class="btn btn-ghost btn-sm" onclick={onQr} aria-label={m.qrCard()} title={m.qrCard()}>
			<i aria-hidden="true" class="ph-fill ph-qr-code"></i>
		</button>
	{/if}
</NsaRow>
