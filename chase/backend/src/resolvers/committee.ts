import { builder } from "./builder";

builder.prismaObject("Committee", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    members: t.relation("members", {
      query: (args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").CommitteeMember,
      }),
    }),
  }),
});
