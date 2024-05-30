import { db } from "chase-backend/prisma/db";
import {
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
} from "chase-backend/prisma/generated/graphql/Conference";
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
      args: { ...field.args, token: t.arg.string({ required: true }) },
      resolve: async (query, root, args, ctx, info) => {
        ctx.permissions.checkIf((user) => user.can("create", "Conference"));

        await db.conferenceCreationToken.delete({
          where: { token: args.token },
        });

        const ret = await field.resolve(query, root, args, ctx, info);

        await db.conferenceMember.create({
          data: {
            role: "ADMIN",
            conference: { connect: { id: ret.id } },
            // biome-ignore lint/style/noNonNullAssertion: we checked the permissions earlier, the user must exist
            user: { connect: { id: ctx.intro.user!.id } },
          },
        });

        return ret;
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
