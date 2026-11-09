import { client } from '#lib/api/rumbleClient/client';
import type { IdentityKeys } from '#lib/helpers/nsaScan';

const STORAGE_KEY = 'identityKeys';

type KeyList = { kid: number; publicKey: string }[];
type StoredKeys = { delegator: KeyList; own: KeyList };

let loaded: Promise<IdentityKeys> | null = null;

const toMap = (list: KeyList) => new Map(list.map(({ kid, publicKey }) => [kid, publicKey]));
const toKeys = (stored: StoredKeys): IdentityKeys => ({
	delegator: toMap(stored.delegator),
	own: toMap(stored.own)
});

function keyList(value: unknown): KeyList {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry: unknown) => {
		if (typeof entry !== 'object' || entry === null) return [];
		const kid: unknown = Reflect.get(entry, 'kid');
		const publicKey: unknown = Reflect.get(entry, 'publicKey');
		return typeof kid === 'number' && typeof publicKey === 'string' ? [{ kid, publicKey }] : [];
	});
}

function readStored(): IdentityKeys | null {
	try {
		const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
		if (typeof stored !== 'object' || stored === null) return null;
		return toKeys({
			delegator: keyList(Reflect.get(stored, 'delegator')),
			own: keyList(Reflect.get(stored, 'own'))
		});
	} catch {
		return null;
	}
}

/**
 * The keys NSA nametags and cards are checked against, fetched once and kept in the browser: the
 * scanner has to keep working when the network drops, and the keys change only when rotated.
 */
export function loadIdentityKeys(): Promise<IdentityKeys> {
	loaded ??= client.query
		.identityKeys({
			delegator: { kid: true, publicKey: true },
			own: { kid: true, publicKey: true }
		})
		.then((keys) => {
			const plain: StoredKeys = { delegator: keyList(keys.delegator), own: keyList(keys.own) };
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
			} catch {
				// storage may be blocked; the keys then live for this page load only
			}
			return toKeys(plain);
		})
		.catch((error) => {
			loaded = null;
			const stored = readStored();
			if (stored) return stored;
			throw error;
		});
	return loaded;
}
