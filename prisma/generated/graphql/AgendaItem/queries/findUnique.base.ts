import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryPrismaObject,
} from "../../utils";

export const findUniqueAgendaItemQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.AgendaItemWhereUniqueInput, required: true }),
}));

export const findUniqueAgendaItemQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: "AgendaItem",
    nullable: true,
    args: findUniqueAgendaItemQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.agendaItem.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueAgendaItemQuery = defineQuery((t) => ({
  findUniqueAgendaItem: t.prismaField(findUniqueAgendaItemQueryObject(t)),
}));
