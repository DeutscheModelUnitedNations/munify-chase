import { context, propagation, trace } from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import {
	CompositePropagator,
	W3CBaggagePropagator,
	W3CTraceContextPropagator
} from '@opentelemetry/core';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
	BatchSpanProcessor,
	ParentBasedSampler,
	TraceIdRatioBasedSampler,
	TracerProvider
} from '@opentelemetry/sdk-trace';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

/**
 * The OpenTelemetry tracer provider of the server (`src/instrumentation.server.ts`), registered
 * globally so that every `trace.getTracer()` - SvelteKit's, rumble's, the logger's - reports into it.
 * Returns `undefined`, and sets up nothing, unless `OTEL_ENDPOINT_URL` names a collector.
 *
 * `OTEL_TRACES_SAMPLER_ARG` is the share of traces kept (0 to 1, all of them by default). A span
 * follows its parent's decision, so a trace that came in sampled from another service stays whole.
 *
 * Reads `process.env` directly: it runs before SvelteKit has set up `$app/env`.
 */
export function startTracing({ defaultServiceName }: { defaultServiceName: string }) {
	const endpoint = process.env.OTEL_ENDPOINT_URL;
	if (!endpoint) return undefined;

	const authorization = process.env.OTEL_AUTHORIZATION_HEADER;
	const ratio = Number(process.env.OTEL_TRACES_SAMPLER_ARG || 1);

	// What `NodeTracerProvider.register()` did before OpenTelemetry 3: spans follow the async call
	// chain, and trace context travels in W3C headers.
	context.setGlobalContextManager(new AsyncLocalStorageContextManager().enable());
	propagation.setGlobalPropagator(
		new CompositePropagator({
			propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator()]
		})
	);

	const provider = new TracerProvider({
		resource: resourceFromAttributes({
			[ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || defaultServiceName,
			...(process.env.OTEL_SERVICE_VERSION
				? { [ATTR_SERVICE_VERSION]: process.env.OTEL_SERVICE_VERSION }
				: {})
		}),
		sampler: new ParentBasedSampler({
			root: new TraceIdRatioBasedSampler(Number.isFinite(ratio) ? ratio : 1)
		}),
		spanProcessors: [
			new BatchSpanProcessor({
				exporter: new OTLPTraceExporter({
					url: endpoint,
					headers: authorization ? { Authorization: authorization } : undefined
				})
			})
		]
	});
	trace.setGlobalTracerProvider(provider);
	return provider;
}
