import { drizzle } from 'drizzle-orm/bun-sql';
import { schema } from './schema/schema';

export const db = drizzle(process.env.DATABASE_URL, {
	schema
});
