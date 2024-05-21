import {
  UserIdFieldObject,
  UserNameFieldObject,
  createOneUserMutationObject,
  deleteOneUserMutationObject,
  findFirstUserQueryObject,
  findManyUserQueryObject,
  findUniqueUserQueryObject,
  updateOneUserMutationObject,
} from "../../prisma/generated/graphql/User";
import { builder } from "./builder";

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.field(UserIdFieldObject),
    name: t.field(UserNameFieldObject),
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
    emails: t.relation("emails", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").Email,
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