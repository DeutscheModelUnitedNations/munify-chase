import { readFile, writeFile } from 'node:fs/promises';
import { lexicographicSortSchema, printSchema, type GraphQLSchema } from 'graphql';

/**
 * Writes the API's schema as SDL, sorted so the file only changes when the schema does, and only
 * when it did: the dev server would otherwise see its own write and reload.
 */
export async function writeSchemaFile({ schema, path }: { schema: GraphQLSchema; path: string }) {
	const sdl = printSchema(lexicographicSortSchema(schema)) + '\n';
	const current = await readFile(path, 'utf8').catch(() => undefined);
	if (current !== sdl) await writeFile(path, sdl);
}
