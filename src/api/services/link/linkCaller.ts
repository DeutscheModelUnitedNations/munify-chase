import { isRemoteInstanceToken, linkConfig } from './linkAuth';

/**
 * Whether a request is the linked DELEGATOR calling: it carries a token the provider issued to
 * DELEGATOR's client for this instance's API (`linkAuth.ts`). Checked only when a request carries
 * one, and once per request (`context` keeps the promise).
 */
export function isLinkCall(token: string | null | undefined): Promise<boolean> {
	const config = linkConfig();
	if (!token || !config) return Promise.resolve(false);
	return isRemoteInstanceToken({ token, config });
}
