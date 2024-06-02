import {
  SpeakerOnListIdFieldObject,
  SpeakerOnListPositionFieldObject,
  createOneSpeakerOnListMutationObject,
  deleteOneSpeakerOnListMutationObject,
  findFirstSpeakerOnListQueryObject,
  findManySpeakerOnListQueryObject,
  findUniqueSpeakerOnListQueryObject,
  updateOneSpeakerOnListMutationObject,
} from "../../../prisma/generated/graphql/SpeakerOnList";
import { builder } from "./builder";

builder.prismaObject("SpeakerOnList", {
  fields: (t) => ({
    id: t.field(SpeakerOnListIdFieldObject),
    speakersList: t.relation("speakersList"),
    committeeMember: t.relation("committeeMember"),
    position: t.field(SpeakerOnListPositionFieldObject),
  }),
});

builder.queryFields((t) => {
  const field = findManySpeakerOnListQueryObject(t);
  return {
    findManySpeakerOnLists: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").SpeakerOnList],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findFirstSpeakerOnListQueryObject(t);
  return {
    findFirstSpeakerOnList: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").SpeakerOnList],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findUniqueSpeakerOnListQueryObject(t);
  return {
    findUniqueSpeakerOnList: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").SpeakerOnList],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = createOneSpeakerOnListMutationObject(t);
  return {
    createOneSpeakerOnList: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        ctx.permissions.checkIf((user) => user.can("create", "SpeakerOnList"));
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = updateOneSpeakerOnListMutationObject(t);
  return {
    updateOneSpeakerOnList: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("update").SpeakerOnList],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = deleteOneSpeakerOnListMutationObject(t);
  return {
    deleteOneSpeakerOnList: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("delete").SpeakerOnList],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});
