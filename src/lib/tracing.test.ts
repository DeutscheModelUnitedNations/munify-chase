import { afterEach, describe, expect, test, vi } from 'vitest';
import { context, propagation, trace } from '@opentelemetry/api';
import { TracerProvider } from '@opentelemetry/sdk-trace';
import { startTracing } from './tracing';

describe('startTracing', () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		trace.disable();
		context.disable();
		propagation.disable();
	});

	test('sets up nothing without a collector', () => {
		vi.stubEnv('OTEL_ENDPOINT_URL', '');
		expect(startTracing({ defaultServiceName: 'MUNIFY-CHASE' })).toBeUndefined();
	});

	test('registers a provider that records spans, under the configured service name', async () => {
		vi.stubEnv('OTEL_ENDPOINT_URL', 'http://localhost:4318/v1/traces');
		vi.stubEnv('OTEL_SERVICE_NAME', 'munify-chase-app');
		vi.stubEnv('OTEL_SERVICE_VERSION', '3.1.3');
		vi.stubEnv('OTEL_AUTHORIZATION_HEADER', 'Bearer token');

		const provider = startTracing({ defaultServiceName: 'MUNIFY-CHASE' });
		expect(provider).toBeInstanceOf(TracerProvider);

		// Not ended: the exporter would then try to reach the collector, which is not there
		expect(trace.getTracer('test').startSpan('probe').isRecording()).toBe(true);
		await provider?.shutdown();
	});

	test('keeps no root trace at a sample share of 0, and falls back to all of them', async () => {
		vi.stubEnv('OTEL_ENDPOINT_URL', 'http://localhost:4318/v1/traces');
		vi.stubEnv('OTEL_TRACES_SAMPLER_ARG', '0');
		const none = startTracing({ defaultServiceName: 'MUNIFY-CHASE' });
		expect(trace.getTracer('test').startSpan('dropped').isRecording()).toBe(false);
		await none?.shutdown();
		trace.disable();

		vi.stubEnv('OTEL_TRACES_SAMPLER_ARG', 'not a number');
		const all = startTracing({ defaultServiceName: 'MUNIFY-CHASE' });
		expect(trace.getTracer('test').startSpan('kept').isRecording()).toBe(true);
		await all?.shutdown();
	});
});
