import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const createManySpeakersListMutationArgs = builder.args((t) => ({
  data: t.field({ type: [Inputs.SpeakersListCreateInput], required: true }),
}));

export const createManySpeakersListMutationObject = defineMutationFunction(
  (t) =>
    defineMutationPrismaObject({
      type: ["SpeakersList"],
      nullable: false,
      args: createManySpeakersListMutationArgs,
      resolve: async (_query, _root, args, _context, _info) =>
        await db.$transaction(
          args.data.map((data) => db.speakersList.create({ data })),
        ),
    }),
);

export const createManySpeakersListMutation = defineMutation((t) => ({
  createManySpeakersList: t.prismaField(
    createManySpeakersListMutationObject(t),
  ),
}));
