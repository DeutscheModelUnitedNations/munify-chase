import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { customAlphabet } from 'nanoid';
import { LINK_SECRET } from '$app/env/private';
import { GraphQLError } from 'graphql';

/** The header a linked instance sends its token in. Not `Authorization`: OIDC takes bearer tokens. */
export const LINK_TOKEN_HEADER = 'x-munify-link-token';

const TOKEN_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/** A token one instance hands the other to call it with. */
export const makeLinkToken = customAlphabet(TOKEN_ALPHABET, 48);

/** Only the hash of a token the remote sends is kept. */
export function hashLinkToken(token: string) {
	return createHash('sha256').update(token).digest('hex');
}

/** `LINK_SECRET`, or why linking is not possible without it. */
export function linkSecret() {
	if (!LINK_SECRET)
		throw new GraphQLError('LINK_SECRET is not set, so this instance cannot be linked.');
	return LINK_SECRET;
}

function sealingKey() {
	return createHash('sha256').update(`munify-instance-link\n${linkSecret()}`).digest();
}

/** The token this instance sends, encrypted for the database (AES-256-GCM under `LINK_SECRET`). */
export function sealLinkToken(token: string) {
	const iv = randomBytes(12);
	const cipher = createCipheriv('aes-256-gcm', sealingKey(), iv);
	const sealed = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
	return Buffer.concat([iv, cipher.getAuthTag(), sealed]).toString('base64url');
}

export function openLinkToken(sealed: string) {
	const bytes = Buffer.from(sealed, 'base64url');
	const decipher = createDecipheriv('aes-256-gcm', sealingKey(), bytes.subarray(0, 12));
	decipher.setAuthTag(bytes.subarray(12, 28));
	return Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString('utf8');
}
