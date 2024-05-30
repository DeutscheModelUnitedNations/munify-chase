import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const upsertOneAgendaItemMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.AgendaItemWhereUniqueInput, required: true }),
  create: t.field({ type: Inputs.AgendaItemCreateInput, required: true }),
  update: t.field({ type: Inputs.AgendaItemUpdateInput, required: true }),
}));

export const upsertOneAgendaItemMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: "AgendaItem",
    nullable: false,
    args: upsertOneAgendaItemMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.agendaItem.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneAgendaItemMutation = defineMutation((t) => ({
  upsertOneAgendaItem: t.prismaField(upsertOneAgendaItemMutationObject(t)),
}));
