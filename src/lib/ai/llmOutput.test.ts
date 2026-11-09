import { describe, expect, it } from 'vitest';
import {
	closeJson,
	extractJson,
	extractTrailingBoolean,
	robustJsonParse,
	safeTextParse,
	sanitizeRankedIndices
} from './llmOutput';

describe('safeTextParse', () => {
	it('drops think blocks, finished or not, and surrounding quotes', () => {
		expect(safeTextParse('<think>hmm</think> "Merged text"')).toBe('Merged text');
		expect(safeTextParse('Answer <think>still thinking')).toBe('Answer');
	});
});

describe('extractJson', () => {
	it('takes the content of a code fence', () => {
		expect(extractJson('Sure:\n```json\n{"a":1}\n```')).toBe('{"a":1}');
	});

	it('cuts off commentary after the value', () => {
		expect(extractJson('Here: {"a":"} [","b":[1]} hope that helps')).toBe('{"a":"} [","b":[1]}');
		expect(extractJson('[1,[2]] done')).toBe('[1,[2]]');
	});

	it('keeps escaped quotes inside strings', () => {
		expect(extractJson('{"a":"say \\"}\\""} trailing')).toBe('{"a":"say \\"}\\""}');
	});

	it('returns a truncated value as it is, and text without JSON trimmed', () => {
		expect(extractJson('x {"a":[1,')).toBe('{"a":[1,');
		expect(extractJson('  no json  ')).toBe('no json');
	});
});

describe('closeJson', () => {
	it('closes open strings, arrays and objects', () => {
		expect(closeJson('{"a":[1,{"b":"x')).toBe('{"a":[1,{"b":"x"}]}');
		expect(closeJson('{"a":"\\"}"')).toBe('{"a":"\\"}"}');
		expect(closeJson('[1]')).toBe('[1]');
	});
});

describe('robustJsonParse', () => {
	it('parses complete, fenced, multi-line and truncated answers', () => {
		expect(robustJsonParse('{"ranked":[2,1]}')).toEqual({ ranked: [2, 1] });
		expect(robustJsonParse('<think>a</think>```\n{"t":"a\nb"}\n```')).toEqual({ t: 'a b' });
		expect(robustJsonParse('{"ranked":[2,1')).toEqual({ ranked: [2, 1] });
	});

	it('gives up on what is no JSON at all', () => {
		expect(() => robustJsonParse('{"a": nope')).toThrow(SyntaxError);
	});
});

describe('extractTrailingBoolean', () => {
	it('answers the verdict named most often', () => {
		expect(extractTrailingBoolean('A=true, B=false. Result: **true**')).toBe(true);
		expect(extractTrailingBoolean('A=FALSE B=false\n\nfalse')).toBe(false);
	});

	it('is null on a tie or without a verdict', () => {
		expect(extractTrailingBoolean('A=true B=false')).toBeNull();
		expect(extractTrailingBoolean('maybe')).toBeNull();
		expect(extractTrailingBoolean('<think>true</think>')).toBeNull();
	});
});

describe('sanitizeRankedIndices', () => {
	it('accepts every position exactly once, numbers or numeric strings', () => {
		expect(sanitizeRankedIndices([2, '1', 3], 3)).toEqual([2, 1, 3]);
	});

	it('refuses duplicates, gaps, out of range and wrong lengths', () => {
		expect(sanitizeRankedIndices([1, 1, 2], 3)).toBeNull();
		expect(sanitizeRankedIndices([0, 1, 2], 3)).toBeNull();
		expect(sanitizeRankedIndices([1, 'x', 2], 3)).toBeNull();
		expect(sanitizeRankedIndices([1, 2], 3)).toBeNull();
		expect(sanitizeRankedIndices('1,2,3', 3)).toBeNull();
	});
});
