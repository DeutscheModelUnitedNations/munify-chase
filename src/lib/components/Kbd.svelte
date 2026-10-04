<script lang="ts">
	import { formatHotkey } from '$lib/helpers/hotkey';

	interface Props {
		hotkey: string;
		size?: 'xs' | 'sm';
		class?: string;
	}

	let { hotkey, size, class: className }: Props = $props();

	const formatted = $derived(formatHotkey(hotkey));
</script>

<span class="kbd{size ? ` kbd-${size}` : ''}{className ? ` ${className}` : ''}">{formatted}</span>
