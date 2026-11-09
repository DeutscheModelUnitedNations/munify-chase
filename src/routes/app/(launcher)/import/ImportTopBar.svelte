<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '#lib/paraglide/messages';

	interface Props {
		/** The wizard's step, 0 is the start page */
		step: number;
		/** Whether there is data to show and save yet */
		hasData: boolean;
		showJsonPanel: boolean;
		onBack: () => void;
		onToggleJson: () => void;
		onDownload: () => void;
	}

	let { step, hasData, showJsonPanel, onBack, onToggleJson, onDownload }: Props = $props();

	const onStart = $derived(step === 0);

	/** Back to the launcher from the start page, else one step back */
	function handleBack(e: MouseEvent) {
		if (onStart) return;
		e.preventDefault();
		onBack();
	}
</script>

<header class="navbar bg-base-100 sticky top-0 z-20 shadow-sm">
	<div class="flex flex-1 items-center gap-2">
		<a
			class="btn btn-ghost"
			href={onStart ? resolve('/app/(launcher)') : undefined}
			onclick={handleBack}
		>
			<i aria-hidden="true" class="ph-fill ph-arrow-left"></i>
			{onStart ? m.launcher() : m.back()}
		</a>
	</div>
	<div class="flex items-center gap-1">
		{#if hasData}
			<button type="button" class="btn btn-ghost btn-sm" onclick={onToggleJson}>
				<i aria-hidden="true" class="ph-fill ph-code"></i>
				{showJsonPanel ? m.hideJson() : m.viewJson()}
			</button>
			<button type="button" class="btn btn-ghost btn-sm" onclick={onDownload}>
				<i aria-hidden="true" class="ph-fill ph-download-simple"></i>
				{m.save()}
			</button>
		{/if}
	</div>
</header>
