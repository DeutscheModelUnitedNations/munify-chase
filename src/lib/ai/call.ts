import { getEngine, loadedModelSupportsThinking, resetIdleTimer } from './model';
import { client } from '$lib/api/rumbleClient/client';
import { urqlClient } from '$lib/api/client';

const AI_CALL_QUERY = `
	query AiCall(
		$messages: [AiMessageInput!]!
		$temperature: Float
		$maxTokens: Int
		$responseType: AiResponseType
		$responseJSONSchema: JSON
	) {
		aiCall(
			messages: $messages
			temperature: $temperature
			maxTokens: $maxTokens
			responseType: $responseType
			responseJSONSchema: $responseJSONSchema
		)
	}
`;

export type AiMode = 'offline' | 'online';

type ServerArgs = Parameters<typeof client.query.aiCall>[0]['__args'];

/** 'boolean' is a local-only, grammar-constrained format — never sent to the server. */
type CallAIArgs = Omit<ServerArgs, 'responseType'> & {
	responseType?: ServerArgs['responseType'] | 'boolean';
	mode: AiMode;
	enableThinking?: boolean;
};

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
}: CallAIArgs): Promise<string> {
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
					: responseType === 'boolean'
						? { type: 'grammar', grammar: 'root ::= "true" | "false"' }
						: { type: 'text' },
			...(useThinking ? { extra_body: { enable_thinking: true } } : {})
		});

		resetIdleTimer();
		return response.choices[0]?.message?.content ?? '';
	}

	// TODO: this needs no cache set. Make this suppoerted in rumble client
	const { data, error } = await urqlClient
		.query(
			AI_CALL_QUERY,
			{
				messages,
				temperature,
				maxTokens,
				responseType: responseType as ServerArgs['responseType'],
				responseJSONSchema
			},
			{ requestPolicy: 'network-only' }
		)
		.toPromise();

	if (error) throw error;

	return (data?.aiCall as string | null) ?? '';
}
