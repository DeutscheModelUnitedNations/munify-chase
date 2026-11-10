/*
 * Parsing what a model answers. Small local models wrap JSON in fences, add commentary,
 * break off mid-object and think out loud, so every step here is lenient.
 */

/** Strips `<think>` blocks (also an unfinished one) and quotes around the whole answer. */
export function safeTextParse(raw: string): string {
	return raw
		.replace(/<think>[\s\S]*?<\/think>/g, '')
		.replace(/<think>[\s\S]*/g, '')
		.trim()
		.replace(/^["']|["']$/g, '');
}

/**
 * Calls `visit` for every character of `s` from `start` on that is outside a JSON string,
 * until it returns true. Answers where it stopped and whether `s` ends inside a string.
 */
function scanOutsideStrings({
	s,
	start = 0,
	visit
}: {
	s: string;
	start?: number;
	visit: (c: string) => boolean | void;
}): { stoppedAt?: number; inString: boolean } {
	let inString = false;
	let escape = false;
	for (let i = start; i < s.length; i++) {
		const c = s[i];
		if (escape) escape = false;
		else if (inString) {
			escape = c === '\\';
			inString = c !== '"';
		} else if (c === '"') inString = true;
		else if (visit(c)) return { stoppedAt: i, inString };
	}
	return { inString };
}

const CLOSERS: Record<string, string> = { '{': '}', '[': ']' };

/** The JSON value in a model's answer, without fences or commentary after it. */
export function extractJson(raw: string): string {
	const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/);
	if (fenced) return fenced[1].trim();

	const start = raw.search(/[{[]/);
	if (start < 0) return raw.trim();

	// Walk forward to find the matching close bracket, so trailing model
	// commentary after the JSON object doesn't break JSON.parse.
	const openChar = raw[start];
	const closeChar = CLOSERS[openChar];
	let depth = 0;
	const { stoppedAt } = scanOutsideStrings({
		s: raw,
		start,
		visit: (c) => {
			if (c === openChar) depth++;
			else if (c === closeChar) return --depth === 0;
		}
	});
	// Truncated — return from start to end for closeJson to complete.
	return raw.slice(start, stoppedAt === undefined ? undefined : stoppedAt + 1);
}

/**
 * Attempts to close a truncated JSON string by tracking open strings and
 * unclosed braces/brackets, then appending the minimum suffix to make it valid.
 */
export function closeJson(s: string): string {
	const stack: string[] = [];
	const { inString } = scanOutsideStrings({
		s,
		visit: (c) => {
			if (CLOSERS[c]) stack.push(CLOSERS[c]);
			else if (c === '}' || c === ']') stack.pop();
		}
	});
	return s + (inString ? '"' : '') + stack.reverse().join('');
}

/** Parses the JSON in a model's answer, completing it when it was cut off. */
export function robustJsonParse(raw: string): unknown {
	// LLMs sometimes emit literal newlines/tabs inside JSON string values, which is invalid.
	const cleaned = extractJson(safeTextParse(raw)).replace(/[\r\n\t]+/g, ' ');
	for (const candidate of [cleaned, closeJson(cleaned)]) {
		try {
			return JSON.parse(candidate);
		} catch {
			/* continue */
		}
	}
	throw new SyntaxError(`Could not parse LLM output: ${raw.slice(0, 120)}`);
}

/**
 * Tallies standalone "true"/"false" tokens across the full model output (think blocks
 * stripped) and returns whichever occurs more often, null on a tie or without any.
 * Counting across the whole response is more robust than only checking the final line,
 * since the reasoning tends to consistently reference the eventual verdict throughout.
 */
export function extractTrailingBoolean(raw: string): boolean | null {
	// Strip markdown emphasis/code markers and collapse whitespace so tokens like
	// "**true**" or a stray "true\n\n" still match cleanly.
	const cleaned = safeTextParse(raw).replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
	const matches = cleaned.match(/\btrue\b|\bfalse\b/gi) ?? [];
	const trueCount = matches.filter((match) => match.toLowerCase() === 'true').length;
	const falseCount = matches.length - trueCount;
	if (trueCount === falseCount) return null;
	return trueCount > falseCount;
}

const toIndex = (item: unknown) => (typeof item === 'number' ? item : parseInt(String(item), 10));

/** `ranked` as 1-based positions, if it names each of 1…`count` exactly once */
export function sanitizeRankedIndices(ranked: unknown, count: number): number[] | null {
	if (!Array.isArray(ranked) || ranked.length !== count) return null;
	const indices = ranked.map(toIndex);
	const inRange = indices.every((n) => Number.isInteger(n) && n >= 1 && n <= count);
	return inRange && new Set(indices).size === count ? indices : null;
}
