import { LINK_SECRET } from '$app/env/private';
import { signClaims, type SignedCodeClaims, type SignedCodeKeys } from '#lib/signedCode/signedCode';

/**
 * The key this instance signs NSA cards with while no DELEGATOR is linked
 * (`docs/plans/delegator-link.md`), derived from `LINK_SECRET` under a label of its own, so it
 * survives redeploys and every instance agrees on it. Without the secret there is none, and cards
 * cannot be printed here.
 */

/** DER prefix of a PKCS#8 Ed25519 private key, which ends in the 32-byte seed. */
const PKCS8_ED25519_PREFIX = Uint8Array.from([
	0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20
]);

/** The key id this instance's codes name; its own keys are a set apart from DELEGATOR's. */
const OWN_KID = 1;

async function deriveKeys(secret: string) {
	const hmac = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const seed = new Uint8Array(
		await crypto.subtle.sign(
			'HMAC',
			hmac,
			new TextEncoder().encode(`munify-chase-signed-code-${OWN_KID}`)
		)
	);
	const pkcs8 = new Uint8Array([...PKCS8_ED25519_PREFIX, ...seed]);
	const privateKey = await crypto.subtle.importKey('pkcs8', pkcs8, 'Ed25519', true, ['sign']);
	const { x } = await crypto.subtle.exportKey('jwk', privateKey);
	if (!x) throw new Error('Could not derive the signed code public key');
	return { privateKey, publicKey: x };
}

let derived: ReturnType<typeof deriveKeys> | undefined;

/** Derived on first use: `vite build` evaluates the module without the deployment's secrets. */
function keys() {
	if (!LINK_SECRET) return undefined;
	derived ??= deriveKeys(LINK_SECRET);
	return derived;
}

/** The keys this instance's cards are checked against, by key id; none without a secret. */
export async function ownSigningKeys(): Promise<SignedCodeKeys> {
	const pair = await keys();
	return new Map(pair ? [[OWN_KID, pair.publicKey]] : []);
}

/** Signs `claims` with this instance's key, or answers undefined while it has none. */
export async function signOwnCode(claims: SignedCodeClaims) {
	const pair = await keys();
	if (!pair) return undefined;
	return signClaims({
		claims,
		kid: OWN_KID,
		sign: async (bytes) =>
			new Uint8Array(await crypto.subtle.sign('Ed25519', pair.privateKey, bytes))
	});
}
