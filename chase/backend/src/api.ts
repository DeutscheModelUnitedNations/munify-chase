import Elysia from "elysia";
import { createYoga } from "graphql-yoga";
import { builder } from "./resolvers/builder";

import { sessionPlugin } from "./auth/session";
import { permissionsPlugin } from "./auth/permissions";

builder.queryType({});
builder.mutationType({});

import "./resolvers/agendaItem";
import "./resolvers/committee";
import "./resolvers/committeeMember";
import "./resolvers/conference";
import "./resolvers/conferenceMember";
import "./resolvers/delegation";
import "./resolvers/email";
import "./resolvers/message";
import "./resolvers/nation";
import "./resolvers/speakerOnList";
import "./resolvers/speakersList";
import "./resolvers/user";
import "./resolvers/time";

const yoga = createYoga({
  schema: builder.toSchema(),
});

export const GraphQLApi = new Elysia()
  .use(sessionPlugin)
  .use(permissionsPlugin)
  .all("/graphql", ({ request, session, permissions }) => {
    return yoga.handleRequest(request, { session, permissions });
  });
