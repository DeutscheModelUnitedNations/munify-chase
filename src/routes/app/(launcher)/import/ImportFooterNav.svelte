<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { IMPORT_STEP_COUNT } from './importWizard';

	interface Props {
		/** The current step, from 1 */
		step: number;
		onStep: (step: number) => void;
	}

	let { step, onStep }: Props = $props();
</script>

<footer
	class="bg-base-100/90 border-base-content/10 sticky bottom-0 flex items-center justify-between gap-4 border-t px-6 py-3 backdrop-blur"
>
	<button class="btn" onclick={() => onStep(step - 1)}>
		<i aria-hidden="true" class="ph-fill ph-arrow-left"></i>
		{m.back()}
	</button>
	<div class="text-base-content/55 text-sm">
		{m.stepXofY({ current: step, total: IMPORT_STEP_COUNT })}
	</div>
	<button class="btn btn-primary" onclick={() => onStep(step + 1)}>
		{step === IMPORT_STEP_COUNT - 1 ? m.goToReview() : m.forward()}
		<i aria-hidden="true" class="ph-fill ph-arrow-right"></i>
	</button>
</footer>
