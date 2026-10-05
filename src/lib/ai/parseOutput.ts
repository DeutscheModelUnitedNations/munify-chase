/**
 * Calls `visit` for every character of `s` from `start` on that sits outside a JSON
 * string literal, until `visit` returns true. Returns whether the scan ended inside a
 * string, i.e. on an unterminated one.
 */
function scanJson(s: string, start: number, visit: (c: string, i: number) => boolean | void) {
	let inString = false;
	let escape = false;
	for (let i = start; i < s.length; i++) {
		const c = s[i];
		if (escape) {
			escape = false;
		} else if (inString) {
			if (c === '\\') escape = true;
			else if (c === '"') inString = false;
		} else if (c === '"') {
			inString = true;
		} else if (visit(c, i)) {
			break;
		}
	}
	return inString;
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
	let end = -1;
	scanJson(raw, start, (c, i) => {
		if (c === openChar) depth++;
		else if (c === closeChar && --depth === 0) end = i;
		return end >= 0;
	});

	// Truncated — return from start to end for closeJson to complete.
	return end >= 0 ? raw.slice(start, end + 1) : raw.slice(start);
}

/**
 * Attempts to close a truncated JSON string by tracking open strings and
 * unclosed braces/brackets, then appending the minimum suffix to make it valid.
 */
function closeJson(s: string): string {
	const stack: string[] = [];
	const inString = scanJson(s, 0, (c) => {
		if (c === '{') stack.push('}');
		else if (c === '[') stack.push(']');
		else if (c === '}' || c === ']') stack.pop();
	});
	return s + (inString ? '"' : '') + stack.reverse().join('');
}

/** Strips `<think>` reasoning and surrounding quotes from a model's text answer. */
export function safeTextParse(raw: string): string {
	return raw
		.replace(/<think>[\s\S]*?<\/think>/g, '')
		.replace(/<think>[\s\S]*/g, '')
		.trim()
		.replace(/^["']|["']$/g, '');
}

/** Parses the JSON in a model's answer, tolerating code fences, commentary and truncation. */
export function robustJsonParse(raw: string): unknown {
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
