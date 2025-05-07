import { schema } from '$api/db/db';
import { object, pubsub as rumblePubsub, query, arg as rumbleArg } from '$api/rumble';

/**
 * Implements basic CRUD stuff for a table using the rumble helpers
 */
export function basics<TableName extends Parameters<typeof object>[0]['table']>(table: TableName) {
	const ref = object({
		table
	});
	const pubsub = rumblePubsub({ table: table });
	const arg = rumbleArg({ table: table });
	query({
		table: table
	});
	return {
		arg,
		ref,
		pubsub,
		table: schema[table]
	};
}
