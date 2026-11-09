import { describe, expect, it, vi } from 'vitest';
import { syncRequestToasts } from './requestToasts';

function setup() {
	const notified = new Set<string>();
	const open = new Map<string, string>();
	const show = vi.fn((req: { id: string }) => {
		notified.add(req.id);
		open.set(req.id, `toast-${req.id}`);
	});
	const dismiss = vi.fn();
	return { notified, open, show, dismiss };
}

describe('syncRequestToasts', () => {
	it('only notes the requests pending when the committee opens', () => {
		const deps = setup();
		const initialized = syncRequestToasts({
			...deps,
			pending: [{ id: 'old' }],
			initialized: false
		});
		expect(initialized).toBe(true);
		expect(deps.notified.has('old')).toBe(true);
		expect(deps.show).not.toHaveBeenCalled();
	});

	it('toasts new requests and dismisses the toasts of closed ones', () => {
		const deps = setup();
		syncRequestToasts({ ...deps, pending: [{ id: 'old' }], initialized: false });
		syncRequestToasts({ ...deps, pending: [{ id: 'old' }, { id: 'new' }], initialized: true });
		expect(deps.show).toHaveBeenCalledExactlyOnceWith({ id: 'new' });

		syncRequestToasts({ ...deps, pending: [{ id: 'old' }], initialized: true });
		expect(deps.dismiss).toHaveBeenCalledExactlyOnceWith('toast-new');
		expect(deps.open.size).toBe(0);
		expect(deps.notified.has('new')).toBe(true);
	});
});
