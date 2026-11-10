import { beforeEach, describe, expect, it, vi } from 'vitest';

const callAI = vi.hoisted(() => vi.fn());
vi.mock('./call', () => ({ callAI }));

const { classifyObsolescence, evaluateAndSuggestRewrite, rankAmendmentsByImpact } =
	await import('./amendments');

beforeEach(() => {
	callAI.mockReset();
});

const trigger = { id: 't', oldContent: 'Old text', newContent: 'Current text' };
const subject = { id: 's', newContent: 'Proposed text' };

describe('classifyObsolescence', () => {
	it('trusts the verdict in the reasoning', async () => {
		callAI.mockResolvedValueOnce('A=true, B=false. true');
		expect(await classifyObsolescence(trigger, subject, 'offline')).toEqual({
			id: 's',
			obsolete: true
		});
		expect(callAI).toHaveBeenCalledOnce();
		expect(callAI.mock.calls[0][0].messages[1].content).toContain('"Old text" to "Proposed text"');
	});

	it('gives up online when the reasoning has no verdict', async () => {
		callAI.mockResolvedValueOnce('I cannot say');
		expect(await classifyObsolescence(trigger, subject, 'online')).toBeNull();
		expect(callAI).toHaveBeenCalledOnce();
	});

	it('extracts the verdict in a second call offline', async () => {
		callAI.mockResolvedValueOnce('A=true B=false').mockResolvedValueOnce('false');
		expect(await classifyObsolescence(trigger, { newContent: 'x' }, 'offline')).toEqual({
			id: '',
			obsolete: false
		});
		expect(callAI.mock.calls[1][0].responseType).toBe('boolean');
	});
});

describe('rankAmendmentsByImpact', () => {
	const amendments = [
		{ id: 'a', documentNumber: 'A/1', targetOperativeIndex: 0, newContent: 'x' },
		{ id: 'b', newContent: null },
		{ id: 'c', targetOperativeIndex: 2 }
	];

	it('keeps fewer than two amendments as they are', async () => {
		expect(await rankAmendmentsByImpact([amendments[0]], 'online')).toEqual(['a']);
		expect(callAI).not.toHaveBeenCalled();
	});

	it('orders by the ranking the model answers', async () => {
		callAI.mockResolvedValueOnce('{"ranked":[3,1,2]}');
		expect(await rankAmendmentsByImpact(amendments, 'online')).toEqual(['c', 'a', 'b']);
		const prompt = callAI.mock.calls[0][0].messages[1].content;
		expect(prompt).toContain('1. (A/1 – clause 1): "x"');
		expect(prompt).toContain('2. (amendment – clause ?): "(not available)"');
	});

	it('keeps the order when the online answer is empty or unusable', async () => {
		callAI.mockResolvedValueOnce('');
		expect(await rankAmendmentsByImpact(amendments, 'online')).toEqual(['a', 'b', 'c']);
		callAI.mockResolvedValueOnce('{"ranked":[1,1,1]}');
		expect(await rankAmendmentsByImpact(amendments, 'online')).toEqual(['a', 'b', 'c']);
		expect(callAI).toHaveBeenCalledTimes(2);
	});

	it('extracts the ranking from the reasoning offline', async () => {
		callAI
			.mockResolvedValueOnce('C matters most, then B')
			.mockResolvedValueOnce('{"ranked":[3,2,1]}');
		expect(await rankAmendmentsByImpact(amendments, 'offline')).toEqual(['c', 'b', 'a']);
		expect(callAI.mock.calls[1][0].responseType).toBe('json');
	});

	it('keeps the order when the extraction fails too', async () => {
		callAI.mockResolvedValueOnce('no idea').mockResolvedValueOnce('');
		expect(await rankAmendmentsByImpact(amendments, 'offline')).toEqual(['a', 'b', 'c']);
		callAI.mockResolvedValueOnce('no idea').mockResolvedValueOnce('"a list"');
		expect(await rankAmendmentsByImpact(amendments, 'offline')).toEqual(['a', 'b', 'c']);
	});
});

describe('evaluateAndSuggestRewrite', () => {
	it('answers the merged text without labels or quotes', async () => {
		callAI.mockResolvedValueOnce('<think>merge</think>OUTPUT: "Merged text"');
		expect(await evaluateAndSuggestRewrite(trigger, subject, 'online')).toBe('Merged text');
	});

	it('is empty without an answer', async () => {
		callAI.mockResolvedValueOnce('');
		expect(await evaluateAndSuggestRewrite(trigger, subject)).toBe('');
	});
});
