import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryPrismaObject,
} from "../../utils";

export const findManyConferenceMemberQueryArgs = builder.args((t) => ({
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

export const findManyConferenceMemberQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ["ConferenceMember"],
    nullable: false,
    args: findManyConferenceMemberQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.conferenceMember.findMany({
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

export const findManyConferenceMemberQuery = defineQuery((t) => ({
  findManyConferenceMember: t.prismaField(
    findManyConferenceMemberQueryObject(t),
  ),
}));
