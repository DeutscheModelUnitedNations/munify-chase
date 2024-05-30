import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryObject,
} from "../../utils";

export const countConferenceMemberQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.ConferenceMemberWhereInput, required: false }),
  orderBy: t.field({
    type: [Inputs.ConferenceMemberOrderByWithRelationInput],
    required: false,
  }),
  cursor: t.field({
    type: Inputs.ConferenceMemberWhereUniqueInput,
    required: false,
  }),
  take: t.field({ type: "Int", required: false }),
  skip: t.field({ type: "Int", required: false }),
  distinct: t.field({
    type: [Inputs.ConferenceMemberScalarFieldEnum],
    required: false,
  }),
}));

export const countConferenceMemberQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: "Int",
    nullable: false,
    args: countConferenceMemberQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.conferenceMember.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countConferenceMemberQuery = defineQuery((t) => ({
  countConferenceMember: t.field(countConferenceMemberQueryObject(t)),
}));
