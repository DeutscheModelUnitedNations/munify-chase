import { AI_PROVIDERS } from '$app/env/private';
import { createOpenAI } from '@ai-sdk/openai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createVertex } from '@ai-sdk/google-vertex';
import { createAzure } from '@ai-sdk/azure';
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { createXai } from '@ai-sdk/xai';
import { createGroq } from '@ai-sdk/groq';
import { createMistral } from '@ai-sdk/mistral';
import { createCohere } from '@ai-sdk/cohere';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { createFireworks } from '@ai-sdk/fireworks';
import { createTogetherAI } from '@ai-sdk/togetherai';
import { createDeepInfra } from '@ai-sdk/deepinfra';
import { createCerebras } from '@ai-sdk/cerebras';
import { generateText, type LanguageModel } from 'ai';
import { logger } from '#lib/logger';

let currentProviderIndex = 0;

type ProviderConfig = { model: string; apiKey?: string; baseURL?: string };
type ModelFactory = (modelName: string) => LanguageModel;

/** How each provider named before the slash of a configured model builds its models. */
const providerFactories: Record<string, (config: ProviderConfig) => ModelFactory | undefined> = {
	openai: ({ apiKey }) => createOpenAI({ apiKey }),
	'openai-compatible': ({ apiKey, baseURL }) => {
		if (!baseURL) {
			logger.warn('An openai-compatible AI provider without a baseURL is skipped');
			return undefined;
		}
		return createOpenAICompatible({ name: 'openai-compatible', baseURL, apiKey });
	},
	anthropic: ({ apiKey }) => createAnthropic({ apiKey }),
	google: ({ apiKey }) => createGoogleGenerativeAI({ apiKey }),
	'google-vertex': () => createVertex({ googleAuthOptions: {} }),
	azure: ({ apiKey }) => createAzure({ apiKey }),
	'amazon-bedrock': () => createAmazonBedrock(),
	xai: ({ apiKey }) => createXai({ apiKey }),
	groq: ({ apiKey }) => createGroq({ apiKey }),
	mistral: ({ apiKey }) => createMistral({ apiKey }),
	cohere: ({ apiKey }) => createCohere({ apiKey }),
	deepseek: ({ apiKey }) => createDeepSeek({ apiKey }),
	fireworks: ({ apiKey }) => createFireworks({ apiKey }),
	togetherai: ({ apiKey }) => createTogetherAI({ apiKey }),
	deepinfra: ({ apiKey }) => createDeepInfra({ apiKey }),
	cerebras: ({ apiKey }) => createCerebras({ apiKey })
};

function providerOf(config: ProviderConfig) {
	const [providerName, ...modelParts] = config.model.split('/');
	if (!Object.hasOwn(providerFactories, providerName)) {
		logger.warn('Unknown AI provider, skipped', { provider: providerName });
		return undefined;
	}
	const createModel = providerFactories[providerName](config);
	return createModel && { model: createModel(modelParts.join('/')) };
}

const providers = AI_PROVIDERS?.map(providerOf).filter(Boolean);

const nextProvider = () => {
	if (!providers) {
		return;
	}
	if (currentProviderIndex === providers.length) {
		currentProviderIndex = 0;
	}
	return providers[currentProviderIndex++];
};

/**
 * Makes a call to an AI provider with retry logic. Auto selects some configured AI provider and retries with another provider if the first one fails. Throws an error if all attempts fail.
 */
export async function makeAICall(
	params: Omit<Parameters<typeof generateText>[0], 'model'>,
	maxIterations = 3
) {
	let lastError: unknown;
	for (let attempt = 1; attempt <= maxIterations; attempt++) {
		const provider = nextProvider();
		if (!provider) {
			throw new Error('No AI providers configured', { cause: lastError });
		}
		try {
			return await generateText({
				...params,
				model: provider.model
			} as Parameters<typeof generateText>[0]);
		} catch (error) {
			logger.error('Calling the AI provider failed', { attempt, err: error });
			lastError = error;
		}
	}
	throw new Error('All attempts to call AI provider failed', { cause: lastError });
}
