import { drizzle } from 'drizzle-orm/node-postgres';
import * as schemaInternal from './schema';
import { DATABASE_URL } from '$env/static/private';

export const db = drizzle(DATABASE_URL, {
	schema: schemaInternal
});

export const schema = schemaInternal;
