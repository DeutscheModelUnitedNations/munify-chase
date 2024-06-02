import {
  DelegationIdFieldObject,
  createOneDelegationMutationObject,
  deleteOneDelegationMutationObject,
  findFirstDelegationQueryObject,
  findManyDelegationQueryObject,
  findUniqueDelegationQueryObject,
  updateOneDelegationMutationObject,
} from "../../../prisma/generated/graphql/Delegation";
import { builder } from "./builder";

builder.prismaObject("Delegation", {
  fields: (t) => ({
    id: t.field(DelegationIdFieldObject),
    conference: t.relation("conference"),
    nation: t.relation("nation"),
    members: t.relation("members", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").CommitteeMember,
      }),
    }),
  }),
});

builder.queryFields((t) => {
  const field = findManyDelegationQueryObject(t);
  return {
    findManyDelegations: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").Delegation],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findFirstDelegationQueryObject(t);
  return {
    findFirstDelegation: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").Delegation],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findUniqueDelegationQueryObject(t);
  return {
    findUniqueDelegation: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").Delegation],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = createOneDelegationMutationObject(t);
  return {
    createOneDelegation: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        ctx.permissions.checkIf((user) => user.can("create", "Delegation"));
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = updateOneDelegationMutationObject(t);
  return {
    updateOneDelegation: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("update").Delegation],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = deleteOneDelegationMutationObject(t);
  return {
    deleteOneDelegation: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("delete").Delegation],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});
