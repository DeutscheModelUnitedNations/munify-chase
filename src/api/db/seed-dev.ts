import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { reset, seed } from 'drizzle-seed';
import { assertFirstEntryExists } from '@m1212e/rumble';

const db = drizzle(process.env.DATABASE_URL!, {
	schema: schema,
	casing: 'snake_case'
});

console.info('Resetting database...');
await reset(db, schema);

console.info('Seeding database...');

// Conference
await seed(db, { users: schema.user }).refine((f) => ({
	users: {
		columns: {
			familyName: f.lastName(),
			givenName: f.firstName(),
			email: f.email(),
			preferredUsername: f.companyName()
		},
		count: 20
	}
}));

// Users
await db.insert(schema.user).values({
	id: 'admin',
	email: 'admin@mail.com',
	familyName: 'Doe',
	givenName: 'John',
	locale: 'en',
	preferredUsername: 'admin'
});

await db.insert(schema.user).values({
	id: 'user',
	email: 'user@mail.com',
	familyName: 'Doe',
	givenName: 'Jane',
	locale: 'en',
	preferredUsername: 'user'
});

const devConf = await db
	.insert(schema.conference)
	.values({
		title: 'Dev Conference',
		pressWebsite: 'https://devconf.com'
	})
	.returning()
	.then(assertFirstEntryExists);

// Connect users to conference
await db.insert(schema.conferenceUser).values({
	conferenceId: devConf.id,
	userId: 'admin',
	conferenceUserType: 'ADMIN'
});

await db.insert(schema.conferenceUser).values({
	conferenceId: devConf.id,
	userId: 'user',
	conferenceUserType: 'TEAM'
});

// Committees
const gv = await db.insert(schema.committee).values({
	name: 'General Assembly',
	abbreviation: 'GV',
	conferenceId: devConf.id
});

const sr = await db.insert(schema.committee).values({
	name: 'Scientific Committee',
	abbreviation: 'SR',
	conferenceId: devConf.id
});

console.info('Seeding database done.');
