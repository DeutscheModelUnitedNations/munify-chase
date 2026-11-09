import { describe, expect, test } from 'vitest';
import {
	LIVE_CODE_VALIDITY_SECONDS,
	looksLikeSignedCode,
	parseSignedCode,
	signClaims,
	signedCodeLink,
	verifySignedCode,
	type SignedCodeClaims
} from './signedCode';
import { fromScannerSafe, toScannerSafe } from './scannerSafeText';

const NOW = Date.UTC(2026, 10, 8, 9, 0, 0);
const issuedAt = NOW / 1000;

async function keyPair() {
	const pair = await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify']);
	const { x } = await crypto.subtle.exportKey('jwk', pair.publicKey);
	if (!x) throw new Error('no public key');
	return { privateKey: pair.privateKey, publicKey: x };
}

const ours = await keyPair();
const theirs = await keyPair();
const keys = new Map([[1, ours.publicKey]]);

function sign({ claims, key = ours.privateKey }: { claims: SignedCodeClaims; key?: CryptoKey }) {
	return signClaims({
		claims,
		kid: 1,
		sign: async (bytes) => new Uint8Array(await crypto.subtle.sign('Ed25519', key, bytes))
	});
}

const live: SignedCodeClaims = {
	kind: 'live',
	userId: 'user_with-Mixed.case',
	conferenceId: 'conference1',
	issuedAt,
	expiresAt: issuedAt + LIVE_CODE_VALIDITY_SECONDS
};
const print: SignedCodeClaims = {
	kind: 'print',
	userId: 'user1',
	conferenceId: 'conference1',
	issuedAt
};
const certificate: SignedCodeClaims = {
	kind: 'certificate',
	issuedAt,
	certificate: { n: 'Ada Lovelace', t: 'MUN-SH 2026', s: 1, e: 2, a: ['Opening'] }
};

describe('scanner safe text', () => {
	test('round-trips any bytes, read in any case', () => {
		const bytes = Uint8Array.from({ length: 70 }, (_, index) => (index * 37) % 256);
		const text = toScannerSafe(bytes);
		expect(text).toMatch(/^[0-9A-HJ-NP-X]+$/);
		expect(fromScannerSafe(text.toLowerCase())).toEqual(bytes);
	});

	test('refuses letters a keyboard layout swaps', () => {
		expect(fromScannerSafe('ABZ')).toBeNull();
		expect(fromScannerSafe('ABY')).toBeNull();
	});
});

describe('signed codes', () => {
	test.each([live, print, certificate])(
		'a $kind code verifies and says what was signed',
		async (claims) => {
			const code = await sign({ claims });
			expect(await verifySignedCode({ text: code, keys, now: NOW + 1000 })).toEqual({
				valid: true,
				claims,
				code
			});
		}
	);

	test('a certificate without sessions leaves them out', async () => {
		const claims: SignedCodeClaims = {
			kind: 'certificate',
			issuedAt,
			certificate: { n: 'Ada', t: 'MUN', s: 0, e: 0 }
		};
		const code = await sign({ claims });
		expect(parseSignedCode(code)?.claims).toEqual(claims);
	});

	test('is read from the link, in lower case, and as a German keyboard scanner types it', async () => {
		const code = await sign({ claims: print });
		const link = signedCodeLink({ origin: 'https://delegator.dmun.de', code });
		expect(link).toBe(`HTTPS://DELEGATOR.DMUN.DE/ID/${code}`);
		const garbled = link.replaceAll('/', '-').replace(':', 'Ö');
		for (const text of [link, link.toLowerCase(), garbled, ` ${code}\n`]) {
			expect(await verifySignedCode({ text, keys, now: NOW })).toMatchObject({
				valid: true,
				code
			});
		}
	});

	test('a prefix character turned into one of the alphabet does not hide the code', async () => {
		const code = await sign({ claims: print });
		expect(parseSignedCode(`HTTPS-ID7${code}`)?.code).toBe(code);
	});

	test('a code signed with another key is forged', async () => {
		const code = await sign({ claims: live, key: theirs.privateKey });
		expect(await verifySignedCode({ text: code, keys, now: NOW })).toEqual({
			valid: false,
			reason: 'forged'
		});
	});

	test('a key the deployment does not know is refused as such', async () => {
		const code = await sign({ claims: live });
		expect(await verifySignedCode({ text: code, keys: new Map(), now: NOW })).toEqual({
			valid: false,
			reason: 'unknownKey'
		});
	});

	test('changing a single character breaks the code', async () => {
		const code = await sign({ claims: print });
		const index = 60;
		const changed =
			code.slice(0, index) + (code[index] === '0' ? '1' : '0') + code.slice(index + 1);
		expect(await verifySignedCode({ text: changed, keys, now: NOW })).toMatchObject({
			valid: false
		});
	});

	test('a live code stops counting after ten minutes, and one from the future does not count', async () => {
		const code = await sign({ claims: live });
		const later = NOW + (LIVE_CODE_VALIDITY_SECONDS + 1) * 1000;
		expect(await verifySignedCode({ text: code, keys, now: later })).toEqual({
			valid: false,
			reason: 'expired'
		});
		expect(await verifySignedCode({ text: code, keys, now: NOW - 3 * 60 * 1000 })).toEqual({
			valid: false,
			reason: 'expired'
		});
		expect(await verifySignedCode({ text: code, keys, now: NOW - 60 * 1000 })).toMatchObject({
			valid: true
		});
	});

	test('a printed code keeps counting', async () => {
		const code = await sign({ claims: print });
		const yearsLater = NOW + 5 * 365 * 24 * 3600 * 1000;
		expect(await verifySignedCode({ text: code, keys, now: yearsLater })).toMatchObject({
			valid: true
		});
	});

	test('a code whose ids hold a control character is no signed code', async () => {
		// a garbled character can decode to a NUL, which Postgres refuses in any lookup
		const code = await sign({ claims: { ...print, conferenceId: 'conference\u00001' } });
		expect(parseSignedCode(code)).toBeNull();
	});

	test('a user id, a short code or any other text is no signed code', () => {
		for (const text of ['dev-admin', 'V1StGXR8_Z5jdHi6B-myT', 'A'.repeat(120), '']) {
			expect(looksLikeSignedCode(text)).toBe(false);
		}
	});
});

describe('NSA cards', () => {
	const card: SignedCodeClaims = {
		kind: 'nsaCard',
		userId: 'nsa-user',
		conferenceId: 'conference1',
		issuedAt,
		expiresAt: issuedAt + 3 * 24 * 60 * 60,
		cardNumber: 2
	};

	test('a card keeps its number and counts until it expires', async () => {
		const code = await sign({ claims: card });
		expect(await verifySignedCode({ text: code, keys, now: NOW })).toEqual({
			valid: true,
			claims: card,
			code
		});
		expect(
			await verifySignedCode({ text: code, keys, now: NOW + 4 * 24 * 60 * 60 * 1000 })
		).toEqual({ valid: false, reason: 'expired' });
	});

	test('a card read from its link is the same card', async () => {
		const code = await sign({ claims: card });
		const link = signedCodeLink({ origin: 'https://delegator.example', code });
		expect(parseSignedCode(link)?.claims).toEqual(card);
	});
});
