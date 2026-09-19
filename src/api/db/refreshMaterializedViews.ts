import { sql } from 'drizzle-orm';
import { db } from './db';

export async function refreshMaterializedViewsWithLock(lockName: string, viewNames: string[]) {
	await db.transaction(async (tx) => {
		const { rows } = await tx.execute<{ acquired: boolean }>(
			sql`select pg_try_advisory_xact_lock(hashtext(${lockName})) as acquired`
		);
		if (!rows[0]?.acquired) return;

		for (const viewName of viewNames) {
			await tx.execute(sql.raw(`REFRESH MATERIALIZED VIEW CONCURRENTLY "${viewName}"`));
		}
	});
}
