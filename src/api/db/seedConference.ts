import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { reset, seed } from 'drizzle-seed';
import { assertFirstEntryExists } from '@m1212e/rumble';
import yaml from 'js-yaml';
import type { SeedData } from './seed-data/schema';
import * as fs from 'fs';
import { getCountryData } from './seedUtils';
import { eq } from 'drizzle-orm';

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

		const delegations: Record<string, any> = {};
		for (const alpha2Code of conference.committees.flatMap((committee) => committee.countries)) {
			if (delegations[alpha2Code]) {
				continue;
			}
			delegations[alpha2Code] = await db
				.insert(schema.representation)
				.values({
					...getCountryData(alpha2Code),
					conferenceId: conferenceEntry.id
				})
				.returning()
				.then(assertFirstEntryExists);
		}
		console.info(`   Delegations: ${Object.keys(delegations).length}`);

		console.info('   Custom representations:');
		for (const representation of conference.customRepresentations ?? []) {
			const representationEntry = await db
				.insert(schema.representation)
				.values({
					...representation,
					conferenceId: conferenceEntry.id
				})
				.returning()
				.then(assertFirstEntryExists);

			await db.insert(schema.conferenceMember).values({
				conferenceId: conferenceEntry.id,
				representationId: representationEntry.id
			});
			console.info(`    - ${representation.name} (${representation.type})`);
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

				if (agendaItem.active) {
					await db
						.update(schema.committee)
						.set({ activeAgendaItemId: agendaItemEntry.id })
						.where(eq(schema.committee.id, committeeEntry.id));
				}

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

			for (const country of committee.countries) {
				const delegation = delegations[country];
				if (!delegation) {
					throw new Error(`Delegation ${country} not found`);
				}

				await db.insert(schema.committeeMember).values({
					committeeId: committeeEntry.id,
					representationId: delegation.id
				});
			}
			console.info(`      Countries: ${committee.countries.length}`);
		}
	}

	console.info('\n####################');
	console.info('### Seeding done ###');
	console.info('####################\n');
} catch (e) {
	console.error(e);
}
