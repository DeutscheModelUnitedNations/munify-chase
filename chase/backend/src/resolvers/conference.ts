import { builder } from "../../builder";
import { db } from "../../prisma/db";
import {
  createOneConferenceMutationObject,
  deleteOneConferenceMutationObject,
  findManyConferenceQueryObject,
  findUniqueConferenceQueryObject,
  updateOneConferenceMutationObject,
} from "../../prisma/generated/graphql/pothosCrud/Conference";

builder.queryFields((t) => {
  const field = findManyConferenceQueryObject(t);
  return {
    findManyConferences: t.prismaField({
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

builder.queryFields((t) => {
  const field = findUniqueConferenceQueryObject(t);
  return {
    findUniqueConference: t.prismaField({
      ...field,
      resolve: async (query, root, args, context, info) => {
        args.where = {
          ...args.where,
          AND: [context.permissions.allowDatabaseAccessTo().Conference],
        };
        return field.resolve(query, root, args, context, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = createOneConferenceMutationObject(t);
  return {
    createConference: t.prismaField({
      ...field,
      args: { ...field.args, token: t.arg.string({ required: true }) },
      resolve: async (query, root, args, context, info) => {
        context.permissions.checkIf((user) => user.can("create", "Conference"));

        await db.conferenceCreationToken.delete({
          where: { token: args.token },
        });

        args.data.members = {
          create: {
            role: "ADMIN",
            user: {
              connect: {
                id: context.session.data?.user?.id,
              },
            },
          },
        };

        return field.resolve(query, root, args, context, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = updateOneConferenceMutationObject(t);
  return {
    updateConference: t.prismaField({
      ...field,
      resolve: async (query, root, args, context, info) => {
        args.where = {
          ...args.where,
          AND: [context.permissions.allowDatabaseAccessTo("update").Conference],
        };
        return field.resolve(query, root, args, context, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = deleteOneConferenceMutationObject(t);
  return {
    deleteConference: t.prismaField({
      ...field,
      resolve: async (query, root, args, context, info) => {
        args.where = {
          ...args.where,
          AND: [context.permissions.allowDatabaseAccessTo("delete").Conference],
        };
        return field.resolve(query, root, args, context, info);
      },
    }),
  };
});
