import { db, schema } from '#api/db/db';
import { pubsub } from '#api/rumble';
import { and, eq, inArray, notInArray, sql } from 'drizzle-orm';
import type { Mirror } from './mirror';

/**
 * Writes one DELEGATOR conference into CHASE (`docs/plans/delegator-link.md`): upserts every
 * mirrored row by its id and deletes the managed rows DELEGATOR no longer has (with what hangs on
 * them). Local extras stay, but one sharing an address with a mirrored person gives way to them.
 * One transaction, so a conference never shows half a sync.
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

/** `excluded.<column>` for an upsert's `set`, which takes the inserted value. */
function excluded(column: { name: string }) {
	return sql.raw(`excluded."${column.name}"`);
}

const NONE = ['\u0000'];
const ids = (rows: readonly { id: string }[]) => (rows.length > 0 ? rows.map((r) => r.id) : NONE);

export async function reconcileConference(mirror: Mirror) {
	const conferenceId = mirror.conference.id;
	const managed = { managedByDelegator: true };

	const changes = await db.transaction(async (tx) => {
		const conference = schema.conference;
		await tx
			.insert(conference)
			.values({ ...mirror.conference, ...managed })
			.onConflictDoUpdate({
				target: conference.id,
				set: {
					title: excluded(conference.title),
					location: excluded(conference.location),
					startDate: excluded(conference.startDate),
					endDate: excluded(conference.endDate),
					managedByDelegator: true
				}
			});

		// --- removals first, children before parents, so renames and moves do not collide
		const committeeIdsOfConference = tx
			.select({ id: schema.committee.id })
			.from(schema.committee)
			.where(eq(schema.committee.conferenceId, conferenceId));

		const removedUsers = await tx
			.delete(schema.conferenceUser)
			.where(
				and(
					eq(schema.conferenceUser.conferenceId, conferenceId),
					eq(schema.conferenceUser.managedByDelegator, true),
					notInArray(schema.conferenceUser.id, ids(mirror.conferenceUsers))
				)
			)
			.returning({ id: schema.conferenceUser.id });
		// a local extra with the address of someone DELEGATOR now has gives way to them
		const replacedExtras = mirror.conferenceUsers.length
			? await tx
					.delete(schema.conferenceUser)
					.where(
						and(
							eq(schema.conferenceUser.conferenceId, conferenceId),
							eq(schema.conferenceUser.managedByDelegator, false),
							inArray(
								schema.conferenceUser.userEmail,
								mirror.conferenceUsers.map((u) => u.userEmail)
							)
						)
					)
					.returning({ id: schema.conferenceUser.id })
			: [];
		const removedConferenceMembers = await tx
			.delete(schema.conferenceMember)
			.where(
				and(
					eq(schema.conferenceMember.conferenceId, conferenceId),
					eq(schema.conferenceMember.managedByDelegator, true),
					notInArray(schema.conferenceMember.id, ids(mirror.conferenceMembers))
				)
			)
			.returning({ id: schema.conferenceMember.id });
		const removedCommitteeMembers = await tx
			.delete(schema.committeeMember)
			.where(
				and(
					inArray(schema.committeeMember.committeeId, committeeIdsOfConference),
					eq(schema.committeeMember.managedByDelegator, true),
					notInArray(schema.committeeMember.id, ids(mirror.committeeMembers))
				)
			)
			.returning({ id: schema.committeeMember.id });
		const removedRepresentations = await tx
			.delete(schema.representation)
			.where(
				and(
					eq(schema.representation.conferenceId, conferenceId),
					eq(schema.representation.managedByDelegator, true),
					notInArray(schema.representation.id, ids(mirror.representations))
				)
			)
			.returning({ id: schema.representation.id });
		const removedAgendaItems = await tx
			.delete(schema.agendaItem)
			.where(
				and(
					inArray(schema.agendaItem.committeeId, committeeIdsOfConference),
					eq(schema.agendaItem.managedByDelegator, true),
					notInArray(schema.agendaItem.id, ids(mirror.agendaItems))
				)
			)
			.returning({ id: schema.agendaItem.id });
		const removedCommittees = await tx
			.delete(schema.committee)
			.where(
				and(
					eq(schema.committee.conferenceId, conferenceId),
					eq(schema.committee.managedByDelegator, true),
					notInArray(schema.committee.id, ids(mirror.committees))
				)
			)
			.returning({ id: schema.committee.id });

		// --- upserts, parents before children
		if (mirror.committees.length) {
			const t = schema.committee;
			await tx
				.insert(t)
				.values(mirror.committees.map((c) => ({ ...c, conferenceId, ...managed })))
				.onConflictDoUpdate({
					target: t.id,
					set: { name: excluded(t.name), abbreviation: excluded(t.abbreviation), ...managed }
				});
		}
		if (mirror.agendaItems.length) {
			const t = schema.agendaItem;
			await tx
				.insert(t)
				.values(mirror.agendaItems.map((a) => ({ ...a, ...managed })))
				.onConflictDoUpdate({
					target: t.id,
					set: { title: excluded(t.title), committeeId: excluded(t.committeeId), ...managed }
				});
		}
		if (mirror.representations.length) {
			const t = schema.representation;
			await tx
				.insert(t)
				.values(mirror.representations.map((r) => ({ ...r, conferenceId, ...managed })))
				.onConflictDoUpdate({
					target: t.id,
					set: {
						type: excluded(t.type),
						alpha2Code: excluded(t.alpha2Code),
						alpha3Code: excluded(t.alpha3Code),
						regionalGroup: excluded(t.regionalGroup),
						name: excluded(t.name),
						faIcon: excluded(t.faIcon),
						...managed
					}
				});
		}
		if (mirror.committeeMembers.length) {
			const t = schema.committeeMember;
			await tx
				.insert(t)
				.values(mirror.committeeMembers.map((m) => ({ ...m, ...managed })))
				.onConflictDoNothing({ target: t.id });
		}
		if (mirror.conferenceMembers.length) {
			const t = schema.conferenceMember;
			await tx
				.insert(t)
				.values(mirror.conferenceMembers.map((m) => ({ ...m, conferenceId, ...managed })))
				.onConflictDoUpdate({
					target: t.id,
					set: { representationId: excluded(t.representationId), ...managed }
				});
		}
		if (mirror.conferenceUsers.length) {
			const t = schema.conferenceUser;
			await tx
				.insert(t)
				.values(mirror.conferenceUsers.map((u) => ({ ...u, conferenceId, ...managed })))
				.onConflictDoUpdate({
					target: t.id,
					set: {
						conferenceUserType: excluded(t.conferenceUserType),
						userEmail: excluded(t.userEmail),
						name: excluded(t.name),
						delegatorUserId: excluded(t.delegatorUserId),
						conferenceMemberId: excluded(t.conferenceMemberId),
						committeeMemberId: excluded(t.committeeMemberId),
						...managed
					}
				});
		}

		return {
			removedUsers: [...removedUsers, ...replacedExtras],
			removedConferenceMembers,
			removedCommitteeMembers,
			removedRepresentations,
			removedAgendaItems,
			removedCommittees
		};
	});

	pubsubs.conference.updated(conferenceId);
	announce({ pubsub: pubsubs.committee, rows: mirror.committees, removed: changes.removedCommittees });
	announce({ pubsub: pubsubs.agendaItem, rows: mirror.agendaItems, removed: changes.removedAgendaItems });
	announce({
		pubsub: pubsubs.representation,
		rows: mirror.representations,
		removed: changes.removedRepresentations
	});
	announce({
		pubsub: pubsubs.committeeMember,
		rows: mirror.committeeMembers,
		removed: changes.removedCommitteeMembers
	});
	announce({
		pubsub: pubsubs.conferenceMember,
		rows: mirror.conferenceMembers,
		removed: changes.removedConferenceMembers
	});
	announce({ pubsub: pubsubs.conferenceUser, rows: mirror.conferenceUsers, removed: changes.removedUsers });
}

/**
 * Tells open lists and rows what the sync did. A row the sync wrote may be new, so lists hear of
 * it too; an upsert does not say which it was.
 */
function announce({
	pubsub,
	rows,
	removed
}: {
	pubsub: { created(): void; removed(): void; updated(ids?: string[]): void };
	rows: readonly { id: string }[];
	removed: readonly { id: string }[];
}) {
	if (rows.length) {
		pubsub.created();
		pubsub.updated(rows.map((r) => r.id));
	}
	if (removed.length) pubsub.removed();
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
			await tx.update(table).set({ managedByDelegator: false }).where(eq(table.conferenceId, conferenceId));
		}
		await tx
			.update(schema.committee)
			.set({ managedByDelegator: false })
			.where(eq(schema.committee.conferenceId, conferenceId));
		for (const table of [schema.agendaItem, schema.committeeMember]) {
			await tx.update(table).set({ managedByDelegator: false }).where(inArray(table.committeeId, committees));
		}
	});
	pubsubs.conference.updated(conferenceId);
}
