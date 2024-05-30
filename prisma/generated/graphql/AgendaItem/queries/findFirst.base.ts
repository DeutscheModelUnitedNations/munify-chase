import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryPrismaObject,
} from "../../utils";

export const findFirstAgendaItemQueryArgs = builder.args((t) => ({
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

export const findFirstAgendaItemQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: "AgendaItem",
    nullable: true,
    args: findFirstAgendaItemQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.agendaItem.findFirst({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
        ...query,
      }),
  }),
);

export const findFirstAgendaItemQuery = defineQuery((t) => ({
  findFirstAgendaItem: t.prismaField(findFirstAgendaItemQueryObject(t)),
}));
