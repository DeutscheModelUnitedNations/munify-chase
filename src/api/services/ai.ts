import { configPrivate } from '$lib/config/private';
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
import { generateText } from 'ai';

let currentProviderIndex = 0;

const providers = configPrivate.AI_PROVIDERS?.map((config) => {
	const [providerName, ...modelParts] = config.model.split('/');
	const modelName = modelParts.join('/');

	switch (providerName) {
		case 'openai': {
			const openai = createOpenAI({ apiKey: config.apiKey });
			return { model: openai(modelName) };
		}
		case 'openai-compatible': {
			if (!config.baseURL) {
				console.warn('openai-compatible provider requires a baseURL, skipping');
				return undefined;
			}
			const openaiCompatible = createOpenAICompatible({
				name: 'openai-compatible',
				baseURL: config.baseURL,
				apiKey: config.apiKey
			});
			return { model: openaiCompatible(modelName) };
		}
		case 'anthropic': {
			const anthropic = createAnthropic({ apiKey: config.apiKey });
			return { model: anthropic(modelName) };
		}
		case 'google': {
			const google = createGoogleGenerativeAI({ apiKey: config.apiKey });
			return { model: google(modelName) };
		}
		case 'google-vertex': {
			const vertex = createVertex({ googleAuthOptions: {} });
			return { model: vertex(modelName) };
		}
		case 'azure': {
			const azure = createAzure({ apiKey: config.apiKey });
			return { model: azure(modelName) };
		}
		case 'amazon-bedrock': {
			const bedrock = createAmazonBedrock();
			return { model: bedrock(modelName) };
		}
		case 'xai': {
			const xai = createXai({ apiKey: config.apiKey });
			return { model: xai(modelName) };
		}
		case 'groq': {
			const groq = createGroq({ apiKey: config.apiKey });
			return { model: groq(modelName) };
		}
		case 'mistral': {
			const mistral = createMistral({ apiKey: config.apiKey });
			return { model: mistral(modelName) };
		}
		case 'cohere': {
			const cohere = createCohere({ apiKey: config.apiKey });
			return { model: cohere(modelName) };
		}
		case 'deepseek': {
			const deepseek = createDeepSeek({ apiKey: config.apiKey });
			return { model: deepseek(modelName) };
		}
		case 'fireworks': {
			const fireworks = createFireworks({ apiKey: config.apiKey });
			return { model: fireworks(modelName) };
		}
		case 'togetherai': {
			const togetherai = createTogetherAI({ apiKey: config.apiKey });
			return { model: togetherai(modelName) };
		}
		case 'deepinfra': {
			const deepinfra = createDeepInfra({ apiKey: config.apiKey });
			return { model: deepinfra(modelName) };
		}
		case 'cerebras': {
			const cerebras = createCerebras({ apiKey: config.apiKey });
			return { model: cerebras(modelName) };
		}
		default:
			console.warn(`Unknown AI provider: ${providerName}`);
			return undefined;
	}
}).filter(Boolean);

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
	let provider = nextProvider();
	if (!provider) {
		throw new Error('No AI providers configured');
	}

	for (let attempt = 1; attempt <= maxIterations; attempt++) {
		try {
			return await generateText({
				...params,
				model: provider.model
			} as Parameters<typeof generateText>[0]);
		} catch (error) {
			console.error(`Attempt ${attempt} failed:`, error);
			if (attempt === maxIterations) {
				throw new Error('All attempts to call AI provider failed', { cause: error });
			}
			provider = nextProvider();
			if (!provider) {
				throw new Error('No AI providers configured', { cause: error });
			}
		}
	}
}
