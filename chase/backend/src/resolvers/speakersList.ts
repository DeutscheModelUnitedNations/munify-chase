import {
  SpeakersListIdFieldObject,
  SpeakersListTypeFieldObject,
  SpeakersListSpeakingTimeFieldObject,
  SpeakersListTimeLeftFieldObject,
  SpeakersListStartTimestampFieldObject,
  SpeakersListIsClosedFieldObject,
  createOneSpeakersListMutationObject,
  deleteOneSpeakersListMutationObject,
  findFirstSpeakersListQueryObject,
  findManySpeakersListQueryObject,
  findUniqueSpeakersListQueryObject,
  updateOneSpeakersListMutationObject,
} from "../../prisma/generated/graphql/SpeakersList";
import { builder } from "./builder";

builder.prismaObject("SpeakersList", {
  fields: (t) => ({
    id: t.field(SpeakersListIdFieldObject),
    agendaItem: t.relation("agendaItem"),
    type: t.field(SpeakersListTypeFieldObject),
    speakers: t.relation("speakers", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").SpeakerOnList,
      }),
    }),
    speakingTime: t.field(SpeakersListSpeakingTimeFieldObject),
    timeLeft: t.field(SpeakersListTimeLeftFieldObject),
    startTimestamp: t.field(SpeakersListStartTimestampFieldObject),
    isClosed: t.field(SpeakersListIsClosedFieldObject),
  }),
});

builder.queryFields((t) => {
  const field = findManySpeakersListQueryObject(t);
  return {
    findManySpeakersLists: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").SpeakersList],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findFirstSpeakersListQueryObject(t);
  return {
    findFirstSpeakersList: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").SpeakersList],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findUniqueSpeakersListQueryObject(t);
  return {
    findUniqueSpeakersList: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").SpeakersList],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = createOneSpeakersListMutationObject(t);
  return {
    createOneSpeakersList: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        ctx.permissions.checkIf((user) => user.can("create", "SpeakersList"));
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = updateOneSpeakersListMutationObject(t);
  return {
    updateOneSpeakersList: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("update").SpeakersList],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = deleteOneSpeakersListMutationObject(t);
  return {
    deleteOneSpeakersList: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("delete").SpeakersList],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});