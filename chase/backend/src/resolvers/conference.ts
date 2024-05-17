import {
  ConferenceStartFieldObject,
  createOneConferenceMutationObject,
  deleteOneConferenceMutationObject,
  findFirstConferenceQueryObject,
  findManyConferenceQueryObject,
  findUniqueConferenceQueryObject,
  updateOneConferenceMutationObject,
} from "../../prisma/generated/graphql/Conference";
import { builder } from "./builder";

builder.prismaObject("Conference", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    start: t.field(ConferenceStartFieldObject),
    end: t.field(ConferenceStartFieldObject),
    committees: t.relation("committees", {
      query: (args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").Committee,
      }),
    }),
    // delegations Delegation[]
    // members     ConferenceMember[]
    // committees  Committee[]
  }),
});

builder.queryFields((t) => {
  const field = findManyConferenceQueryObject(t);
  return {
    findManyConferences: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").Conference],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findFirstConferenceQueryObject(t);
  return {
    findFirstConference: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").Conference],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findUniqueConferenceQueryObject(t);
  return {
    findUniqueConference: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").Conference],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = createOneConferenceMutationObject(t);
  return {
    createOneConference: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        ctx.permissions.checkIf((user) => user.can("create", "Conference"));
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = updateOneConferenceMutationObject(t);
  return {
    updateOneConference: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("update").Conference],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = deleteOneConferenceMutationObject(t);
  return {
    deleteOneConference: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("delete").Conference],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});
