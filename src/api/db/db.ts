import { drizzle } from 'drizzle-orm/node-postgres';
import * as schemaInternal from './schema';

// biome-ignore lint/style/noNonNullAssertion: must exist
export const db = drizzle(process.env.DATABASE_URL!, {
	schema: schemaInternal
});

export const schema = schemaInternal;
