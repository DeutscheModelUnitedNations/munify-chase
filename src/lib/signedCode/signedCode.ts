import { decode, encode, Tag } from 'cbor2';
import { fromScannerSafe, isScannerSafeChar, toScannerSafe } from './scannerSafeText';

/**
 * Signed codes: what we hand participants so the team can tell who they are - the digital nametag,
 * the application documents, the participation certificates. Anybody can render a QR code of a
 * user id, so a code carries its claims and a signature the deployment made, which a scanner
 * checks against the deployment's public keys without asking the server.
 *
 * The format is the one the EU's digital certificates use, a CWT (RFC 8392) in a COSE_Sign1
 * (RFC 9052) signed with Ed25519 (RFC 9053), naming its key in `kid`. Written in the scanner safe
 * alphabet behind `/ID/` (`signedCodeLink`), a code is a link the camera app opens and text a hand
 * scanner types without mistakes, whatever its keyboard layout.
 *
 * A copy of MUNify DELEGATOR's `src/lib/signedCode/signedCode.ts`; change both together. DELEGATOR
 * signs the digital nametags (`live`) and, while linked, the NSA cards (`nsaCard`); unlinked, CHASE
 * signs NSA cards with a key of its own, naming the `conferenceUser`. The NSA scanner verifies them
 * offline (`#lib/helpers/nsaScan`). Only the certificate payload's type lives here instead of in
 * DELEGATOR's `certificateJwt.ts`.
 */

/** What a DELEGATOR participation certificate states (DELEGATOR's `CertificateJWTPayload`). */
export interface CertificateJWTPayload extends Record<string, unknown> {
	n: string;
	t: string;
	s: number;
	e: number;
	a?: string[];
}

/** COSE_Sign1's CBOR tag (RFC 9052). */
const COSE_SIGN1 = 18;
/** The COSE header labels for the algorithm and the key id, and EdDSA's algorithm id. */
const HEADER_ALG = 1;
const HEADER_KID = 4;
const ALG_EDDSA = -8;
/** CWT claim keys (RFC 8392); the others are ours, a letter each, since every byte is in the code. */
const CLAIM_SUB = 2;
const CLAIM_EXP = 4;
const CLAIM_IAT = 6;
const CLAIM_KIND = 'k';
const CLAIM_CONFERENCE = 'c';
const CLAIM_CARD_NUMBER = 'v';

/** How long a live code counts, counted from when it was issued. */
export const LIVE_CODE_VALIDITY_SECONDS = 10 * 60;
/** How far a code may be from the future, for scanners whose clock runs ahead of the server's. */
const CLOCK_SKEW_SECONDS = 2 * 60;

/**
 * What a code says, by kind:
 * - `live`: the digital nametag, renewed while it is shown and good for minutes only, so a
 *   screenshot passed on is of little use;
 * - `print`: the application documents, printed and sent by post, good for as long as the paper;
 * - `certificate`: a participation certificate, which anybody may check (`/validateCertificate`);
 * - `nsaCard`: a non-state actor's printed card, which MUNify CHASE's chairs scan to check them in
 *   and out of committees (`docs/plans/chase-link.md`). Good until the day after the conference
 *   ends, and only while its `cardNumber` is the person's current one: printing a new card raises
 *   it, so a lost card stops counting.
 */
export type SignedCodeClaims =
	| {
			kind: 'live';
			userId: string;
			conferenceId: string;
			/** Unix seconds */
			issuedAt: number;
			/** Unix seconds */
			expiresAt: number;
	  }
	| { kind: 'print'; userId: string; conferenceId: string; issuedAt: number }
	| {
			kind: 'nsaCard';
			userId: string;
			conferenceId: string;
			issuedAt: number;
			expiresAt: number;
			cardNumber: number;
	  }
	| { kind: 'certificate'; issuedAt: number; certificate: CertificateJWTPayload };

type SignedCodeKind = SignedCodeClaims['kind'];

const KIND_LETTERS: Record<SignedCodeKind, string> = {
	live: 'l',
	print: 'p',
	certificate: 'c',
	nsaCard: 'n'
};

function claimsMap(claims: SignedCodeClaims): Map<number | string, unknown> {
	const map = new Map<number | string, unknown>([
		[CLAIM_KIND, KIND_LETTERS[claims.kind]],
		[CLAIM_IAT, claims.issuedAt]
	]);
	if (claims.kind === 'certificate') {
		for (const [key, value] of Object.entries(claims.certificate)) {
			if (value !== undefined) map.set(key, value);
		}
		return map;
	}
	map.set(CLAIM_SUB, claims.userId);
	map.set(CLAIM_CONFERENCE, claims.conferenceId);
	if (claims.kind === 'live' || claims.kind === 'nsaCard') map.set(CLAIM_EXP, claims.expiresAt);
	if (claims.kind === 'nsaCard') map.set(CLAIM_CARD_NUMBER, claims.cardNumber);
	return map;
}

const isText = (value: unknown): value is string => typeof value === 'string';
const isTime = (value: unknown): value is number => Number.isSafeInteger(value);
/** An id we signed never holds a control character; Postgres refuses a NUL in any query. */
const isId = (value: unknown): value is string => isText(value) && !/\p{Cc}/u.test(value);

function certificateOf(map: Map<unknown, unknown>): CertificateJWTPayload | null {
	const [n, t, s, e, a] = ['n', 't', 's', 'e', 'a'].map((key) => map.get(key));
	if (!isText(n) || !isText(t) || !isTime(s) || !isTime(e)) return null;
	if (a === undefined) return { n, t, s, e };
	if (!Array.isArray(a) || !a.every(isText)) return null;
	return { n, t, s, e, a };
}

/** The claims of a code naming a participant (`print`, `live` or `nsaCard`), or `null`. */
function participantClaims({
	map,
	kind,
	issuedAt
}: {
	map: Map<unknown, unknown>;
	kind: unknown;
	issuedAt: number;
}): SignedCodeClaims | null {
	const userId = map.get(CLAIM_SUB);
	const conferenceId = map.get(CLAIM_CONFERENCE);
	if (!isId(userId) || !isId(conferenceId)) return null;
	if (kind === KIND_LETTERS.print) return { kind: 'print', userId, conferenceId, issuedAt };
	const expiresAt = map.get(CLAIM_EXP);
	if (!isTime(expiresAt)) return null;
	if (kind === KIND_LETTERS.live)
		return { kind: 'live', userId, conferenceId, issuedAt, expiresAt };
	const cardNumber = map.get(CLAIM_CARD_NUMBER);
	if (kind !== KIND_LETTERS.nsaCard || !isTime(cardNumber)) return null;
	return { kind: 'nsaCard', userId, conferenceId, issuedAt, expiresAt, cardNumber };
}

/** The claims a decoded payload holds, or `null` when it is not one of ours. */
function readClaims(map: unknown): SignedCodeClaims | null {
	if (!(map instanceof Map)) return null;
	const issuedAt = map.get(CLAIM_IAT);
	if (!isTime(issuedAt)) return null;
	const kind = map.get(CLAIM_KIND);
	if (kind !== KIND_LETTERS.certificate) return participantClaims({ map, kind, issuedAt });
	const certificate = certificateOf(map);
	return certificate && { kind: 'certificate', issuedAt, certificate };
}

function protectedHeader(kid: number) {
	return encode(
		new Map<number, unknown>([
			[HEADER_ALG, ALG_EDDSA],
			[HEADER_KID, Uint8Array.of(kid)]
		])
	);
}

/** The bytes the signature covers: COSE's `Sig_structure` without external data. */
function toBeSigned({
	header,
	payload
}: {
	header: Uint8Array;
	payload: Uint8Array;
}): Uint8Array<ArrayBuffer> {
	return Uint8Array.from(encode(['Signature1', header, new Uint8Array(0), payload]));
}

/**
 * Signs `claims` with the key `kid` names, through `sign` (Ed25519 over the bytes it is given),
 * and answers the code in the scanner safe alphabet.
 */
export async function signClaims({
	claims,
	kid,
	sign
}: {
	claims: SignedCodeClaims;
	kid: number;
	sign: (bytes: Uint8Array<ArrayBuffer>) => Promise<Uint8Array>;
}) {
	const header = protectedHeader(kid);
	const payload = encode(claimsMap(claims));
	const signature = await sign(toBeSigned({ header, payload }));
	return toScannerSafe(encode(new Tag(COSE_SIGN1, [header, new Map(), payload, signature])));
}

/** A code as a link to the `/id` page, all uppercase so a QR code holds it compactly. */
export function signedCodeLink({ origin, code }: { origin: string; code: string }) {
	return `${origin}/id/${code}`.toUpperCase();
}

/** Below this, text is no signed code: the signature alone takes 103 characters. */
const MIN_CODE_LENGTH = 100;

/**
 * The code in what was read: the scanner safe characters at its end. A link's prefix may arrive
 * garbled from a hand scanner, and a character of it may have turned into one of the alphabet, so
 * the run is also tried without its first one or two.
 */
function candidates(text: string): string[] {
	const trimmed = text.trim();
	let start = trimmed.length;
	while (start > 0 && isScannerSafeChar(trimmed[start - 1])) start -= 1;
	const run = trimmed.slice(start);
	if (run.length < MIN_CODE_LENGTH) return [];
	return [run, run.slice(1), run.slice(2)];
}

const STRICT = { rejectStreaming: true, rejectDuplicateKeys: true, preferMap: true };

const isBytes = (value: unknown): value is Uint8Array => value instanceof Uint8Array;

/** The key id of a protected header we accept: EdDSA, and a one-byte `kid`. */
function kidOf(header: Uint8Array) {
	const map = decode(header, STRICT);
	if (!(map instanceof Map) || map.get(HEADER_ALG) !== ALG_EDDSA) return null;
	const kid = map.get(HEADER_KID);
	return isBytes(kid) && kid.length === 1 ? kid[0] : null;
}

/** The parts of a COSE_Sign1 message with an Ed25519 signature, or `null`. */
function sign1Parts(bytes: Uint8Array) {
	const message = decode(bytes, STRICT);
	if (!(message instanceof Tag) || message.tag !== COSE_SIGN1) return null;
	const parts: unknown = message.contents;
	if (!Array.isArray(parts) || parts.length !== 4) return null;
	const [header, , payload, signature] = parts;
	if (!isBytes(header) || !isBytes(payload) || !isBytes(signature)) return null;
	return signature.length === 64 ? { header, payload, signature } : null;
}

function parseCandidate(text: string) {
	const bytes = fromScannerSafe(text);
	const parts = bytes && sign1Parts(bytes);
	if (!parts) return null;
	const { header, payload, signature } = parts;
	const kid = kidOf(header);
	const claims = readClaims(decode(payload, STRICT));
	if (kid === null || !claims) return null;
	return {
		code: text.toUpperCase(),
		kid,
		claims,
		signed: toBeSigned({ header, payload }),
		signature: Uint8Array.from(signature)
	};
}

/**
 * The signed code in `text` (a link, the bare code, or either as a hand scanner typed it), with
 * its claims, but not checked yet; `null` when there is none.
 */
export function parseSignedCode(text: string) {
	for (const candidate of candidates(text)) {
		try {
			const parsed = parseCandidate(candidate);
			if (parsed) return parsed;
		} catch {
			// not CBOR: try the next candidate
		}
	}
	return null;
}

/** Whether `text` holds a signed code at all, genuine or not. */
export const looksLikeSignedCode = (text: string) => parseSignedCode(text) !== null;

/** The deployment's public keys by `kid`, each raw and base64url, as the API publishes them. */
export type SignedCodeKeys = ReadonlyMap<number, string>;

export type SignedCodeCheck =
	| { valid: true; claims: SignedCodeClaims; code: string }
	| { valid: false; reason: 'malformed' | 'unknownKey' | 'forged' | 'expired' };

function fromBase64Url(text: string): Uint8Array<ArrayBuffer> {
	const padded = text
		.replaceAll('-', '+')
		.replaceAll('_', '/')
		.padEnd(Math.ceil(text.length / 4) * 4, '=');
	return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

function expired({ claims, now }: { claims: SignedCodeClaims; now: number }) {
	const seconds = now / 1000;
	if (claims.issuedAt > seconds + CLOCK_SKEW_SECONDS) return true;
	return (claims.kind === 'live' || claims.kind === 'nsaCard') && claims.expiresAt < seconds;
}

/**
 * Checks the signed code in `text` against the deployment's public keys. `code` in the answer is
 * the bare code, uppercase, whatever form it was read in.
 */
export async function verifySignedCode({
	text,
	keys,
	now = Date.now()
}: {
	text: string;
	keys: SignedCodeKeys;
	now?: number;
}): Promise<SignedCodeCheck> {
	const parsed = parseSignedCode(text);
	if (!parsed) return { valid: false, reason: 'malformed' };
	const publicKey = keys.get(parsed.kid);
	if (!publicKey) return { valid: false, reason: 'unknownKey' };

	const key = await crypto.subtle.importKey('raw', fromBase64Url(publicKey), 'Ed25519', false, [
		'verify'
	]);
	if (!(await crypto.subtle.verify('Ed25519', key, parsed.signature, parsed.signed))) {
		return { valid: false, reason: 'forged' };
	}
	if (expired({ claims: parsed.claims, now })) return { valid: false, reason: 'expired' };
	return { valid: true, claims: parsed.claims, code: parsed.code };
}
