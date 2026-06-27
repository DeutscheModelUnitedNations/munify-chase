import { browser } from '$app/environment';
import type { MLCEngineInterface } from '@mlc-ai/web-llm';
import { assessAiCapability } from './assess';

let enginePromise: Promise<MLCEngineInterface | null> | null = null;

export function getEngine(): Promise<MLCEngineInterface | null> {
	if (!browser) return Promise.resolve(null);
	if (!enginePromise) {
		enginePromise = assessAiCapability().then(async (assessment) => {
			if (!assessment.supported || !assessment.modelId) return null;
			const [{ CreateWebWorkerMLCEngine, prebuiltAppConfig }, { default: MLCWorker }] =
				await Promise.all([import('@mlc-ai/web-llm'), import('./worker.ts?worker')]);
			const appConfig = { ...prebuiltAppConfig, cacheBackend: 'cross-origin' as const };
			return CreateWebWorkerMLCEngine(new MLCWorker(), assessment.modelId, {
				appConfig,
				initProgressCallback: (p) => {
					window.dispatchEvent(
						new CustomEvent('webllm-progress', {
							detail: { progress: p.progress, text: p.text }
						})
					);
				}
			});
		});
	}
	return enginePromise;
}
