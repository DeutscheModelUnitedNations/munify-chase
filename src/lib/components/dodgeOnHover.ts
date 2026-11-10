interface Box {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

/** Whether the point lies within `pad` pixels of the box. */
export function isNearBox({
	box,
	x,
	y,
	pad = 24
}: {
	box: Box;
	x: number;
	y: number;
	pad?: number;
}) {
	return x >= box.left - pad && x <= box.right + pad && y >= box.top - pad && y <= box.bottom + pad;
}

/**
 * Tells `onChange` whether the mouse is near the element, so a floating notice
 * can step aside instead of covering what is under it.
 */
export function dodgeOnHover(onChange: (dodging: boolean) => void) {
	return (node: { getBoundingClientRect(): Box }) => {
		const onMove = (e: MouseEvent) =>
			onChange(isNearBox({ box: node.getBoundingClientRect(), x: e.clientX, y: e.clientY }));
		window.addEventListener('mousemove', onMove);
		return () => {
			window.removeEventListener('mousemove', onMove);
			onChange(false);
		};
	};
}
