import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const createManyAgendaItemMutationArgs = builder.args((t) => ({
  data: t.field({ type: [Inputs.AgendaItemCreateInput], required: true }),
}));

export const createManyAgendaItemMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ["AgendaItem"],
    nullable: false,
    args: createManyAgendaItemMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await db.$transaction(
        args.data.map((data) => db.agendaItem.create({ data })),
      ),
  }),
);

export const createManyAgendaItemMutation = defineMutation((t) => ({
  createManyAgendaItem: t.prismaField(createManyAgendaItemMutationObject(t)),
}));
