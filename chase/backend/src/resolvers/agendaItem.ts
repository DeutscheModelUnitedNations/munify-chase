import {
  AgendaItemDescriptionFieldObject,
  AgendaItemIdFieldObject,
  AgendaItemIsActiveFieldObject,
  AgendaItemTitleFieldObject,
  createOneAgendaItemMutationObject,
  deleteOneAgendaItemMutationObject,
  findFirstAgendaItemQueryObject,
  findManyAgendaItemQueryObject,
  findUniqueAgendaItemQueryObject,
  updateOneAgendaItemMutationObject,
} from "../../prisma/generated/graphql/AgendaItem";
import { builder } from "./builder";

builder.prismaObject("AgendaItem", {
  fields: (t) => ({
    id: t.field(AgendaItemIdFieldObject),
    committee: t.relation("committee"),
    title: t.field(AgendaItemTitleFieldObject),
    description: t.field(AgendaItemDescriptionFieldObject),
    speakerLists: t.relation("speakerLists", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").SpeakersList,
      }),
    }),
    isActive: t.field(AgendaItemIsActiveFieldObject),
  }),
});

builder.queryFields((t) => {
  const field = findManyAgendaItemQueryObject(t);
  return {
    findManyAgendaItems: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").AgendaItem],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findFirstAgendaItemQueryObject(t);
  return {
    findFirstAgendaItem: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").AgendaItem],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findUniqueAgendaItemQueryObject(t);
  return {
    findUniqueAgendaItem: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").AgendaItem],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = createOneAgendaItemMutationObject(t);
  return {
    createOneAgendaItem: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        ctx.permissions.checkIf((user) => user.can("create", "AgendaItem"));
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = updateOneAgendaItemMutationObject(t);
  return {
    updateOneAgendaItem: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("update").AgendaItem],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = deleteOneAgendaItemMutationObject(t);
  return {
    deleteOneAgendaItem: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("delete").AgendaItem],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});
