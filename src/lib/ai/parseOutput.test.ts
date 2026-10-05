import { describe, expect, it } from 'vitest';
import { robustJsonParse, safeTextParse } from './parseOutput';

describe('safeTextParse', () => {
	it('strips think blocks and surrounding quotes', () => {
		expect(safeTextParse('<think>hmm</think> "true"')).toBe('true');
		expect(safeTextParse('false <think>unterminated')).toBe('false');
	});
});

describe('robustJsonParse', () => {
	it('parses plain JSON', () => {
		expect(robustJsonParse('{"a":[1,2]}')).toEqual({ a: [1, 2] });
	});

	it('reads JSON from a code fence', () => {
		expect(robustJsonParse('Here you go:\n```json\n[3, 1]\n```')).toEqual([3, 1]);
	});

	it('ignores commentary around the JSON', () => {
		expect(robustJsonParse('Sure! {"ranked": [2]} Hope that helps {not json}')).toEqual({
			ranked: [2]
		});
	});

	it('does not end the object on brackets inside strings', () => {
		expect(robustJsonParse('{"text": "a } b \\" ]", "n": 1} trailing')).toEqual({
			text: 'a } b " ]',
			n: 1
		});
	});

	it('closes truncated output', () => {
		expect(robustJsonParse('{"ranked": [1, 2')).toEqual({ ranked: [1, 2] });
		expect(robustJsonParse('{"reason": "cut off')).toEqual({ reason: 'cut off' });
	});

	it('replaces raw newlines inside strings', () => {
		expect(robustJsonParse('{"text": "line\none"}')).toEqual({ text: 'line one' });
	});

	it('throws on unparseable output', () => {
		expect(() => robustJsonParse('no json here')).toThrow(SyntaxError);
	});
});
