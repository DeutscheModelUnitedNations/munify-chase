import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { reset, seed } from 'drizzle-seed';
import { assertFirstEntryExists } from '@m1212e/rumble';
import yaml from 'js-yaml';
import type { SeedData } from './seed-data/schema.d.ts';
import * as fs from 'fs';

const db = drizzle(process.env.DATABASE_URL!, {
	schema: schema,
	casing: 'snake_case'
});

console.info('Resetting database...\n');
await reset(db, schema);

console.info('########################');
console.info('### Seeding database ###');
console.info('########################\n');

try {
	// Load the YAML file
	const filePath = './src/api/db/seed-data/' + process.argv[2];
	const fileContents = fs.readFileSync(filePath, 'utf8');

	const data = yaml.load(fileContents) as SeedData;

	// Users
	for (const user of data.users) {
		await db.insert(schema.user).values({
			...user
		});
	}

	// Conference
	console.info('Conferences:');
	for (const conference of data.conferences) {
		const conferenceEntry = await db
			.insert(schema.conference)
			.values({
				...conference
			})
			.returning()
			.then(assertFirstEntryExists);

		console.info(` - ${conference.title}`);

		console.info('   Conference users:');
		for (const user of data.users) {
			await db.insert(schema.conferenceUser).values({
				userId: user.id,
				conferenceId: conferenceEntry.id,
				conferenceUserType: user.conferenceUserType
			});
			console.info(`    - ${user.preferredUsername} (${user.conferenceUserType})`);
		}

		console.info('   Committees:');
		for (const committee of conference.committees) {
			const committeeEntry = await db
				.insert(schema.committee)
				.values({
					...committee,
					conferenceId: conferenceEntry.id
				})
				.returning()
				.then(assertFirstEntryExists);

			console.info(`    - ${committee.name}`);

			console.info('      Agenda items:');
			for (const agendaItem of committee.agendaItems) {
				const agendaItemEntry = await db
					.insert(schema.agendaItem)
					.values({
						...agendaItem,
						committeeId: committeeEntry.id
					})
					.returning()
					.then(assertFirstEntryExists);

				console.info(`       - ${agendaItem.title}${agendaItem.active ? ' (active)' : ''}`);

				await db.insert(schema.speakersList).values({
					agendaItemId: agendaItemEntry.id,
					type: 'SPEAKERS_LIST',
					speakingTime: 180
				});
				await db.insert(schema.speakersList).values({
					agendaItemId: agendaItemEntry.id,
					type: 'COMMENT_LIST',
					speakingTime: 30
				});
			}
		}
	}

	console.info('\n####################');
	console.info('### Seeding done ###');
	console.info('####################\n');
} catch (e) {
	console.error(e);
}
