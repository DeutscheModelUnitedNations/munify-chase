import { db } from '#api/db/db';
import { hashLinkToken } from './linkTokens';

/**
 * The link a request's token belongs to, if any: the linked DELEGATOR instance calling. Looked up
 * only when a request carries a token, and once per request (`context` keeps the promise).
 */
export function findLinkCaller(token: string | null | undefined) {
	if (!token) return Promise.resolve(undefined);
	return db.query.instanceLink.findFirst({
		where: { inboundTokenHash: hashLinkToken(token), status: { ne: 'FROZEN' } },
		columns: { id: true, status: true }
	});
}

export type LinkCaller = NonNullable<Awaited<ReturnType<typeof findLinkCaller>>>;
