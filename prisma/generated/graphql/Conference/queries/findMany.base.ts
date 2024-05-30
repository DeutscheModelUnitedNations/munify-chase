import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryPrismaObject,
} from "../../utils";

export const findManyConferenceQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.ConferenceWhereInput, required: false }),
  orderBy: t.field({
    type: [Inputs.ConferenceOrderByWithRelationInput],
    required: false,
  }),
  cursor: t.field({ type: Inputs.ConferenceWhereUniqueInput, required: false }),
  take: t.field({ type: "Int", required: false }),
  skip: t.field({ type: "Int", required: false }),
  distinct: t.field({
    type: [Inputs.ConferenceScalarFieldEnum],
    required: false,
  }),
}));

export const findManyConferenceQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ["Conference"],
    nullable: false,
    args: findManyConferenceQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.conference.findMany({
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

export const findManyConferenceQuery = defineQuery((t) => ({
  findManyConference: t.prismaField(findManyConferenceQueryObject(t)),
}));
