import * as Inputs from "../../inputs";
import { BatchPayload } from "../../objects";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationObject,
} from "../../utils";

export const updateManySpeakersListMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SpeakersListWhereInput, required: false }),
  data: t.field({
    type: Inputs.SpeakersListUpdateManyMutationInput,
    required: true,
  }),
}));

export const updateManySpeakersListMutationObject = defineMutationFunction(
  (t) =>
    defineMutationObject({
      type: BatchPayload,
      nullable: false,
      args: updateManySpeakersListMutationArgs,
      resolve: async (_root, args, _context, _info) =>
        await db.speakersList.updateMany({
          where: args.where || undefined,
          data: args.data,
        }),
    }),
);

export const updateManySpeakersListMutation = defineMutation((t) => ({
  updateManySpeakersList: t.field(updateManySpeakersListMutationObject(t)),
}));
