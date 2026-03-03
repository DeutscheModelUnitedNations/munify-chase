<script lang="ts">
	import { browser } from '$app/environment';

	interface Props {
		hotkey: string;
		size?: 'xs' | 'sm';
		class?: string;
	}

	let { hotkey, size, class: className }: Props = $props();

	const isMac = browser && /Mac|iPhone|iPad|iPod/.test(navigator.platform);

	const macModifiers: Record<string, string> = {
		alt: '\u2325',
		shift: '\u21E7',
		ctrl: '\u2303',
		mod: '\u2318',
		enter: '\u21B5',
		space: '\u2423',
		backspace: '\u232B',
		esc: 'Esc'
	};

	const nonMacModifiers: Record<string, string> = {
		alt: 'Alt',
		shift: 'Shift',
		ctrl: 'Ctrl',
		mod: 'Ctrl',
		enter: '\u21B5',
		space: '\u2423',
		backspace: '\u232B',
		esc: 'Esc'
	};

	const formatted = $derived(
		hotkey
			.split('+')
			.map((part) => {
				const key = part.trim().toLowerCase();
				if (isMac) return macModifiers[key] ?? part.trim();
				return nonMacModifiers[key] ?? part.trim();
			})
			.join(isMac ? '' : '+')
	);
</script>

<span class="kbd{size ? ` kbd-${size}` : ''}{className ? ` ${className}` : ''}">{formatted}</span>
