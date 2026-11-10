import { describe, expect, test, vi } from 'vitest';

vi.mock('#lib/api/rumbleClient/client', () => ({ client: {} }));
const { syncLinkBothWays } = await import('./delegatorLink');

describe('syncLinkBothWays', () => {
	test('asks both sides', async () => {
		const requestLocal = vi.fn(() => Promise.resolve(true));
		const requestRemote = vi.fn(() => Promise.resolve(true));
		const { local, remote } = await syncLinkBothWays({ requestLocal, requestRemote });
		expect(requestLocal).toHaveBeenCalledOnce();
		expect(requestRemote).toHaveBeenCalledOnce();
		expect(local).toEqual({ status: 'fulfilled', value: true });
		expect(remote).toEqual({ status: 'fulfilled', value: true });
	});

	test('a DELEGATOR that cannot be asked leaves this side syncing, and is reported', async () => {
		const failure = new Error('DELEGATOR could not be asked to sync');
		const { local, remote } = await syncLinkBothWays({
			requestLocal: () => Promise.resolve(true),
			requestRemote: () => Promise.reject(failure)
		});
		expect(local).toEqual({ status: 'fulfilled', value: true });
		expect(remote).toEqual({ status: 'rejected', reason: failure });
	});
});
