import { builder } from "./builder";

builder.prismaObject("CommitteeMember", {
  fields: (t) => ({
    id: t.exposeID("id"),
  }),
});
