import { describe, expect, test } from 'vitest';
import { aiOutput } from './aiOutput';

function formatOf(args: Parameters<typeof aiOutput>[0]) {
	return aiOutput(args).responseFormat;
}

describe('aiOutput', () => {
	test('asks for text unless JSON is asked for', async () => {
		expect(await formatOf({ responseType: null, responseJSONSchema: '{}' })).toEqual({
			type: 'text'
		});
		expect(await formatOf({ responseType: 'text', responseJSONSchema: null })).toEqual({
			type: 'text'
		});
	});

	test('asks for any JSON without a schema', async () => {
		expect(await formatOf({ responseType: 'json', responseJSONSchema: null })).toMatchObject({
			type: 'json'
		});
	});

	test('asks for JSON of the schema the client sends', async () => {
		const schema = { type: 'object', properties: { a: { type: 'string' } } };
		expect(
			await formatOf({ responseType: 'json', responseJSONSchema: JSON.stringify(schema) })
		).toMatchObject({ type: 'json', schema });
	});
});
