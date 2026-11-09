import { rumble } from '@m1212e/rumble';
import { db, schema } from './db/db';
import { context } from './context';
import { dev } from '$app/env';
import { Redis } from 'ioredis';
import { createRedisEventTarget } from '@graphql-yoga/redis-event-target';
import {
	OTEL_ENDPOINT_URL,
	OTEL_SERVICE_NAME,
	OTEL_SERVICE_VERSION,
	REDIS_URL
} from '$app/env/private';
import ValidationPlugin from '@pothos/plugin-validation';
import { trace } from '@opentelemetry/api';
import { graphqlLogger } from '#lib/logger';

let eventTarget: ReturnType<typeof createRedisEventTarget> | undefined;
if (REDIS_URL) {
	// ioredis v6 defaults to the RESP3 wire protocol, which changes reply shapes for some
	// commands — pin the previously-default RESP2 protocol to keep behavior unchanged.
	const publishClient = new Redis(REDIS_URL, { protocol: 2 });
	const subscribeClient = new Redis(REDIS_URL, { protocol: 2 });

	eventTarget = createRedisEventTarget({
		publishClient,
		subscribeClient
	});
}

// this tells the dev server to reload the cache of the schema builder to prevent buildup of non
// existent fields/queries
if (dev) {
	import('#api/handlers/register');
}

export const {
	abilityBuilder,
	schemaBuilder,
	whereArg,
	object,
	query,
	pubsub,
	createYoga,
	createWs,
	enum_,
	clientCreator,
	buildSchema
} = rumble({
	db,
	schema,
	context,
	defaultLimit: 1000,
	subscriptions: [{ eventTarget }],
	// A span per operation and root field, over HTTP and WebSocket (`src/instrumentation.server.ts`).
	// Variables carry personal data, so they stay out of spans and log lines.
	otel: {
		enabled: !!OTEL_ENDPOINT_URL,
		tracer: trace.getTracer(OTEL_SERVICE_NAME, OTEL_SERVICE_VERSION),
		includeVariables: false
	},
	// The trace ids come from the logger itself, on every line (`#lib/logger`)
	logger: { enabled: true, logger: graphqlLogger, includeVariables: false, injectTraceId: false },
	pothosConfig: {
		plugins: [ValidationPlugin]
	}
});
