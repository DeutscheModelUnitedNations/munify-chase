import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const upsertOneConferenceMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.ConferenceWhereUniqueInput, required: true }),
  create: t.field({ type: Inputs.ConferenceCreateInput, required: true }),
  update: t.field({ type: Inputs.ConferenceUpdateInput, required: true }),
}));

export const upsertOneConferenceMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: "Conference",
    nullable: false,
    args: upsertOneConferenceMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.conference.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneConferenceMutation = defineMutation((t) => ({
  upsertOneConference: t.prismaField(upsertOneConferenceMutationObject(t)),
}));
