import { builder } from "./builder";

builder.queryFields((t) => {
  return {
    serverTime: t.field({
      type: "DateTime",
      resolve: () => new Date(),
      description: "The current server time",
    }),
  };
});
