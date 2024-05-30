import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryObject,
} from "../../utils";

export const countCommitteeQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CommitteeWhereInput, required: false }),
  orderBy: t.field({
    type: [Inputs.CommitteeOrderByWithRelationInput],
    required: false,
  }),
  cursor: t.field({ type: Inputs.CommitteeWhereUniqueInput, required: false }),
  take: t.field({ type: "Int", required: false }),
  skip: t.field({ type: "Int", required: false }),
  distinct: t.field({
    type: [Inputs.CommitteeScalarFieldEnum],
    required: false,
  }),
}));

export const countCommitteeQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: "Int",
    nullable: false,
    args: countCommitteeQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.committee.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countCommitteeQuery = defineQuery((t) => ({
  countCommittee: t.field(countCommitteeQueryObject(t)),
}));
