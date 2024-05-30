import * as Inputs from "../../inputs";
import { BatchPayload } from "../../objects";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationObject,
} from "../../utils";

export const updateManyConferenceMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.ConferenceWhereInput, required: false }),
  data: t.field({
    type: Inputs.ConferenceUpdateManyMutationInput,
    required: true,
  }),
}));

export const updateManyConferenceMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManyConferenceMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.conference.updateMany({
        where: args.where || undefined,
        data: args.data,
      }),
  }),
);

export const updateManyConferenceMutation = defineMutation((t) => ({
  updateManyConference: t.field(updateManyConferenceMutationObject(t)),
}));
