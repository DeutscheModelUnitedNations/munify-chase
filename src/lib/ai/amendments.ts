import { getEngine } from './model';

type AmendmentBrief = {
	id?: string;
	documentNumber?: string | null;
	newContent?: string | null;
	targetOperativeIndex?: number | null;
	/** Text of the clause before the trigger amendment was accepted. */
	oldContent?: string | null;
};

function clauseRef(idx: number | null | undefined) {
	return idx != null ? `operative clause ${idx + 1}` : 'an operative clause';
}

function extractJson(raw: string): string {
	const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/);
	if (fenced) return fenced[1].trim();
	const brace = raw.search(/[{[]/);
	if (brace > 0) return raw.slice(brace);
	return raw.trim();
}

function robustJsonParse(raw: string): unknown {
	const cleaned = extractJson(raw);
	try {
		return JSON.parse(cleaned);
	} catch {
		/* continue */
	}

	const patches = ['"}', '"]}', '}', ']}'];
	for (const patch of patches) {
		try {
			return JSON.parse(cleaned + patch);
		} catch {
			/* continue */
		}
	}

	throw new SyntaxError(`Could not parse LLM output: ${raw.slice(0, 120)}`);
}

export interface ObsolescenceResult {
	id: string;
	obsolete: boolean;
	reason: string;
}

export async function classifyObsolescence(
	trigger: AmendmentBrief,
	subject: AmendmentBrief
): Promise<ObsolescenceResult | null> {
	const engine = await getEngine();
	if (!engine) return null;

	const response = await engine.chat.completions.create({
		messages: [
			{
				role: 'system',
				content:
					'You are a Model UN resolution expert. Output ONLY a raw JSON object — no markdown, no code fences, no explanation. The object must contain "obsolete" (boolean) and "reason" (string).'
			},
			{
				role: 'user',
				content: `A resolution amendment was accepted that changes ${clauseRef(trigger.targetOperativeIndex)}.\n\nBefore the change, the clause read:\n"${trigger.oldContent ?? '(not available)'}"\n\nAfter the change, the clause now reads:\n"${trigger.newContent ?? '(no text)'}"\n\nA surviving amendment (${subject.documentNumber ?? 'amendment'}) proposes changing that clause to:\n"${subject.newContent ?? '(no text)'}"\n\nIs this surviving amendment now obsolete — i.e. its intended change is already covered or contradicted by the accepted text?`
			}
		],
		temperature: 0.1,
		max_tokens: 200,
		response_format: { type: 'json_object', schema: '{}' }
	});

	const raw = response.choices[0]?.message?.content ?? '';
	const parsed = robustJsonParse(raw) as { obsolete: boolean; reason: string };
	return {
		id: subject.id ?? '',
		obsolete: !!parsed.obsolete,
		reason: String(parsed.reason ?? '')
	};
}

export async function rankAmendmentsByImpact(
	amendments: Array<{
		id: string;
		documentNumber?: string | null;
		newContent?: string | null;
		targetOperativeIndex?: number | null;
	}>
): Promise<string[]> {
	const engine = await getEngine();
	if (!engine || amendments.length < 2) return amendments.map((a) => a.id);

	const list = amendments
		.map(
			(a, i) =>
				`${i + 1}. id="${a.id}" (${a.documentNumber ?? 'amendment'} – clause ${a.targetOperativeIndex != null ? a.targetOperativeIndex + 1 : '?'}): "${a.newContent ?? '(no text)'}"`
		)
		.join('\n');

	const response = await engine.chat.completions.create({
		messages: [
			{
				role: 'system',
				content:
					'You are a Model UN resolution expert. Output ONLY a raw JSON object — no markdown, no code fences, no explanation. The object must contain "ranked" (array of id strings ordered from most to least impactful).'
			},
			{
				role: 'user',
				content: `Rank these text-change amendments from most to least impactful. Consider: replacement of operative verbs or key substantive language = high impact; rewording of purpose clauses or scope = medium impact; minor changes like adjectives, adverbs, or punctuation = low impact.\n\nAmendments:\n${list}`
			}
		],
		temperature: 0.1,
		max_tokens: 200,
		response_format: { type: 'json_object', schema: '{}' }
	});

	const raw = response.choices[0]?.message?.content ?? '';
	const parsed = robustJsonParse(raw) as { ranked: string[] };
	return parsed.ranked ?? amendments.map((a) => a.id);
}

export interface RewriteResult {
	needsRewrite: boolean;
	/** Empty string when needsRewrite is false. */
	suggestion: string;
}

export async function evaluateAndSuggestRewrite(
	trigger: AmendmentBrief,
	subject: AmendmentBrief
): Promise<RewriteResult> {
	const engine = await getEngine();
	if (!engine) return { needsRewrite: false, suggestion: '' };

	const response = await engine.chat.completions.create({
		messages: [
			{
				role: 'system',
				content:
					'You are a Model UN resolution expert. Output ONLY a raw JSON object — no markdown, no code fences, no explanation. The object must contain "needsRewrite" (boolean), "reason" (string), and "suggestion" (string, empty if no rewrite needed).'
			},
			{
				role: 'user',
				content: `An amendment was accepted that changes ${clauseRef(trigger.targetOperativeIndex)}.\n\nBefore the change, the clause read:\n"${trigger.oldContent ?? '(not available)'}"\n\nAfter the change, the clause now reads:\n"${trigger.newContent ?? '(no text)'}"\n\nA surviving amendment (${subject.documentNumber ?? 'amendment'}) proposes changing that clause to:\n"${subject.newContent ?? '(no text)'}"\n\nDoes this surviving amendment's proposed text need to be adjusted to stay coherent given what the clause now says? It is valid to say no adjustment is needed if the proposed text still reads correctly on its own.`
			}
		],
		temperature: 0.1,
		max_tokens: Math.max(150, 80 + Math.ceil(((subject.newContent?.length ?? 0) * 1.5) / 4)),
		response_format: { type: 'json_object', schema: '{}' }
	});

	const raw = response.choices[0]?.message?.content ?? '';
	const parsed = robustJsonParse(raw) as { needsRewrite: boolean; suggestion: string };
	const needsRewrite = !!parsed.needsRewrite;
	return {
		needsRewrite,
		suggestion: needsRewrite ? (parsed.suggestion ?? '') : ''
	};
}
