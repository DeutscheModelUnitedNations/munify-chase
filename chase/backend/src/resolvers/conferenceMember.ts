import {
  ConferenceMemberIdFieldObject,
  ConferenceMemberRoleFieldObject,
  createOneConferenceMemberMutationObject,
  deleteOneConferenceMemberMutationObject,
  findFirstConferenceMemberQueryObject,
  findManyConferenceMemberQueryObject,
  findUniqueConferenceMemberQueryObject,
  updateOneConferenceMemberMutationObject,
} from "../../prisma/generated/graphql/ConferenceMember";
import { builder } from "./builder";

builder.prismaObject("ConferenceMember", {
  fields: (t) => ({
    id: t.field(ConferenceMemberIdFieldObject),
    conference: t.relation("conference"),
    user: t.relation("user", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("read").User,
      }),
    }),
    role: t.field(ConferenceMemberRoleFieldObject),
  }),
});

builder.queryFields((t) => {
  const field = findManyConferenceMemberQueryObject(t);
  return {
    findManyConferenceMembers: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").ConferenceMember],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findFirstConferenceMemberQueryObject(t);
  return {
    findFirstConferenceMember: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").ConferenceMember],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findUniqueConferenceMemberQueryObject(t);
  return {
    findUniqueConferenceMember: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").ConferenceMember],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = createOneConferenceMemberMutationObject(t);
  return {
    createOneConferenceMember: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        ctx.permissions.checkIf((user) => user.can("create", "ConferenceMember"));
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = updateOneConferenceMemberMutationObject(t);
  return {
    updateOneConferenceMember: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("update").ConferenceMember],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = deleteOneConferenceMemberMutationObject(t);
  return {
    deleteOneConferenceMember: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("delete").ConferenceMember],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});