import {
  NationIdFieldObject,
  NationAlpha3CodeFieldObject,
  NationVariantFieldObject,
  createOneNationMutationObject,
  deleteOneNationMutationObject,
  findFirstNationQueryObject,
  findManyNationQueryObject,
  findUniqueNationQueryObject,
  updateOneNationMutationObject,
} from "../../prisma/generated/graphql/Nation";
import { builder } from "./builder";

builder.prismaObject("Nation", {
  fields: (t) => ({
    id: t.field(NationIdFieldObject),
    alpha3Code: t.field(NationAlpha3CodeFieldObject),
    variant: t.field(NationVariantFieldObject),
    delegations: t.relation("delegations", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").Delegation,
      }),
    }),
  }),
});

builder.queryFields((t) => {
  const field = findManyNationQueryObject(t);
  return {
    findManyNations: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").Nation],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findFirstNationQueryObject(t);
  return {
    findFirstNation: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").Nation],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findUniqueNationQueryObject(t);
  return {
    findUniqueNation: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").Nation],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = createOneNationMutationObject(t);
  return {
    createOneNation: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        ctx.permissions.checkIf((user) => user.can("create", "Nation"));
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = updateOneNationMutationObject(t);
  return {
    updateOneNation: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("update").Nation],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = deleteOneNationMutationObject(t);
  return {
    deleteOneNation: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("delete").Nation],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});
