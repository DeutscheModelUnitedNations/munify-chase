import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createPubSub } from 'graphql-yoga';
import { GraphQLError } from 'graphql';
import type { Context } from '#api/context';

const config = vi.hoisted(() => ({ current: undefined as { remoteUrl: string } | undefined }));
const remote = vi.hoisted(() => ({
	requestLinkSync: vi.fn<() => Promise<boolean>>(),
	dispose: vi.fn()
}));

vi.mock('#api/rumble', () => ({
	instanceSignals: createPubSub<{ linkSyncRequested: [request: { at: string }] }>()
}));
vi.mock('#api/services/authHelper', () => ({
	isGlobalAdmin: (ctx: { globalAdmin?: boolean }) => !!ctx.globalAdmin
}));
vi.mock('./linkAuth', () => ({
	linkConfig: () => config.current,
	linkAccessToken: () => Promise.resolve('link-token')
}));
vi.mock('./delegatorRemote', () => ({
	createDelegatorClient: () => ({
		mutate: { requestLinkSync: remote.requestLinkSync },
		dispose: remote.dispose
	})
}));

const {
	assertCanRequestLinkSync,
	assertCanRequestRemoteLinkSync,
	followSyncRequests,
	requestLinkSync,
	requestRemoteLinkSync
} = await import('./linkSync');
const { instanceSignals } = await import('#api/rumble');

/** A caller as far as the checks read it. */
function caller({ globalAdmin = false, roles = [] as string[] } = {}) {
	// TYPE-SAFETY-EXCEPTION: the checks read only whether the caller is a global admin and its
	// roles; a real context would need a SvelteKit request.
	return { globalAdmin, hasRole: (role: string) => roles.includes(role) } as unknown as Context;
}

const settled = () => new Promise((resolve) => setTimeout(resolve, 0));

afterEach(() => {
	config.current = undefined;
	remote.requestLinkSync.mockReset();
	remote.dispose.mockReset();
	vi.useRealTimers();
});

describe('who may ask for a sync', () => {
	test('global admins and the linked DELEGATOR, nobody else', () => {
		expect(() => assertCanRequestLinkSync(caller({ globalAdmin: true }))).not.toThrow();
		expect(() => assertCanRequestLinkSync(caller({ roles: ['delegator'] }))).not.toThrow();
		expect(() => assertCanRequestLinkSync(caller())).toThrow(GraphQLError);
		expect(() => assertCanRequestLinkSync(caller({ roles: ['member'] }))).toThrow(GraphQLError);
	});

	test('only global admins make this instance ask DELEGATOR, never DELEGATOR itself', () => {
		expect(() => assertCanRequestRemoteLinkSync(caller({ globalAdmin: true }))).not.toThrow();
		expect(() => assertCanRequestRemoteLinkSync(caller({ roles: ['delegator'] }))).toThrow(
			GraphQLError
		);
		expect(() => assertCanRequestRemoteLinkSync(caller())).toThrow(GraphQLError);
	});
});

describe('requestLinkSync', () => {
	test('answers false and signals nothing while unlinked', async () => {
		const sync = vi.fn();
		const stop = followSyncRequests({
			requests: instanceSignals.subscribe('linkSyncRequested'),
			sync
		});
		expect(requestLinkSync()).toBe(false);
		await settled();
		expect(sync).not.toHaveBeenCalled();
		stop();
	});

	test('signals the instance holding the worker, which reads everything again', async () => {
		config.current = { remoteUrl: 'https://delegator.example' };
		const sync = vi.fn();
		const stop = followSyncRequests({
			requests: instanceSignals.subscribe('linkSyncRequested'),
			sync
		});
		await settled();
		expect(requestLinkSync()).toBe(true);
		await settled();
		expect(sync).toHaveBeenCalledOnce();
		stop();
	});
});

describe('requestRemoteLinkSync', () => {
	test('answers false while unlinked, without calling anybody', async () => {
		expect(await requestRemoteLinkSync()).toBe(false);
		expect(remote.requestLinkSync).not.toHaveBeenCalled();
	});

	test("asks DELEGATOR's requestLinkSync and answers what it said", async () => {
		config.current = { remoteUrl: 'https://delegator.example' };
		remote.requestLinkSync.mockResolvedValue(true);
		expect(await requestRemoteLinkSync()).toBe(true);
		expect(remote.requestLinkSync).toHaveBeenCalledOnce();
		expect(remote.dispose).toHaveBeenCalledOnce();
	});

	test('a DELEGATOR that fails is a CONFLICT, and this side still syncs', async () => {
		config.current = { remoteUrl: 'https://delegator.example' };
		remote.requestLinkSync.mockRejectedValue(new Error('connect ECONNREFUSED'));
		const sync = vi.fn();
		const stop = followSyncRequests({
			requests: instanceSignals.subscribe('linkSyncRequested'),
			sync
		});
		await settled();

		const [local, other] = await Promise.allSettled([
			Promise.resolve(requestLinkSync()),
			requestRemoteLinkSync()
		]);
		expect(local).toEqual({ status: 'fulfilled', value: true });
		expect(other.status).toBe('rejected');
		const error = (other as PromiseRejectedResult).reason as GraphQLError;
		expect(error.extensions.code).toBe('CONFLICT');
		expect(error.message).toContain('ECONNREFUSED');
		expect(remote.dispose).toHaveBeenCalledOnce();
		await settled();
		expect(sync).toHaveBeenCalledOnce();
		stop();
	});
});

describe('followSyncRequests', () => {
	beforeEach(() => vi.useFakeTimers());

	/** Requests that arrive when `push` is called. */
	function requestsSource() {
		const waiting: ((result: IteratorResult<unknown>) => void)[] = [];
		const queued: unknown[] = [];
		let done = false;
		const requests: AsyncIterableIterator<unknown> = {
			next: () =>
				queued.length > 0
					? Promise.resolve({ value: queued.shift(), done: false })
					: done
						? Promise.resolve({ value: undefined, done: true })
						: new Promise((resolve) => waiting.push(resolve)),
			return: () => {
				done = true;
				for (const resolve of waiting.splice(0)) resolve({ value: undefined, done: true });
				return Promise.resolve({ value: undefined, done: true });
			},
			[Symbol.asyncIterator]() {
				return requests;
			}
		};
		const push = async () => {
			const resolve = waiting.shift();
			if (resolve) resolve({ value: {}, done: false });
			else queued.push({});
			await vi.advanceTimersByTimeAsync(0);
		};
		return { requests, push };
	}

	test('syncs at once, and a burst right after makes one more sync once the spacing passed', async () => {
		const { requests, push } = requestsSource();
		const sync = vi.fn();
		const stop = followSyncRequests({ requests, sync, spacingMs: 1_000 });

		await push();
		expect(sync).toHaveBeenCalledTimes(1);
		await push();
		await push();
		await push();
		expect(sync).toHaveBeenCalledTimes(1);
		await vi.advanceTimersByTimeAsync(1_000);
		expect(sync).toHaveBeenCalledTimes(2);
		stop();
	});

	test('stopping drops a sync that is waiting', async () => {
		const { requests, push } = requestsSource();
		const sync = vi.fn();
		const stop = followSyncRequests({ requests, sync, spacingMs: 1_000 });
		await push();
		await push();
		stop();
		await vi.advanceTimersByTimeAsync(5_000);
		expect(sync).toHaveBeenCalledTimes(1);
	});
});
