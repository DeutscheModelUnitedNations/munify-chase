import { afterEach, describe, expect, test, vi } from 'vitest';
import { INVALID_SPAN_CONTEXT, SpanStatusCode, trace } from '@opentelemetry/api';
import { logger, serializeError } from './logger';

describe('serializeError', () => {
	function circular() {
		const client: Record<string, unknown> = { host: 'redis' };
		client.self = client;
		return client;
	}

	test('keeps message, stack and fields that serialize, and names the ones that do not', () => {
		const err = Object.assign(new Error('boom'), { code: 'ECONNRESET', client: circular() });
		const serialized = serializeError(err);

		expect(serialized).toMatchObject({
			type: 'Error',
			message: 'boom',
			stack: err.stack,
			code: 'ECONNRESET',
			client: '[unserializable Object]'
		});
		expect(() => JSON.stringify(serialized)).not.toThrow();
	});

	test('does the same for the errors of an AggregateError', () => {
		const inner = Object.assign(new Error('inner'), { socket: circular() });
		const serialized = serializeError(new AggregateError([inner], 'outer'));

		expect(serialized).toMatchObject({
			message: 'outer',
			aggregateErrors: [{ message: 'inner', socket: '[unserializable Object]' }]
		});
		expect(() => JSON.stringify(serialized)).not.toThrow();
	});

	test('leaves what is not an error alone, and names what does not serialize', () => {
		expect(serializeError('text')).toBe('text');
		const loop: Record<string, unknown> = {};
		loop.self = loop;
		expect(serializeError(loop)).toBe('[unserializable Object]');
	});
});

describe('the active span', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	function spanSpy() {
		const span = trace.wrapSpanContext(INVALID_SPAN_CONTEXT);
		vi.spyOn(trace, 'getActiveSpan').mockReturnValue(span);
		return {
			addEvent: vi.spyOn(span, 'addEvent'),
			recordException: vi.spyOn(span, 'recordException'),
			setStatus: vi.spyOn(span, 'setStatus')
		};
	}

	test('gets each line as an event, with its fields flattened to primitives', () => {
		const span = spanSpy();
		const err = new Error('boom');
		logger.info('Saved', { id: 'a', count: 2, done: true, gone: undefined, ids: ['x'], err });

		expect(span.addEvent).toHaveBeenCalledWith('Saved', {
			'log.level': 'info',
			id: 'a',
			count: 2,
			done: true,
			gone: undefined,
			ids: '["x"]',
			'err.message': 'boom',
			'err.stack': err.stack
		});
		expect(span.setStatus).not.toHaveBeenCalled();
	});

	test('keeps a value that is not an object under `data`, and an error without a stack bare', () => {
		const span = spanSpy();
		const err = new Error('boom');
		err.stack = undefined;
		logger.warn('Odd', 'text');
		logger.child({ name: 'yjs' }).warn('No stack', err);
		logger.debug('Bare');

		expect(span.addEvent).toHaveBeenNthCalledWith(1, 'Odd', { 'log.level': 'warn', data: 'text' });
		expect(span.addEvent).toHaveBeenNthCalledWith(2, 'No stack', {
			'log.level': 'warn',
			'err.message': 'boom'
		});
		expect(span.addEvent).toHaveBeenNthCalledWith(3, 'Bare', { 'log.level': 'debug' });
	});

	test('is marked failed by an error line, with the exception recorded, also from a field', () => {
		const span = spanSpy();
		const err = new Error('boom');
		const fieldErr = new Error('in a field');
		logger.error('Failed', err);
		logger.error('Failed with fields', { paperId: 'p1', err: fieldErr });
		logger.error('Failed without one');

		expect(span.recordException.mock.calls).toEqual([[err], [fieldErr]]);
		expect(span.setStatus).toHaveBeenCalledWith({ code: SpanStatusCode.ERROR, message: 'Failed' });
		expect(span.setStatus).toHaveBeenCalledTimes(3);
	});

	test('is left alone when there is none', () => {
		vi.spyOn(trace, 'getActiveSpan').mockReturnValue(undefined);
		expect(() => logger.error('Nothing to attach to', new Error('boom'))).not.toThrow();
	});
});
