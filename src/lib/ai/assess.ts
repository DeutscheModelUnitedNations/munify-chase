import { m } from '#lib/paraglide/messages';

export interface AiAssessment {
	supported: boolean;
	/** Human-readable explanation shown to the user when supported=false. */
	reason: string;
	/** The model ID selected for this hardware. Only set when supported=true. */
	modelId?: string;
	/** Informational backend string, e.g. "vulkan", "opengl", "d3d12". */
	backend?: string;
	/** VRAM required by the selected model in MB. */
	vramRequiredMB?: number;
}

// Human-friendly model tiers exposed to the settings UI (index 0 = fastest/smallest).
export const LOCAL_MODEL_TIERS = [
	{
		id: 'Qwen3-0.6B-q4f16_1-MLC',
		label: () => m.aiModelTierFastest(),
		vramMB: 1403,
		thinking: true
	},
	{
		id: 'Qwen3.5-0.8B-q4f16_1-MLC',
		label: () => m.aiModelTierLight(),
		vramMB: 1629,
		thinking: true
	},
	{
		id: 'Qwen3.5-2B-q4f16_1-MLC',
		label: () => m.aiModelTierBalanced(),
		vramMB: 2245,
		thinking: true
	},
	{
		id: 'Qwen3.5-4B-q4f16_1-MLC',
		label: () => m.aiModelTierAdvanced(),
		vramMB: 3868,
		thinking: true
	},
	{ id: 'Qwen3-8B-q4f16_1-MLC', label: () => m.aiModelTierExpert(), vramMB: 5696, thinking: true }
] as const;

// Auto-detection order: best quality first, falling back to smaller models.
const CANDIDATE_MODEL_IDS = [...LOCAL_MODEL_TIERS].reverse().map((t) => t.id) as string[];

// Browsers/drivers known to report a hardware adapter but run all compute on
// the CPU (no real GPU acceleration).
const SOFTWARE_BACKEND_PATTERNS = ['swiftshader', 'llvmpipe', 'softpipe', 'lavapipe', 'warp'];

let cached: Promise<AiAssessment> | null = null;

/**
 * Assesses hardware capability and selects a model.
 * Pass `forcedTier` (0 = fastest … 3 = best) to skip VRAM auto-detection
 * and use a specific LOCAL_MODEL_TIERS entry directly.
 */
export function assessAiCapability(forcedTier?: number | null): Promise<AiAssessment> {
	if (forcedTier != null) return runWithForcedTier(forcedTier);
	if (!cached) cached = run();
	return cached;
}

function runWithForcedTier(tier: number): Promise<AiAssessment> {
	const clamped = Math.max(0, Math.min(LOCAL_MODEL_TIERS.length - 1, tier));
	const entry = LOCAL_MODEL_TIERS[clamped];
	return Promise.resolve({
		supported: true,
		reason: '',
		modelId: entry.id,
		vramRequiredMB: entry.vramMB
	});
}

type AdapterInfo = { vendor: string; device: string; description: string; backend: string };
type CatalogEntry = { model_id: string; vram_required_MB?: number };

const unsupported = (reason: string, backend?: string): AiAssessment => ({
	supported: false,
	reason,
	backend
});

/**
 * Some browsers initialise the WebGPU subsystem lazily and return null on the first call,
 * so this retries a few times with short delays before giving up. Throws when the GPU
 * cannot be accessed at all.
 */
async function requestAdapter(gpu: GPU): Promise<GPUAdapter | null> {
	for (const delay of [0, 200, 500]) {
		if (delay) await new Promise((r) => setTimeout(r, delay));
		const adapter =
			(await gpu.requestAdapter()) ?? (await gpu.requestAdapter({ powerPreference: 'low-power' }));
		if (adapter) return adapter;
	}
	return null;
}

/** Vendor and backend for detection, lower-cased; empty where the browser does not tell */
async function readAdapterInfo(adapter: GPUAdapter): Promise<AdapterInfo> {
	let info: Partial<AdapterInfo> | null = null;
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const a = adapter as any;
		info = a.info ?? (await a.requestAdapterInfo?.()) ?? null;
	} catch {
		/* ignore */
	}
	return {
		vendor: (info?.vendor ?? '').toLowerCase(),
		device: (info?.device ?? '').toLowerCase(),
		description: (info?.description ?? '').toLowerCase(),
		backend: info?.backend ?? ''
	};
}

/** Why an adapter cannot run the models although WebGPU reports one, if it cannot */
export function adapterProblem(info: AdapterInfo): AiAssessment | undefined {
	const { vendor, device, description, backend } = info;
	const adapterStr = `${vendor} ${device} ${description} ${backend}`.toLowerCase();

	// Browsers/drivers that report a hardware adapter but run all compute on the CPU
	if (SOFTWARE_BACKEND_PATTERNS.some((p) => adapterStr.includes(p))) {
		return unsupported(
			`GPU is a software renderer (${vendor || 'unknown'}) — AI features require a hardware GPU`,
			backend
		);
	}

	// On Linux AMD/Intel: OpenGL/ANGLE backend doesn't support compute shaders well.
	if (backend.toLowerCase() === 'opengl') {
		console.warn(
			'[WebLLM] WebGPU is using the OpenGL backend — LLM inference will saturate the CPU.\n' +
				'Fix: chrome://flags/#use-vulkan → Enabled, then relaunch.'
		);
		return unsupported(
			'WebGPU is using OpenGL — Vulkan is required for GPU-accelerated AI. See console.',
			backend
		);
	}
	return undefined;
}

/**
 * The best model whose `vram_required_MB` fits within `maxStorageBindingMB`, the same
 * hardware metric WebLLM's own engine uses, by the catalog's measured per-model costs.
 */
export function pickModel({
	catalog,
	info,
	maxStorageBindingMB
}: {
	catalog: CatalogEntry[];
	info: AdapterInfo;
	maxStorageBindingMB: number;
}): AiAssessment {
	const { backend } = info;
	// On some platforms (notably Linux + AMD/Intel via Vulkan) Chrome reports no
	// adapter info at all and caps maxStorageBufferBindingSize at a conservative
	// browser default (1024 MB) that has no relation to actual VRAM. In that case
	// skip VRAM filtering and trust the model preference order — any desktop GPU
	// capable of WebGPU can handle the 3B models.
	const skipVramCheck = !Object.values(info).some(Boolean);
	if (skipVramCheck) {
		console.warn(
			'[WebLLM] No adapter info available — skipping VRAM check, selecting by preference order'
		);
	}

	const vramOf = (id: string) => catalog.find((m) => m.model_id === id)?.vram_required_MB;
	const known = CANDIDATE_MODEL_IDS.filter((id) => catalog.some((m) => m.model_id === id));
	const fitting = known.find(
		(id) => skipVramCheck || (vramOf(id) ?? Infinity) <= maxStorageBindingMB
	);
	if (fitting) {
		return {
			supported: true,
			reason: '',
			modelId: fitting,
			backend,
			vramRequiredMB: vramOf(fitting) ?? Infinity
		};
	}

	// Nothing fit — fall back to the smallest model unconditionally and hope
	// shared GPU memory covers the shortfall (common on iGPUs).
	const fallbackId = LOCAL_MODEL_TIERS[0].id;
	console.warn(
		`[WebLLM] No model fit within ${Math.round(maxStorageBindingMB)} MB — using fallback ${fallbackId}`
	);
	return {
		supported: true,
		reason: '',
		modelId: fallbackId,
		backend,
		vramRequiredMB: vramOf(fallbackId)
	};
}

async function run(): Promise<AiAssessment> {
	if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
		return unsupported('WebGPU is not supported in this browser');
	}

	let adapter: GPUAdapter | null;
	try {
		adapter = await requestAdapter((navigator as unknown as { gpu: GPU }).gpu);
	} catch {
		return unsupported('Could not access the GPU');
	}
	if (!adapter) return unsupported('No WebGPU adapter found');

	const info = await readAdapterInfo(adapter);
	const problem = adapterProblem(info);
	if (problem) return problem;

	// maxStorageBufferBindingSize is what WebLLM's own engine.getMaxStorageBufferBindingSize()
	// uses to assess limited hardware (e.g. Android phones). It is a tighter and more
	// meaningful limit than maxBufferSize for LLM inference because model weight tensors
	// are bound as storage buffers. Chrome reports the true device value here (not a
	// hard-capped constant like it does for maxBufferSize).
	const maxStorageBindingMB = adapter.limits.maxStorageBufferBindingSize / (1024 * 1024);

	const { prebuiltAppConfig } = await import('@mlc-ai/web-llm');
	return pickModel({ catalog: prebuiltAppConfig.model_list, info, maxStorageBindingMB });
}
