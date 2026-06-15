import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { reset } from 'drizzle-seed';
import { assertFirstEntryExists } from '@m1212e/rumble';
import yaml from 'js-yaml';
import type { SeedData } from './seed-data/schema';
import * as fs from 'fs';
import { getCountryData } from './seedUtils';
import { and, eq, type InferSelectModel } from 'drizzle-orm';
import { attendanceCode as generateAttendanceCode } from '../../lib/helpers/attendanceCode';
import { nanoid } from '../../lib/helpers/nanoid';
import * as Y from 'yjs';
import { jsonToYDoc } from '@deutschemodelunitednations/munify-resolution-editor/yjs';
import {
	createEmptyResolution,
	type Resolution
} from '@deutschemodelunitednations/munify-resolution-editor/schema';

// casing is a valid runtime option but missing from DrizzlePgConfig types in this RC
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = drizzle(process.env.DATABASE_URL!);

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
				userEmail: user.email,
				conferenceId: conferenceEntry.id,
				conferenceUserType: user.conferenceUserType,
				attendanceCode:
					user.conferenceUserType === 'NON_STATE_ACTOR' ? generateAttendanceCode() : null
			});
			console.info(`    - ${user.preferredUsername} (${user.conferenceUserType})`);
		}

		const delegations: Record<string, InferSelectModel<typeof schema.representation>> = {};
		for (const alpha2Code of conference.committees.flatMap((committee) =>
			committee.countries.map((country) => country.toLowerCase())
		)) {
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
		const customRepresentations = [];
		for (const representation of conference.customRepresentations ?? []) {
			const representationEntry = await db
				.insert(schema.representation)
				.values({
					...representation,
					conferenceId: conferenceEntry.id,
					alpha2Code: representation.type === 'UN' ? 'un' : undefined,
					alpha3Code: representation.type === 'UN' ? 'uno' : undefined
				})
				.returning()
				.then(assertFirstEntryExists);

			customRepresentations.push(
				await db
					.insert(schema.conferenceMember)
					.values({
						conferenceId: conferenceEntry.id,
						representationId: representationEntry.id
					})
					.returning()
					.then(assertFirstEntryExists)
			);
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
				const delegation = delegations[country.toLowerCase()];
				if (!delegation) {
					throw new Error(`Delegation ${country.toLowerCase()} not found`);
				}

				const cm = await db
					.insert(schema.committeeMember)
					.values({
						committeeId: committeeEntry.id,
						representationId: delegation.id
					})
					.returning()
					.then(assertFirstEntryExists);

				await db.insert(schema.conferenceUser).values({
					userEmail: `${committee.abbreviation.toLowerCase()}.${country.toLowerCase()}@delegate.dev`,
					conferenceId: conferenceEntry.id,
					conferenceUserType: 'DELEGATE',
					committeeMemberId: cm.id
				});
			}
			console.info(`      Countries: ${committee.countries.length}`);

			for (const customRepresentation of customRepresentations) {
				if (customRepresentation.representationId === committeeEntry.id) {
					continue;
				}
				await db.insert(schema.committeeMember).values({
					committeeId: committeeEntry.id,
					representationId: customRepresentation.representationId
				});
			}
		}
	}

	console.info('\n### Seeding resolution papers ###');
	await seedResolutionPapers();

	console.info('\n####################');
	console.info('### Seeding done ###');
	console.info('####################\n');
} catch (e) {
	console.error(e);
}

function encodeYjsState(seed: Resolution): Buffer {
	const doc = new Y.Doc();
	jsonToYDoc(doc, seed);
	return Buffer.from(Y.encodeStateAsUpdate(doc));
}

async function seedResolutionPapers() {
	// For each committee with an active agenda item, create 2 papers in
	// different statuses. Uses plain SELECTs because the seed db has no
	// relations registered.
	const committees = await db.select().from(schema.committee);

	for (const committee of committees) {
		if (!committee.activeAgendaItemId) continue;

		const allMembers = await db
			.select({
				id: schema.committeeMember.id,
				representationType: schema.representation.type
			})
			.from(schema.committeeMember)
			.innerJoin(
				schema.representation,
				eq(schema.committeeMember.representationId, schema.representation.id)
			)
			.where(eq(schema.committeeMember.committeeId, committee.id));

		const delegateMembers = allMembers.filter((m) => m.representationType === 'DELEGATION');
		if (delegateMembers.length < 3) continue;

		console.info(`  ${committee.name}:`);

		// === WORKING_PAPER ===
		{
			const creator = delegateMembers[0];
			const sponsors = delegateMembers.slice(0, 3);
			const paperId = nanoid();
			const title = `Working draft on agenda item`;
			const seed = createEmptyResolution(committee.name);
			seed.committeeName = committee.name;

			await db.insert(schema.resolutionPaper).values({
				id: paperId,
				committeeId: committee.id,
				agendaItemId: committee.activeAgendaItemId,
				creatorCommitteeMemberId: creator.id,
				status: 'WORKING_PAPER',
				title,
				documentNumber: `WP/${committee.abbreviation}/1`
			});
			await db.insert(schema.paperYjsDoc).values({
				id: nanoid(),
				paperId,
				state: encodeYjsState(seed)
			});
			for (const s of sponsors) {
				await db.insert(schema.paperSponsor).values({
					id: nanoid(),
					paperId,
					committeeMemberId: s.id
				});
			}
			console.info(
				`    - ${title} [WORKING_PAPER, ${sponsors.length} sponsors] (${paperId})`
			);
		}

		// === DRAFT_RESOLUTION (active) ===
		{
			const creator = delegateMembers[1];
			const sponsors = delegateMembers.slice(0, 5);
			const paperId = nanoid();
			const title = `Draft resolution`;

			// Pre-seed with a realistic resolution body so the editor isn't empty.
			const seed: Resolution = createEmptyResolution(committee.name);
			seed.committeeName = committee.name;
			seed.preamble = [
				{
					id: nanoid(),
					content:
						'Reaffirming the principles of the Charter of the United Nations and the Universal Declaration of Human Rights,'
				},
				{
					id: nanoid(),
					content:
						'Recognizing the urgency of coordinated international action on the matter at hand,'
				},
				{
					id: nanoid(),
					content: 'Deeply concerned by the lack of sustained financing for capacity building,'
				}
			];
			seed.operative = [
				{
					id: nanoid(),
					blocks: [
						{
							type: 'text',
							id: nanoid(),
							content:
								'Calls upon all Member States to support the establishment of a coordinated reporting mechanism;'
						}
					]
				},
				{
					id: nanoid(),
					blocks: [
						{
							type: 'text',
							id: nanoid(),
							content:
								'Requests the Secretary-General to submit, within twelve months, a detailed implementation roadmap;'
						}
					]
				},
				{
					id: nanoid(),
					blocks: [
						{
							type: 'text',
							id: nanoid(),
							content:
								'Decides to remain actively seized of the matter and to review progress at its next session.'
						}
					]
				}
			];

			await db.insert(schema.resolutionPaper).values({
				id: paperId,
				committeeId: committee.id,
				agendaItemId: committee.activeAgendaItemId,
				creatorCommitteeMemberId: creator.id,
				status: 'DRAFT_RESOLUTION',
				title,
				documentNumber: `DR/${committee.abbreviation}/1`,
				sequenceNumber: 1
			});
			await db.insert(schema.paperYjsDoc).values({
				id: nanoid(),
				paperId,
				state: encodeYjsState(seed)
			});
			for (const s of sponsors) {
				await db.insert(schema.paperSponsor).values({
					id: nanoid(),
					paperId,
					committeeMemberId: s.id
				});
			}

			// Pin as the committee's active DR.
			await db
				.update(schema.committee)
				.set({ activeDraftResolutionId: paperId })
				.where(eq(schema.committee.id, committee.id));

			// One pending amendment from a non-sponsor.
			if (delegateMembers.length > 5) {
				const proposer = delegateMembers[5];
				const amendmentId = nanoid();
				await db.insert(schema.amendment).values({
					id: amendmentId,
					paperId,
					proposerCommitteeMemberId: proposer.id,
					type: 'ALTER_TEXT',
					status: 'SUBMITTED',
					targetClauseId: seed.operative[0].id,
					targetOperativeIndex: 0,
					newContent:
						'Calls upon all Member States to support the establishment of a transparent and coordinated reporting mechanism, with annual public review;',
					documentNumber: `${committee.abbreviation}/1/ALT.1`,
					sequenceNumber: 1
				});
				await db.insert(schema.amendmentSponsor).values({
					id: nanoid(),
					amendmentId,
					committeeMemberId: proposer.id
				});
			}

			// One PUBLIC and one TEAM_ONLY comment.
			const adminCU = (
				await db
					.select()
					.from(schema.conferenceUser)
					.where(
						and(
							eq(schema.conferenceUser.conferenceId, committee.conferenceId),
							eq(schema.conferenceUser.conferenceUserType, 'ADMIN')
						)
					)
					.limit(1)
			)[0];
			if (adminCU) {
				await db.insert(schema.resolutionComment).values({
					id: nanoid(),
					paperId,
					authorConferenceUserId: adminCU.id,
					content: 'Please refine the language in OP3 — chairs',
					visibility: 'TEAM_ONLY'
				});
			}
			const delegateCU = (
				await db
					.select({ id: schema.conferenceUser.id })
					.from(schema.conferenceUser)
					.innerJoin(
						schema.committeeMember,
						eq(schema.conferenceUser.committeeMemberId, schema.committeeMember.id)
					)
					.where(eq(schema.committeeMember.committeeId, committee.id))
					.limit(1)
			)[0];
			if (delegateCU) {
				await db.insert(schema.resolutionComment).values({
					id: nanoid(),
					paperId,
					authorConferenceUserId: delegateCU.id,
					content: 'Strong support from our delegation on PP2.',
					clauseId: seed.preamble[1].id,
					visibility: 'PUBLIC'
				});
			}

			console.info(
				`    - ${title} [DRAFT_RESOLUTION active, ${sponsors.length} sponsors] (${paperId})`
			);
		}
	}
}
