/** Resolves the current DaisyUI theme colors a chart needs by measuring a hidden element. */
export function readChartColors() {
	const el = Object.assign(document.createElement('div'), {
		className: 'text-primary bg-transparent',
		style: 'position:absolute;visibility:hidden'
	});
	document.body.appendChild(el);
	const primaryColor = getComputedStyle(el).color;
	el.className = 'text-base-content/20 bg-transparent';
	const gridColor = getComputedStyle(el).color;
	el.className = 'text-base-content/60 bg-transparent';
	const labelColor = getComputedStyle(el).color;
	el.remove();
	return { primaryColor, gridColor, labelColor };
}
