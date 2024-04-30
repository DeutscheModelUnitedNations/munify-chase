import { builder } from "../../builder";
import {
  createOneCommitteeMutationObject,
  deleteOneCommitteeMutationObject,
  findManyCommitteeQueryObject,
  findUniqueCommitteeQueryObject,
  updateOneCommitteeMutationObject,
} from "../../prisma/generated/graphql/pothosCrud/Committee";

builder.queryFields((t) => {
  const field = findManyCommitteeQueryObject(t);
  return {
    findManyCommittees: t.prismaField({
      ...field,
      resolve: async (query, root, args, context, info) => {
        args.where = {
          ...args.where,
          AND: [context.permissions.allowDatabaseAccessTo("list").Committee],
        };
        return field.resolve(query, root, args, context, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findUniqueCommitteeQueryObject(t);
  return {
    findUniqueCommittee: t.prismaField({
      ...field,
      resolve: async (query, root, args, context, info) => {
        args.where = {
          ...args.where,
          AND: [context.permissions.allowDatabaseAccessTo().Committee],
        };
        return field.resolve(query, root, args, context, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = createOneCommitteeMutationObject(t);
  return {
    createCommittee: t.prismaField({
      ...field,
      resolve: async (query, root, args, context, info) => {
        context.permissions.checkIf((user) => user.can("create", "Committee"));
        return field.resolve(query, root, args, context, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = updateOneCommitteeMutationObject(t);
  return {
    updateCommittee: t.prismaField({
      ...field,
      resolve: async (query, root, args, context, info) => {
        args.where = {
          ...args.where,
          AND: [context.permissions.allowDatabaseAccessTo("update").Committee],
        };
        return field.resolve(query, root, args, context, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = deleteOneCommitteeMutationObject(t);
  return {
    deleteCommittee: t.prismaField({
      ...field,
      resolve: async (query, root, args, context, info) => {
        args.where = {
          ...args.where,
          AND: [context.permissions.allowDatabaseAccessTo("delete").Committee],
        };
        return field.resolve(query, root, args, context, info);
      },
    }),
  };
});
