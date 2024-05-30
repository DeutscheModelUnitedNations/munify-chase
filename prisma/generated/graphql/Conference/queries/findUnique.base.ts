import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryPrismaObject,
} from "../../utils";

export const findUniqueConferenceQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.ConferenceWhereUniqueInput, required: true }),
}));

export const findUniqueConferenceQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: "Conference",
    nullable: true,
    args: findUniqueConferenceQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.conference.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueConferenceQuery = defineQuery((t) => ({
  findUniqueConference: t.prismaField(findUniqueConferenceQueryObject(t)),
}));
