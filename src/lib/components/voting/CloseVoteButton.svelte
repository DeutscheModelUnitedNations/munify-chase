<script lang="ts">
	import Kbd from '#lib/components/Kbd.svelte';
	import { m } from '#lib/paraglide/messages';

	interface Props {
		onclick: () => void;
		class?: string;
	}

	let { onclick, class: className = '' }: Props = $props();
</script>

<div class="modal-action {className}">
	<button class="btn btn-lg flex gap-2" {onclick}>
		<i aria-hidden="true" class="ph-fill ph-x"></i>
		{m.close()}
		<Kbd hotkey="esc" />
	</button>
</div>
