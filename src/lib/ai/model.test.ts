import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LOCAL_MODEL_TIERS } from './assess';

const webLlm = vi.hoisted(() => ({
	CreateWebWorkerMLCEngine: vi.fn(),
	deleteModelAllInfoInCache: vi.fn(),
	prebuiltAppConfig: { model_list: [{ model_id: 'Qwen3-0.6B-q4f16_1-MLC', overrides: {} }] }
}));
const assess = vi.hoisted(() => vi.fn());
const preference = vi.hoisted(() => ({ tier: null as number | null }));

vi.mock('$app/env', () => ({ browser: true }));
vi.mock('@mlc-ai/web-llm', () => webLlm);
vi.mock('./worker.ts?worker', () => ({ default: class {} }));
vi.mock('./aiPreference.svelte', () => ({ getLocalModelTier: () => preference.tier }));
vi.mock('./assess', async (original) => ({
	...(await original<typeof import('./assess')>()),
	assessAiCapability: assess
}));

const errors: { message: string; retrying: boolean }[] = [];
const fakeEngine = () => ({ unload: vi.fn() });

function loadModule({ availableMB }: { availableMB?: number } = {}) {
	vi.resetModules();
	vi.stubGlobal('navigator', {
		storage:
			availableMB === undefined
				? undefined
				: {
						persist: vi.fn().mockResolvedValue(true),
						estimate: vi.fn().mockResolvedValue({ quota: availableMB * 1024 * 1024, usage: 0 })
					}
	});
	return import('./model');
}

beforeEach(() => {
	errors.length = 0;
	preference.tier = null;
	vi.spyOn(console, 'error').mockImplementation(() => {});
	vi.stubGlobal('window', {
		dispatchEvent: (event: CustomEvent) => {
			if (event.type === 'webllm-error') errors.push(event.detail);
			return true;
		}
	});
	assess.mockImplementation((tier: number) =>
		Promise.resolve({ supported: true, reason: '', modelId: LOCAL_MODEL_TIERS[tier].id })
	);
	webLlm.CreateWebWorkerMLCEngine.mockReset();
	webLlm.deleteModelAllInfoInCache.mockReset().mockResolvedValue(undefined);
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	vi.useRealTimers();
});

describe('fittingTier', () => {
	it('keeps the preference without an estimate', async () => {
		const { fittingTier } = await loadModule();
		expect(fittingTier({ preferred: 2, availableMB: null })).toBe(2);
	});

	it('steps down to what fits, starting at the preference', async () => {
		const { fittingTier } = await loadModule();
		expect(fittingTier({ preferred: null, availableMB: 100_000 })).toBe(4);
		expect(fittingTier({ preferred: 9, availableMB: 2000 })).toBe(1);
		expect(fittingTier({ preferred: 0, availableMB: 100_000 })).toBe(0);
		expect(fittingTier({ preferred: null, availableMB: 100 })).toBeNull();
	});
});

describe('getEngine', () => {
	it('loads the model storage allows once, and says when it is a smaller one', async () => {
		preference.tier = 4;
		const engine = fakeEngine();
		webLlm.CreateWebWorkerMLCEngine.mockResolvedValue(engine);
		const model = await loadModule({ availableMB: 2000 });

		expect(await model.getEngine()).toBe(engine);
		expect(await model.getEngine()).toBe(engine);
		expect(webLlm.CreateWebWorkerMLCEngine).toHaveBeenCalledOnce();
		expect(webLlm.CreateWebWorkerMLCEngine.mock.calls[0][1]).toBe(LOCAL_MODEL_TIERS[1].id);
		expect(errors).toEqual([expect.objectContaining({ retrying: true })]);
		expect(model.loadedModelSupportsThinking()).toBe(true);
	});

	it('gives up without a storage estimate or a preference', async () => {
		const model = await loadModule();
		expect(await model.getEngine()).toBeNull();
	});

	it('gives up without storage for any model', async () => {
		const model = await loadModule({ availableMB: 100 });
		expect(await model.getEngine()).toBeNull();
		expect(errors).toHaveLength(1);
		expect(model.loadedModelSupportsThinking()).toBe(false);
	});

	it('gives up when the hardware cannot run a model', async () => {
		assess.mockResolvedValue({ supported: false, reason: 'No WebGPU' });
		const model = await loadModule({ availableMB: 100_000 });
		expect(await model.getEngine()).toBeNull();
		expect(webLlm.CreateWebWorkerMLCEngine).not.toHaveBeenCalled();
	});

	it('retries without the sliding window when the window size is refused', async () => {
		webLlm.CreateWebWorkerMLCEngine.mockRejectedValueOnce(
			new Error('WindowSizeConfigurationError')
		).mockResolvedValueOnce(fakeEngine());
		preference.tier = 0;
		const model = await loadModule();
		expect(await model.getEngine()).not.toBeNull();
		const retried = webLlm.CreateWebWorkerMLCEngine.mock.calls[1][2].appConfig.model_list[0];
		expect(retried.overrides.sliding_window_size).toBe(-1);
	});

	it('clears a corrupt cache and loads again', async () => {
		webLlm.CreateWebWorkerMLCEngine.mockRejectedValueOnce(
			new SyntaxError('JSON.parse: unexpected end')
		).mockResolvedValueOnce(fakeEngine());
		const model = await loadModule({ availableMB: 100_000 });
		expect(await model.getEngine()).not.toBeNull();
		expect(webLlm.deleteModelAllInfoInCache).toHaveBeenCalled();
		expect(errors[0].retrying).toBe(true);
	});

	it('reports other load failures', async () => {
		webLlm.CreateWebWorkerMLCEngine.mockRejectedValue('network down');
		const model = await loadModule({ availableMB: 100_000 });
		expect(await model.getEngine()).toBeNull();
		expect(errors.at(-1)?.retrying).toBe(false);
	});

	it('retries one tier down when storage runs full', async () => {
		preference.tier = 2;
		webLlm.CreateWebWorkerMLCEngine.mockRejectedValueOnce(
			new Error('QuotaExceededError')
		).mockResolvedValueOnce(fakeEngine());
		const model = await loadModule();
		expect(await model.getEngine()).not.toBeNull();
		expect(webLlm.CreateWebWorkerMLCEngine.mock.calls[1][1]).toBe(LOCAL_MODEL_TIERS[1].id);
	});

	it('gives up when storage runs full on the smallest tier or the retry fails', async () => {
		preference.tier = 0;
		webLlm.CreateWebWorkerMLCEngine.mockRejectedValue(new Error('QuotaExceededError'));
		expect(await (await loadModule()).getEngine()).toBeNull();

		preference.tier = 1;
		expect(await (await loadModule()).getEngine()).toBeNull();
		expect(errors.at(-1)?.message).toContain('QuotaExceededError');

		assess.mockImplementation((tier: number) =>
			Promise.resolve(
				tier === 1 ? { supported: true, modelId: LOCAL_MODEL_TIERS[1].id } : { supported: false }
			)
		);
		expect(await (await loadModule()).getEngine()).toBeNull();
	});
});

describe('unloading', () => {
	it('unloads after being idle and on request', async () => {
		vi.useFakeTimers();
		const engine = fakeEngine();
		webLlm.CreateWebWorkerMLCEngine.mockResolvedValue(engine);
		const model = await loadModule({ availableMB: 100_000 });

		model.resetIdleTimer();
		await model.getEngine();
		model.resetIdleTimer();
		model.resetIdleTimer();
		await vi.advanceTimersByTimeAsync(10 * 60 * 1000);
		expect(engine.unload).toHaveBeenCalledOnce();

		await model.getEngine();
		model.resetIdleTimer();
		await model.unloadEngine();
		await model.unloadEngine();
		expect(engine.unload).toHaveBeenCalledTimes(2);
	});
});
