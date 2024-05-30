import { db } from "chase-backend/prisma/db";
import {
  UserIdFieldObject,
  createOneUserMutationObject,
  deleteOneUserMutationObject,
  findFirstUserQueryObject,
  findManyUserQueryObject,
  findUniqueUserQueryObject,
  updateOneUserMutationObject,
} from "chase-backend/prisma/generated/graphql/User";
import { builder } from "./builder";

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.field(UserIdFieldObject),
    conferenceMemberships: t.relation("conferenceMemberships", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").ConferenceMember,
      }),
    }),
    committeeMemberships: t.relation("committeeMemberships", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").CommitteeMember,
      }),
    }),
    messages: t.relation("messages", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").Message,
      }),
    }),
  }),
});

builder.queryFields((t) => {
  const field = findManyUserQueryObject(t);
  return {
    findManyUsers: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").User],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findFirstUserQueryObject(t);
  return {
    findFirstUser: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").User],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findUniqueUserQueryObject(t);
  return {
    findUniqueUser: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").User],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = createOneUserMutationObject(t);
  return {
    createOneUser: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        ctx.permissions.checkIf((user) => user.can("create", "User"));
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = createOneUserMutationObject(t);
  return {
    createOrFindUserAfterLogin: t.prismaField({
      ...field,
      args: undefined,
      description:
        "Query the user after you have logged in. Ensures the user entity is created in the database.",
      resolve: async (query, root, _args, ctx, info) => {
        ctx.permissions.mustBeLoggedIn();
        // biome-ignore lint/style/noNonNullAssertion: when the user is logged in they have an id
        const userId = ctx.intro.user!.id;

        const r = await db.user.findFirst({ ...query });
        if (r) {
          return r;
        }

        return field.resolve(
          query,
          root,
          {
            data: {
              id: userId,
            },
          },
          ctx,
          info,
        );
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = updateOneUserMutationObject(t);
  return {
    updateOneUser: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("update").User],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = deleteOneUserMutationObject(t);
  return {
    deleteOneUser: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("delete").User],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});
