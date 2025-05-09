import { rumble } from '@m1212e/rumble';
import { db } from './db/db';
import { context } from './context';
import { dev } from '$app/environment';

// this tells the dev server to reload the cache of the schema builder to prevent buildup of non
// existent fields/queries
if (dev) {
	import('$api/handlers/register');
}

export const { abilityBuilder, schemaBuilder, arg, object, query, pubsub, createYoga, enum_ } =
	rumble({
		db,
		context,
		defaultLimit: 300
	});
