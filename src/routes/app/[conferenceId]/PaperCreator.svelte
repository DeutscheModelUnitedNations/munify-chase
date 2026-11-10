<script lang="ts">
	import Flag from '#lib/components/Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';

	interface Props {
		representation: {
			name?: string | null;
			alpha2Code?: string | null;
			alpha3Code?: string | null;
			icon?: string | null;
			type?: string | null;
		};
		class?: string;
	}
	let { representation, class: className = '' }: Props = $props();
</script>

<div class="flex items-center gap-1 {className}">
	<Flag size="xs" {representation} />
	<span
		>{representation.name ??
			getTranslatedCountryNameFromAlpha3Code(representation.alpha3Code)}</span
	>
</div>
