import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const updateOneSpeakerOnListMutationArgs = builder.args((t) => ({
  where: t.field({
    type: Inputs.SpeakerOnListWhereUniqueInput,
    required: true,
  }),
  data: t.field({ type: Inputs.SpeakerOnListUpdateInput, required: true }),
}));

export const updateOneSpeakerOnListMutationObject = defineMutationFunction(
  (t) =>
    defineMutationPrismaObject({
      type: "SpeakerOnList",
      nullable: true,
      args: updateOneSpeakerOnListMutationArgs,
      resolve: async (query, _root, args, _context, _info) =>
        await db.speakerOnList.update({
          where: args.where,
          data: args.data,
          ...query,
        }),
    }),
);

export const updateOneSpeakerOnListMutation = defineMutation((t) => ({
  updateOneSpeakerOnList: t.prismaField(
    updateOneSpeakerOnListMutationObject(t),
  ),
}));
