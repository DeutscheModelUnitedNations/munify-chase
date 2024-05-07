import Elysia from "elysia";
import { createYoga } from "graphql-yoga";
import { builder } from "../builder";

import { sessionPlugin } from "./auth/session";
import { permissionsPlugin } from "./auth/permissions";
import { generateAllObjects } from "../prisma/generated/graphql/pothosCrud/autocrud";

//TODO robots.txt

generateAllObjects();
// generateAllQueries();
// generateAllMutations()

builder.queryType({});
builder.mutationType({});

import "./resolvers/conference";
import "./resolvers/committee";

const yoga = createYoga({
  schema: builder.toSchema(),
});

export const GraphQLApi = new Elysia()
  .use(sessionPlugin)
  .use(permissionsPlugin)
  .all("/graphql", ({ request, session, permissions }) => {
    return yoga.handleRequest(request, { session, permissions });
  });
