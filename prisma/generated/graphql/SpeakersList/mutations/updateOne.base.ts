import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const updateOneSpeakersListMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SpeakersListWhereUniqueInput, required: true }),
  data: t.field({ type: Inputs.SpeakersListUpdateInput, required: true }),
}));

export const updateOneSpeakersListMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: "SpeakersList",
    nullable: true,
    args: updateOneSpeakersListMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.speakersList.update({
        where: args.where,
        data: args.data,
        ...query,
      }),
  }),
);

export const updateOneSpeakersListMutation = defineMutation((t) => ({
  updateOneSpeakersList: t.prismaField(updateOneSpeakersListMutationObject(t)),
}));
