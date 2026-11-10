import { beforeEach, describe, expect, test, vi } from 'vitest';
import { logger } from '#lib/logger';

const env = vi.hoisted(() => ({}) as Record<string, string | undefined>);

vi.mock('$app/env/private', () => ({
	OIDC_ROLE_CLAIM: 'roles',
	get LINK_REMOTE_URL() {
		return env.LINK_REMOTE_URL;
	},
	get LINK_REMOTE_RESOURCE() {
		return env.LINK_REMOTE_RESOURCE;
	},
	get LINK_RESOURCE() {
		return env.LINK_RESOURCE;
	},
	get OIDC_M2M_CLIENT_ID() {
		return env.OIDC_M2M_CLIENT_ID;
	},
	get OIDC_M2M_CLIENT_SECRET() {
		return env.OIDC_M2M_CLIENT_SECRET;
	}
}));
vi.mock('$app/env/public', () => ({ PUBLIC_OIDC_AUTHORITY: 'https://idp.example' }));

const { isMachineToken, isSafeRemoteUrl, linkConfig, rolesOfToken } = await import('./linkAuth');

describe('rolesOfToken', () => {
	test('grants the link role through the role claim, in either shape', () => {
		expect(rolesOfToken({ roles: ['delegator'] })).toEqual(['delegator']);
		expect(rolesOfToken({ roles: [{ name: 'delegator' }] })).toEqual(['delegator']);
		expect(rolesOfToken({ roles: { delegator: {} } })).toEqual(['delegator']);
	});

	test('grants it as a scope, which is how Logto hands an M2M app its permissions', () => {
		expect(rolesOfToken({ scope: 'read delegator' })).toEqual(['delegator']);
	});

	test('grants nothing it does not know', () => {
		expect(rolesOfToken({ roles: ['chase'], scope: 'chase other' })).toEqual([]);
		expect(rolesOfToken({})).toEqual([]);
	});
});

describe('linkConfig', () => {
	const complete = {
		LINK_REMOTE_URL: 'https://delegator.example/some/path',
		LINK_REMOTE_RESOURCE: 'https://delegator.example/api',
		LINK_RESOURCE: 'https://chase.example/api',
		OIDC_M2M_CLIENT_ID: 'client',
		OIDC_M2M_CLIENT_SECRET: 'secret'
	};

	beforeEach(() => {
		for (const key of Object.keys(env)) delete env[key];
	});

	test('is off while the remote instance is not configured', () => {
		expect(linkConfig()).toBeUndefined();
	});

	test("answers the configuration, the remote's origin only", () => {
		Object.assign(env, complete);
		expect(linkConfig()).toEqual({
			remoteUrl: 'https://delegator.example',
			remoteResource: 'https://delegator.example/api',
			resource: 'https://chase.example/api',
			clientId: 'client',
			clientSecret: 'secret'
		});
	});

	test('is off and warns while only partly configured', () => {
		const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
		Object.assign(env, complete, { OIDC_M2M_CLIENT_SECRET: undefined, LINK_RESOURCE: '' });
		expect(linkConfig()).toBeUndefined();
		expect(warn).toHaveBeenCalledWith(expect.any(String), {
			missing: ['LINK_RESOURCE', 'OIDC_M2M_CLIENT_SECRET']
		});
		warn.mockRestore();
	});
});

describe('isMachineToken', () => {
	test('takes a client credentials token, whose subject is the client', () => {
		expect(isMachineToken({ sub: 'm2m-app', client_id: 'm2m-app', scope: 'delegator' })).toBe(true);
	});

	test("never takes a person's token, whatever it grants", () => {
		expect(isMachineToken({ sub: 'user-1', client_id: 'web-app', scope: 'delegator' })).toBe(false);
		expect(isMachineToken({ sub: 'user-1', scope: 'delegator' })).toBe(false);
	});
});

describe('isSafeRemoteUrl', () => {
	test('takes https, and http only on this machine', () => {
		expect(isSafeRemoteUrl('https://chase.example.org')).toBe(true);
		expect(isSafeRemoteUrl('http://localhost:5173')).toBe(true);
		expect(isSafeRemoteUrl('http://127.0.0.1:5174')).toBe(true);
		expect(isSafeRemoteUrl('http://chase.example.org')).toBe(false);
		expect(isSafeRemoteUrl('not a url')).toBe(false);
	});
});
