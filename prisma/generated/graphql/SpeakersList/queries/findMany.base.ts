import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryPrismaObject,
} from "../../utils";

export const findManySpeakersListQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SpeakersListWhereInput, required: false }),
  orderBy: t.field({
    type: [Inputs.SpeakersListOrderByWithRelationInput],
    required: false,
  }),
  cursor: t.field({
    type: Inputs.SpeakersListWhereUniqueInput,
    required: false,
  }),
  take: t.field({ type: "Int", required: false }),
  skip: t.field({ type: "Int", required: false }),
  distinct: t.field({
    type: [Inputs.SpeakersListScalarFieldEnum],
    required: false,
  }),
}));

export const findManySpeakersListQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ["SpeakersList"],
    nullable: false,
    args: findManySpeakersListQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.speakersList.findMany({
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

export const findManySpeakersListQuery = defineQuery((t) => ({
  findManySpeakersList: t.prismaField(findManySpeakersListQueryObject(t)),
}));
