import { browser } from '$app/environment';

interface PhraseLists {
	preamble: string[];
	operative: string[];
}

let cached: PhraseLists | undefined;
let pending: Promise<PhraseLists> | undefined;

function parse(content: string): string[] {
	return content
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith('#'));
}

export async function loadResolutionPhrases(fetchFn: typeof fetch = fetch): Promise<PhraseLists> {
	if (cached) return cached;
	if (pending) return pending;

	pending = (async () => {
		const [preambleRes, operativeRes] = await Promise.all([
			fetchFn('/resolution-phrases/preamble.txt'),
			fetchFn('/resolution-phrases/operative.txt')
		]);
		const [preambleText, operativeText] = await Promise.all([
			preambleRes.text(),
			operativeRes.text()
		]);
		const result: PhraseLists = {
			preamble: parse(preambleText),
			operative: parse(operativeText)
		};
		if (browser) cached = result;
		return result;
	})();

	try {
		return await pending;
	} finally {
		pending = undefined;
	}
}
