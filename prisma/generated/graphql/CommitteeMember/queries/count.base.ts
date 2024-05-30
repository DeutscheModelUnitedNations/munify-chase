import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryObject,
} from "../../utils";

export const countCommitteeMemberQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CommitteeMemberWhereInput, required: false }),
  orderBy: t.field({
    type: [Inputs.CommitteeMemberOrderByWithRelationInput],
    required: false,
  }),
  cursor: t.field({
    type: Inputs.CommitteeMemberWhereUniqueInput,
    required: false,
  }),
  take: t.field({ type: "Int", required: false }),
  skip: t.field({ type: "Int", required: false }),
  distinct: t.field({
    type: [Inputs.CommitteeMemberScalarFieldEnum],
    required: false,
  }),
}));

export const countCommitteeMemberQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: "Int",
    nullable: false,
    args: countCommitteeMemberQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.committeeMember.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countCommitteeMemberQuery = defineQuery((t) => ({
  countCommitteeMember: t.field(countCommitteeMemberQueryObject(t)),
}));
