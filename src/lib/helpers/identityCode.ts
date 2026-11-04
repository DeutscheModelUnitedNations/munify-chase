/**
 * Identity codes: what a participant's phone shows for the team to scan, and what a printed NSA
 * card carries. A bare user id proves
 * nothing, since anybody can render one, so the code carries the id, the moment it was issued and
 * an Ed25519 signature the deployment made with its secret. The scanner checks the signature
 * against the deployment's public key, which works offline, and a code stops counting a while
 * after it was issued, so a screenshot passed on is of little use.
 *
 * A printed card cannot renew itself, so a card code (`MUC1`) is good until its conference is over
 * instead, for that conference only, and carries a card number: printing a new card raises it, and
 * the scanner refuses a card whose number is not the person's current one.
 *
 * A copy of MUNify DELEGATOR's `src/lib/helpers/identityCode.ts`; change both together. DELEGATOR
 * signs the nametags and, while linked, the cards; unlinked, CHASE signs cards itself, with its own
 * key and its `conferenceUser` id as the user id. The scanner checks both kinds offline.
 */

const PREFIX = 'MUN1';
const DOMAIN = 'munify-identity-code-v1';
const CARD_PREFIX = 'MUC1';
const CARD_DOMAIN = 'munify-identity-card-v1';

/** How long a code counts, counted from when it was issued. */
export const IDENTITY_CODE_VALIDITY_MS = 10 * 60 * 1000;
/** How far a code may be from the future, for scanners whose clock runs ahead of the server's. */
const CLOCK_SKEW_MS = 2 * 60 * 1000;

function fromBase64Url(text: string): Uint8Array<ArrayBuffer> {
	const padded = text
		.replaceAll('-', '+')
		.replaceAll('_', '/')
		.padEnd(Math.ceil(text.length / 4) * 4, '=');
	return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

/**
 * The alphabet the code's own parts are written in. A code may be typed by a keyboard scanner, and
 * those mistake characters by layout (a German layout swaps Y and Z) and case, so it leaves out the
 * letters that get swapped or mistaken for digits (I, O, Y, Z) and is read case-insensitively.
 */
const TYPABLE = '0123456789ABCDEFGHJKLMNPQRSTUVWX';

function toTypable(bytes: Uint8Array): string {
	let text = '';
	let buffer = 0;
	let bits = 0;
	for (const byte of bytes) {
		buffer = (buffer << 8) | byte;
		bits += 8;
		while (bits >= 5) {
			text += TYPABLE[(buffer >>> (bits - 5)) & 31];
			bits -= 5;
		}
		buffer &= (1 << bits) - 1;
	}
	return bits > 0 ? text + TYPABLE[(buffer << (5 - bits)) & 31] : text;
}

function fromTypable(text: string): Uint8Array<ArrayBuffer> | null {
	const bytes: number[] = [];
	let buffer = 0;
	let bits = 0;
	for (const char of text.toUpperCase()) {
		const value = TYPABLE.indexOf(char);
		if (value < 0) return null;
		buffer = (buffer << 5) | value;
		bits += 5;
		if (bits >= 8) {
			bytes.push((buffer >>> (bits - 8)) & 255);
			bits -= 8;
			buffer &= (1 << bits) - 1;
		}
	}
	return Uint8Array.from(bytes);
}

/** The bytes that get signed: the id and the issue time, under a label no other signature uses. */
export function identityCodeMessage({
	userId,
	issuedAtSeconds
}: {
	userId: string;
	issuedAtSeconds: number;
}): Uint8Array<ArrayBuffer> {
	return Uint8Array.from(new TextEncoder().encode(`${DOMAIN}\n${userId}\n${issuedAtSeconds}`));
}

/** A time as four big-endian bytes, which is all a Unix second count in this century needs. */
function numberBytes(value: number) {
	return Uint8Array.from([value >>> 24, (value >>> 16) & 255, (value >>> 8) & 255, value & 255]);
}

/** A card number as two big-endian bytes. */
function shortBytes(value: number) {
	return Uint8Array.from([(value >>> 8) & 255, value & 255]);
}

/** The largest card number a card can carry. */
export const MAX_CARD_NUMBER = 0xffff;

function readNumber(bytes: Uint8Array) {
	return bytes.reduce((value, byte) => value * 256 + byte, 0);
}

async function signatureIsGenuine({
	publicKey,
	signature,
	message
}: {
	publicKey: string;
	signature: Uint8Array<ArrayBuffer>;
	message: Uint8Array<ArrayBuffer>;
}) {
	const key = await crypto.subtle.importKey('raw', fromBase64Url(publicKey), 'Ed25519', false, [
		'verify'
	]);
	return crypto.subtle.verify('Ed25519', key, signature, message);
}

export function encodeIdentityCode({
	userId,
	issuedAtSeconds,
	signature
}: {
	userId: string;
	issuedAtSeconds: number;
	signature: Uint8Array;
}) {
	return `${PREFIX}.${userId}.${toTypable(numberBytes(issuedAtSeconds))}.${toTypable(signature)}`;
}

export function looksLikeIdentityCode(code: string) {
	return code.startsWith(`${PREFIX}.`);
}

/** Splits a code from the right, as a user id may itself contain dots. */
function parseIdentityCode(code: string) {
	if (!looksLikeIdentityCode(code)) return null;
	const body = code.slice(PREFIX.length + 1);
	const signatureAt = body.lastIndexOf('.');
	const issuedAt = body.lastIndexOf('.', signatureAt - 1);
	if (signatureAt < 0 || issuedAt < 1) return null;
	const time = fromTypable(body.slice(issuedAt + 1, signatureAt));
	const signature = fromTypable(body.slice(signatureAt + 1));
	if (time?.length !== 4 || signature?.length !== 64) return null;
	const issuedAtSeconds = ((time[0] << 24) | (time[1] << 16) | (time[2] << 8) | time[3]) >>> 0;
	return { userId: body.slice(0, issuedAt), issuedAtSeconds, signature };
}

export type IdentityCodeCheck =
	{ valid: true; userId: string } | { valid: false; reason: 'malformed' | 'forged' | 'expired' };

/** Checks a scanned code against the deployment's public key (the raw key, base64url). */
export async function verifyIdentityCode({
	code,
	publicKey,
	now = Date.now()
}: {
	code: string;
	publicKey: string;
	now?: number;
}): Promise<IdentityCodeCheck> {
	const parsed = parseIdentityCode(code);
	if (!parsed) return { valid: false, reason: 'malformed' };

	const genuine = await signatureIsGenuine({
		publicKey,
		signature: parsed.signature,
		message: identityCodeMessage({ userId: parsed.userId, issuedAtSeconds: parsed.issuedAtSeconds })
	});
	if (!genuine) return { valid: false, reason: 'forged' };

	const age = now - parsed.issuedAtSeconds * 1000;
	if (age > IDENTITY_CODE_VALIDITY_MS || age < -CLOCK_SKEW_MS) {
		return { valid: false, reason: 'expired' };
	}
	return { valid: true, userId: parsed.userId };
}

interface IdentityCard {
	userId: string;
	conferenceId: string;
	/** When the card stops counting: the day after its conference ends. */
	expiresAtSeconds: number;
	cardNumber: number;
}

/** The bytes a card's signature covers, under a label of its own. */
export function identityCardMessage({
	userId,
	conferenceId,
	expiresAtSeconds,
	cardNumber
}: IdentityCard): Uint8Array<ArrayBuffer> {
	return Uint8Array.from(
		new TextEncoder().encode(
			`${CARD_DOMAIN}\n${userId}\n${conferenceId}\n${expiresAtSeconds}\n${cardNumber}`
		)
	);
}

export function encodeIdentityCard({
	signature,
	...card
}: IdentityCard & { signature: Uint8Array }) {
	return [
		CARD_PREFIX,
		card.userId,
		card.conferenceId,
		toTypable(numberBytes(card.expiresAtSeconds)),
		toTypable(shortBytes(card.cardNumber)),
		toTypable(signature)
	].join('.');
}

export function looksLikeIdentityCard(code: string) {
	return code.startsWith(`${CARD_PREFIX}.`);
}

/** Splits a card from the right: the user id may contain dots, a conference id does not. */
function parseIdentityCard(code: string) {
	if (!looksLikeIdentityCard(code)) return null;
	const parts = code.slice(CARD_PREFIX.length + 1).split('.');
	if (parts.length < 5) return null;
	const [conferenceId, expires, number, signatureText] = parts.slice(-4);
	const userId = parts.slice(0, -4).join('.');
	const time = fromTypable(expires);
	const cardNumber = fromTypable(number);
	const signature = fromTypable(signatureText);
	if (!userId || !conferenceId) return null;
	if (time?.length !== 4 || cardNumber?.length !== 2 || signature?.length !== 64) return null;
	return {
		card: {
			userId,
			conferenceId,
			expiresAtSeconds: readNumber(time),
			cardNumber: readNumber(cardNumber)
		},
		signature
	};
}

export type IdentityCardCheck =
	| { valid: true; userId: string; conferenceId: string; cardNumber: number }
	| { valid: false; reason: 'malformed' | 'forged' | 'expired' | 'otherConference' };

/**
 * Checks a scanned card against the public key it was signed with (raw, base64url), for the
 * conference it is scanned at. Whether its number is the person's current one is the caller's to
 * check: only the caller knows the current number.
 */
export async function verifyIdentityCard({
	code,
	publicKey,
	conferenceId,
	now = Date.now()
}: {
	code: string;
	publicKey: string;
	conferenceId: string;
	now?: number;
}): Promise<IdentityCardCheck> {
	const parsed = parseIdentityCard(code);
	if (!parsed) return { valid: false, reason: 'malformed' };
	const genuine = await signatureIsGenuine({
		publicKey,
		signature: parsed.signature,
		message: identityCardMessage(parsed.card)
	});
	if (!genuine) return { valid: false, reason: 'forged' };
	if (parsed.card.conferenceId !== conferenceId) return { valid: false, reason: 'otherConference' };
	if (now > parsed.card.expiresAtSeconds * 1000) return { valid: false, reason: 'expired' };
	const { userId, cardNumber } = parsed.card;
	return { valid: true, userId, conferenceId, cardNumber };
}

/** When a card for a conference ending on `endConference` stops counting: a day after that day. */
export function identityCardExpiry(endConference: Date) {
	const end = new Date(endConference);
	end.setUTCHours(0, 0, 0, 0);
	return Math.floor(end.getTime() / 1000) + 2 * 24 * 60 * 60;
}
