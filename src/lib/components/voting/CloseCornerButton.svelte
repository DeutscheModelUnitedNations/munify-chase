<script lang="ts">
	interface Props {
		onclick: () => void;
	}

	let { onclick }: Props = $props();
</script>

<div class="absolute top-3 right-3">
	<button aria-label="Close modal" class="btn btn-ghost btn-circle btn-sm" {onclick}>
		<i aria-hidden="true" class="ph-duotone ph-x"></i>
	</button>
</div>
