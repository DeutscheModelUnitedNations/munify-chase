<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { onMount } from 'svelte';
	import { createDetectionThrottle, errorText } from './detectionThrottle';

	interface Props {
		// Called every time a code is detected. Caller is responsible for
		// validating/applying it. Re-fires of the same code are throttled by
		// `debounceMs` so a chair can hold a card under the camera without
		// triggering hundreds of mutations.
		onDetect: (text: string) => void;
		debounceMs?: number;
		// Disable detection without unmounting (e.g. during a confirmation toast).
		paused?: boolean;
	}

	let { onDetect, debounceMs = 1500, paused = false }: Props = $props();

	let video: HTMLVideoElement | undefined = $state();
	let errorMessage = $state<string | null>(null);
	let starting = $state(true);

	const shouldFire = createDetectionThrottle(() => debounceMs);

	function handleResult(result: { getText(): string } | undefined) {
		if (paused || !result) return;
		const text = result.getText();
		if (shouldFire(text, Date.now())) onDetect(text);
	}

	async function startPreview(isCancelled: () => boolean) {
		const { BrowserMultiFormatReader } = await import('@zxing/browser');
		if (isCancelled() || !video) return undefined;
		return new BrowserMultiFormatReader().decodeFromVideoDevice(undefined, video, handleResult);
	}

	onMount(() => {
		let controls: { stop: () => void } | undefined;
		let cancelled = false;

		startPreview(() => cancelled).then(
			(previewControls) => {
				if (!previewControls) return;
				if (cancelled) {
					previewControls.stop();
					return;
				}
				controls = previewControls;
				starting = false;
			},
			(e) => {
				if (cancelled) return;
				errorMessage = errorText(e);
				starting = false;
			}
		);

		return () => {
			cancelled = true;
			controls?.stop();
		};
	});
</script>

<div class="relative aspect-square w-full overflow-hidden rounded-lg bg-black">
	<video bind:this={video} class="h-full w-full object-cover" muted playsinline></video>

	{#if starting && !errorMessage}
		<div class="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{/if}

	{#if errorMessage}
		<div
			class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/85 p-4 text-center text-white"
		>
			<span class="text-3xl">📷</span>
			<p class="text-sm">{m.qrScannerError()}</p>
			<p class="text-xs opacity-75">{errorMessage}</p>
		</div>
	{/if}

	<!-- Aiming reticle to help chairs frame the QR card -->
	{#if !errorMessage}
		<div class="pointer-events-none absolute inset-[15%] rounded-lg border-2 border-white/70"></div>
	{/if}
</div>
