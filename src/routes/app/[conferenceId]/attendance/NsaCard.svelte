<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import QrCodeSvg from '#lib/components/qr/QrCodeSvg.svelte';

	/** A printed NSA card: the signed card code as a QR, and the names to find the person by. */
	interface Props {
		card: { code: string; name: string; nsaName: string | null; cardNumber: number };
		conferenceTitle: string;
	}

	let { card, conferenceTitle }: Props = $props();
</script>

<div class="nsa-card">
	<div class="nsa-card-header">
		<div class="person-name">{card.name}</div>
		<div class="org-name">{card.nsaName ?? m.unknown()}</div>
	</div>

	<div class="qr-wrapper">
		<QrCodeSvg data={card.code} errorCorrection="M" />
	</div>

	<div class="footer">
		<span>{conferenceTitle}</span>
		<span>{m.nsaCardNumber({ number: card.cardNumber })}</span>
	</div>
</div>

<style>
	.nsa-card {
		width: 55mm;
		height: 85mm;
		padding: 3mm;
		border: 1px dashed #999;
		border-radius: 1.5mm;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5mm;
		background: white;
		color: black;
		font-family: 'Outfit', system-ui, sans-serif;
		break-inside: avoid;
	}

	.nsa-card-header {
		text-align: center;
		width: 100%;
	}

	.person-name {
		font-size: 12pt;
		font-weight: 700;
		line-height: 1.15;
	}

	.org-name {
		font-size: 9pt;
		margin-top: 0.5mm;
		line-height: 1.15;
	}

	.qr-wrapper {
		flex: 1 1 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 0;
		padding: 1.5mm 0;
	}

	.qr-wrapper :global(.qr-code) {
		width: min(48mm, 100%);
		aspect-ratio: 1 / 1;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		gap: 2mm;
		width: 100%;
		font-size: 6.5pt;
		opacity: 0.65;
	}
</style>
