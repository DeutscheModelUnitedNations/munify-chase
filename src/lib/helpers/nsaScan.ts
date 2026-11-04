import {
	looksLikeIdentityCard,
	looksLikeIdentityCode,
	verifyIdentityCard,
	verifyIdentityCode
} from './identityCode';

/**
 * Who a scanned NSA code stands for, decided the same way by the scanner (offline, from the NSAs
 * it has loaded) and by the server (which never trusts the scanner's answer).
 *
 * - a digital nametag (`MUN1`) is signed by the linked DELEGATOR and names the person's DELEGATOR
 *   user id;
 * - a card (`MUC1`) is signed by the linked DELEGATOR (a DELEGATOR user id) or, printed here while
 *   unlinked, by this instance (the `conferenceUser` id). Only the person's current card counts.
 */

/** The public keys codes are checked against (raw, base64url); null where there is none. */
export interface IdentityKeys {
	delegator: string | null;
	own: string | null;
}

export interface NsaCandidate {
	id: string;
	delegatorUserId: string | null;
	cardNumber: number;
}

export type NsaScanFailure =
	| 'unsigned'
	| 'malformed'
	| 'forged'
	| 'expired'
	| 'otherConference'
	| 'outdatedCard'
	| 'notNsa'
	| 'noKey';

export type NsaScan<T extends NsaCandidate> =
	{ found: true; nsa: T } | { found: false; reason: NsaScanFailure };

type Signed = { signedBy: 'delegator' | 'own'; userId: string; cardNumber?: number };

async function verifyCard({
	code,
	keys,
	conferenceId,
	now
}: {
	code: string;
	keys: IdentityKeys;
	conferenceId: string;
	now: number;
}): Promise<Signed | NsaScanFailure> {
	let failure: NsaScanFailure = 'noKey';
	for (const signedBy of ['delegator', 'own'] as const) {
		const publicKey = keys[signedBy];
		if (!publicKey) continue;
		const check = await verifyIdentityCard({ code, publicKey, conferenceId, now });
		if (check.valid) return { signedBy, userId: check.userId, cardNumber: check.cardNumber };
		failure = check.reason;
		// only a signature by the other key may still make it genuine
		if (check.reason !== 'forged') return failure;
	}
	return failure;
}

async function verifyScan({
	code,
	keys,
	conferenceId,
	now
}: {
	code: string;
	keys: IdentityKeys;
	conferenceId: string;
	now: number;
}): Promise<Signed | NsaScanFailure> {
	if (looksLikeIdentityCard(code)) return verifyCard({ code, keys, conferenceId, now });
	if (!looksLikeIdentityCode(code)) return 'unsigned';
	if (!keys.delegator) return 'noKey';
	const check = await verifyIdentityCode({ code, publicKey: keys.delegator, now });
	return check.valid ? { signedBy: 'delegator', userId: check.userId } : check.reason;
}

export async function identifyNsa<T extends NsaCandidate>({
	code,
	keys,
	conferenceId,
	nsas,
	now = Date.now()
}: {
	code: string;
	keys: IdentityKeys;
	conferenceId: string;
	nsas: readonly T[];
	now?: number;
}): Promise<NsaScan<T>> {
	const signed = await verifyScan({ code: code.trim(), keys, conferenceId, now });
	if (typeof signed === 'string') return { found: false, reason: signed };
	const nsa = nsas.find((candidate) =>
		signed.signedBy === 'delegator'
			? candidate.delegatorUserId === signed.userId
			: candidate.id === signed.userId
	);
	if (!nsa) return { found: false, reason: 'notNsa' };
	if (signed.cardNumber !== undefined && signed.cardNumber !== nsa.cardNumber) {
		return { found: false, reason: 'outdatedCard' };
	}
	return { found: true, nsa };
}
