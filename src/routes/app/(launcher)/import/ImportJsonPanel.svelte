<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import type { ImportData } from './importWizard';

	interface Props {
		data: ImportData;
		onClose: () => void;
	}

	let { data, onClose }: Props = $props();
</script>

<aside
	class="bg-primary text-primary-content fixed inset-y-0 right-0 z-40 w-96 overflow-auto p-5 shadow-2xl"
>
	<div class="mb-4 flex items-center justify-between">
		<strong>{m.viewJson()}</strong>
		<button class="btn btn-ghost btn-sm text-primary-content" onclick={onClose} aria-label="Close">
			<i aria-hidden="true" class="ph-fill ph-x"></i>
		</button>
	</div>
	<pre
		class="m-0 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap">{JSON.stringify(
			data,
			null,
			2
		)}</pre>
</aside>
