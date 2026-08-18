import { rumble } from '@m1212e/rumble';
import { db, schema } from './db/db';
import { context } from './context';
import { dev } from '$app/environment';
import { Redis } from 'ioredis';
import { createRedisEventTarget } from '@graphql-yoga/redis-event-target';
import { configPrivate } from '$config/private';
import ValidationPlugin from '@pothos/plugin-validation';

let eventTarget: ReturnType<typeof createRedisEventTarget> | undefined;
if (configPrivate.REDIS_URL) {
	// ioredis v6 defaults to the RESP3 wire protocol, which changes reply shapes for some
	// commands — pin the previously-default RESP2 protocol to keep behavior unchanged.
	const publishClient = new Redis(configPrivate.REDIS_URL, { protocol: 2 });
	const subscribeClient = new Redis(configPrivate.REDIS_URL, { protocol: 2 });

	eventTarget = createRedisEventTarget({
		publishClient,
		subscribeClient
	});
}

// this tells the dev server to reload the cache of the schema builder to prevent buildup of non
// existent fields/queries
if (dev) {
	import('$api/handlers/register');
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
	clientCreator
} = rumble({
	db,
	schema,
	context,
	defaultLimit: 1000,
	subscriptions: [{ eventTarget }],
	pothosConfig: {
		plugins: [ValidationPlugin]
	}
});
