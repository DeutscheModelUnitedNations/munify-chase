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

// Candidate model IDs in preference order (best quality → smallest).
// All must exist in WebLLM's prebuiltAppConfig.model_list so vram_required_MB
// is available for comparison. f16 quantisation halves memory vs f32.
const CANDIDATE_MODEL_IDS = [
	'Hermes-3-Llama-3.2-3B-q4f16_1-MLC',
	'Llama-3.2-3B-Instruct-q4f16_1-MLC',
	'Llama-3.2-1B-Instruct-q4f32_1-MLC',
	'Llama-3.2-1B-Instruct-q4f16_1-MLC'
] as const;

// Browsers/drivers known to report a hardware adapter but run all compute on
// the CPU (no real GPU acceleration).
const SOFTWARE_BACKEND_PATTERNS = ['swiftshader', 'llvmpipe', 'softpipe', 'lavapipe', 'warp'];

let cached: Promise<AiAssessment> | null = null;

export function assessAiCapability(): Promise<AiAssessment> {
	if (!cached) cached = run();
	return cached;
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

	for (const candidateId of CANDIDATE_MODEL_IDS) {
		const record = catalog.find((m) => m.model_id === candidateId);
		if (!record) continue;

		const vramNeeded = record.vram_required_MB ?? Infinity;

		console.log(
			`[WebLLM] Checking ${candidateId}: needs ${Math.round(vramNeeded)} MB, available ${Math.round(maxStorageBindingMB)} MB`
		);

		if (vramNeeded <= maxStorageBindingMB) {
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
	const fallbackId = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
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
