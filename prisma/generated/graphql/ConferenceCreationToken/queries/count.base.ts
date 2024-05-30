import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryObject,
} from "../../utils";

export const countConferenceCreationTokenQueryArgs = builder.args((t) => ({
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

export const countConferenceCreationTokenQueryObject = defineQueryFunction(
  (t) =>
    defineQueryObject({
      type: "Int",
      nullable: false,
      args: countConferenceCreationTokenQueryArgs,
      resolve: async (_root, args, _context, _info) =>
        await db.conferenceCreationToken.count({
          where: args.where || undefined,
          cursor: args.cursor || undefined,
          take: args.take || undefined,
          skip: args.skip || undefined,
          orderBy: args.orderBy || undefined,
        }),
    }),
);

export const countConferenceCreationTokenQuery = defineQuery((t) => ({
  countConferenceCreationToken: t.field(
    countConferenceCreationTokenQueryObject(t),
  ),
}));
