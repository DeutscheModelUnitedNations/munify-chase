import { schema } from '#api/db/db';
import { assertFirstEntryExists } from '@m1212e/rumble';
import { and, count, eq, gte, sql, type SQL } from 'drizzle-orm';
import type { Transaction } from './scopedLookups';

/** The position after the last entry of a list (positions are 0 based). */
export async function nextPosition(tx: Transaction, speakersListId: string) {
	const { count: entries } = await tx
		.select({ count: count() })
		.from(schema.speakerOnList)
		.where(eq(schema.speakerOnList.speakersListId, speakersListId))
		.then(assertFirstEntryExists);
	return entries;
}

/** Moves every entry at or after `position` one back, freeing that position. */
export async function makeRoomAt({
	tx,
	speakersListId,
	position
}: {
	tx: Transaction;
	speakersListId: string;
	position: number;
}) {
	await tx
		.update(schema.speakerOnList)
		.set({ position: sql`${schema.speakerOnList.position} + 1` })
		.where(
			and(
				eq(schema.speakerOnList.speakersListId, speakersListId),
				gte(schema.speakerOnList.position, position)
			)
		);
}

export async function insertSpeaker(
	tx: Transaction,
	values: typeof schema.speakerOnList.$inferInsert
) {
	const created = await tx
		.insert(schema.speakerOnList)
		.values(values)
		.returning({ id: schema.speakerOnList.id })
		.then(assertFirstEntryExists);
	return created.id;
}

/**
 * Moves entries by `step` positions, one at a time in the given order, so the unique position
 * never collides midway. Returns their ids.
 */
export async function shiftEntries({
	tx,
	entries,
	step
}: {
	tx: Transaction;
	entries: { id: string }[];
	step: 1 | -1;
}) {
	for (const entry of entries) {
		await tx
			.update(schema.speakerOnList)
			.set({ position: sql`${schema.speakerOnList.position} + ${step}` })
			.where(eq(schema.speakerOnList.id, entry.id));
	}
	return entries.map((entry) => entry.id);
}

/** Deletes one entry and closes the gap it leaves behind. Returns the deleted row. */
export async function deleteSpeakerAndCloseGap(tx: Transaction, where: SQL | undefined) {
	const deleted = await tx
		.delete(schema.speakerOnList)
		.where(where)
		.returning()
		.then(assertFirstEntryExists);

	const behind = await tx.query.speakerOnList.findMany({
		where: { speakersListId: deleted.speakersListId, position: { gt: deleted.position } },
		orderBy: { position: 'asc' }
	});
	await shiftEntries({ tx, entries: behind, step: -1 });
	return deleted;
}

/** A list with the committee it belongs to, for the self service checks. */
export function findListWithCommittee(tx: Transaction, speakersListId: string) {
	return tx.query.speakersList.findFirst({
		where: { id: speakersListId },
		with: { agendaItem: { with: { committee: true } } }
	});
}

/** The caller's own entry on a list, through their seat or their conference membership. */
export async function findOwnEntry({
	tx,
	speakersListId,
	conferenceUser
}: {
	tx: Transaction;
	speakersListId: string;
	conferenceUser: { committeeMemberId: string | null; conferenceMemberId: string | null };
}) {
	const bySeat = conferenceUser.committeeMemberId
		? await tx.query.speakerOnList.findFirst({
				where: { speakersListId, committeeMemberId: conferenceUser.committeeMemberId }
			})
		: undefined;
	if (bySeat || !conferenceUser.conferenceMemberId) return bySeat;
	return tx.query.speakerOnList.findFirst({
		where: { speakersListId, conferenceMemberId: conferenceUser.conferenceMemberId }
	});
}
