import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../../../../old/src/api/db/schema';
import { reset } from 'drizzle-seed';

const db = drizzle(process.env.DATABASE_URL!, {
	schema: schema,
	casing: 'snake_case'
});

console.info('Resetting database...');
await reset(db, schema);
console.info('Resetting database done.');
