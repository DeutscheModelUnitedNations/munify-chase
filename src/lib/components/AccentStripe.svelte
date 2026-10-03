<script lang="ts">
	// The DMUN Akzentstreifen: the corporate design's one rounded shape.
	// Use at most one or two per surface.
	interface Props {
		long?: boolean;
		inverse?: boolean;
	}

	let { long = false, inverse = false }: Props = $props();
</script>

<div
	aria-hidden="true"
	class="h-2 flex-none rounded-full {long ? 'w-44' : 'w-24'} {inverse
		? 'bg-neutral-content'
		: 'bg-accent'}"
></div>
