/** A short, stable hash of the schema, so a changed schema gets a fresh cache database */
export function hashSchema(schemaObject: unknown): string {
	const json = JSON.stringify(schemaObject);
	let hash = 0;
	for (let i = 0; i < json.length; i++) {
		hash = (Math.imul(31, hash) + json.charCodeAt(i)) | 0;
	}
	return (hash >>> 0).toString(36);
}

const isCacheDatabase = (name: string | undefined): name is string =>
	!!name && (name === 'chase-cache' || name.startsWith('chase-cache-'));

/** Deletes the cache databases of earlier schemas, best effort */
export async function cleanupStaleCaches(currentIdbName: string) {
	if (typeof indexedDB === 'undefined' || typeof indexedDB.databases !== 'function') return;
	try {
		const databases = await indexedDB.databases();
		for (const { name } of databases) {
			if (isCacheDatabase(name) && name !== currentIdbName) indexedDB.deleteDatabase(name);
		}
	} catch {
		// Best-effort cleanup only
	}
}
