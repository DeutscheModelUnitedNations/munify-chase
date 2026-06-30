import { serializeClause } from '@deutschemodelunitednations/munify-resolution-editor';
import { callAI, type AiMode } from './call';

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

export async function classifyObsolescence(
	trigger: AmendmentBrief,
	subject: AmendmentBrief,
	mode: AiMode = 'offline'
): Promise<ObsolescenceResult | null> {
	const triggerOld = toText(trigger.oldContent);
	const triggerNew = toText(trigger.newContent);
	const subjectOld = toText(subject.oldContent);
	const subjectNew = toText(subject.newContent);

	const raw = await callAI({
		messages: [
			{
				role: 'system',
				content: `You are a Model UN resolution expert. Output ONLY JSON: {"obsolete":boolean}.

Obsolete = accepted change already made the same change, removed the targeted words, or shifted meaning so much the amendment no longer makes sense. Not obsolete = targets a different part of the clause.

Examples:
"10%"→"20%", surviving proposes "20%" → {"obsolete":true}
"10%"→"20%", surviving proposes "15%" → {"obsolete":false}
"developed nations"→"all nations", surviving targets "developed nations" → {"obsolete":true}`
			},
			{
				role: 'user',
				content: `An amendment was accepted that changes ${clauseRef(trigger.targetOperativeIndex)}.

Before the accepted change, the clause read:
"${triggerOld}"

After the accepted change, the clause now reads:
"${triggerNew}"

The surviving amendment (${subject.documentNumber ?? 'amendment'}) was written to change the clause from:
"${subjectOld}"
to:
"${subjectNew}"

First, check whether the words the surviving amendment was targeting still appear in the updated clause text. Then decide: is this surviving amendment now obsolete?`
			}
		],
		temperature: 0.1,
		maxTokens: 300,
		responseType: 'json',
		responseJSONSchema: JSON.stringify({
			type: 'object',
			properties: { obsolete: { type: 'boolean' } },
			required: ['obsolete']
		}),
		mode
	});

	if (raw === null) return null;

	const parsed = robustJsonParse(raw) as { obsolete: boolean };
	return {
		id: subject.id ?? '',
		obsolete: !!parsed.obsolete
	};
}

export async function rankAmendmentsByImpact(
	amendments: Array<{
		id: string;
		documentNumber?: string | null;
		newContent?: string | null;
		targetOperativeIndex?: number | null;
	}>,
	mode: AiMode = 'offline'
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
	mode: AiMode = 'offline'
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
- Beware of sentence symbols like periods, commas, semicolons, and colons. They should NOT BE MISPLACED OR APPEAR RANDOMLY MID SENTENCE. Use combinatory words instead!`
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
		// maxTokens: Math.min(1000, Math.ceil(currentClause.length / 3) + 500),
		responseType: 'text',
		enableThinking: true,
		mode
	});

	console.log(raw)

	if (!raw) return '';
	const result = safeTextParse(raw)
		.replace(/^OUTPUT:\s*/i, '')
		.replace(/^["']|["']$/g, '')
		.trim();
	return result;
}
