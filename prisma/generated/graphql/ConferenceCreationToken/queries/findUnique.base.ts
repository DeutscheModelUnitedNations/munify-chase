import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryPrismaObject,
} from "../../utils";

export const findUniqueConferenceCreationTokenQueryArgs = builder.args((t) => ({
  where: t.field({
    type: Inputs.ConferenceCreationTokenWhereUniqueInput,
    required: true,
  }),
}));

export const findUniqueConferenceCreationTokenQueryObject = defineQueryFunction(
  (t) =>
    defineQueryPrismaObject({
      type: "ConferenceCreationToken",
      nullable: true,
      args: findUniqueConferenceCreationTokenQueryArgs,
      resolve: async (query, _root, args, _context, _info) =>
        await db.conferenceCreationToken.findUnique({
          where: args.where,
          ...query,
        }),
    }),
);

export const findUniqueConferenceCreationTokenQuery = defineQuery((t) => ({
  findUniqueConferenceCreationToken: t.prismaField(
    findUniqueConferenceCreationTokenQueryObject(t),
  ),
}));
