import { afterEach, describe, expect, it, vi } from 'vitest';
import { dodgeOnHover, isNearBox } from './dodgeOnHover';

const box = { left: 100, right: 200, top: 100, bottom: 150 };

describe('isNearBox', () => {
	it('counts the padding around the box as near', () => {
		expect(isNearBox({ box, x: 150, y: 120 })).toBe(true);
		expect(isNearBox({ box, x: 76, y: 76 })).toBe(true);
		expect(isNearBox({ box, x: 224, y: 174 })).toBe(true);
	});

	it('is false outside the padding', () => {
		expect(isNearBox({ box, x: 75, y: 120 })).toBe(false);
		expect(isNearBox({ box, x: 225, y: 120 })).toBe(false);
		expect(isNearBox({ box, x: 150, y: 75 })).toBe(false);
		expect(isNearBox({ box, x: 150, y: 175 })).toBe(false);
		expect(isNearBox({ box, x: 150, y: 175, pad: 30 })).toBe(true);
	});
});

describe('dodgeOnHover', () => {
	afterEach(() => vi.unstubAllGlobals());

	it('reports mouse moves near the node and resets on cleanup', () => {
		const target = new EventTarget();
		vi.stubGlobal('window', target);
		const onChange = vi.fn();
		const node = { getBoundingClientRect: () => box };
		const cleanup = dodgeOnHover(onChange)(node);

		const move = (x: number, y: number) =>
			target.dispatchEvent(Object.assign(new Event('mousemove'), { clientX: x, clientY: y }));
		move(150, 120);
		move(0, 0);
		expect(onChange.mock.calls).toEqual([[true], [false]]);

		cleanup();
		move(150, 120);
		expect(onChange.mock.calls).toEqual([[true], [false], [false]]);
	});
});
