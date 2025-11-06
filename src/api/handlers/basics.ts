import { schema } from "$api/db/db";
import { object, query, pubsub as rumblePubsub } from "$api/rumble";

/**
 * Implements basic CRUD stuff for a table using the rumble helpers
 */
export function basics<TableName extends Parameters<typeof object>[0]["table"]>(
	table: TableName,
) {
	const ref = object({
		table,
	});
	const pubsub = rumblePubsub({ table: table });
	query({
		table: table,
	});
	return {
		ref,
		pubsub,
		table: schema[table],
	};
}
