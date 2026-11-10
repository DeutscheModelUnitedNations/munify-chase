import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const env = vi.hoisted(() => ({ browser: true }));
vi.mock('$app/env', () => env);

let store: Map<string, string>;

function loadModule() {
	vi.resetModules();
	return import('./aiPreference.svelte');
}

beforeEach(() => {
	env.browser = true;
	store = new Map();
	vi.stubGlobal('localStorage', {
		getItem: (key: string) => store.get(key) ?? null,
		setItem: (key: string, value: string) => store.set(key, value),
		removeItem: (key: string) => store.delete(key)
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('AI preference', () => {
	it('starts local and not onboarded', async () => {
		const preference = await loadModule();
		preference.initAiPreference();
		expect(preference.getAiPreference()).toBe('local');
		expect(preference.getAiOnboarded()).toBe(false);
		expect(preference.getLocalModelTier()).toBeNull();
	});

	it('remembers the choice across loads', async () => {
		const first = await loadModule();
		first.setAiPreference('backend', 2);
		const second = await loadModule();
		second.initAiPreference();
		expect(second.getAiPreference()).toBe('backend');
		expect(second.getAiOnboarded()).toBe(true);
		expect(second.getLocalModelTier()).toBe(2);
	});

	it('keeps the tier when none is given and forgets it on null', async () => {
		const preference = await loadModule();
		preference.setAiPreference('local', 1);
		preference.setAiPreference('off');
		expect(store.get('chase:ai:model-tier')).toBe('1');
		preference.setAiPreference('local', null);
		expect(store.has('chase:ai:model-tier')).toBe(false);
		expect(preference.getLocalModelTier()).toBeNull();
	});

	it('stores nothing outside the browser', async () => {
		env.browser = false;
		const preference = await loadModule();
		preference.setAiPreference('off', 0);
		preference.initAiPreference();
		expect(store.size).toBe(0);
		expect(preference.getAiPreference()).toBe('off');
	});

	it('maps the preference to a mode', async () => {
		const { preferenceToMode } = await loadModule();
		expect(preferenceToMode('backend')).toBe('online');
		expect(preferenceToMode('local')).toBe('offline');
	});
});
