import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const upsertOneSpeakerOnListMutationArgs = builder.args((t) => ({
  where: t.field({
    type: Inputs.SpeakerOnListWhereUniqueInput,
    required: true,
  }),
  create: t.field({ type: Inputs.SpeakerOnListCreateInput, required: true }),
  update: t.field({ type: Inputs.SpeakerOnListUpdateInput, required: true }),
}));

export const upsertOneSpeakerOnListMutationObject = defineMutationFunction(
  (t) =>
    defineMutationPrismaObject({
      type: "SpeakerOnList",
      nullable: false,
      args: upsertOneSpeakerOnListMutationArgs,
      resolve: async (query, _root, args, _context, _info) =>
        await db.speakerOnList.upsert({
          where: args.where,
          create: args.create,
          update: args.update,
          ...query,
        }),
    }),
);

export const upsertOneSpeakerOnListMutation = defineMutation((t) => ({
  upsertOneSpeakerOnList: t.prismaField(
    upsertOneSpeakerOnListMutationObject(t),
  ),
}));
