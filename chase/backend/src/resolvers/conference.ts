import {
  ConferenceCommitteesFieldObject,
  ConferenceDelegationsFieldObject,
  ConferenceEndFieldObject,
  ConferenceFeedbackWebsiteFieldObject,
  ConferenceIdFieldObject,
  ConferenceNameFieldObject,
  ConferencePressWebsiteFieldObject,
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
    id: t.field(ConferenceIdFieldObject),
    name: t.field(ConferenceNameFieldObject),
    start: t.field(ConferenceStartFieldObject),
    end: t.field(ConferenceEndFieldObject),
    pressWebsite: t.field(ConferencePressWebsiteFieldObject),
    feedbackWebsite: t.field(ConferenceFeedbackWebsiteFieldObject),
    committees: t.relation("committees", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").Committee,
      }),
    }),
    delegations: t.relation("delegations", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").Delegation,
      }),
    }),
    members: t.relation("members", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").ConferenceMember,
      }),
    }),
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
