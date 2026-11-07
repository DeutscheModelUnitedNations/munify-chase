import { trace } from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { register, supportsSyncHooks } from 'import-in-the-middle/register-hooks.mjs';
import { startTracing } from '#lib/tracing';

/**
 * OpenTelemetry for the server, which SvelteKit finds by its name and loads before any
 * application code (https://svelte.dev/docs/kit/observability). adapter-node's `index.js` loads it
 * first, so `src/server.js`, which imports that, gets it too.
 *
 * Only active when `OTEL_ENDPOINT_URL` names a collector (`startTracing`). SvelteKit then emits
 * spans for `handle`, loads and remote functions (`tracing.server` in `vite.config.ts`), rumble one
 * per GraphQL operation and root field, over HTTP and WebSocket alike (`otel` in
 * `src/api/rumble.ts`), and the instrumentations below one per incoming and outgoing HTTP request,
 * Postgres query and Redis command.
 *
 * The instrumentations wrap the modules they observe as these are imported, which for an ES module
 * only an import hook can do, and only before the module is first loaded: that is why the hook is
 * registered here, and why `pg` (under drizzle) and `ioredis` stay out of the server bundle, as
 * `dependencies` that adapter-node leaves external. The hook intercepts only those modules.
 */
const provider = startTracing({ defaultServiceName: 'MUNIFY-CHASE' });

if (provider) {
	// The synchronous hook needs Node 22.22.3+, 24.11.1+, 25.1.0+ or 26 (the image runs the current
	// LTS). On an older Node only SvelteKit's and rumble's spans are left.
	if (supportsSyncHooks()) {
		register({ include: ['pg', 'ioredis', 'http', 'https', 'node:http', 'node:https'] });
	} else {
		console.warn('Node is too old for the import hook: no spans for HTTP, Postgres and Redis');
	}

	registerInstrumentations({
		tracerProvider: provider,
		instrumentations: [
			new HttpInstrumentation(),
			// The statements as drizzle sends them, with `$1` placeholders: their values stay out. A
			// query outside a request (the pool's own) is no trace of its own, and taking a pooled
			// connection, as every query does, no span.
			new PgInstrumentation({
				enhancedDatabaseReporting: false,
				requireParentSpan: true,
				ignoreConnectSpans: true
			}),
			// Commands outside a request (the subscriptions' and Hocuspocus' pub/sub) are left out,
			// by default
			new IORedisInstrumentation()
		]
	});

	trace.getTracer('munify-chase').startSpan('startup').end();
}
