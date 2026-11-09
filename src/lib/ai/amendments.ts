import { serializeClause } from '@deutschemodelunitednations/munify-resolution-editor';
import { callAI, type AiMode } from './call';
import { getAiPreference, preferenceToMode } from './aiPreference.svelte';
import {
	extractTrailingBoolean,
	robustJsonParse,
	safeTextParse,
	sanitizeRankedIndices
} from './llmOutput';

function defaultMode(): AiMode {
	return preferenceToMode(getAiPreference());
}

/*
 * ATTENTION: The parameters in this module are carefully tuned for the smallest local model.
 * Before you change anything, be sure you know what you are doing!
 */

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

export interface ObsolescenceResult {
	id: string;
	obsolete: boolean;
}

export async function classifyObsolescence(
	trigger: AmendmentBrief,
	subject: AmendmentBrief,
	mode: AiMode = defaultMode()
): Promise<ObsolescenceResult | null> {
	// const triggerOld = toText(trigger.oldContent);
	const triggerNew = toText(trigger.newContent);
	// subject.oldContent is only populated once an amendment is accepted; a still-pending
	// subject amendment never has it set, so fall back to the shared pre-change baseline
	// captured on the trigger amendment (both target the same original clause text).
	const subjectOld = toText(subject.oldContent ?? trigger.oldContent);
	const subjectNew = toText(subject.newContent);

	const reasoning = await callAI({
		messages: [
			{
				role: 'system',
				content: `You are a text evaluation expert that is trained to detect obsolescence after a change to a text. You will be given a text change proposal. Your task is to determine whether the proposal is obsolete.

A proposal is obsolete if EITHER of these two, separate questions is true:
 - Question A (subsumed): Does the current text already fully express the proposed change, such that applying the change would alter nothing meaningful in the text?
 - Question B (irreconcilable): Is the current text so substantially or completely different from the proposed change that merging them would not make sense (e.g. the change effectively replaces the whole text with unrelated wording)?

Answer Question A, then Question B, explicitly and separately, before giving your final verdict. The final verdict is true only if A is true OR B is true; otherwise false.

Examples:
Current text: "The committee shall meet bi-annually."; Proposed change: "The committee shall meet every year." -> "The committee shall meet every two years."; A=true (the current text already says "bi-annually", i.e. every two years); B=false; Result: true
Current text: "The committee shall meet bi-annually."; Proposed change: "The committee shall meet every year." -> "The committee shall meet every year to discuss recent changes."; A=false (the current text does not mention discussing recent changes); B=false (the texts are close enough to merge); Result: false
Current text: "The human rights council decides to be actively involved in developments in that field."; Proposed change: "The committee shall meet every year." -> "The committee shall meet every year to discuss recent changes."; A=false; B=true (the current text has nothing in common with the proposed change, so there is no sensible way to merge them); Result: true
Current text: "The committee calls upon Member States to increase funding for education."; Proposed change: "The committee calls upon Member States to increase funding for education." -> "The committee calls upon developed Member States to increase funding for education and healthcare."; A=false (the change adds "developed" and "healthcare", which the current text does not cover); B=false (the change only extends the current text and could be merged into it); Result: false

Reason step by step, explicitly stating A and B. Finish your response with one boolean value, and nothing else in the response, no prefix, no field name, just a boolean value that directly can be parsed (e.g. no obsolete='true', just 'true'). Respond with a truthy value if you think it is obsolete. Respond with a falsy value if you think it is not obsolete.`
			},
			{
				role: 'user',
				content: `Please determine if the change of "${subjectOld}" to "${subjectNew}" is obsolete if the current text is "${triggerNew}". Answer Question A and Question B explicitly, then finish with a final line containing exactly one word representing the verdict as a bool value, and nothing else.`
			}
		],
		temperature: 0.2,
		responseType: 'text',
		enableThinking: true,
		mode
	});

	if (reasoning === null) return null;
	const verdictOf = (obsolete: boolean | null) =>
		obsolete === null ? null : { id: subject.id ?? '', obsolete };

	// Remote models are trusted to follow the trailing true/false instruction in one call. We
	// also dont wanna waste another paid call here if not running locally. Local models are
	// weaker at instruction-following, so they only fall back to a second grammar-constrained
	// call (re-extracting from the same reasoning, no re-prompting) when that parse failed.
	const extracted = extractTrailingBoolean(reasoning);
	if (extracted !== null || mode === 'online') return verdictOf(extracted);

	const verdict = await callAI({
		messages: [
			{
				role: 'system',
				content:
					'Extract the final verdict (obsolete or not) from the analysis given. Respond with exactly one word: true or false.'
			},
			// Pass the complete reasoning, including any <think> blocks, so the extraction
			// call sees the full deliberation rather than just a stripped conclusion.
			{ role: 'user', content: reasoning }
		],
		temperature: 0,
		responseType: 'boolean',
		mode
	});

	if (verdict === null) return null;
	return verdictOf(safeTextParse(verdict).toLowerCase() === 'true');
}

type RankedAmendment = {
	id: string;
	documentNumber?: string | null;
	newContent?: string | null;
	targetOperativeIndex?: number | null;
};

// 1-based numeric keys in the prompt so the model never has to reproduce 30-char nanoids
function amendmentLine(amendment: RankedAmendment, i: number) {
	const clause = amendment.targetOperativeIndex != null ? amendment.targetOperativeIndex + 1 : '?';
	return `${i + 1}. (${amendment.documentNumber ?? 'amendment'} – clause ${clause}): "${toText(amendment.newContent)}"`;
}

/** The ids in the order a model's `{"ranked":[…]}` answer puts them, null if it is unusable */
function rankingFrom({ raw, ids }: { raw: string; ids: string[] }): string[] | null {
	try {
		const parsed = robustJsonParse(raw);
		const ranked =
			typeof parsed === 'object' && parsed !== null ? Reflect.get(parsed, 'ranked') : undefined;
		return sanitizeRankedIndices(ranked, ids.length)?.map((n) => ids[n - 1]) ?? null;
	} catch {
		return null;
	}
}

export async function rankAmendmentsByImpact(
	amendments: RankedAmendment[],
	mode: AiMode = defaultMode()
): Promise<string[]> {
	const ids = amendments.map((a) => a.id);
	if (amendments.length < 2) return ids;

	const list = amendments.map(amendmentLine).join('\n');

	const systemPrompt = `You are a Model UN resolution expert.

Impact = how much the change affects the clause's operative meaning and political weight.
High: operative verb replacement, scope change (who is obligated), binding language.
Medium: qualifying conditions, purpose/scope rewording, new sub-clauses.
Low: synonyms, adjectives, punctuation, minor rephrasing.`;

	const userPrompt = `Rank these amendments from most to least impactful:\n${list}\n\nOutput ONLY raw JSON (no markdown, no code fences): {"ranked":[3,2,1,4]} using the amendment numbers above — include every number exactly once.`;

	// A free reasoning call first (enables thinking)
	const reasoning = await callAI({
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: userPrompt }
		],
		temperature: 0.1,
		responseType: 'text',
		enableThinking: true,
		mode
	});

	if (!reasoning) return ids;
	const ranking = rankingFrom({ raw: reasoning, ids });
	// Remote models get one call; local ones a constrained extraction when that failed
	if (ranking || mode === 'online') return ranking ?? ids;

	// Second call: schema-constrained extraction from the reasoning output.
	const extracted = await callAI({
		messages: [
			{
				role: 'system',
				content: `Extract the final ranked amendment numbers from the analysis given. Output ONLY valid JSON: {"ranked":[1,2,3,4,5]} using integers 1–${amendments.length}.`
			},
			{ role: 'user', content: reasoning }
		],
		temperature: 0,
		responseType: 'json',
		responseJSONSchema: JSON.stringify({
			type: 'object',
			properties: { ranked: { type: 'array', items: { type: 'integer' } } },
			required: ['ranked']
		}),
		mode
	});

	if (!extracted) return ids;
	return rankingFrom({ raw: extracted, ids }) ?? ids;
}

export async function evaluateAndSuggestRewrite(
	trigger: AmendmentBrief,
	subject: AmendmentBrief,
	mode: AiMode = defaultMode()
): Promise<string> {
	const originalClause = toText(subject.oldContent ?? trigger.oldContent);
	const currentClause = toText(trigger.newContent);
	const proposedClause = toText(subject.newContent);

	const raw = await callAI({
		messages: [
			{
				role: 'system',
				content: `You are a text editor for merging change requests to a text.
Rules:
- Output only the merged text. No explanation, no commentary.
- Keep all wording that is not part of the change.
- Same language as input. Joining words like "and", "oder", "ou" are good.
- A simple concat with a SINGLE CONCAT WORD is often a GOOD solution. When doing that, prefer the first text to actually turn out to be first in the merge.
- Beware of sentence symbols like periods, commas, semicolons, and colons. They should NOT BE MISPLACED OR APPEAR RANDOMLY MID SENTENCE. Use combinatory words instead!

Examples:
Original: "Requests the Secretary-General to report annually."
First change: "Requests the Secretary-General to report annually to the General Assembly."
Second change: "Requests the Secretary-General to report annually to the Security Council."
Merged: "Requests the Secretary-General to report annually to the General Assembly and the Security Council."

Original: "Calls upon Member States to increase funding."
First change: "Calls upon Member States to increase funding for education."
Second change: "Calls upon developed Member States to increase funding."
Merged: "Calls upon developed Member States to increase funding for education."`
			},
			{
				role: 'user',
				content: `The original text is "${originalClause}".
There are two suggested changes.
The first one wants to change the text to "${currentClause}".
The second one wants to change the text to "${proposedClause}".
Respond with the FULL MERGED TEXT preserving BOTH change intents. Double check that you did not leave out any intent of either change request!`
			}
		],
		temperature: 0.43,
		responseType: 'text',
		enableThinking: true,
		mode
	});

	if (!raw) return '';
	const result = safeTextParse(raw)
		.replace(/^OUTPUT:\s*/i, '')
		.replace(/^["']|["']$/g, '')
		.trim();
	return result;
}
