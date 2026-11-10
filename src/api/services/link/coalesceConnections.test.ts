import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { coalesceConnections, RECONNECT_DEBOUNCE_MS } from './coalesceConnections';

describe('coalesceConnections', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	test('reports the first connection once, not every subscription connecting', () => {
		const onConnected = vi.fn();
		const { connected } = coalesceConnections(onConnected);

		connected(false);
		connected(false);
		connected(false);

		expect(onConnected).toHaveBeenCalledTimes(1);
		expect(onConnected).toHaveBeenCalledWith(false);
	});

	test('reports a burst of reconnects once, after the last of them', () => {
		const onConnected = vi.fn();
		const { connected } = coalesceConnections(onConnected);
		connected(false);
		onConnected.mockClear();

		connected(true);
		vi.advanceTimersByTime(RECONNECT_DEBOUNCE_MS - 1);
		connected(true);
		vi.advanceTimersByTime(RECONNECT_DEBOUNCE_MS - 1);
		expect(onConnected).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		expect(onConnected).toHaveBeenCalledTimes(1);
		expect(onConnected).toHaveBeenCalledWith(true);
	});

	test('reports each later burst again', () => {
		const onConnected = vi.fn();
		const { connected } = coalesceConnections(onConnected);

		connected(true);
		vi.advanceTimersByTime(RECONNECT_DEBOUNCE_MS);
		connected(true);
		vi.advanceTimersByTime(RECONNECT_DEBOUNCE_MS);

		expect(onConnected.mock.calls).toEqual([[true], [true]]);
	});

	test('reports nothing pending once disposed', () => {
		const onConnected = vi.fn();
		const { connected, dispose } = coalesceConnections(onConnected);

		connected(true);
		dispose();
		vi.advanceTimersByTime(RECONNECT_DEBOUNCE_MS);

		expect(onConnected).not.toHaveBeenCalled();
	});
});
