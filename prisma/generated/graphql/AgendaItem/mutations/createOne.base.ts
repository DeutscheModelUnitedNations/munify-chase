import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const createOneAgendaItemMutationArgs = builder.args((t) => ({
  data: t.field({ type: Inputs.AgendaItemCreateInput, required: true }),
}));

export const createOneAgendaItemMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: "AgendaItem",
    nullable: false,
    args: createOneAgendaItemMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.agendaItem.create({ data: args.data, ...query }),
  }),
);

export const createOneAgendaItemMutation = defineMutation((t) => ({
  createOneAgendaItem: t.prismaField(createOneAgendaItemMutationObject(t)),
}));
