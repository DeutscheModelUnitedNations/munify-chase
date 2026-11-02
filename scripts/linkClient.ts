/**
 * Generates the typed client of the linked DELEGATOR's API (`docs/plans/delegator-link.md`) from
 * DELEGATOR's `schema.graphql`, which its dev server writes:
 *
 *   bun run link:client                       # ../munify-delegator/schema.graphql
 *   bun run link:client path/to/schema.graphql
 *   bun run link:client https://…/schema.graphql
 */
import { readFile } from 'node:fs/promises';
import { buildSchema } from 'graphql';
import { generateFromSchema } from '@m1212e/rumble/client/generate';

const source = process.argv[2] ?? '../munify-delegator/schema.graphql';
const sdl = /^https?:\/\//.test(source)
	? await fetch(source).then((response) => {
			if (!response.ok) throw new Error(`${source} answered ${response.status}`);
			return response.text();
		})
	: await readFile(source, 'utf8');

await generateFromSchema({
	schema: buildSchema(sdl),
	outputPath: 'src/api/services/link/delegatorClient',
	// unused: `delegatorRemote.ts` builds a client per link from the generated schema and types
	apiUrl: 'http://delegator.invalid/api/graphql',
	removeExisting: true,
	autoIncludeIdField: true
});

console.log(`Generated the DELEGATOR client from ${source}`);
