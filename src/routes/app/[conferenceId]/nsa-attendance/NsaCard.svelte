<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import QrCodeSvg from '$lib/components/qr/QrCodeSvg.svelte';

	interface Props {
		nsaUser: {
			id: string;
			userEmail: string;
			attendanceCode: string | null;
			orgName: string | null;
		};
		conferenceTitle: string;
	}

	let { nsaUser, conferenceTitle }: Props = $props();
</script>

<div class="nsa-card">
	<div class="nsa-card-header">
		<div class="conference-title">{conferenceTitle}</div>
		<div class="org-name">{nsaUser.orgName ?? m.unknown()}</div>
		<div class="user-email">{nsaUser.userEmail}</div>
	</div>

	<div class="qr-wrapper">
		<QrCodeSvg data={nsaUser.id} errorCorrection="Q" />
	</div>

	{#if nsaUser.attendanceCode}
		<div class="code-row">
			<span class="code-label">{m.attendanceCode()}</span>
			<span class="code-value">{nsaUser.attendanceCode}</span>
		</div>
	{:else}
		<div class="code-row">
			<span class="code-label">{m.attendanceCode()}</span>
			<span class="code-missing">—</span>
		</div>
	{/if}
</div>

<style>
	.nsa-card {
		width: 85mm;
		height: 110mm;
		padding: 4mm;
		border: 1px dashed #999;
		border-radius: 2mm;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2mm;
		background: white;
		color: black;
		font-family: 'Outfit', system-ui, sans-serif;
		break-inside: avoid;
	}

	.nsa-card-header {
		text-align: center;
		width: 100%;
	}

	.conference-title {
		font-size: 9pt;
		opacity: 0.65;
		line-height: 1.2;
	}

	.org-name {
		font-size: 14pt;
		font-weight: 700;
		margin-top: 1mm;
		line-height: 1.15;
	}

	.user-email {
		font-size: 9pt;
		opacity: 0.85;
		margin-top: 0.5mm;
		word-break: break-all;
	}

	.qr-wrapper {
		flex: 1 1 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 0;
		padding: 2mm 0;
	}

	.qr-wrapper :global(.qr-code) {
		width: min(60mm, 100%);
		aspect-ratio: 1 / 1;
	}

	.code-row {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5mm;
	}

	.code-label {
		font-size: 7pt;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		opacity: 0.6;
	}

	.code-value {
		font-family: 'Roboto Mono', ui-monospace, monospace;
		font-size: 16pt;
		font-weight: 600;
		letter-spacing: 0.15em;
	}

	.code-missing {
		font-family: 'Roboto Mono', ui-monospace, monospace;
		font-size: 16pt;
		font-weight: 600;
		opacity: 0.4;
	}
</style>
