import { rumble } from '@m1212e/rumble';
import { db } from './db/db';
import { context } from './context';

export const { abilityBuilder, schemaBuilder, arg, object, query, pubsub, createYoga, enum_ } = rumble({
	db,
	context
});
