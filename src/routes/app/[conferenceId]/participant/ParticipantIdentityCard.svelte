<script lang="ts">
	import Flag from '$lib/components/Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';

	interface Props {
		representation?: {
			name?: string | null;
			alpha2Code?: string | null;
			alpha3Code?: string | null;
			type?: 'DELEGATION' | 'NSA' | 'UN';
			faIcon?: string | null;
		} | null;
	}

	let { representation }: Props = $props();

	let displayName = $derived(
		representation?.name || getTranslatedCountryNameFromAlpha3Code(representation?.alpha3Code)
	);
</script>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body flex-row items-center gap-4 p-4">
		{#if representation}
			<Flag {representation} size="xs" />
		{:else}
			<Flag size="xs" placeholder />
		{/if}
		<span class="font-semibold">{displayName}</span>
	</div>
</div>
