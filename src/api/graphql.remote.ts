import { execute } from "graphql";
import { z } from "zod";
import { command, getRequestEvent, query } from "$app/server";
import { GET } from "../routes/api/graphql/+server";
import { context } from "./context";

// TODO batch this?
// https://the-guild.dev/graphql/yoga-server/docs/features/request-batching

const schema = GET.getEnveloped().schema;

const graphqlRequestSchema = z.object({
  query: z.any(),
  variables: z.record(z.string(), z.any()).optional(),
});

const performQuery = async (p) => {
  const result = await execute({
    schema,
    document: p.query,
    variableValues: p.variables,
    //TODO: how to do this properly so the rumble context injection is run on request?
    // contextValue: await context(getRequestEvent()),
  });

  return result;
};

export const graphqlQuery = query(graphqlRequestSchema, performQuery);
export const graphqlMutation = command(graphqlRequestSchema, performQuery);
