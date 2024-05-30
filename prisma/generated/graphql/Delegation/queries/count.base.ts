import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryObject,
} from "../../utils";

export const countDelegationQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.DelegationWhereInput, required: false }),
  orderBy: t.field({
    type: [Inputs.DelegationOrderByWithRelationInput],
    required: false,
  }),
  cursor: t.field({ type: Inputs.DelegationWhereUniqueInput, required: false }),
  take: t.field({ type: "Int", required: false }),
  skip: t.field({ type: "Int", required: false }),
  distinct: t.field({
    type: [Inputs.DelegationScalarFieldEnum],
    required: false,
  }),
}));

export const countDelegationQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: "Int",
    nullable: false,
    args: countDelegationQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.delegation.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countDelegationQuery = defineQuery((t) => ({
  countDelegation: t.field(countDelegationQueryObject(t)),
}));
