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

export const graphqlQuery = query(graphqlRequestSchema, async (p) => {
  const result = await execute({
    schema,
    document: p.query,
    variableValues: p.variables,
    contextValue: context(getRequestEvent()),
  });

  return result;
});

export const graphqlMutation = command(graphqlRequestSchema, async (p) => {
  const result = await execute({
    schema,
    document: p.query,
    variableValues: p.variables,
    contextValue: context(getRequestEvent()),
  });

  return result;
});
