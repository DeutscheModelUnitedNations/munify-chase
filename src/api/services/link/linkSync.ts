import { GraphQLError } from 'graphql';
import type { Context } from '#api/context';
import { instanceSignals } from '#api/rumble';
import { isGlobalAdmin } from '#api/services/authHelper';
import { logger } from '#lib/logger';
import { createDelegatorClient } from './delegatorRemote';
import { linkAccessToken, linkConfig } from './linkAuth';

/**
 * "Sync now" for the DELEGATOR link (`docs/plans/delegator-link.md`): the link worker asks DELEGATOR
 * for every table again right away, as it does on a reconnect, instead of waiting for the next
 * change. Asked for by a global admin here, or by the linked DELEGATOR (its own "sync now" asks
 * both sides). The worker runs on one instance only (the advisory lock), so the request goes to
 * all of them as an instance signal and the one holding the worker follows it
 * (`followSyncRequests`). DELEGATOR offers the same pair of mutations.
 */

/** Syncs follow each other at least this far apart; requests in between make one more after. */
const SYNC_SPACING_MS = 10_000;
/** How long DELEGATOR may take to accept a request. */
const REMOTE_TIMEOUT_MS = 10_000;

/** Global admins and the linked DELEGATOR (its link token) may ask; anybody else is refused. */
export function assertCanRequestLinkSync(ctx: Context) {
	if (isGlobalAdmin(ctx) || ctx.hasRole('delegator')) return;
	throw new GraphQLError('Only global admins and the linked DELEGATOR can request a sync.');
}

/**
 * Only global admins make this instance ask DELEGATOR: DELEGATOR asking it to ask back would only
 * bounce the request between the two.
 */
export function assertCanRequestRemoteLinkSync(ctx: Context) {
	if (isGlobalAdmin(ctx)) return;
	throw new GraphQLError('Only global admins can ask DELEGATOR to sync.');
}

/** Asks the instance running the link worker to read everything again; false while unlinked. */
export function requestLinkSync() {
	if (!linkConfig()) return false;
	instanceSignals.publish('linkSyncRequested', { at: new Date().toISOString() });
	return true;
}

/**
 * Asks the linked DELEGATOR to read everything of this instance again, through its own
 * `requestLinkSync`, which accepts this instance's link token (the `chase` role there). The token
 * stays on the server. False while unlinked or when DELEGATOR answers that it has no link; an
 * unreachable or refusing DELEGATOR is a CONFLICT the page shows, and leaves this side's sync alone.
 */
export async function requestRemoteLinkSync() {
	const config = linkConfig();
	if (!config) return false;
	const remote = createDelegatorClient({
		url: config.remoteUrl,
		token: () => linkAccessToken(config)
	});
	try {
		// the generated client types a mutation without arguments as its result, not as a call
		const ask = remote.mutate.requestLinkSync as unknown as () => PromiseLike<boolean>;
		return await withTimeout(Promise.resolve(ask()), REMOTE_TIMEOUT_MS);
	} catch (error) {
		logger.warn('Asking DELEGATOR to sync failed', error);
		throw new GraphQLError(
			`DELEGATOR could not be asked to sync: ${error instanceof Error ? error.message : String(error)}`,
			{ extensions: { code: 'CONFLICT' } }
		);
	} finally {
		remote.dispose();
	}
}

function withTimeout<T>(promise: Promise<T>, ms: number) {
	let timer: ReturnType<typeof setTimeout> | undefined;
	const timeout = new Promise<never>((_resolve, reject) => {
		timer = setTimeout(() => reject(new Error(`no answer within ${ms / 1000} s`)), ms);
	});
	return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/**
 * Runs `sync` for each request the worker hears, at most once per `spacingMs`: a request inside
 * that time (a burst of clicks, DELEGATOR asking back) makes one more sync once it has passed.
 * Answers the function that stops following.
 */
export function followSyncRequests({
	requests,
	sync,
	spacingMs = SYNC_SPACING_MS
}: {
	requests: AsyncIterableIterator<unknown>;
	sync: () => void;
	spacingMs?: number;
}) {
	let lastSyncAt = -Infinity;
	let pending: ReturnType<typeof setTimeout> | undefined;
	const run = () => {
		pending = undefined;
		lastSyncAt = Date.now();
		sync();
	};
	const requested = () => {
		if (pending) return;
		const wait = lastSyncAt + spacingMs - Date.now();
		if (wait <= 0) run();
		else pending = setTimeout(run, wait);
	};

	void (async () => {
		for await (const _request of requests) requested();
	})().catch((error) => logger.warn('Following DELEGATOR sync requests stopped', error));

	return () => {
		clearTimeout(pending);
		void requests.return?.();
	};
}
