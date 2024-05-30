import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const deleteOneSpeakerOnListMutationArgs = builder.args((t) => ({
  where: t.field({
    type: Inputs.SpeakerOnListWhereUniqueInput,
    required: true,
  }),
}));

export const deleteOneSpeakerOnListMutationObject = defineMutationFunction(
  (t) =>
    defineMutationPrismaObject({
      type: "SpeakerOnList",
      nullable: true,
      args: deleteOneSpeakerOnListMutationArgs,
      resolve: async (query, _root, args, _context, _info) =>
        await db.speakerOnList.delete({ where: args.where, ...query }),
    }),
);

export const deleteOneSpeakerOnListMutation = defineMutation((t) => ({
  deleteOneSpeakerOnList: t.prismaField(
    deleteOneSpeakerOnListMutationObject(t),
  ),
}));
