import * as Inputs from "../../inputs";
import { BatchPayload } from "../../objects";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationObject,
} from "../../utils";

export const deleteManyAgendaItemMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.AgendaItemWhereInput, required: true }),
}));

export const deleteManyAgendaItemMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManyAgendaItemMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.agendaItem.deleteMany({ where: args.where }),
  }),
);

export const deleteManyAgendaItemMutation = defineMutation((t) => ({
  deleteManyAgendaItem: t.field(deleteManyAgendaItemMutationObject(t)),
}));
