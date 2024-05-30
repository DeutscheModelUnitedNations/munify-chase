import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryObject,
} from "../../utils";

export const countMessageQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.MessageWhereInput, required: false }),
  orderBy: t.field({
    type: [Inputs.MessageOrderByWithRelationInput],
    required: false,
  }),
  cursor: t.field({ type: Inputs.MessageWhereUniqueInput, required: false }),
  take: t.field({ type: "Int", required: false }),
  skip: t.field({ type: "Int", required: false }),
  distinct: t.field({ type: [Inputs.MessageScalarFieldEnum], required: false }),
}));

export const countMessageQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: "Int",
    nullable: false,
    args: countMessageQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.message.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countMessageQuery = defineQuery((t) => ({
  countMessage: t.field(countMessageQueryObject(t)),
}));
