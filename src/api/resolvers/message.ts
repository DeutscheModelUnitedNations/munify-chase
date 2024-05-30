import {
  MessageIdFieldObject,
  MessageSubjectFieldObject,
  MessageCategoryFieldObject,
  MessageMessageFieldObject,
  MessageTimestampFieldObject,
  MessageStatusFieldObject,
  MessageForwardedFieldObject,
  MessageMetaEmailFieldObject,
  MessageMetaDelegationFieldObject,
  MessageMetaCommitteeFieldObject,
  MessageMetaAgendaItemFieldObject,
  createOneMessageMutationObject,
  deleteOneMessageMutationObject,
  findFirstMessageQueryObject,
  findManyMessageQueryObject,
  findUniqueMessageQueryObject,
  updateOneMessageMutationObject,
} from "chase-backend/prisma/generated/graphql/Message";
import { builder } from "./builder";

builder.prismaObject("Message", {
  fields: (t) => ({
    id: t.field(MessageIdFieldObject),
    subject: t.field(MessageSubjectFieldObject),
    category: t.field(MessageCategoryFieldObject),
    message: t.field(MessageMessageFieldObject),
    committee: t.relation("committee"),
    author: t.relation("author"),
    timestamp: t.field(MessageTimestampFieldObject),
    status: t.field(MessageStatusFieldObject),
    forwarded: t.field(MessageForwardedFieldObject),
    metaEmail: t.field(MessageMetaEmailFieldObject),
    metaDelegation: t.field(MessageMetaDelegationFieldObject),
    metaCommittee: t.field(MessageMetaCommitteeFieldObject),
    metaAgendaItem: t.field(MessageMetaAgendaItemFieldObject),
  }),
});

builder.queryFields((t) => {
  const field = findManyMessageQueryObject(t);
  return {
    findManyMessages: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").Message],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findFirstMessageQueryObject(t);
  return {
    findFirstMessage: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").Message],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findUniqueMessageQueryObject(t);
  return {
    findUniqueMessage: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").Message],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = createOneMessageMutationObject(t);
  return {
    createOneMessage: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        ctx.permissions.checkIf((user) => user.can("create", "Message"));
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = updateOneMessageMutationObject(t);
  return {
    updateOneMessage: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("update").Message],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = deleteOneMessageMutationObject(t);
  return {
    deleteOneMessage: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("delete").Message],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});
