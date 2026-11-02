import { db, schema } from '#api/db/db';
import { eq } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { createDelegatorClient } from './delegatorRemote';
import { instanceLinkPubsub } from './linkPubsub';
import { hashLinkToken, linkSecret, makeLinkToken, openLinkToken, sealLinkToken } from './linkTokens';
import { startLinkWorker, stopLinkWorker } from './linkWorker';

/**
 * Pairing (`docs/plans/delegator-link.md`): DELEGATOR asks with the token CHASE will call it with,
 * a global admin here approves, and CHASE hands DELEGATOR its own token by confirming. Only one
 * link at a time; a frozen one is replaced by the next request.
 */

export async function receiveLinkRequest({
	remoteUrl,
	token,
	confirmationCode
}: {
	remoteUrl: string;
	token: string;
	confirmationCode: string;
}) {
	linkSecret();
	const removedId = await db.transaction(async (tx) => {
		const existing = await tx.query.instanceLink.findFirst({ columns: { id: true, status: true } });
		if (existing && existing.status !== 'FROZEN') {
			throw new GraphQLError('This instance is already linked, or a link request is pending.');
		}
		if (existing) await tx.delete(schema.instanceLink).where(eq(schema.instanceLink.id, existing.id));
		await tx.insert(schema.instanceLink).values({
			remoteUrl,
			outboundToken: sealLinkToken(token),
			confirmationCode,
			status: 'PENDING'
		});
		return existing?.id;
	});
	if (removedId) instanceLinkPubsub.removed();
	instanceLinkPubsub.created();
}

export async function approveLink({ confirmationCode }: { confirmationCode: string }) {
	const link = await db.query.instanceLink.findFirst({ where: { status: 'PENDING' } });
	if (!link) throw new GraphQLError('There is no pending link request.');
	if (link.confirmationCode !== confirmationCode.trim().toUpperCase()) {
		throw new GraphQLError('The code does not match the one DELEGATOR shows.');
	}

	const token = makeLinkToken();
	const remote = createDelegatorClient({
		url: link.remoteUrl,
		token: openLinkToken(link.outboundToken)
	});
	try {
		await remote.mutate.confirmChaseLink({
			__args: { confirmationCode: link.confirmationCode, token }
		});
	} catch (error) {
		console.error('[link] DELEGATOR refused or did not answer the confirmation', error);
		throw new GraphQLError('DELEGATOR did not confirm the link. Is it reachable from here?');
	} finally {
		remote.dispose();
	}

	await db
		.update(schema.instanceLink)
		.set({
			status: 'ACTIVE',
			inboundTokenHash: hashLinkToken(token),
			linkedAt: new Date(),
			lastError: null
		})
		.where(eq(schema.instanceLink.id, link.id));
	instanceLinkPubsub.updated(link.id);
	startLinkWorker();
}

export async function rejectLink() {
	await db.delete(schema.instanceLink).where(eq(schema.instanceLink.status, 'PENDING'));
	instanceLinkPubsub.removed();
}

/**
 * Ends the link: DELEGATOR's token stops working, the worker stops, and everything synced becomes
 * this instance's own rows. Tells DELEGATOR when the unlinking started here.
 */
export async function freezeLink({ notifyRemote }: { notifyRemote: boolean }) {
	const link = await db.query.instanceLink.findFirst({ where: { status: 'ACTIVE' } });
	if (!link) throw new GraphQLError('There is no active link.');

	stopLinkWorker();
	if (notifyRemote) {
		const remote = createDelegatorClient({
			url: link.remoteUrl,
			token: openLinkToken(link.outboundToken)
		});
		await Promise.resolve(remote.mutate.unlinkChase({}))
			.catch((error) => console.warn('[link] DELEGATOR did not hear of the unlinking', error))
			.finally(() => remote.dispose());
	}

	await db.transaction(async (tx) => {
		await tx
			.update(schema.instanceLink)
			.set({ status: 'FROZEN', inboundTokenHash: null })
			.where(eq(schema.instanceLink.id, link.id));
		for (const table of MANAGED_TABLES) {
			await tx
				.update(table)
				.set({ managedByDelegator: false })
				.where(eq(table.managedByDelegator, true));
		}
	});
	instanceLinkPubsub.updated(link.id);
}

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
