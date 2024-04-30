import { builder } from "../../builder";
import { findManyConferenceQueryObject } from "../../prisma/generated/graphql/pothosCrud/Conference";

builder.queryFields((t) => {
  const field = findManyConferenceQueryObject(t);
  return {
    findManyConference: t.prismaField({
      ...field,
      resolve: async (query, root, args, context, info) => {
        args.where = {
          ...args.where,
          AND: [context.permissions.allowDatabaseAccessTo("list").Conference],
        };
        return field.resolve(query, root, args, context, info);
      },
    }),
  };
});
