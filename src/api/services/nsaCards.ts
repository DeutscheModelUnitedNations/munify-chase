import { db, schema } from '#api/db/db';
import { and, eq, lt, sql } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { identityCardExpiry, MAX_CARD_NUMBER } from '#lib/helpers/identityCode';
import { identifyNsa, type IdentityKeys, type NsaScanFailure } from '#lib/helpers/nsaScan';
import { issueOwnIdentityCard, ownIdentityPublicKey } from './identityKeyPair';

/**
 * NSA attendance by signed codes (`docs/plans/delegator-link.md`): DELEGATOR's digital nametags,
 * the NSA cards DELEGATOR prints while linked, and the cards this instance prints otherwise.
 */

/**
 * The keys codes are checked against. DELEGATOR's stays after unlinking, so the cards it printed
 * keep scanning at the conference they were printed for.
 */
export async function identityKeys(): Promise<IdentityKeys> {
	const link = await db.query.instanceLink.findFirst({ columns: { remoteIdentityKey: true } });
	return { delegator: link?.remoteIdentityKey ?? null, own: await ownIdentityPublicKey() };
}

const SCAN_FAILURES: Record<NsaScanFailure, string> = {
	unsigned: 'This is no MUNify nametag or NSA card',
	malformed: 'This is no MUNify nametag or NSA card',
	forged: 'This code was not issued for this conference',
	expired: 'This code has expired',
	otherConference: 'This card is for another conference',
	outdatedCard: 'This card was replaced by a newer one',
	notNsa: 'No non-state actor of this conference has this code',
	noKey: 'Codes cannot be checked yet: the linked DELEGATOR has not shared its key'
};

/**
 * The NSA a scan or a pick from the name search names, in the conference of the committee. A
 * scanned code is verified here again, whatever the scanner made of it.
 */
export async function resolveNsaTarget({
	conferenceId,
	code,
	conferenceUserId
}: {
	conferenceId: string;
	code?: string | null;
	conferenceUserId?: string | null;
}) {
	const nsas = await db.query.conferenceUser.findMany({
		where: {
			conferenceId,
			conferenceUserType: 'NON_STATE_ACTOR',
			...(conferenceUserId ? { id: conferenceUserId } : {})
		},
		columns: { id: true, delegatorUserId: true, cardNumber: true }
	});
	if (code) {
		const scan = await identifyNsa({ code, keys: await identityKeys(), conferenceId, nsas });
		if (!scan.found) throw new GraphQLError(SCAN_FAILURES[scan.reason]);
		return scan.nsa;
	}
	const [nsa] = conferenceUserId ? nsas : [];
	if (!nsa) throw new GraphQLError('NSA user not found for this conference');
	return nsa;
}

/**
 * The cards of a conference's NSAs, signed by this instance, or those of the given people. Only
 * for a conference of this instance's own: a synced one's cards are DELEGATOR's.
 */
export async function ownNsaCards({
	conferenceId,
	conferenceUserIds
}: {
	conferenceId: string;
	conferenceUserIds?: readonly string[] | null;
}) {
	const conference = await db.query.conference.findFirst({
		where: { id: conferenceId },
		columns: { managedByDelegator: true, endDate: true }
	});
	if (!conference) throw new GraphQLError('Conference not found');
	if (conference.managedByDelegator) {
		throw new GraphQLError('This conference comes from DELEGATOR, which prints its NSA cards');
	}
	if (!conference.endDate) {
		throw new GraphQLError("Set the conference's end date first: the cards count until then");
	}
	const users = await db.query.conferenceUser.findMany({
		where: {
			conferenceId,
			conferenceUserType: 'NON_STATE_ACTOR',
			...(conferenceUserIds ? { id: { in: [...conferenceUserIds] } } : {})
		},
		columns: { id: true, name: true, userEmail: true, cardNumber: true },
		with: {
			conferenceMember: { with: { representation: { columns: { name: true, faIcon: true } } } }
		}
	});
	const expiresAtSeconds = identityCardExpiry(conference.endDate);
	return Promise.all(
		users.map(async (user) => {
			const code = await issueOwnIdentityCard({
				userId: user.id,
				conferenceId,
				expiresAtSeconds,
				cardNumber: user.cardNumber
			});
			if (!code)
				throw new GraphQLError('LINK_SECRET is not set, so this instance cannot sign cards');
			return {
				conferenceUserId: user.id,
				name: user.name ?? user.userEmail,
				nsaName: user.conferenceMember?.representation?.name ?? null,
				nsaIcon: user.conferenceMember?.representation?.faIcon ?? null,
				cardNumber: user.cardNumber,
				code
			};
		})
	);
}

/** A new card for a lost one: raises the number, so the earlier cards stop scanning. */
export async function reprintOwnNsaCard({
	conferenceId,
	conferenceUserId
}: {
	conferenceId: string;
	conferenceUserId: string;
}) {
	const [current] = await ownNsaCards({ conferenceId, conferenceUserIds: [conferenceUserId] });
	if (!current) throw new GraphQLError('NSA user not found for this conference');
	const raised = await db
		.update(schema.conferenceUser)
		.set({ cardNumber: sql`${schema.conferenceUser.cardNumber} + 1` })
		.where(
			and(
				eq(schema.conferenceUser.id, conferenceUserId),
				lt(schema.conferenceUser.cardNumber, MAX_CARD_NUMBER)
			)
		)
		.returning({ id: schema.conferenceUser.id });
	if (raised.length === 0)
		throw new GraphQLError('No further cards can be printed for this person');
	const [card] = await ownNsaCards({ conferenceId, conferenceUserIds: [conferenceUserId] });
	if (!card) throw new GraphQLError('NSA user not found for this conference');
	return card;
}
