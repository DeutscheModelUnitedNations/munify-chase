import { db, schema } from '#api/db/db';
import { eq } from 'drizzle-orm';
import { linkConfig, type LinkConfig } from './linkAuth';
import { instanceLinkPubsub } from './linkPubsub';

/** The tables whose rows the sync writes, marked `managedByDelegator`. */
const MANAGED_TABLES = [
	schema.conference,
	schema.committee,
	schema.agendaItem,
	schema.representation,
	schema.conferenceMember,
	schema.committeeMember,
	schema.conferenceUser
] as const;

/**
 * Brings the link's row in line with the configuration (`linkAuth.ts`), at start-up. A link that
 * ends, or points at another DELEGATOR, leaves what it synced as this instance's own rows. The row
 * of a link that ended stays, unread (`instanceLink.ts`): its keys keep the cards DELEGATOR printed
 * scanning. Answers the configuration, undefined while there is no link.
 */
export async function syncLinkRow() {
	const config = linkConfig();
	const changed = await db.transaction(async (tx) => {
		const existing = await tx.query.instanceLink.findFirst({
			columns: { id: true, remoteUrl: true }
		});
		if (isCurrent({ config, existing })) return false;
		// again on every start while unlinked, which finds nothing left after the first
		const released = await releaseManagedRows(tx);
		if (!config) return released;
		await replaceLinkRow({ tx, existing, remoteUrl: config.remoteUrl });
		return true;
	});
	if (changed) {
		instanceLinkPubsub.removed();
		instanceLinkPubsub.created();
	}
	return config;
}

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

type LinkRow = { id: string; remoteUrl: string };

/** Whether the stored link row already points where the configuration does. */
function isCurrent({
	config,
	existing
}: {
	config: LinkConfig | undefined;
	existing: LinkRow | undefined;
}) {
	return !!config && existing?.remoteUrl === config.remoteUrl;
}

async function replaceLinkRow({
	tx,
	existing,
	remoteUrl
}: {
	tx: Transaction;
	existing: LinkRow | undefined;
	remoteUrl: string;
}) {
	if (existing) await tx.delete(schema.instanceLink).where(eq(schema.instanceLink.id, existing.id));
	await tx.insert(schema.instanceLink).values({ remoteUrl });
}

async function releaseManagedRows(tx: Transaction) {
	let released = false;
	for (const table of MANAGED_TABLES) {
		const rows = await tx
			.update(table)
			.set({ managedByDelegator: false })
			.where(eq(table.managedByDelegator, true))
			.returning({ id: table.id });
		released ||= rows.length > 0;
	}
	return released;
}
