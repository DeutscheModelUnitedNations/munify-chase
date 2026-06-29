import { configPrivate } from '$lib/config/private';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject, type LanguageModel } from 'ai';
import { z } from 'zod';

// ─── Provider config schema ───────────────────────────────────────────────────

const providerConfigSchema = z.object({
	/**
	 * Model ID in "provider/model-name" format, e.g.:
	 *   "openai/gpt-4o-mini"
	 *   "anthropic/claude-haiku-4.5"
	 *   "openai/llama-3.1-8b-instant"  (with baseUrl pointing to Groq / Together / etc.)
	 */
	model: z.string(),
	apiKey: z.string(),
	/** Required for OpenAI-compatible endpoints that are not api.openai.com */
	baseUrl: z.string().optional()
});

type ProviderConfig = z.infer<typeof providerConfigSchema>;

// ─── Parse and cache provider list ───────────────────────────────────────────

let parsedProviders: ProviderConfig[] | null = null;

function getProviders(): ProviderConfig[] {
	if (parsedProviders) return parsedProviders;

	const raw = configPrivate.AI_PROVIDERS;
	if (!raw) {
		parsedProviders = [];
		return parsedProviders;
	}

	let json: unknown;
	try {
		json = JSON.parse(raw);
	} catch {
		console.error('[AI] AI_PROVIDERS is not valid JSON — backend AI disabled');
		parsedProviders = [];
		return parsedProviders;
	}

	const result = z.array(providerConfigSchema).safeParse(json);
	if (!result.success) {
		console.error('[AI] AI_PROVIDERS failed validation:', result.error.issues);
		parsedProviders = [];
		return parsedProviders;
	}

	parsedProviders = result.data;
	return parsedProviders;
}

/** Build an SDK LanguageModel from a config entry by parsing the provider prefix. */
function buildModel(config: ProviderConfig): LanguageModel {
	const slashIndex = config.model.indexOf('/');
	if (slashIndex === -1) throw new Error(`Invalid model ID "${config.model}" — expected "provider/model-name"`);

	const provider = config.model.slice(0, slashIndex);
	const modelName = config.model.slice(slashIndex + 1);

	if (provider === 'anthropic') {
		return createAnthropic({ apiKey: config.apiKey })(modelName);
	}

	// "openai" prefix covers OpenAI itself and any OpenAI-compatible API (Groq, Together, Ollama…)
	return createOpenAI({
		apiKey: config.apiKey,
		...(config.baseUrl ? { baseURL: config.baseUrl } : {})
	})(modelName);
}

/**
 * Picks a random provider from the configured list, then falls back through the
 * remaining providers (in shuffled order) if the chosen one fails.
 */
async function withModel<T>(fn: (model: LanguageModel) => Promise<T>): Promise<T> {
	const providers = getProviders();
	if (providers.length === 0) throw new Error('Backend AI not configured');

	// Fisher-Yates shuffle into a new array so we try each provider at most once
	const shuffled = [...providers];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	let lastError: unknown;
	for (const config of shuffled) {
		try {
			return await fn(buildModel(config));
		} catch (err) {
			console.warn(`[AI] ${config.model} failed, trying next:`, err);
			lastError = err;
		}
	}

	throw lastError;
}

// ─── Public helpers ───────────────────────────────────────────────────────────

export function isBackendAiAvailable(): boolean {
	return getProviders().length > 0;
}

export async function backendClassifyObsolescence(
	triggerOld: string,
	triggerNew: string,
	subjectOld: string,
	subjectNew: string,
	clauseRef: string,
	documentNumber: string
): Promise<{ obsolete: boolean; reason: string }> {
	return withModel((model) =>
		generateObject({
			model,
			schema: z.object({
				obsolete: z.boolean(),
				reason: z.string()
			}),
			system: `You are a Model UN resolution expert.

Obsolete = accepted change already made the same change, removed the targeted words, or shifted meaning so much the amendment no longer makes sense. Not obsolete = targets a different part of the clause.

Examples:
"10%"→"20%", surviving proposes "20%" → obsolete (already adopted)
"10%"→"20%", surviving proposes "15%" → not obsolete (distinct proposal)
"developed nations"→"all nations", surviving targets "developed nations" → obsolete (words removed)`,
			prompt: `An amendment was accepted that changes ${clauseRef}.

Before the accepted change, the clause read:
"${triggerOld}"

After the accepted change, the clause now reads:
"${triggerNew}"

The surviving amendment (${documentNumber}) was written to change the clause from:
"${subjectOld}"
to:
"${subjectNew}"

First, check whether the words the surviving amendment was targeting still appear in the updated clause text. Then decide: is this surviving amendment now obsolete?`
		}).then((r) => r.object)
	);
}

export async function backendRankAmendmentsByImpact(list: string): Promise<{ ranked: string[] }> {
	return withModel((model) =>
		generateObject({
			model,
			schema: z.object({
				ranked: z.array(z.string())
			}),
			system: `You are a Model UN resolution expert.

Impact = how much the change affects the clause's operative meaning and political weight.
High: operative verb replacement, scope change (who is obligated), binding language.
Medium: qualifying conditions, purpose/scope rewording, new sub-clauses.
Low: synonyms, adjectives, punctuation, minor rephrasing.`,
			prompt: `Rank these amendments from most to least impactful:\n${list}`
		}).then((r) => r.object)
	);
}

export async function backendEvaluateAndSuggestRewrite(
	triggerOld: string,
	triggerNew: string,
	subjectNew: string,
	clauseRef: string,
	documentNumber: string
): Promise<{ needsRewrite: boolean; reason: string; suggestion: string }> {
	return withModel((model) =>
		generateObject({
			model,
			schema: z.object({
				needsRewrite: z.boolean(),
				reason: z.string(),
				suggestion: z.string()
			}),
			system: `You are a Model UN resolution expert.

Merge the surviving amendment's intent into the new clause text. suggestion = start from the NEW clause, apply what the surviving amendment intended to change, output the merged clause as plain prose (no explanation). needsRewrite = false only if the surviving amendment targets a part completely untouched by the accepted change (then suggestion = "").

Examples:
Old "…member states…30 days", new "…all nations…30 days", surviving intent: 60 days → {"needsRewrite":true,"reason":"Baseline shifted; merged 60-day intent into new text.","suggestion":"…all nations…60 days"}
Old "compile a report", new "compile an annual report", surviving intent: soften verb to 'invites' → {"needsRewrite":true,"reason":"Applied softened verb to updated text.","suggestion":"invites…to compile an annual report"}`,
			prompt: `An amendment was accepted that changes ${clauseRef}.

Before the accepted change, the clause read:
"${triggerOld}"

After the accepted change, the clause now reads:
"${triggerNew}"

The surviving amendment (${documentNumber}) was written to change that clause to:
"${subjectNew}"

Identify what the surviving amendment was trying to achieve (its intent). Then apply that intent to the new clause text and produce the merged result.`
		}).then((r) => r.object)
	);
}
