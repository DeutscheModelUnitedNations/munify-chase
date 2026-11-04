import { client } from '#lib/api/rumbleClient/client';
import type { IdentityKeys } from '#lib/helpers/nsaScan';

const STORAGE_KEY = 'identityKeys';

let loaded: Promise<IdentityKeys> | null = null;

function readStored(): IdentityKeys | null {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return null;
		const parsed: unknown = JSON.parse(stored);
		if (typeof parsed !== 'object' || parsed === null) return null;
		const keyOf = (name: string) => {
			const value: unknown = Reflect.get(parsed, name);
			return typeof value === 'string' ? value : null;
		};
		return { delegator: keyOf('delegator'), own: keyOf('own') };
	} catch {
		return null;
	}
}

/**
 * The keys NSA nametags and cards are checked against, fetched once and kept in the browser: the
 * scanner has to keep working when the network drops, and the keys change only with a secret.
 */
export function loadIdentityKeys(): Promise<IdentityKeys> {
	loaded ??= client.query
		.identityKeys({ delegator: true, own: true })
		.then((keys) => {
			const plain = { delegator: keys.delegator ?? null, own: keys.own ?? null };
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
			} catch {
				// storage may be blocked; the keys then live for this page load only
			}
			return plain;
		})
		.catch((error) => {
			loaded = null;
			const stored = readStored();
			if (stored) return stored;
			throw error;
		});
	return loaded;
}
