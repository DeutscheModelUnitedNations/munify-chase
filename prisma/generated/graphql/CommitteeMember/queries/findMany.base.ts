import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryPrismaObject,
} from "../../utils";

export const findManyCommitteeMemberQueryArgs = builder.args((t) => ({
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

export const findManyCommitteeMemberQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ["CommitteeMember"],
    nullable: false,
    args: findManyCommitteeMemberQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.committeeMember.findMany({
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

export const findManyCommitteeMemberQuery = defineQuery((t) => ({
  findManyCommitteeMember: t.prismaField(findManyCommitteeMemberQueryObject(t)),
}));
