import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { adapterProblem, LOCAL_MODEL_TIERS, pickModel } from './assess';

const noInfo = { vendor: '', device: '', description: '', backend: '' };
const nvidia = { ...noInfo, vendor: 'nvidia', backend: 'vulkan' };
const catalog = LOCAL_MODEL_TIERS.map((tier) => ({
	model_id: tier.id,
	vram_required_MB: tier.vramMB
}));

beforeEach(() => {
	vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	vi.doUnmock('@mlc-ai/web-llm');
});

describe('adapterProblem', () => {
	it('refuses software renderers', () => {
		expect(adapterProblem({ ...noInfo, device: 'SwiftShader Device' })).toMatchObject({
			supported: false
		});
		expect(adapterProblem({ ...noInfo, description: 'llvmpipe' })?.reason).toContain('unknown');
	});

	it('refuses the OpenGL backend', () => {
		expect(adapterProblem({ ...noInfo, vendor: 'amd', backend: 'OpenGL' })).toMatchObject({
			supported: false,
			backend: 'OpenGL'
		});
	});

	it('accepts a hardware adapter', () => {
		expect(adapterProblem(nvidia)).toBeUndefined();
	});
});

describe('pickModel', () => {
	it('picks the best model that fits', () => {
		expect(pickModel({ catalog, info: nvidia, maxStorageBindingMB: 2500 })).toEqual({
			supported: true,
			reason: '',
			modelId: 'Qwen3.5-2B-q4f16_1-MLC',
			backend: 'vulkan',
			vramRequiredMB: 2245
		});
	});

	it('trusts the preference order without adapter info', () => {
		expect(pickModel({ catalog, info: noInfo, maxStorageBindingMB: 1024 }).modelId).toBe(
			'Qwen3-8B-q4f16_1-MLC'
		);
	});

	it('skips models missing from the catalog and treats unknown sizes as too big', () => {
		const partial = [
			{ model_id: 'Qwen3-8B-q4f16_1-MLC' },
			{ model_id: 'Qwen3.5-0.8B-q4f16_1-MLC', vram_required_MB: 1629 }
		];
		expect(pickModel({ catalog: partial, info: nvidia, maxStorageBindingMB: 9000 }).modelId).toBe(
			'Qwen3.5-0.8B-q4f16_1-MLC'
		);
	});

	it('falls back to the smallest model when nothing fits', () => {
		expect(pickModel({ catalog, info: nvidia, maxStorageBindingMB: 100 })).toMatchObject({
			modelId: LOCAL_MODEL_TIERS[0].id,
			vramRequiredMB: LOCAL_MODEL_TIERS[0].vramMB
		});
	});
});

describe('assessAiCapability', () => {
	async function assess({ gpu, forcedTier }: { gpu?: unknown; forcedTier?: number } = {}) {
		vi.resetModules();
		vi.doMock('@mlc-ai/web-llm', () => ({ prebuiltAppConfig: { model_list: catalog } }));
		vi.stubGlobal('navigator', gpu === undefined ? {} : { gpu });
		const { assessAiCapability } = await import('./assess');
		return assessAiCapability(forcedTier);
	}

	const adapter = (info: object | undefined, mb: number) => ({
		info,
		limits: { maxStorageBufferBindingSize: mb * 1024 * 1024 }
	});

	it('uses a forced tier, clamped to the tiers there are', async () => {
		expect((await assess({ forcedTier: 99 })).modelId).toBe(LOCAL_MODEL_TIERS.at(-1)?.id);
		expect((await assess({ forcedTier: -1 })).modelId).toBe(LOCAL_MODEL_TIERS[0].id);
	});

	it('needs WebGPU', async () => {
		expect(await assess()).toMatchObject({ supported: false });
	});

	it('reports a GPU it cannot access', async () => {
		const gpu = { requestAdapter: vi.fn().mockRejectedValue(new Error('denied')) };
		expect((await assess({ gpu })).reason).toBe('Could not access the GPU');
	});

	it('retries before reporting no adapter', async () => {
		vi.useFakeTimers();
		const gpu = { requestAdapter: vi.fn().mockResolvedValue(null) };
		const result = assess({ gpu });
		await vi.runAllTimersAsync();
		expect((await result).reason).toBe('No WebGPU adapter found');
		expect(gpu.requestAdapter).toHaveBeenCalledTimes(6);
		vi.useRealTimers();
	});

	it('refuses a software adapter', async () => {
		const gpu = {
			requestAdapter: vi.fn().mockResolvedValue(adapter({ vendor: 'lavapipe' }, 4096))
		};
		expect(await assess({ gpu })).toMatchObject({ supported: false });
	});

	it('picks a model for the adapter, reading its info where it is offered', async () => {
		const legacy = {
			...adapter(undefined, 1500),
			requestAdapterInfo: vi.fn().mockResolvedValue({ vendor: 'Intel' })
		};
		const gpu = { requestAdapter: vi.fn().mockResolvedValue(legacy) };
		expect((await assess({ gpu })).modelId).toBe('Qwen3-0.6B-q4f16_1-MLC');
	});

	it('picks by preference when the adapter tells nothing about itself', async () => {
		const broken = {
			...adapter(undefined, 1024),
			requestAdapterInfo: vi.fn().mockRejectedValue(new Error('gone'))
		};
		const gpu = { requestAdapter: vi.fn().mockResolvedValue(broken) };
		expect((await assess({ gpu })).modelId).toBe('Qwen3-8B-q4f16_1-MLC');
	});
});
