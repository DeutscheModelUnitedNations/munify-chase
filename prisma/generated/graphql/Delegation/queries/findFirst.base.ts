import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryPrismaObject,
} from "../../utils";

export const findFirstDelegationQueryArgs = builder.args((t) => ({
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

export const findFirstDelegationQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: "Delegation",
    nullable: true,
    args: findFirstDelegationQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.delegation.findFirst({
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

export const findFirstDelegationQuery = defineQuery((t) => ({
  findFirstDelegation: t.prismaField(findFirstDelegationQueryObject(t)),
}));
