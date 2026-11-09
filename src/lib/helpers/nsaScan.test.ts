import { describe, expect, it } from 'vitest';
import { signClaims, type SignedCodeClaims } from '#lib/signedCode/signedCode';
import { identifyNsa, type IdentityKeys } from './nsaScan';

const NOW = Date.UTC(2027, 2, 2, 9, 0, 0);
const issuedAt = NOW / 1000;

async function keyPair() {
	const pair = await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify']);
	if (!('privateKey' in pair)) throw new Error('no key pair');
	const { x } = await crypto.subtle.exportKey('jwk', pair.publicKey);
	if (!x) throw new Error('no public key');
	const sign = (claims: SignedCodeClaims) =>
		signClaims({
			claims,
			kid: 1,
			sign: async (bytes) =>
				new Uint8Array(await crypto.subtle.sign('Ed25519', pair.privateKey, bytes))
		});
	return { keys: new Map([[1, x]]), sign };
}

const delegator = await keyPair();
const own = await keyPair();
const keys: IdentityKeys = { delegator: delegator.keys, own: own.keys };

const nsas = [
	{ id: 'cu-anna', delegatorUserId: 'anna', cardNumber: 2 },
	{ id: 'cu-local', delegatorUserId: null, cardNumber: 1 }
];

const nametag = (userId: string) =>
	delegator.sign({
		kind: 'live',
		userId,
		conferenceId: 'conf',
		issuedAt,
		expiresAt: issuedAt + 600
	});
const card = ({
	signer = delegator,
	userId,
	cardNumber,
	conferenceId = 'conf'
}: {
	signer?: typeof delegator;
	userId: string;
	cardNumber: number;
	conferenceId?: string;
}) =>
	signer.sign({
		kind: 'nsaCard',
		userId,
		conferenceId,
		issuedAt,
		expiresAt: issuedAt + 3 * 24 * 3600,
		cardNumber
	});

const identify = (code: string, withKeys: IdentityKeys = keys) =>
	identifyNsa({ code, keys: withKeys, conferenceId: 'conf', nsas, now: NOW });

describe('identifyNsa', () => {
	it("finds the person behind DELEGATOR's digital nametag, also read as its link", async () => {
		const code = await nametag('anna');
		expect(await identify(code)).toEqual({ found: true, nsa: nsas[0] });
		expect(await identify(`HTTPS://DELEGATOR.EXAMPLE/ID/${code}`)).toEqual({
			found: true,
			nsa: nsas[0]
		});
	});

	it("finds the person behind DELEGATOR's current card", async () => {
		expect(await identify(await card({ userId: 'anna', cardNumber: 2 }))).toEqual({
			found: true,
			nsa: nsas[0]
		});
	});

	it('finds the person behind a card this instance printed', async () => {
		const code = await card({ signer: own, userId: 'cu-local', cardNumber: 1 });
		expect(await identify(code)).toEqual({ found: true, nsa: nsas[1] });
	});

	it('refuses a card printed before the current one', async () => {
		const code = await card({ userId: 'anna', cardNumber: 1 });
		expect(await identify(code)).toEqual({ found: false, reason: 'outdatedCard' });
	});

	it("refuses another conference's card, and a code no known key signed", async () => {
		const other = await card({ userId: 'anna', cardNumber: 2, conferenceId: 'x' });
		expect(await identify(other)).toEqual({ found: false, reason: 'otherConference' });
		const stranger = await keyPair();
		const forged = await card({ signer: stranger, userId: 'anna', cardNumber: 2 });
		expect(await identify(forged)).toEqual({ found: false, reason: 'forged' });
	});

	it('refuses an expired nametag, and documents that are no nametag', async () => {
		const old = await delegator.sign({
			kind: 'live',
			userId: 'anna',
			conferenceId: 'conf',
			issuedAt: issuedAt - 3600,
			expiresAt: issuedAt - 3000
		});
		expect(await identify(old)).toEqual({ found: false, reason: 'expired' });
		const documents = await delegator.sign({
			kind: 'print',
			userId: 'anna',
			conferenceId: 'conf',
			issuedAt
		});
		expect(await identify(documents)).toEqual({ found: false, reason: 'wrongKind' });
	});

	it('refuses someone who is no NSA here, and plain text', async () => {
		expect(await identify(await nametag('bob'))).toEqual({ found: false, reason: 'notNsa' });
		expect(await identify('cu-anna')).toEqual({ found: false, reason: 'unsigned' });
	});

	it('cannot check a nametag without the linked DELEGATOR keys', async () => {
		expect(await identify(await nametag('anna'), { delegator: new Map(), own: own.keys })).toEqual({
			found: false,
			reason: 'forged'
		});
		expect(await identify(await nametag('anna'), { delegator: new Map(), own: new Map() })).toEqual(
			{
				found: false,
				reason: 'noKey'
			}
		);
	});
});
