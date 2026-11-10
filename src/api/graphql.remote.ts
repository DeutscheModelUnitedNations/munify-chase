import { execute } from 'graphql';
import { z } from 'zod';
import { command, getRequestEvent, query } from '$app/server';
import { GET } from '../routes/api/graphql/+server';

// TODO batch this?
// https://the-guild.dev/graphql/yoga-server/docs/features/request-batching

const graphqlRequestSchema = z.object({
	query: z.any(),
	variables: z.record(z.string(), z.any()).optional()
});

const performQuery = async (p: z.infer<typeof graphqlRequestSchema>) => {
	const requestEvent = await getRequestEvent();

	const envelop = GET.getEnveloped(requestEvent);
	const contextValue = envelop.contextFactory ? await envelop.contextFactory() : undefined;

	const result = await execute({
		schema: envelop.schema,
		document: p.query,
		variableValues: p.variables,
		contextValue
	});

	// The result goes through devalue to the client, which refuses class instances, so a failed
	// resolver's GraphQLError has to travel as its plain JSON form.
	return {
		data: result.data,
		errors: result.errors?.map((error) => error.toJSON()),
		extensions: result.extensions
	};
};

export const graphqlQuery = query(graphqlRequestSchema, performQuery);
export const graphqlMutation = command(graphqlRequestSchema, performQuery);
