import { getEngine, loadedModelSupportsThinking, resetIdleTimer } from './model';
import { client } from '$lib/api/rumbleClient/client';

export type AiMode = 'offline' | 'online';

/**
 * Sends a chat completion request to either the local WebLLM engine or the remote GraphQL
 * endpoint, depending on the `mode` parameter. Returns the raw text output from the model.
 */
export async function callAI({
	messages,
	maxTokens,
	responseJSONSchema,
	responseType,
	temperature,
	mode,
	enableThinking = false
}: Parameters<typeof client.query.aiCall>[0]['__args'] & {
	mode: AiMode;
	enableThinking?: boolean;
}): Promise<string> {
	if (mode === 'offline') {
		const engine = await getEngine();
		if (!engine) throw new Error('WebLLM engine not available');

		const useThinking = enableThinking && loadedModelSupportsThinking();
		const response = await engine.chat.completions.create({
			messages,
			temperature: temperature,
			max_tokens: maxTokens,
			response_format:
				responseType === 'json'
					? { type: 'json_object', schema: responseJSONSchema ?? '{}' }
					: { type: 'text' },
			...(useThinking ? { extra_body: { enable_thinking: true } } : {})
		});

		resetIdleTimer();
		return response.choices[0]?.message?.content ?? '';
	}

	const result = (await client.query.aiCall({
		__args: {
			messages,
			temperature,
			maxTokens,
			responseType,
			responseJSONSchema
		}
	})) as unknown as string | null;

	return result ?? '';
}
