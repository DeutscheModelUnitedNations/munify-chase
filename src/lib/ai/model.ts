import { browser } from '$app/env';
import type { MLCEngineInterface } from '@mlc-ai/web-llm';
import { m } from '#lib/paraglide/messages';
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

async function availableStorageMB(): Promise<number | null> {
	if (!navigator.storage?.estimate) return null;
	const { quota = 0, usage = 0 } = await navigator.storage.estimate();
	return (quota - usage) / 1024 / 1024;
}

/**
 * The largest tier up to `preferred` (any without) that fits in `availableMB` with a safety
 * buffer. Without a storage estimate the preference stands.
 */
export function fittingTier({
	preferred,
	availableMB
}: {
	preferred: number | null;
	availableMB: number | null;
}): number | null {
	if (availableMB === null) return preferred;
	const largest = LOCAL_MODEL_TIERS.length - 1;
	const start = Math.min(preferred ?? largest, largest);
	for (let i = start; i >= 0; i--) {
		if (LOCAL_MODEL_TIERS[i].vramMB + STORAGE_BUFFER_MB <= availableMB) return i;
	}
	return null;
}

async function clearCache(): Promise<void> {
	const { deleteModelAllInfoInCache, prebuiltAppConfig } = await import('@mlc-ai/web-llm');
	const appConfig = { ...prebuiltAppConfig, cacheBackend: 'opfs' as const };
	await Promise.allSettled(
		LOCAL_MODEL_TIERS.map((t) => deleteModelAllInfoInCache(t.id, appConfig))
	);
}

async function loadEngine(modelId: string, fixWindowSize = false): Promise<MLCEngineInterface> {
	const [{ CreateWebWorkerMLCEngine, prebuiltAppConfig }, { default: MLCWorker }] =
		await Promise.all([import('@mlc-ai/web-llm'), import('./worker.ts?worker')]);
	const modelList = fixWindowSize
		? prebuiltAppConfig.model_list.map((m) =>
				m.model_id === modelId
					? { ...m, overrides: { ...m.overrides, sliding_window_size: -1 } }
					: m
			)
		: prebuiltAppConfig.model_list;
	const engine = await CreateWebWorkerMLCEngine(new MLCWorker(), modelId, {
		appConfig: { ...prebuiltAppConfig, model_list: modelList, cacheBackend: 'opfs' as const },
		initProgressCallback: (p) =>
			window.dispatchEvent(
				new CustomEvent('webllm-progress', { detail: { progress: p.progress, text: p.text } })
			)
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
			dispatchError(m.aiModelCacheCorrupted(), true);
			await clearCache().catch(() => undefined);
			return loadEngine(modelId, fixWindowSize); // one retry; let it throw on second failure
		}
		throw err;
	}
}

/** The tier storage allows, telling the user when it is not the one they chose */
async function chooseTier(): Promise<number | null> {
	const preferred = getLocalModelTier();
	const tier = fittingTier({ preferred, availableMB: await availableStorageMB() });

	if (tier === null) {
		dispatchError(m.aiModelNoStorage());
	} else if (preferred !== null && tier < preferred) {
		dispatchError(
			m.aiModelStorageFallback({
				model: LOCAL_MODEL_TIERS[tier].label(),
				size: LOCAL_MODEL_TIERS[tier].vramMB
			}),
			true
		);
	}
	return tier;
}

async function modelForTier(tier: number): Promise<string | undefined> {
	const assessment = await assessAiCapability(tier);
	return assessment.supported ? assessment.modelId : undefined;
}

/** Storage ran full mid-download: clear it and retry one tier down. */
async function retryOneTierDown(tier: number): Promise<MLCEngineInterface | null> {
	dispatchError(m.aiModelStorageFullRetry(), true);
	await clearCache().catch(() => undefined);

	if (tier < 1) {
		dispatchError(m.aiModelNoStorage());
		return null;
	}
	const modelId = await modelForTier(tier - 1);
	if (!modelId) return null;

	return tryLoad(modelId).catch((retryErr) => {
		enginePromise = null;
		dispatchError(m.aiModelLoadFailed({ error: errMsg(retryErr) }));
		return null;
	});
}

async function createEnginePromise(): Promise<MLCEngineInterface | null> {
	await navigator.storage?.persist?.().catch(() => undefined);

	const tier = await chooseTier();
	if (tier === null) return null;

	const modelId = await modelForTier(tier);
	if (!modelId) return null;

	try {
		return await tryLoad(modelId);
	} catch (err) {
		enginePromise = null;
		if (isStorageFullError(err)) return retryOneTierDown(tier);
		dispatchError(m.aiModelLoadFailed({ error: errMsg(err) }));
		return null;
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
	if (idleTimer) {
		clearTimeout(idleTimer);
		idleTimer = null;
	}
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
