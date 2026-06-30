<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { AiPreference } from '$lib/ai/aiPreference.svelte';
	import { LOCAL_MODEL_TIERS } from '$lib/ai/assess';

	interface Props {
		open: boolean;
		hasBackend: boolean;
		initialModelTier: number | null;
		onConfirm: (mode: AiPreference, modelTier: number | null) => void;
	}

	let { open = $bindable(), hasBackend, initialModelTier, onConfirm }: Props = $props();

	let userOverride = $state<AiPreference | null>(null);
	const selected = $derived<AiPreference>(userOverride ?? (hasBackend ? 'backend' : 'local'));

	// -1 = auto, 0..3 = specific tier. Undefined means user hasn't touched it yet.
	let tierOverride = $state<number | undefined>(undefined);
	const tierSlider = $derived<number>(tierOverride !== undefined ? tierOverride : (initialModelTier ?? -1));
	const effectiveTier = $derived<number | null>(tierSlider === -1 ? null : tierSlider);
	const previewTier = $derived(effectiveTier ?? LOCAL_MODEL_TIERS.length - 1);

	function confirm() {
		open = false;
		onConfirm(selected, effectiveTier);
	}
</script>

<Modal bind:open closeOnEsc={false}>
	<h3 class="text-lg font-bold mb-4 flex items-center gap-2">
		<i class="fas fa-robot opacity-60"></i>
		{m.aiOnboardingTitle()}
	</h3>

	<div class="space-y-4 text-sm">
		<section>
			<p class="font-semibold mb-1">{m.aiOnboardingWhatTitle()}</p>
			<ul class="list-disc list-inside space-y-0.5 opacity-80">
				<li>{m.aiOnboardingWhatItem1()}</li>
				<li>{m.aiOnboardingWhatItem2()}</li>
				<li>{m.aiOnboardingWhatItem3()}</li>
			</ul>
		</section>

		<section>
			<p class="font-semibold mb-1">{m.aiOnboardingHowTitle()}</p>
			<div class="space-y-2 opacity-80">
				{#if hasBackend}
					<p><span class="font-medium opacity-100">Backend AI —</span> {m.aiOnboardingBackendDesc()}</p>
				{/if}
				<p><span class="font-medium opacity-100">Local AI —</span> {m.aiOnboardingLocalDesc()}</p>
			</div>
		</section>

		<div class="alert alert-warning py-2 text-xs">
			<i class="fas fa-triangle-exclamation shrink-0"></i>
			<span>{m.aiOnboardingDisclaimer()}</span>
		</div>

		<section>
			<p class="font-semibold mb-2">{m.aiOnboardingChooseMode()}</p>
			<div class="flex flex-col gap-2">
				<label class="flex items-center gap-3 {hasBackend ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}">
					<input
						type="radio"
						class="radio radio-sm"
						checked={selected === 'backend'}
						disabled={!hasBackend}
						onchange={() => (userOverride = 'backend')}
					/>
					<span>{hasBackend ? m.aiOnboardingModeBackend() : m.aiOnboardingModeBackendDisabled()}</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="radio"
						class="radio radio-sm"
						checked={selected === 'local'}
						onchange={() => (userOverride = 'local')}
					/>
					<span>{m.aiOnboardingModeLocal()}</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="radio"
						class="radio radio-sm"
						checked={selected === 'off'}
						onchange={() => (userOverride = 'off')}
					/>
					<span>{m.aiOnboardingModeOff()}</span>
				</label>
			</div>
		</section>

		{#if selected === 'local'}
			<section class="border-t border-base-300 pt-4">
				<p class="font-semibold mb-3">{m.aiOnboardingModelTitle()}</p>
				<div class="space-y-3">
					<div class="flex items-center justify-between text-xs">
						<span class="opacity-60">{m.aiOnboardingModelFastest()}</span>
						<span class="font-medium">
							{tierSlider === -1
								? m.aiOnboardingModelAuto()
								: LOCAL_MODEL_TIERS[previewTier].label}
						</span>
						<span class="opacity-60">{m.aiOnboardingModelBest()}</span>
					</div>
					<input
						type="range"
						class="range range-sm range-primary w-full"
						min={-1}
						max={LOCAL_MODEL_TIERS.length - 1}
						step={1}
						value={tierSlider}
						oninput={(e) => (tierOverride = Number(e.currentTarget.value))}
					/>
					<p class="text-xs opacity-50 text-center">
						{#if tierSlider === -1}
							{m.aiOnboardingModelAuto()} — picks the best model that fits your GPU
						{:else}
							{LOCAL_MODEL_TIERS[previewTier].id.replace(/-q\d+f\d+.*$/, '').replaceAll('-', ' ')}
							· {m.aiOnboardingModelVram({ vram: LOCAL_MODEL_TIERS[previewTier].vramMB })}
						{/if}
					</p>
					{#if tierSlider !== -1}
						<div class="alert alert-warning py-1.5 text-xs mt-1">
							<i class="fas fa-triangle-exclamation shrink-0"></i>
							<span>{m.aiOnboardingModelCrashWarning()}</span>
						</div>
					{/if}
				</div>
			</section>
		{/if}
	</div>

	<div class="modal-action mt-5">
		<button class="btn btn-primary btn-sm" onclick={confirm}>
			{m.aiOnboardingConfirm()}
		</button>
	</div>
</Modal>
