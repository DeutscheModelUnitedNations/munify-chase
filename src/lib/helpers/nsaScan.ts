import {
	looksLikeSignedCode,
	verifySignedCode,
	type SignedCodeClaims,
	type SignedCodeKeys
} from '#lib/signedCode/signedCode';

/**
 * Who a scanned NSA code stands for, decided the same way by the scanner (offline, from the NSAs
 * it has loaded) and by the server (which never trusts the scanner's answer). The codes are signed
 * codes (`#lib/signedCode/signedCode`):
 *
 * - a digital nametag (`live`), signed by the linked DELEGATOR, names the person's DELEGATOR user;
 * - an NSA card (`nsaCard`) signed by the linked DELEGATOR names the DELEGATOR user too; one this
 *   instance printed while unlinked names the `conferenceUser`. Only the person's current card
 *   counts.
 */

/** The public keys codes are checked against, by key id: DELEGATOR's and this instance's own. */
export interface IdentityKeys {
	delegator: SignedCodeKeys;
	own: SignedCodeKeys;
}

export interface NsaCandidate {
	id: string;
	/** The person's account id: what DELEGATOR's codes name, the same in both instances. */
	userId: string | null;
	cardNumber: number;
}

export type NsaScanFailure =
	| 'unsigned'
	| 'forged'
	| 'expired'
	| 'wrongKind'
	| 'otherConference'
	| 'outdatedCard'
	| 'notNsa'
	| 'noKey';

export type NsaScan<T extends NsaCandidate> =
	{ found: true; nsa: T } | { found: false; reason: NsaScanFailure };

type PersonClaims = Extract<SignedCodeClaims, { kind: 'live' | 'nsaCard' }>;
type Signed = { signedBy: 'delegator' | 'own'; claims: PersonClaims };

/** This instance only ever signs cards; DELEGATOR's nametags and cards both count. */
function isPersonClaim(
	claims: SignedCodeClaims,
	signedBy: Signed['signedBy']
): claims is PersonClaims {
	return claims.kind === 'nsaCard' || (claims.kind === 'live' && signedBy === 'delegator');
}

/** What a genuine code's claims say about an NSA of this conference. */
function acceptClaims({
	claims,
	signedBy,
	conferenceId
}: {
	claims: SignedCodeClaims;
	signedBy: Signed['signedBy'];
	conferenceId: string;
}): Signed | NsaScanFailure {
	if (!isPersonClaim(claims, signedBy)) return 'wrongKind';
	if (claims.conferenceId !== conferenceId) return 'otherConference';
	return { signedBy, claims };
}

/** The code checked against one side's keys; nothing when that side has none. */
async function checkAgainst({
	code,
	keys,
	signedBy,
	conferenceId,
	now
}: {
	code: string;
	keys: SignedCodeKeys;
	signedBy: Signed['signedBy'];
	conferenceId: string;
	now: number;
}): Promise<Signed | NsaScanFailure | undefined> {
	if (keys.size === 0) return undefined;
	const check = await verifySignedCode({ text: code, keys, now });
	if (check.valid) return acceptClaims({ claims: check.claims, signedBy, conferenceId });
	return check.reason === 'expired' ? 'expired' : 'forged';
}

/** The code checked against DELEGATOR's keys, then this instance's: who signed it, and what it says. */
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
	if (!looksLikeSignedCode(code)) return 'unsigned';
	let failure: NsaScanFailure = 'noKey';
	for (const signedBy of ['delegator', 'own'] as const) {
		const result = await checkAgainst({ code, keys: keys[signedBy], signedBy, conferenceId, now });
		// a forged one: only the other side's keys may still make it genuine
		if (result === 'forged') failure = 'forged';
		else if (result !== undefined) return result;
	}
	return failure;
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
	const { claims } = signed;
	const nsa = nsas.find((candidate) =>
		signed.signedBy === 'delegator'
			? candidate.userId === claims.userId
			: candidate.id === claims.userId
	);
	if (!nsa) return { found: false, reason: 'notNsa' };
	if (claims.kind === 'nsaCard' && claims.cardNumber !== nsa.cardNumber) {
		return { found: false, reason: 'outdatedCard' };
	}
	return { found: true, nsa };
}
