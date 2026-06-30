import { browser } from '$app/environment';
import type { MLCEngineInterface } from '@mlc-ai/web-llm';
import { assessAiCapability, LOCAL_MODEL_TIERS } from './assess';
import { getLocalModelTier } from './aiPreference.svelte';

let enginePromise: Promise<MLCEngineInterface | null> | null = null;
let idleTimer: ReturnType<typeof setTimeout> | null = null;
let loadedModelId: string | null = null;

const IDLE_MS = 10 * 60 * 1000;
const STORAGE_BUFFER_MB = 200;

const isStorageFullError = (e: unknown) =>
	/device space|QuotaExceededError|quota/i.test(String(e)) ||
	String(e).includes('NS_ERROR_FILE_NO_DEVICE_SPACE');

const isCorruptCacheError = (e: unknown) =>
	/JSON\.parse|SyntaxError|unexpected end|unexpected token/i.test(String(e));

const isWindowSizeError = (e: unknown) => String(e).includes('WindowSizeConfigurationError');

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

function dispatchError(message: string, retrying = false): void {
	console.error('[WebLLM]', message);
	window.dispatchEvent(new CustomEvent('webllm-error', { detail: { message, retrying } }));
}

/** Find the largest tier that fits in available storage with a safety buffer. */
async function selectFittingTier(preferred: number | null): Promise<number | null> {
	const available = navigator.storage?.estimate
		? await navigator.storage.estimate().then(({ quota = 0, usage = 0 }) => (quota - usage) / 1024 / 1024)
		: null;
	if (available === null) return preferred;
	const start = preferred !== null ? Math.min(preferred, LOCAL_MODEL_TIERS.length - 1) : LOCAL_MODEL_TIERS.length - 1;
	for (let i = start; i >= 0; i--) {
		if (LOCAL_MODEL_TIERS[i].vramMB + STORAGE_BUFFER_MB <= available) return i;
	}
	return null;
}

async function clearCache(): Promise<void> {
	const { deleteModelAllInfoInCache, prebuiltAppConfig } = await import('@mlc-ai/web-llm');
	const appConfig = { ...prebuiltAppConfig, cacheBackend: 'opfs' as const };
	await Promise.allSettled(LOCAL_MODEL_TIERS.map((t) => deleteModelAllInfoInCache(t.id, appConfig)));
}

async function loadEngine(modelId: string, fixWindowSize = false): Promise<MLCEngineInterface> {
	const [{ CreateWebWorkerMLCEngine, prebuiltAppConfig }, { default: MLCWorker }] =
		await Promise.all([import('@mlc-ai/web-llm'), import('./worker.ts?worker')]);
	const modelList = fixWindowSize
		? prebuiltAppConfig.model_list.map((m) =>
				m.model_id === modelId ? { ...m, overrides: { ...m.overrides, sliding_window_size: -1 } } : m
			)
		: prebuiltAppConfig.model_list;
	const engine = await CreateWebWorkerMLCEngine(new MLCWorker(), modelId, {
		appConfig: { ...prebuiltAppConfig, model_list: modelList, cacheBackend: 'opfs' as const },
		initProgressCallback: (p) =>
			window.dispatchEvent(new CustomEvent('webllm-progress', { detail: { progress: p.progress, text: p.text } }))
	});
	loadedModelId = modelId;
	return engine;
}

/** Load with automatic retries for window-size and corrupt-cache errors. Throws for everything else. */
async function tryLoad(modelId: string, fixWindowSize = false): Promise<MLCEngineInterface> {
	try {
		return await loadEngine(modelId, fixWindowSize);
	} catch (err) {
		// Don't null enginePromise here — that would let getEngine() spawn a parallel load.
		if (isWindowSizeError(err) && !fixWindowSize) return tryLoad(modelId, true);
		if (isCorruptCacheError(err)) {
			dispatchError('Cached model data is corrupted — clearing and redownloading…', true);
			await clearCache().catch(() => undefined);
			return loadEngine(modelId, fixWindowSize); // one retry; let it throw on second failure
		}
		throw err;
	}
}

async function createEnginePromise(): Promise<MLCEngineInterface | null> {
	await navigator.storage?.persist?.().catch(() => undefined);

	const preferred = getLocalModelTier();
	const tier = await selectFittingTier(preferred);

	if (tier === null) {
		dispatchError('Not enough browser storage for any AI model. Please free up disk space and reload.');
		return null;
	}
	if (preferred !== null && tier < preferred) {
		dispatchError(
			`Not enough storage for the selected model — loading ${LOCAL_MODEL_TIERS[tier].label} (${LOCAL_MODEL_TIERS[tier].vramMB} MB) instead.`,
			true
		);
	}

	const assessment = await assessAiCapability(tier);
	if (!assessment.supported || !assessment.modelId) return null;

	try {
		return await tryLoad(assessment.modelId);
	} catch (err) {
		enginePromise = null;
		if (!isStorageFullError(err)) {
			dispatchError(`Failed to load AI model: ${errMsg(err)}`);
			return null;
		}

		// Storage full mid-download — clear and retry one tier down.
		dispatchError('Storage full mid-download — clearing cache and retrying with a smaller model…', true);
		await clearCache().catch(() => undefined);

		const fallbackTier = tier - 1;
		if (fallbackTier < 0) {
			dispatchError('Not enough storage for any AI model. Please free up browser storage.');
			return null;
		}
		const fallback = await assessAiCapability(fallbackTier);
		if (!fallback.supported || !fallback.modelId) return null;

		return tryLoad(fallback.modelId).catch((retryErr) => {
			enginePromise = null;
			dispatchError(`Failed to load AI model: ${errMsg(retryErr)}`);
			return null;
		});
	}
}

export function loadedModelSupportsThinking(): boolean {
	if (!loadedModelId) return false;
	return LOCAL_MODEL_TIERS.find((t) => t.id === loadedModelId)?.thinking ?? false;
}

export function getEngine(): Promise<MLCEngineInterface | null> {
	if (!browser) return Promise.resolve(null);
	if (!enginePromise) enginePromise = createEnginePromise();
	return enginePromise;
}

export async function unloadEngine(): Promise<void> {
	if (!enginePromise) return;
	const promise = enginePromise;
	enginePromise = null;
	if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
	await (await promise)?.unload();
}

export function resetIdleTimer(): void {
	if (!enginePromise) return;
	if (idleTimer) clearTimeout(idleTimer);
	idleTimer = setTimeout(async () => {
		const promise = enginePromise;
		enginePromise = null;
		idleTimer = null;
		await (await promise)?.unload();
	}, IDLE_MS);
}
