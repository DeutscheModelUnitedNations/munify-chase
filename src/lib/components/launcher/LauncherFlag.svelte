<script lang="ts">
	import Flag from '$lib/components/Flag.svelte';
	import type { LauncherBadge } from '$lib/helpers/launcher';

	type RepresentationType = 'DELEGATION' | 'NSA' | 'UN';

	interface Props {
		role: LauncherBadge;
		representation?: {
			type?: RepresentationType | null;
			alpha2Code?: string | null;
			alpha3Code?: string | null;
			faIcon?: string | null;
		} | null;
		size?: 32 | 36 | 44;
	}

	let { role, representation = null, size = 36 }: Props = $props();

	// Show the user's own delegation flag whenever a representation with a real
	// country code is present (regardless of role); fall back to UN otherwise.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const effectiveRep = $derived.by<any>(() => {
		if (representation?.alpha3Code || representation?.alpha2Code || representation?.faIcon) {
			return representation;
		}
		return { type: 'UN' };
	});
</script>

<div class="shrink-0 leading-none" style:width="{size}px">
	<Flag size="full" representation={effectiveRep} />
</div>
