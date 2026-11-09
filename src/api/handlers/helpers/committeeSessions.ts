import { schema } from '#api/db/db';
import { eq } from 'drizzle-orm';
import type { Transaction } from './scopedLookups';

type ActiveSession = Partial<
	Pick<typeof schema.committee.$inferInsert, 'activeVotingSessionId' | 'activeRollCallSessionId'>
>;

/**
 * Points a committee at the session it is running, or at none. The committee's reference is the
 * single source of truth for "is a vote / roll call running?".
 */
export async function setActiveSession({
	tx,
	committeeId,
	active
}: {
	tx: Transaction;
	committeeId: string;
	active: ActiveSession;
}) {
	await tx.update(schema.committee).set(active).where(eq(schema.committee.id, committeeId));
}
