import { serializeClause } from '@deutschemodelunitednations/munify-resolution-editor';
import { configPublic } from '$lib/config/public';
import { urqlClient } from '$lib/api/client';
import { gql } from '@urql/core';
import { getEngine } from './model';

type AmendmentBrief = {
	id?: string;
	documentNumber?: string | null;
	newContent?: string | null;
	targetOperativeIndex?: number | null;
	oldContent?: string | null;
};

/** Deserialize ProseMirror/Y.js clause JSON to plain readable text for LLM prompts. */
function toText(raw: string | null | undefined): string {
	if (!raw) return '(not available)';
	try {
		return serializeClause(JSON.parse(raw));
	} catch {
		return raw;
	}
}

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

// ─── GraphQL documents ────────────────────────────────────────────────────────

const AI_BACKEND_AVAILABLE_QUERY = gql`
	query AiBackendAvailable {
		aiBackendAvailable
	}
`;

const AI_CLASSIFY_OBSOLESCENCE = gql`
	mutation AiClassifyObsolescence(
		$triggerOld: String!
		$triggerNew: String!
		$subjectOld: String!
		$subjectNew: String!
		$clauseRef: String!
		$documentNumber: String!
	) {
		aiClassifyObsolescence(
			triggerOld: $triggerOld
			triggerNew: $triggerNew
			subjectOld: $subjectOld
			subjectNew: $subjectNew
			clauseRef: $clauseRef
			documentNumber: $documentNumber
		) {
			obsolete
			reason
		}
	}
`;

const AI_RANK_AMENDMENTS = gql`
	mutation AiRankAmendmentsByImpact($list: String!) {
		aiRankAmendmentsByImpact(list: $list)
	}
`;

const AI_EVALUATE_REWRITE = gql`
	mutation AiEvaluateAndSuggestRewrite(
		$triggerOld: String!
		$triggerNew: String!
		$subjectNew: String!
		$clauseRef: String!
		$documentNumber: String!
	) {
		aiEvaluateAndSuggestRewrite(
			triggerOld: $triggerOld
			triggerNew: $triggerNew
			subjectNew: $subjectNew
			clauseRef: $clauseRef
			documentNumber: $documentNumber
		) {
			needsRewrite
			reason
			suggestion
		}
	}
`;

// ─── Backend availability cache ───────────────────────────────────────────────

let backendAvailableCache: boolean | null = null;

async function isBackendAvailable(): Promise<boolean> {
	if (backendAvailableCache !== null) return backendAvailableCache;
	try {
		const result = await urqlClient
			.query<{ aiBackendAvailable: boolean }>(AI_BACKEND_AVAILABLE_QUERY, {})
			.toPromise();
		backendAvailableCache = result.data?.aiBackendAvailable ?? false;
		return backendAvailableCache;
	} catch {
		backendAvailableCache = false;
		return false;
	}
}

/**
 * Returns which execution path to use.
 * - "backend": call via GraphQL mutations
 * - "local": use WebLLM in-browser
 * - null: no AI available
 */
async function resolveEngine(): Promise<'backend' | 'local' | null> {
	const mode = configPublic.PUBLIC_AI_MODE;

	if (mode === 'backend') {
		return (await isBackendAvailable()) ? 'backend' : null;
	}

	if (mode === 'local') {
		const engine = await getEngine();
		return engine ? 'local' : null;
	}

	// "auto": prefer backend, fall back to local
	if (await isBackendAvailable()) return 'backend';
	const engine = await getEngine();
	return engine ? 'local' : null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface ObsolescenceResult {
	id: string;
	obsolete: boolean;
	reason: string;
}

export async function classifyObsolescence(
	trigger: AmendmentBrief,
	subject: AmendmentBrief
): Promise<ObsolescenceResult | null> {
	const path = await resolveEngine();
	if (!path) return null;

	const triggerOld = toText(trigger.oldContent);
	const triggerNew = toText(trigger.newContent);
	const subjectOld = toText(subject.oldContent);
	const subjectNew = toText(subject.newContent);
	const ref = clauseRef(trigger.targetOperativeIndex);
	const docNum = subject.documentNumber ?? 'amendment';

	if (path === 'backend') {
		const result = await urqlClient
			.mutation<{
				aiClassifyObsolescence: { obsolete: boolean; reason: string } | null;
			}>(AI_CLASSIFY_OBSOLESCENCE, {
				triggerOld,
				triggerNew,
				subjectOld,
				subjectNew,
				clauseRef: ref,
				documentNumber: docNum
			})
			.toPromise();

		const data = result.data?.aiClassifyObsolescence;
		if (!data) return null;
		return { id: subject.id ?? '', obsolete: data.obsolete, reason: data.reason };
	}

	// local WebLLM path
	const engine = await getEngine();
	if (!engine) return null;

	const response = await engine.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: `You are a Model UN resolution expert. Output ONLY JSON: {"obsolete":boolean,"reason":string}.

Obsolete = accepted change already made the same change, removed the targeted words, or shifted meaning so much the amendment no longer makes sense. Not obsolete = targets a different part of the clause.

Examples:
"10%"→"20%", surviving proposes "20%" → obsolete (already adopted)
"10%"→"20%", surviving proposes "15%" → not obsolete (distinct proposal)
"developed nations"→"all nations", surviving targets "developed nations" → obsolete (words removed)`
			},
			{
				role: 'user',
				content: `An amendment was accepted that changes ${ref}.

Before the accepted change, the clause read:
"${triggerOld}"

After the accepted change, the clause now reads:
"${triggerNew}"

The surviving amendment (${docNum}) was written to change the clause from:
"${subjectOld}"
to:
"${subjectNew}"

First, check whether the words the surviving amendment was targeting still appear in the updated clause text. Then decide: is this surviving amendment now obsolete?`
			}
		],
		temperature: 0.1,
		max_tokens: 200,
		response_format: {
			type: 'json_object',
			schema: JSON.stringify({
				type: 'object',
				properties: { obsolete: { type: 'boolean' }, reason: { type: 'string' } },
				required: ['obsolete', 'reason']
			})
		}
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
	const path = await resolveEngine();
	if (!path || amendments.length < 2) return amendments.map((a) => a.id);

	const list = amendments
		.map(
			(a, i) =>
				`${i + 1}. id="${a.id}" (${a.documentNumber ?? 'amendment'} – clause ${a.targetOperativeIndex != null ? a.targetOperativeIndex + 1 : '?'}): "${a.newContent ?? '(no text)'}"`
		)
		.join('\n');

	if (path === 'backend') {
		const result = await urqlClient
			.mutation<{ aiRankAmendmentsByImpact: string[] }>(AI_RANK_AMENDMENTS, { list })
			.toPromise();
		return result.data?.aiRankAmendmentsByImpact ?? amendments.map((a) => a.id);
	}

	// local WebLLM path
	const engine = await getEngine();
	if (!engine) return amendments.map((a) => a.id);

	const response = await engine.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: `You are a Model UN resolution expert. Output ONLY JSON: {"ranked":[id,...]}.

Impact = how much the change affects the clause's operative meaning and political weight.
High: operative verb replacement, scope change (who is obligated), binding language.
Medium: qualifying conditions, purpose/scope rewording, new sub-clauses.
Low: synonyms, adjectives, punctuation, minor rephrasing.`
			},
			{
				role: 'user',
				content: `Rank these amendments from most to least impactful:\n${list}`
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
	reason: string;
}

export async function evaluateAndSuggestRewrite(
	trigger: AmendmentBrief,
	subject: AmendmentBrief
): Promise<RewriteResult> {
	const path = await resolveEngine();
	if (!path) return { needsRewrite: false, suggestion: '', reason: '' };

	const triggerOld = toText(trigger.oldContent);
	const triggerNew = toText(trigger.newContent);
	const subjectNew = toText(subject.newContent);
	const ref = clauseRef(trigger.targetOperativeIndex);
	const docNum = subject.documentNumber ?? 'amendment';

	if (path === 'backend') {
		const result = await urqlClient
			.mutation<{
				aiEvaluateAndSuggestRewrite: { needsRewrite: boolean; reason: string; suggestion: string };
			}>(AI_EVALUATE_REWRITE, {
				triggerOld,
				triggerNew,
				subjectNew,
				clauseRef: ref,
				documentNumber: docNum
			})
			.toPromise();

		const data = result.data?.aiEvaluateAndSuggestRewrite;
		if (!data) return { needsRewrite: false, suggestion: '', reason: '' };
		const needsRewrite = !!data.needsRewrite;
		return {
			needsRewrite,
			suggestion: needsRewrite ? (data.suggestion ?? '') : '',
			reason: String(data.reason ?? '')
		};
	}

	// local WebLLM path
	const engine = await getEngine();
	if (!engine) return { needsRewrite: false, suggestion: '', reason: '' };

	const response = await engine.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: `You are a Model UN resolution expert. Output ONLY JSON: {"needsRewrite":boolean,"reason":string,"suggestion":string}.

Merge the surviving amendment's intent into the new clause text. suggestion = start from the NEW clause, apply what the surviving amendment intended to change, output the merged clause as plain prose (no explanation). needsRewrite = false only if the surviving amendment targets a part completely untouched by the accepted change (then suggestion = "").

Examples:
Old "…member states…30 days", new "…all nations…30 days", surviving intent: 60 days → {"needsRewrite":true,"reason":"Baseline shifted; merged 60-day intent into new text.","suggestion":"…all nations…60 days"}
Old "compile a report", new "compile an annual report", surviving intent: soften verb to 'invites' → {"needsRewrite":true,"reason":"Applied softened verb to updated text.","suggestion":"invites…to compile an annual report"}`
			},
			{
				role: 'user',
				content: `An amendment was accepted that changes ${ref}.

Before the accepted change, the clause read:
"${triggerOld}"

After the accepted change, the clause now reads:
"${triggerNew}"

The surviving amendment (${docNum}) was written to change that clause to:
"${subjectNew}"

Identify what the surviving amendment was trying to achieve (its intent). Then apply that intent to the new clause text and produce the merged result.`
			}
		],
		temperature: 0.1,
		max_tokens: Math.max(150, 80 + Math.ceil(((subject.newContent?.length ?? 0) * 1.5) / 4)),
		response_format: { type: 'json_object', schema: '{}' }
	});

	const raw = response.choices[0]?.message?.content ?? '';
	const parsed = robustJsonParse(raw) as {
		needsRewrite: boolean;
		suggestion: string;
		reason: string;
	};
	const needsRewrite = !!parsed.needsRewrite;

	return {
		needsRewrite,
		suggestion: needsRewrite ? (parsed.suggestion ?? '') : '',
		reason: String(parsed.reason ?? '')
	};
}
