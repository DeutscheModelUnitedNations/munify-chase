import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { serializeClause } from '@deutschemodelunitednations/munify-resolution-editor/res-markup';
import type { OperativeClause } from '@deutschemodelunitednations/munify-resolution-editor';

/**
 * One-off backfill: convert `amendment.new_content` from a stored
 * `OperativeClause` JSON object to a RES-Markup string fragment.
 *
 * Run this while the column is STILL `json` (before the json -> text
 * migration). It rewrites each ALTER_TEXT / ADD row's `new_content` as a
 * JSON string scalar containing the serialized markup, so the subsequent
 * `ALTER COLUMN ... SET DATA TYPE text USING new_content #>> '{}'`
 * migration yields plain markup text.
 */
const db = drizzle(process.env.DATABASE_URL!, {
	casing: 'snake_case'
});

console.info('Backfilling amendment.new_content -> RES-Markup...');

const rows = await db.execute<{ id: string; type: string; new_content: unknown }>(sql`
	SELECT id, type, new_content
	FROM amendment
	WHERE type IN ('ALTER_TEXT', 'ADD') AND new_content IS NOT NULL
`);

let converted = 0;
let skipped = 0;
for (const row of rows.rows) {
	try {
		// Already a string scalar (idempotent re-run) -> skip.
		if (typeof row.new_content === 'string') {
			skipped++;
			continue;
		}
		const markup = serializeClause(row.new_content as OperativeClause);
		await db.execute(sql`
			UPDATE amendment
			SET new_content = to_jsonb(${markup}::text)
			WHERE id = ${row.id}
		`);
		converted++;
	} catch (err) {
		skipped++;
		console.warn(`Skipped amendment ${row.id} (${row.type}):`, err);
	}
}

console.info(`Backfill done. Converted ${converted}, skipped ${skipped}.`);
process.exit(0);
