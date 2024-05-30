import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryPrismaObject,
} from "../../utils";

export const findFirstConferenceMemberQueryArgs = builder.args((t) => ({
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

export const findFirstConferenceMemberQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: "ConferenceMember",
    nullable: true,
    args: findFirstConferenceMemberQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.conferenceMember.findFirst({
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

export const findFirstConferenceMemberQuery = defineQuery((t) => ({
  findFirstConferenceMember: t.prismaField(
    findFirstConferenceMemberQueryObject(t),
  ),
}));
