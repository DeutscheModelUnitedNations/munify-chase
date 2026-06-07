import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

// casing is a valid runtime option but missing from DrizzlePgConfig types in this RC
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = drizzle(process.env.DATABASE_URL!);

console.info('Resetting database...');
await db.execute(sql`
	DO $$ DECLARE
		r RECORD;
	BEGIN
		FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
			EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
		END LOOP;
	END $$;
`);
// Also drop custom enum types
await db.execute(sql`
	DO $$ DECLARE
		r RECORD;
	BEGIN
		FOR r IN (SELECT typname FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid WHERE n.nspname = 'public' AND t.typtype = 'e') LOOP
			EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
		END LOOP;
	END $$;
`);
console.info('Resetting database done.');
