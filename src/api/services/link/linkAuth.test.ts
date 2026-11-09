import { describe, expect, test, vi } from 'vitest';

vi.mock('$app/env/private', () => ({ OIDC_ROLE_CLAIM: 'roles' }));
vi.mock('$app/env/public', () => ({ PUBLIC_OIDC_AUTHORITY: 'https://idp.example' }));

const { rolesOfToken } = await import('./linkAuth');

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
