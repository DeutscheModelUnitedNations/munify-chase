import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryObject,
} from "../../utils";

export const countAgendaItemQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.AgendaItemWhereInput, required: false }),
  orderBy: t.field({
    type: [Inputs.AgendaItemOrderByWithRelationInput],
    required: false,
  }),
  cursor: t.field({ type: Inputs.AgendaItemWhereUniqueInput, required: false }),
  take: t.field({ type: "Int", required: false }),
  skip: t.field({ type: "Int", required: false }),
  distinct: t.field({
    type: [Inputs.AgendaItemScalarFieldEnum],
    required: false,
  }),
}));

export const countAgendaItemQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: "Int",
    nullable: false,
    args: countAgendaItemQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.agendaItem.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countAgendaItemQuery = defineQuery((t) => ({
  countAgendaItem: t.field(countAgendaItemQueryObject(t)),
}));
