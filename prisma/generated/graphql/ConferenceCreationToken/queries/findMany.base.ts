import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryPrismaObject,
} from "../../utils";

export const findManyConferenceCreationTokenQueryArgs = builder.args((t) => ({
  where: t.field({
    type: Inputs.ConferenceCreationTokenWhereInput,
    required: false,
  }),
  orderBy: t.field({
    type: [Inputs.ConferenceCreationTokenOrderByWithRelationInput],
    required: false,
  }),
  cursor: t.field({
    type: Inputs.ConferenceCreationTokenWhereUniqueInput,
    required: false,
  }),
  take: t.field({ type: "Int", required: false }),
  skip: t.field({ type: "Int", required: false }),
  distinct: t.field({
    type: [Inputs.ConferenceCreationTokenScalarFieldEnum],
    required: false,
  }),
}));

export const findManyConferenceCreationTokenQueryObject = defineQueryFunction(
  (t) =>
    defineQueryPrismaObject({
      type: ["ConferenceCreationToken"],
      nullable: false,
      args: findManyConferenceCreationTokenQueryArgs,
      resolve: async (query, _root, args, _context, _info) =>
        await db.conferenceCreationToken.findMany({
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

export const findManyConferenceCreationTokenQuery = defineQuery((t) => ({
  findManyConferenceCreationToken: t.prismaField(
    findManyConferenceCreationTokenQueryObject(t),
  ),
}));
