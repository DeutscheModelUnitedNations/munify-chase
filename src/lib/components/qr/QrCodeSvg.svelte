<script lang="ts">
	import { untrack } from 'svelte';

	interface Props {
		data: string;
		// Module count target — actual size depends on data length / EC level.
		// Provide a CSS class on the wrapper if you need fixed pixel rendering.
		// Higher EC adds ~30% redundancy; useful for printed cards that may smudge.
		errorCorrection?: 'L' | 'M' | 'Q' | 'H';
		className?: string;
	}

	let { data, errorCorrection = 'M', className = '' }: Props = $props();

	let svgMarkup = $state('');

	$effect(() => {
		// Re-run on data/errorCorrection change. Lib is dynamically imported so
		// participant pages don't pay the cost.
		const currentData = data;
		const currentEc = errorCorrection;
		untrack(() => {
			(async () => {
				const QRCode = await import('qrcode');
				try {
					svgMarkup = await QRCode.toString(currentData, {
						type: 'svg',
						errorCorrectionLevel: currentEc,
						margin: 1
					});
				} catch (e) {
					svgMarkup = '';
					console.warn('QR rendering failed', e);
				}
			})();
		});
	});
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<div class="qr-code {className}">{@html svgMarkup}</div>

<style>
	.qr-code :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
