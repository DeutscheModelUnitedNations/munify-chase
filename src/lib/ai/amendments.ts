import { serializeClause } from '@deutschemodelunitednations/munify-resolution-editor';
import { callAI, type AiMode } from './call';
import { getAiPreference, preferenceToMode } from './aiPreference.svelte';

function defaultMode(): AiMode {
	return preferenceToMode(getAiPreference());
}

/*
 * ATTENTION: The parameters in this module are carefully tuned for the smallest local model.
 * Before you change anything, be sure you know what you are doing!
 */

function describeChange(oldText: string, newText: string): string {
	const ow = oldText.trim().split(/\s+/);
	const nw = newText.trim().split(/\s+/);
	let pre = 0;
	while (pre < ow.length && pre < nw.length && ow[pre] === nw[pre]) pre++;
	let suf = 0;
	const maxSuf = Math.min(ow.length - pre, nw.length - pre);
	while (suf < maxSuf && ow[ow.length - 1 - suf] === nw[nw.length - 1 - suf]) suf++;
	const removed = ow.slice(pre, suf ? -suf : undefined);
	const added = nw.slice(pre, suf ? -suf : undefined);
	if (removed.length === 0 && added.length === 0) return 'no wording change';
	if (removed.length === 0) return `inserts "${added.join(' ')}"`;
	if (added.length === 0) return `deletes "${removed.join(' ')}"`;
	return `replaces "${removed.join(' ')}" with "${added.join(' ')}"`;
}

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

	const start = raw.search(/[{[]/);
	if (start < 0) return raw.trim();

	// Walk forward to find the matching close bracket, so trailing model
	// commentary after the JSON object doesn't break JSON.parse.
	const openChar = raw[start];
	const closeChar = openChar === '{' ? '}' : ']';
	let depth = 0;
	let inString = false;
	let escape = false;
	for (let i = start; i < raw.length; i++) {
		const c = raw[i];
		if (escape) {
			escape = false;
			continue;
		}
		if (c === '\\' && inString) {
			escape = true;
			continue;
		}
		if (c === '"') {
			inString = !inString;
			continue;
		}
		if (inString) continue;
		if (c === openChar) depth++;
		else if (c === closeChar && --depth === 0) return raw.slice(start, i + 1);
	}

	// Truncated — return from start to end for closeJson to complete.
	return raw.slice(start);
}

/**
 * Attempts to close a truncated JSON string by tracking open strings and
 * unclosed braces/brackets, then appending the minimum suffix to make it valid.
 */
function closeJson(s: string): string {
	let inString = false;
	let escape = false;
	const stack: string[] = [];
	for (let i = 0; i < s.length; i++) {
		const c = s[i];
		if (escape) {
			escape = false;
			continue;
		}
		if (c === '\\' && inString) {
			escape = true;
			continue;
		}
		if (c === '"') {
			inString = !inString;
			continue;
		}
		if (inString) continue;
		if (c === '{') stack.push('}');
		else if (c === '[') stack.push(']');
		else if (c === '}' || c === ']') stack.pop();
	}
	return s + (inString ? '"' : '') + stack.reverse().join('');
}

function safeTextParse(raw: string): string {
	return raw
		.replace(/<think>[\s\S]*?<\/think>/g, '')
		.replace(/<think>[\s\S]*/g, '')
		.trim()
		.replace(/^["']|["']$/g, '');
}

function robustJsonParse(raw: string): any {
	const stripped = safeTextParse(raw);
	// LLMs sometimes emit literal newlines/tabs inside JSON string values, which is invalid.
	const sanitize = (s: string) => s.replace(/[\r\n\t]+/g, ' ');

	const cleaned = sanitize(extractJson(stripped));
	try {
		return JSON.parse(cleaned);
	} catch {
		/* continue */
	}

	try {
		return JSON.parse(closeJson(cleaned));
	} catch {
		/* continue */
	}

	throw new SyntaxError(`Could not parse LLM output: ${raw.slice(0, 120)}`);
}

export interface ObsolescenceResult {
	id: string;
	obsolete: boolean;
}

/**
 * Tallies standalone "true"/"false" tokens across the full model output (think blocks
 * already stripped by safeTextParse) and returns whichever occurs more often. Used to
 * trust a single online call's own verdict instead of spending a second call to re-extract
 * it. Counting across the whole response is more robust than only checking the final line,
 * since the reasoning tends to consistently reference the eventual verdict throughout.
 */
function extractTrailingBoolean(raw: string): boolean | null {
	// Strip markdown emphasis/code markers and collapse whitespace so tokens like
	// "**true**" or a stray "true\n\n" still match cleanly.
	const cleaned = safeTextParse(raw).replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
	const matches = cleaned.match(/\btrue\b|\bfalse\b/gi);
	if (!matches || matches.length === 0) return null;
	let trueCount = 0;
	let falseCount = 0;
	for (const m of matches) {
		if (m.toLowerCase() === 'true') trueCount++;
		else falseCount++;
	}
	if (trueCount === falseCount) return null;
	return trueCount > falseCount;
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

	console.log(reasoning);

	if (reasoning === null) return null;

	// Remote models are trusted to follow the trailing true/false instruction in one call. We also dont wanna waste another paid call here if not running locally.
	const extracted = extractTrailingBoolean(reasoning);
	if (mode === 'online') {
		if (extracted === null) return null;
		return { id: subject.id ?? '', obsolete: extracted };
	}

	// Local models are weaker at instruction-following; only fall back to a second
	// grammar-constrained call (re-extracting from the same reasoning, no re-prompting)
	// when the trailing true/false parse failed.
	if (extracted !== null) {
		return { id: subject.id ?? '', obsolete: extracted };
	}

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

	return {
		id: subject.id ?? '',
		obsolete: safeTextParse(verdict).toLowerCase() === 'true'
	};
}

export async function rankAmendmentsByImpact(
	amendments: Array<{
		id: string;
		documentNumber?: string | null;
		newContent?: string | null;
		targetOperativeIndex?: number | null;
	}>,
	mode: AiMode = defaultMode()
): Promise<string[]> {
	if (amendments.length < 2) return amendments.map((a) => a.id);

	const list = amendments
		.map(
			(a, i) =>
				`${i + 1}. id="${a.id}" (${a.documentNumber ?? 'amendment'} – clause ${a.targetOperativeIndex != null ? a.targetOperativeIndex + 1 : '?'}): "${a.newContent ?? '(no text)'}"`
		)
		.join('\n');

	const raw = await callAI({
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
		maxTokens: 300,
		responseType: 'json',
		responseJSONSchema: JSON.stringify({
			type: 'object',
			properties: { ranked: { type: 'array', items: { type: 'string' } } },
			required: ['ranked']
		}),
		mode
	});

	if (raw === null) return amendments.map((a) => a.id);

	const parsed = robustJsonParse(raw) as { ranked: string[] };
	return parsed.ranked ?? amendments.map((a) => a.id);
}

export async function evaluateAndSuggestRewrite(
	trigger: AmendmentBrief,
	subject: AmendmentBrief,
	mode: AiMode = defaultMode()
): Promise<string> {
	const originalClause = toText(subject.oldContent ?? trigger.oldContent);
	const currentClause = toText(trigger.newContent);
	const proposedClause = toText(subject.newContent);
	const delta = describeChange(originalClause, proposedClause);

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
