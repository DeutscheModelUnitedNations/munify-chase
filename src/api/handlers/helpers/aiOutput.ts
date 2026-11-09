import { jsonSchema, Output } from 'ai';

/**
 * The output an AI call asks for: text, any JSON, or JSON of the schema the client sends. The
 * client sends the schema as a JSON string (WebLLM's local grammar-constrained format requires a
 * string), so it is parsed back into an object for the ai SDK's `jsonSchema()`.
 */
export function aiOutput({
	responseType,
	responseJSONSchema
}: {
	responseType?: 'text' | 'json' | null;
	responseJSONSchema?: string | null;
}) {
	if (responseType !== 'json') return Output.text();
	if (!responseJSONSchema) return Output.json();
	return Output.object({ schema: jsonSchema(JSON.parse(responseJSONSchema)) });
}
