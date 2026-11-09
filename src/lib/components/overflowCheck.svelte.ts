import { onMount } from 'svelte';

/**
 * Whether the element bound to `element` is wider than it shows, checked on mount
 * and on every window resize. Call during component init.
 */
export function createOverflowCheck() {
	let element = $state<HTMLElement>();
	let overflowing = $state(false);

	function check() {
		if (element) overflowing = element.scrollWidth > element.clientWidth;
	}

	onMount(() => {
		check();
		window.addEventListener('resize', check);
		return () => window.removeEventListener('resize', check);
	});

	return {
		get element() {
			return element;
		},
		set element(value) {
			element = value;
		},
		get overflowing() {
			return overflowing;
		}
	};
}
