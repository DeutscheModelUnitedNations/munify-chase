import {
  EmailIdFieldObject,
  EmailEmailFieldObject,
  EmailValidatedFieldObject,
  createOneEmailMutationObject,
  deleteOneEmailMutationObject,
  findFirstEmailQueryObject,
  findManyEmailQueryObject,
  findUniqueEmailQueryObject,
  updateOneEmailMutationObject,
} from "../../prisma/generated/graphql/Email";
import { builder } from "./builder";

builder.prismaObject("Email", {
  fields: (t) => ({
    id: t.field(EmailIdFieldObject),
    email: t.field(EmailEmailFieldObject),
    validated: t.field(EmailValidatedFieldObject),
    user: t.relation("user"),
  }),
});

builder.queryFields((t) => {
  const field = findManyEmailQueryObject(t);
  return {
    findManyEmails: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").Email],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findFirstEmailQueryObject(t);
  return {
    findFirstEmail: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").Email],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findUniqueEmailQueryObject(t);
  return {
    findUniqueEmail: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").Email],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = createOneEmailMutationObject(t);
  return {
    createOneEmail: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        ctx.permissions.checkIf((user) => user.can("create", "Email"));
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = updateOneEmailMutationObject(t);
  return {
    updateOneEmail: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("update").Email],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = deleteOneEmailMutationObject(t);
  return {
    deleteOneEmail: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("delete").Email],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});