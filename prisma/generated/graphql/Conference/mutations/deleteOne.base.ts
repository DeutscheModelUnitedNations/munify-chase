import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const deleteOneConferenceMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.ConferenceWhereUniqueInput, required: true }),
}));

export const deleteOneConferenceMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: "Conference",
    nullable: true,
    args: deleteOneConferenceMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.conference.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneConferenceMutation = defineMutation((t) => ({
  deleteOneConference: t.prismaField(deleteOneConferenceMutationObject(t)),
}));
