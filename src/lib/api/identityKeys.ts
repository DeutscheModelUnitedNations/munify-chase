import { client } from '#lib/api/rumbleClient/client';
import type { IdentityKeys } from '#lib/helpers/nsaScan';
import { z } from 'zod/v4';

const STORAGE_KEY = 'identityKeys';

type KeyList = { kid: number; publicKey: string }[];
type StoredKeys = { delegator: KeyList; own: KeyList };

let loaded: Promise<IdentityKeys> | null = null;

const toMap = (list: KeyList) => new Map(list.map(({ kid, publicKey }) => [kid, publicKey]));
const toKeys = (stored: StoredKeys): IdentityKeys => ({
	delegator: toMap(stored.delegator),
	own: toMap(stored.own)
});

const keyEntry = z.object({ kid: z.number(), publicKey: z.string() });
/** A stored list as far as it is readable: malformed entries are dropped, anything else is none. */
const keyListSchema = z
	.array(z.unknown())
	.catch([])
	.transform((entries): KeyList =>
		entries.flatMap((entry) => {
			const parsed = keyEntry.safeParse(entry);
			return parsed.success ? [{ kid: parsed.data.kid, publicKey: parsed.data.publicKey }] : [];
		})
	);
const storedSchema = z.object({ delegator: keyListSchema, own: keyListSchema });

const keyList = (value: unknown): KeyList => keyListSchema.parse(value);

function readStored(): IdentityKeys | null {
	try {
		const stored = storedSchema.safeParse(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'));
		return stored.success ? toKeys(stored.data) : null;
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
