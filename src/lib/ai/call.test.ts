import { beforeEach, describe, expect, it, vi } from 'vitest';

const engine = vi.hoisted(() => ({
	getEngine: vi.fn(),
	loadedModelSupportsThinking: vi.fn(() => true),
	resetIdleTimer: vi.fn()
}));
const urql = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock('./model', () => engine);
vi.mock('#lib/api/client', () => ({ urqlClient: urql }));

const { callAI, localResponseFormat } = await import('./call');

const messages = [{ role: 'user' as const, content: 'Hi' }];

function localEngine(content: string | undefined) {
	const create = vi.fn().mockResolvedValue({
		choices: content === undefined ? [] : [{ message: { content } }]
	});
	engine.getEngine.mockResolvedValue({ chat: { completions: { create } } });
	return create;
}

function serverAnswers(result: { data?: unknown; error?: unknown }) {
	urql.query.mockReturnValue({ toPromise: () => Promise.resolve(result) });
}

beforeEach(() => {
	vi.clearAllMocks();
});

describe('localResponseFormat', () => {
	it('constrains JSON by its schema and booleans by a grammar', () => {
		expect(localResponseFormat({ responseType: 'json' })).toEqual({
			type: 'json_object',
			schema: '{}'
		});
		expect(
			localResponseFormat({ responseType: 'json', responseJSONSchema: '{"a":1}' }).schema
		).toBe('{"a":1}');
		expect(localResponseFormat({ responseType: 'boolean' }).type).toBe('grammar');
		expect(localResponseFormat({})).toEqual({ type: 'text' });
	});
});

describe('callAI offline', () => {
	it('asks the local engine, thinking where the model can', async () => {
		const create = localEngine('true');
		expect(
			await callAI({ messages, mode: 'offline', enableThinking: true, responseType: 'boolean' })
		).toBe('true');
		expect(create.mock.calls[0][0]).toMatchObject({
			extra_body: { enable_thinking: true },
			response_format: { type: 'grammar' }
		});
		expect(engine.resetIdleTimer).toHaveBeenCalledOnce();
	});

	it('does not think unless asked, and answers empty without a choice', async () => {
		const create = localEngine(undefined);
		expect(await callAI({ messages, mode: 'offline' })).toBe('');
		expect(create.mock.calls[0][0]).not.toHaveProperty('extra_body');
	});

	it('fails without an engine', async () => {
		engine.getEngine.mockResolvedValue(null);
		await expect(callAI({ messages, mode: 'offline' })).rejects.toThrow('not available');
	});
});

describe('callAI online', () => {
	it('asks the server, bypassing the cache', async () => {
		serverAnswers({ data: { aiCall: 'Answer' } });
		expect(await callAI({ messages, mode: 'online', temperature: 0.1 })).toBe('Answer');
		expect(urql.query.mock.calls[0][1]).toMatchObject({ messages, temperature: 0.1 });
		expect(urql.query.mock.calls[0][2]).toEqual({ requestPolicy: 'network-only' });
	});

	it('answers empty without data and throws the server error', async () => {
		serverAnswers({ data: { aiCall: null } });
		expect(await callAI({ messages, mode: 'online' })).toBe('');
		serverAnswers({ error: new Error('quota') });
		await expect(callAI({ messages, mode: 'online' })).rejects.toThrow('quota');
	});
});
