import type { RequestEvent } from '@sveltejs/kit';
import { OidcProviderUnavailableError } from '@m1212e/oidc';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const { processTokens } = vi.hoisted(() => ({ processTokens: vi.fn() }));

vi.mock('$app/env/private', () => ({ OIDC_ROLE_CLAIM: 'roles' }));
vi.mock('$app/env/public', () => ({ PUBLIC_OIDC_AUTHORITY: 'https://idp.example' }));
vi.mock('./services/OIDC', () => ({ OIDC: { core: { processTokens } } }));

const { context } = await import('./context');
const { SYNTHETIC_EVENT_FIELD } = await import('./services/syntheticRequestEvent');

type Oidc = NonNullable<RequestEvent['locals']['oidc']>;

function event({
	oidc,
	linkCaller,
	headers = {}
}: {
	oidc?: Partial<Oidc>;
	linkCaller?: boolean;
	headers?: Record<string, string>;
}) {
	return {
		locals: { oidc, linkCaller },
		request: new Request('https://chase.example', { headers })
	} as unknown as RequestEvent;
}

const session = (claims: Record<string, unknown> = {}) =>
	({
		user: { sub: 'u1' },
		tokens: { accessToken: 'token' },
		accessTokenClaims: claims
	}) as unknown as Partial<Oidc>;

beforeEach(() => {
	processTokens.mockReset();
});

describe('context', () => {
	test('grants the roles the access token claims, but never the link role', () => {
		const ctx = context(event({ oidc: session({ roles: ['admin', 'delegator'] }) }));
		expect(ctx.hasRole('admin')).toBe(true);
		expect(ctx.hasRole('delegator')).toBe(false);
		expect(ctx.hasRole('member')).toBe(false);
	});

	test('falls back to the id token claims', () => {
		const oidc = {
			...session(),
			accessTokenClaims: undefined,
			idTokenClaims: { roles: ['member'] }
		};
		expect(context(event({ oidc: oidc as Partial<Oidc> })).hasRole('member')).toBe(true);
	});

	test('grants the link role to the linked DELEGATOR only', () => {
		const ctx = context(event({ linkCaller: true, headers: { 'x-munify-link-token': 't' } }));
		expect(ctx.hasRole('delegator')).toBe(true);
		expect(ctx.linkRequest).toBe(true);
		expect(context(event({})).linkRequest).toBe(false);
	});

	test('reads a WebSocket connection through its synthetic event', () => {
		const inner = event({ oidc: session({ roles: ['admin'] }) });
		const outer = { ...event({}), extra: { request: { [SYNTHETIC_EVENT_FIELD]: inner } } };
		expect(context(outer as unknown as RequestEvent).hasRole('admin')).toBe(true);
	});

	test('mustBeLoggedIn answers the user or refuses', () => {
		expect(context(event({ oidc: session() })).mustBeLoggedIn()).toEqual({ sub: 'u1' });
		expect(() => context(event({})).mustBeLoggedIn()).toThrow('Must be logged in');
	});

	describe('isSessionLive', () => {
		test('is false without a session', async () => {
			expect(await context(event({})).isSessionLive()).toBe(false);
			expect(processTokens).not.toHaveBeenCalled();
		});

		test('asks the provider about the access token', async () => {
			processTokens.mockResolvedValue(undefined);
			expect(await context(event({ oidc: session() })).isSessionLive()).toBe(true);
			expect(processTokens).toHaveBeenCalledWith({ access_token: 'token', subject: 'u1' });
		});

		test('is false when the provider refuses the token', async () => {
			processTokens.mockImplementation(() => Promise.reject(new Error('expired')));
			expect(await context(event({ oidc: session() })).isSessionLive()).toBe(false);
		});

		test('throws when the provider cannot be reached', async () => {
			processTokens.mockImplementation(() =>
				Promise.reject(new OidcProviderUnavailableError(['access'], []))
			);
			await expect(context(event({ oidc: session() })).isSessionLive()).rejects.toBeInstanceOf(
				OidcProviderUnavailableError
			);
		});
	});
});
