import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryObject,
} from "../../utils";

export const countSpeakerOnListQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SpeakerOnListWhereInput, required: false }),
  orderBy: t.field({
    type: [Inputs.SpeakerOnListOrderByWithRelationInput],
    required: false,
  }),
  cursor: t.field({
    type: Inputs.SpeakerOnListWhereUniqueInput,
    required: false,
  }),
  take: t.field({ type: "Int", required: false }),
  skip: t.field({ type: "Int", required: false }),
  distinct: t.field({
    type: [Inputs.SpeakerOnListScalarFieldEnum],
    required: false,
  }),
}));

export const countSpeakerOnListQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: "Int",
    nullable: false,
    args: countSpeakerOnListQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.speakerOnList.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countSpeakerOnListQuery = defineQuery((t) => ({
  countSpeakerOnList: t.field(countSpeakerOnListQueryObject(t)),
}));
