import { object, pubsub as rumblePubsub, query, arg as rumbleArg } from '$api/rumble';

/**
 * Implements basic CRUD stuff for a table using the rumble helpers
 */
export function basics<TableName extends Parameters<typeof object>[0]['tableName']>(
	tableName: TableName
) {
	const ref = object({
		tableName
	});
	const pubsub = rumblePubsub({ tableName });
    const arg = rumbleArg({ tableName })
	query({
		tableName
	});
	return {
        arg,
		ref,
		pubsub
	};
}
