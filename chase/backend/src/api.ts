import Elysia from "elysia";
import { createYoga } from "graphql-yoga";
import { builder } from "./resolvers/builder";

import { sessionPlugin } from "./auth/session";
import { permissionsPlugin } from "./auth/permissions";

//TODO robots.txt

builder.queryType({});
builder.mutationType({});

import "./resolvers/conference";
import "./resolvers/committee";
import "./resolvers/committeeMember";

const yoga = createYoga({
  schema: builder.toSchema(),
});

export const GraphQLApi = new Elysia()
  .use(sessionPlugin)
  .use(permissionsPlugin)
  .all("/graphql", ({ request, session, permissions }) => {
    return yoga.handleRequest(request, { session, permissions });
  });
