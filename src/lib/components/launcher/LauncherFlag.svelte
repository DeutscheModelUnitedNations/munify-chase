<script lang="ts">
	import Flag from '#lib/components/Flag.svelte';
	import { representationOrUn } from '#lib/components/flag';

	type RepresentationType = 'DELEGATION' | 'NSA' | 'UN';

	interface Props {
		representation?: {
			type?: RepresentationType | null;
			alpha2Code?: string | null;
			alpha3Code?: string | null;
			icon?: string | null;
		} | null;
		size?: 32 | 36 | 44;
	}

	let { representation = null, size = 36 }: Props = $props();

	// Show the user's own delegation flag whenever a representation with a real
	// country code is present (regardless of role); fall back to UN otherwise.
	const effectiveRep = $derived(representationOrUn(representation));
</script>

<div class="shrink-0 leading-none" style:width="{size}px">
	<Flag size="full" representation={effectiveRep} />
</div>
