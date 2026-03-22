import { rumble } from '@m1212e/rumble';
import { db } from './db/db';
import { context } from './context';
import { dev } from '$app/environment';
import { Redis } from 'ioredis';
import { createRedisEventTarget } from '@graphql-yoga/redis-event-target';
import { configPrivate } from '$config/private';

let eventTarget: ReturnType<typeof createRedisEventTarget> | undefined;
if (configPrivate.REDIS_URL) {
	const publishClient = new Redis(configPrivate.REDIS_URL);
	const subscribeClient = new Redis(configPrivate.REDIS_URL);

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
	enum_,
	clientCreator
} = rumble({
	db,
	context,
	defaultLimit: 1000,
	subscriptions: [{ eventTarget }]
});
