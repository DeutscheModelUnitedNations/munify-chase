import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanupStaleCaches, hashSchema } from './offlineCacheStorage';

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('hashSchema', () => {
	it('is stable and changes with the schema', () => {
		expect(hashSchema({ a: 1 })).toBe(hashSchema({ a: 1 }));
		expect(hashSchema({ a: 1 })).not.toBe(hashSchema({ a: 2 }));
		expect(hashSchema({ a: 1 })).toMatch(/^[0-9a-z]+$/);
	});
});

describe('cleanupStaleCaches', () => {
	it('deletes the cache databases of other schemas only', async () => {
		const deleteDatabase = vi.fn();
		vi.stubGlobal('indexedDB', {
			databases: async () => [
				{ name: 'chase-cache' },
				{ name: 'chase-cache-old' },
				{ name: 'chase-cache-current' },
				{ name: 'other-app' },
				{}
			],
			deleteDatabase
		});
		await cleanupStaleCaches('chase-cache-current');
		expect(deleteDatabase.mock.calls.map(([name]) => name)).toEqual([
			'chase-cache',
			'chase-cache-old'
		]);
	});

	it('does nothing where databases cannot be listed', async () => {
		await expect(cleanupStaleCaches('x')).resolves.toBeUndefined();
		vi.stubGlobal('indexedDB', { databases: undefined });
		await expect(cleanupStaleCaches('x')).resolves.toBeUndefined();
		vi.stubGlobal('indexedDB', { databases: () => Promise.reject(new Error('blocked')) });
		await expect(cleanupStaleCaches('x')).resolves.toBeUndefined();
	});
});
