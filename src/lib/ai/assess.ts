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
	{ id: 'Qwen3-0.6B-q4f16_1-MLC', label: 'Fastest', vramMB: 1403, thinking: true },
	{ id: 'Qwen3.5-0.8B-q4f16_1-MLC', label: 'Light', vramMB: 1629, thinking: true },
	{ id: 'Qwen3.5-2B-q4f16_1-MLC', label: 'Balanced', vramMB: 2245, thinking: true },
	{ id: 'Qwen3.5-4B-q4f16_1-MLC', label: 'Advanced', vramMB: 3868, thinking: true },
	{ id: 'Qwen3-8B-q4f16_1-MLC', label: 'Expert', vramMB: 5696, thinking: true }
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

async function run(): Promise<AiAssessment> {
	if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
		return { supported: false, reason: 'WebGPU is not supported in this browser' };
	}

	const gpu = (navigator as unknown as { gpu: GPU }).gpu;
	let adapter: GPUAdapter | null = null;

	// Some browsers initialise the WebGPU subsystem lazily and return null on
	// the first call. Retry a few times with short delays before giving up.
	for (const delay of [0, 200, 500]) {
		if (delay) await new Promise((r) => setTimeout(r, delay));
		try {
			adapter =
				(await gpu.requestAdapter()) ??
				(await gpu.requestAdapter({ powerPreference: 'low-power' }));
		} catch {
			return { supported: false, reason: 'Could not access the GPU' };
		}
		if (adapter) break;
	}

	if (!adapter) {
		return { supported: false, reason: 'No WebGPU adapter found' };
	}

	// Read adapter info for vendor/backend detection.
	let adapterInfo: GPUAdapterInfo | null = null;
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const a = adapter as any;
		adapterInfo = a.info ?? (await a.requestAdapterInfo?.()) ?? null;
	} catch {
		/* ignore */
	}

	const vendor = (adapterInfo?.vendor ?? '').toLowerCase();
	const device = (adapterInfo?.device ?? '').toLowerCase();
	const description = (adapterInfo?.description ?? '').toLowerCase();
	const backend = (adapterInfo as unknown as { backend?: string })?.backend ?? '';
	const adapterStr = `${vendor} ${device} ${description} ${backend}`.toLowerCase();

	// maxStorageBufferBindingSize is what WebLLM's own engine.getMaxStorageBufferBindingSize()
	// uses to assess limited hardware (e.g. Android phones). It is a tighter and more
	// meaningful limit than maxBufferSize for LLM inference because model weight tensors
	// are bound as storage buffers. Chrome reports the true device value here (not a
	// hard-capped constant like it does for maxBufferSize).
	const maxStorageBinding = adapter.limits.maxStorageBufferBindingSize;
	const maxStorageBindingMB = maxStorageBinding / (1024 * 1024);

	console.log('[WebLLM] GPU adapter:', {
		vendor,
		device,
		description,
		backend,
		maxStorageBufferBindingSize: `${Math.round(maxStorageBindingMB)} MB`,
		maxBufferSize: `${Math.round(adapter.limits.maxBufferSize / (1024 * 1024))} MB`
	});

	// Detect software/CPU-only renderers.
	if (SOFTWARE_BACKEND_PATTERNS.some((p) => adapterStr.includes(p))) {
		return {
			supported: false,
			reason: `GPU is a software renderer (${vendor || 'unknown'}) — AI features require a hardware GPU`,
			backend
		};
	}

	// On Linux AMD/Intel: OpenGL/ANGLE backend doesn't support compute shaders well.
	if (backend && backend.toLowerCase() === 'opengl') {
		console.warn(
			'[WebLLM] WebGPU is using the OpenGL backend — LLM inference will saturate the CPU.\n' +
				'Fix: chrome://flags/#use-vulkan → Enabled, then relaunch.'
		);
		return {
			supported: false,
			reason: 'WebGPU is using OpenGL — Vulkan is required for GPU-accelerated AI. See console.',
			backend
		};
	}

	// Load the WebLLM model catalog and pick the best model whose vram_required_MB
	// fits within maxStorageBufferBindingSize. This uses the same hardware metric
	// WebLLM's own engine uses, and the catalog's measured per-model VRAM costs.
	const { prebuiltAppConfig } = await import('@mlc-ai/web-llm');
	const catalog = prebuiltAppConfig.model_list;

	// On some platforms (notably Linux + AMD/Intel via Vulkan) Chrome reports no
	// adapter info at all and caps maxStorageBufferBindingSize at a conservative
	// browser default (1024 MB) that has no relation to actual VRAM. In that case
	// skip VRAM filtering and trust the model preference order — any desktop GPU
	// capable of WebGPU can handle the 3B models.
	const hasAdapterInfo = !!(vendor || device || description || backend);
	const skipVramCheck = !hasAdapterInfo;

	if (skipVramCheck) {
		console.warn(
			'[WebLLM] No adapter info available — skipping VRAM check, selecting by preference order'
		);
	}

	for (const candidateId of CANDIDATE_MODEL_IDS) {
		const record = catalog.find((m) => m.model_id === candidateId);
		if (!record) continue;

		const vramNeeded = record.vram_required_MB ?? Infinity;

		console.log(
			`[WebLLM] Checking ${candidateId}: needs ${Math.round(vramNeeded)} MB, available ${Math.round(maxStorageBindingMB)} MB`
		);

		if (skipVramCheck || vramNeeded <= maxStorageBindingMB) {
			console.log(`[WebLLM] Selected model: ${candidateId}`);
			return {
				supported: true,
				reason: '',
				modelId: candidateId,
				backend,
				vramRequiredMB: vramNeeded
			};
		}
	}

	// Nothing fit — fall back to the smallest model unconditionally and hope
	// shared GPU memory covers the shortfall (common on iGPUs).
	const fallbackId = LOCAL_MODEL_TIERS[0].id;
	const fallbackRecord = catalog.find((m) => m.model_id === fallbackId);
	console.warn(
		`[WebLLM] No model fit within ${Math.round(maxStorageBindingMB)} MB — using fallback ${fallbackId}`
	);
	return {
		supported: true,
		reason: '',
		modelId: fallbackId,
		backend,
		vramRequiredMB: fallbackRecord?.vram_required_MB
	};
}
