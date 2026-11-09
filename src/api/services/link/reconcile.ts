import { db, schema } from '#api/db/db';
import { pubsub } from '#api/rumble';
import { eq, inArray, sql } from 'drizzle-orm';
import type { Mirror } from './mirror';
import { displacedExtras, rowChanges } from './rowChanges';

/**
 * Writes one DELEGATOR conference into CHASE (`docs/plans/delegator-link.md`): compares the mirror
 * with the rows CHASE holds and writes only the rows that are new or differ, deletes the managed
 * rows DELEGATOR no longer has (with what hangs on them), and announces only those. Local extras
 * stay, but one sharing an address with a mirrored person gives way to them. One transaction, so a
 * conference never shows half a sync.
 */

const pubsubs = {
	conference: pubsub({ table: 'conference' }),
	committee: pubsub({ table: 'committee' }),
	agendaItem: pubsub({ table: 'agendaItem' }),
	representation: pubsub({ table: 'representation' }),
	committeeMember: pubsub({ table: 'committeeMember' }),
	conferenceMember: pubsub({ table: 'conferenceMember' }),
	conferenceUser: pubsub({ table: 'conferenceUser' })
};

/** Rows written per statement, well below Postgres' limit of parameters. */
const CHUNK = 1000;

function chunks<T>(rows: readonly T[]) {
	const result: T[][] = [];
	for (let start = 0; start < rows.length; start += CHUNK) {
		result.push(rows.slice(start, start + CHUNK));
	}
	return result;
}

/** Writes rows a chunk at a time. */
async function inChunks<T>(rows: readonly T[], write: (chunk: T[]) => Promise<unknown>) {
	for (const chunk of chunks(rows)) await write(chunk);
}

/** `excluded.<column>` for an upsert's `set`, which takes the inserted value. */
function excluded(column: { name: string }) {
	return sql.raw(`excluded."${column.name}"`);
}

const MANAGED = { managedByDelegator: true } as const;

export async function reconcileConference(mirror: Mirror) {
	const conferenceId = mirror.conference.id;
	const ofConference = { conferenceId };
	const ofCommittees = { committee: { conferenceId } };

	const changes = await db.transaction(async (tx) => {
		const [
			conference,
			committees,
			agendaItems,
			representations,
			committeeMembers,
			conferenceMembers,
			users
		] = await Promise.all([
			tx.query.conference.findMany({
				where: { id: conferenceId },
				columns: {
					id: true,
					title: true,
					location: true,
					startDate: true,
					endDate: true,
					managedByDelegator: true
				}
			}),
			tx.query.committee.findMany({
				where: ofConference,
				columns: { id: true, name: true, abbreviation: true, managedByDelegator: true }
			}),
			tx.query.agendaItem.findMany({
				where: ofCommittees,
				columns: { id: true, title: true, committeeId: true, managedByDelegator: true }
			}),
			tx.query.representation.findMany({
				where: ofConference,
				columns: {
					id: true,
					type: true,
					alpha2Code: true,
					alpha3Code: true,
					regionalGroup: true,
					name: true,
					icon: true,
					managedByDelegator: true
				}
			}),
			tx.query.committeeMember.findMany({
				where: ofCommittees,
				columns: { id: true, committeeId: true, representationId: true, managedByDelegator: true }
			}),
			tx.query.conferenceMember.findMany({
				where: ofConference,
				columns: { id: true, representationId: true, managedByDelegator: true }
			}),
			tx.query.conferenceUser.findMany({
				where: ofConference,
				columns: {
					id: true,
					conferenceUserType: true,
					userEmail: true,
					name: true,
					delegatorUserId: true,
					cardNumber: true,
					conferenceMemberId: true,
					committeeMemberId: true,
					managedByDelegator: true
				}
			})
		]);

		const c = {
			conference: rowChanges({
				current: conference,
				wanted: [mirror.conference],
				fields: ['title', 'location', 'startDate', 'endDate']
			}),
			committees: rowChanges({
				current: committees,
				wanted: mirror.committees,
				fields: ['name', 'abbreviation']
			}),
			agendaItems: rowChanges({
				current: agendaItems,
				wanted: mirror.agendaItems,
				fields: ['title', 'committeeId']
			}),
			representations: rowChanges({
				current: representations,
				wanted: mirror.representations,
				fields: ['type', 'alpha2Code', 'alpha3Code', 'regionalGroup', 'name', 'icon']
			}),
			committeeMembers: rowChanges({
				current: committeeMembers,
				wanted: mirror.committeeMembers,
				fields: ['committeeId', 'representationId']
			}),
			conferenceMembers: rowChanges({
				current: conferenceMembers,
				wanted: mirror.conferenceMembers,
				fields: ['representationId']
			}),
			users: rowChanges({
				current: users,
				wanted: mirror.conferenceUsers,
				fields: [
					'conferenceUserType',
					'userEmail',
					'name',
					'delegatorUserId',
					'cardNumber',
					'conferenceMemberId',
					'committeeMemberId'
				]
			})
		};
		const removedUsers = [
			...c.users.remove,
			...displacedExtras({ current: users, mirrored: mirror.conferenceUsers })
		];

		// --- removals first, children before parents, so renames and moves do not collide
		const remove = (table: RemovableTable, ids: readonly string[]) =>
			inChunks(ids, (chunk) => tx.delete(table).where(inArray(table.id, chunk)));
		await remove(schema.conferenceUser, removedUsers);
		await remove(schema.conferenceMember, c.conferenceMembers.remove);
		await remove(schema.committeeMember, c.committeeMembers.remove);
		await remove(schema.representation, c.representations.remove);
		await remove(schema.agendaItem, c.agendaItems.remove);
		await remove(schema.committee, c.committees.remove);

		// --- writes, parents before children
		if (c.conference.write.length) {
			const t = schema.conference;
			await tx
				.insert(t)
				.values({ ...mirror.conference, ...MANAGED })
				.onConflictDoUpdate({
					target: t.id,
					set: {
						title: excluded(t.title),
						location: excluded(t.location),
						startDate: excluded(t.startDate),
						endDate: excluded(t.endDate),
						...MANAGED
					}
				});
		}
		await inChunks(c.committees.write, (rows) => {
			const t = schema.committee;
			return tx
				.insert(t)
				.values(rows.map((row) => ({ ...row, conferenceId, ...MANAGED })))
				.onConflictDoUpdate({
					target: t.id,
					set: { name: excluded(t.name), abbreviation: excluded(t.abbreviation), ...MANAGED }
				});
		});
		await inChunks(c.agendaItems.write, (rows) => {
			const t = schema.agendaItem;
			return tx
				.insert(t)
				.values(rows.map((row) => ({ ...row, ...MANAGED })))
				.onConflictDoUpdate({
					target: t.id,
					set: { title: excluded(t.title), committeeId: excluded(t.committeeId), ...MANAGED }
				});
		});
		await inChunks(c.representations.write, (rows) => {
			const t = schema.representation;
			return tx
				.insert(t)
				.values(rows.map((row) => ({ ...row, conferenceId, ...MANAGED })))
				.onConflictDoUpdate({
					target: t.id,
					set: {
						type: excluded(t.type),
						alpha2Code: excluded(t.alpha2Code),
						alpha3Code: excluded(t.alpha3Code),
						regionalGroup: excluded(t.regionalGroup),
						name: excluded(t.name),
						icon: excluded(t.icon),
						...MANAGED
					}
				});
		});
		await inChunks(c.committeeMembers.write, (rows) => {
			const t = schema.committeeMember;
			return tx
				.insert(t)
				.values(rows.map((row) => ({ ...row, ...MANAGED })))
				.onConflictDoUpdate({
					target: t.id,
					set: {
						committeeId: excluded(t.committeeId),
						representationId: excluded(t.representationId),
						...MANAGED
					}
				});
		});
		await inChunks(c.conferenceMembers.write, (rows) => {
			const t = schema.conferenceMember;
			return tx
				.insert(t)
				.values(rows.map((row) => ({ ...row, conferenceId, ...MANAGED })))
				.onConflictDoUpdate({
					target: t.id,
					set: { representationId: excluded(t.representationId), ...MANAGED }
				});
		});
		await inChunks(c.users.write, (rows) => {
			const t = schema.conferenceUser;
			return tx
				.insert(t)
				.values(rows.map((row) => ({ ...row, conferenceId, ...MANAGED })))
				.onConflictDoUpdate({
					target: t.id,
					set: {
						conferenceUserType: excluded(t.conferenceUserType),
						userEmail: excluded(t.userEmail),
						name: excluded(t.name),
						delegatorUserId: excluded(t.delegatorUserId),
						cardNumber: excluded(t.cardNumber),
						conferenceMemberId: excluded(t.conferenceMemberId),
						committeeMemberId: excluded(t.committeeMemberId),
						...MANAGED
					}
				});
		});

		return { ...c, users: { ...c.users, remove: removedUsers } };
	});

	if (changes.conference.write.length) pubsubs.conference.updated(conferenceId);
	announce({ pubsub: pubsubs.committee, changes: changes.committees });
	announce({ pubsub: pubsubs.agendaItem, changes: changes.agendaItems });
	announce({ pubsub: pubsubs.representation, changes: changes.representations });
	announce({ pubsub: pubsubs.committeeMember, changes: changes.committeeMembers });
	announce({ pubsub: pubsubs.conferenceMember, changes: changes.conferenceMembers });
	announce({ pubsub: pubsubs.conferenceUser, changes: changes.users });
	return {
		/** Something was written or removed; a sync that found everything as it was is false. */
		changed: Object.values(changes).some(
			(table) => table.write.length > 0 || table.remove.length > 0
		)
	};
}

type RemovableTable =
	| typeof schema.conferenceUser
	| typeof schema.conferenceMember
	| typeof schema.committeeMember
	| typeof schema.representation
	| typeof schema.agendaItem
	| typeof schema.committee;

/** Tells open lists and rows what the sync changed, and nothing more. */
function announce({
	pubsub,
	changes
}: {
	pubsub: { created(): void; removed(): void; updated(ids?: string[]): void };
	changes: { write: readonly { id: string }[]; created: boolean; remove: readonly string[] };
}) {
	if (changes.created) pubsub.created();
	if (changes.write.length) pubsub.updated(changes.write.map((row) => row.id));
	if (changes.remove.length) pubsub.removed();
}

/** Takes a conference out of the sync when DELEGATOR stops offering it (over, or deleted there). */
export async function releaseConference(conferenceId: string) {
	await db.transaction(async (tx) => {
		const committees = tx
			.select({ id: schema.committee.id })
			.from(schema.committee)
			.where(eq(schema.committee.conferenceId, conferenceId));
		await tx
			.update(schema.conference)
			.set({ managedByDelegator: false })
			.where(eq(schema.conference.id, conferenceId));
		for (const table of [schema.representation, schema.conferenceMember, schema.conferenceUser]) {
			await tx
				.update(table)
				.set({ managedByDelegator: false })
				.where(eq(table.conferenceId, conferenceId));
		}
		await tx
			.update(schema.committee)
			.set({ managedByDelegator: false })
			.where(eq(schema.committee.conferenceId, conferenceId));
		for (const table of [schema.agendaItem, schema.committeeMember]) {
			await tx
				.update(table)
				.set({ managedByDelegator: false })
				.where(inArray(table.committeeId, committees));
		}
	});
	pubsubs.conference.updated(conferenceId);
}
