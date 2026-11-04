import { db, schema } from '#api/db/db';
import { pubsub } from '#api/rumble';
import { and, eq, isNotNull, isNull } from 'drizzle-orm';

const paperPubsub = pubsub({ table: 'resolutionPaper' });

/** Drafts known to need no detaching any more: detached already, or never from DELEGATOR. */
const settled = new Set<string>();

/**
 * Marks a draft taken over from DELEGATOR as CHASE's own, on its first change here: from then on
 * DELEGATOR's newer versions are ignored. Cheap to call on every edit.
 */
export async function detachFromDelegator(paperId: string) {
	if (settled.has(paperId)) return;
	const detached = await db
		.update(schema.resolutionPaper)
		.set({ detachedAt: new Date() })
		.where(
			and(
				eq(schema.resolutionPaper.id, paperId),
				isNotNull(schema.resolutionPaper.delegatorPaperId),
				isNull(schema.resolutionPaper.detachedAt)
			)
		)
		.returning({ id: schema.resolutionPaper.id });
	settled.add(paperId);
	if (detached.length > 0) paperPubsub.updated(paperId);
}
