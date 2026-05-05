<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	interface Props {
		onPickFile: (file: File) => void;
		onCreateFresh: () => void;
		loading?: boolean;
	}

	let { onPickFile, onCreateFresh, loading = false }: Props = $props();

	let fileInput: HTMLInputElement;
	let dragActive = $state(false);

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const f = target.files?.[0];
		if (f) onPickFile(f);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragActive = false;
		const f = e.dataTransfer?.files?.[0];
		if (f && f.name.toLowerCase().endsWith('.json')) onPickFile(f);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragActive = true;
	}

	function handleDragLeave() {
		dragActive = false;
	}
</script>

<div
	role="region"
	aria-label="Drop zone"
	ondrop={handleDrop}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	class="flex w-full flex-col items-center gap-10"
>
	<div class="max-w-prose text-center">
		<div class="text-primary text-xs font-semibold tracking-widest uppercase">
			{m.howToBeginEyebrow()}
		</div>
		<h1 class="mt-2 mb-3 text-4xl leading-tight font-bold">{m.howToBeginTitle()}</h1>
		<p class="text-base-content/70 text-lg">{m.howToBeginSubtitle()}</p>
	</div>

	<input
		bind:this={fileInput}
		type="file"
		accept=".json"
		class="hidden"
		onchange={handleFileChange}
	/>

	<div class="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
		<button
			type="button"
			class="card bg-base-100 hover:border-primary cursor-pointer flex-col items-start gap-4 border-2 border-transparent p-8 text-left shadow transition hover:-translate-y-0.5"
			onclick={() => fileInput?.click()}
			disabled={loading}
		>
			<div class="bg-primary/15 text-primary grid h-14 w-14 place-items-center rounded-xl text-2xl">
				<i class="fa-solid fa-file-import"></i>
			</div>
			<div>
				<h3 class="mb-1 text-xl font-bold">{m.uploadFileTitle()}</h3>
				<p class="text-base-content/65 m-0 text-sm">{m.uploadFileDescription()}</p>
			</div>
			<div class="text-primary mt-auto flex items-center gap-2 text-sm font-semibold">
				{#if loading}
					<span class="loading loading-spinner loading-sm"></span>
				{:else}
					<span>{m.uploadFileCta()}</span>
					<i class="fa-solid fa-arrow-right"></i>
				{/if}
			</div>
		</button>

		<button
			type="button"
			class="card bg-base-100 hover:border-accent cursor-pointer flex-col items-start gap-4 border-2 border-transparent p-8 text-left shadow transition hover:-translate-y-0.5"
			onclick={onCreateFresh}
			disabled={loading}
		>
			<div
				class="bg-accent/25 text-accent-content grid h-14 w-14 place-items-center rounded-xl text-2xl"
			>
				<i class="fa-solid fa-sparkles"></i>
			</div>
			<div>
				<h3 class="mb-1 text-xl font-bold">{m.startFreshTitle()}</h3>
				<p class="text-base-content/65 m-0 text-sm">{m.startFreshDescription()}</p>
			</div>
			<div class="text-accent-content mt-auto flex items-center gap-2 text-sm font-semibold">
				<span>{m.startFreshCta()}</span>
				<i class="fa-solid fa-arrow-right"></i>
			</div>
		</button>
	</div>

	<div
		class="text-base-content/60 flex w-full max-w-4xl items-center justify-center gap-3 rounded-box border-2 border-dashed p-5 text-sm transition
			{dragActive ? 'border-primary bg-primary/10' : 'border-base-content/20 bg-base-100/60'}"
	>
		<i class="fa-solid fa-cloud-arrow-up"></i>
		<span>{m.dropJsonHint()}</span>
	</div>
</div>
