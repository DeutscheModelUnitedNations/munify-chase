import { describe, expect, it } from 'vitest';
import {
	encodeIdentityCard,
	encodeIdentityCode,
	identityCardExpiry,
	identityCardMessage,
	identityCodeMessage
} from './identityCode';
import { identifyNsa, type IdentityKeys } from './nsaScan';

const NOW = Date.UTC(2027, 2, 2, 9, 0, 0);
const expiresAtSeconds = identityCardExpiry(new Date(Date.UTC(2027, 2, 4)));

async function keyPair() {
	const pair = await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify']);
	if (!('privateKey' in pair)) throw new Error('no key pair');
	const { x } = await crypto.subtle.exportKey('jwk', pair.publicKey);
	if (!x) throw new Error('no public key');
	const sign = async (message: Uint8Array<ArrayBuffer>) =>
		new Uint8Array(await crypto.subtle.sign('Ed25519', pair.privateKey, message));
	return { publicKey: x, sign };
}

const delegator = await keyPair();
const own = await keyPair();
const keys: IdentityKeys = { delegator: delegator.publicKey, own: own.publicKey };

const nsas = [
	{ id: 'cu-anna', delegatorUserId: 'anna', cardNumber: 2 },
	{ id: 'cu-local', delegatorUserId: null, cardNumber: 1 }
];

const nametag = async (userId: string) => {
	const issuedAtSeconds = Math.floor(NOW / 1000);
	return encodeIdentityCode({
		userId,
		issuedAtSeconds,
		signature: await delegator.sign(identityCodeMessage({ userId, issuedAtSeconds }))
	});
};

const card = async ({
	signer,
	userId,
	cardNumber,
	conferenceId = 'conf'
}: {
	signer: typeof delegator;
	userId: string;
	cardNumber: number;
	conferenceId?: string;
}) => {
	const content = { userId, conferenceId, expiresAtSeconds, cardNumber };
	return encodeIdentityCard({
		...content,
		signature: await signer.sign(identityCardMessage(content))
	});
};

const identify = (code: string, withKeys: IdentityKeys = keys) =>
	identifyNsa({ code, keys: withKeys, conferenceId: 'conf', nsas, now: NOW });

describe('identifyNsa', () => {
	it("finds the person behind DELEGATOR's digital nametag", async () => {
		expect(await identify(await nametag('anna'))).toEqual({ found: true, nsa: nsas[0] });
	});

	it("finds the person behind DELEGATOR's current card", async () => {
		const code = await card({ signer: delegator, userId: 'anna', cardNumber: 2 });
		expect(await identify(code)).toEqual({ found: true, nsa: nsas[0] });
	});

	it('finds the person behind a card this instance printed', async () => {
		const code = await card({ signer: own, userId: 'cu-local', cardNumber: 1 });
		expect(await identify(code)).toEqual({ found: true, nsa: nsas[1] });
	});

	it('refuses a card printed before the current one', async () => {
		const code = await card({ signer: delegator, userId: 'anna', cardNumber: 1 });
		expect(await identify(code)).toEqual({ found: false, reason: 'outdatedCard' });
	});

	it("refuses another conference's card", async () => {
		const code = await card({
			signer: delegator,
			userId: 'anna',
			cardNumber: 2,
			conferenceId: 'x'
		});
		expect(await identify(code)).toEqual({ found: false, reason: 'otherConference' });
	});

	it('refuses a card no known key signed', async () => {
		const stranger = await keyPair();
		const code = await card({ signer: stranger, userId: 'anna', cardNumber: 2 });
		expect(await identify(code)).toEqual({ found: false, reason: 'forged' });
	});

	it('refuses someone who is no NSA here, and plain text', async () => {
		expect(await identify(await nametag('bob'))).toEqual({ found: false, reason: 'notNsa' });
		expect(await identify('cu-anna')).toEqual({ found: false, reason: 'unsigned' });
	});

	it('cannot check a nametag without the linked DELEGATOR key', async () => {
		expect(await identify(await nametag('anna'), { delegator: null, own: own.publicKey })).toEqual({
			found: false,
			reason: 'noKey'
		});
	});
});
