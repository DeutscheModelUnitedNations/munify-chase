<script lang="ts">
	import type { ChartConfiguration } from 'chart.js';

	export type ThemeColors = { primary: string; grid: string; label: string };

	interface Props {
		/** The chart for the theme's colours; pass a new function to redraw it */
		build: (colors: ThemeColors) => ChartConfiguration<'line'>;
		height: number;
	}
	let { build, height }: Props = $props();

	let canvas: HTMLCanvasElement | undefined = $state();

	/** The computed colour of each class, read off a hidden element. */
	function themeColors(): ThemeColors {
		const el = Object.assign(document.createElement('div'), {
			style: 'position:absolute;visibility:hidden'
		});
		document.body.appendChild(el);
		const colorOf = (className: string) => {
			el.className = `${className} bg-transparent`;
			return getComputedStyle(el).color;
		};
		const colors = {
			primary: colorOf('text-primary'),
			grid: colorOf('text-base-content/20'),
			label: colorOf('text-base-content/60')
		};
		el.remove();
		return colors;
	}

	$effect(() => {
		if (!canvas) return;
		const target = canvas;
		const make = build;
		let destroyed = false;
		let chart: import('chart.js').Chart | undefined;

		(async () => {
			const { Chart } = await import('chart.js/auto');
			if (destroyed) return;
			chart = new Chart(target, make(themeColors()));
		})();

		return () => {
			destroyed = true;
			chart?.destroy();
		};
	});
</script>

<div style="height:{height}px">
	<canvas bind:this={canvas}></canvas>
</div>
