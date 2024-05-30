import * as Inputs from "../../inputs";
import { BatchPayload } from "../../objects";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationObject,
} from "../../utils";

export const deleteManyConferenceMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.ConferenceWhereInput, required: true }),
}));

export const deleteManyConferenceMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManyConferenceMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.conference.deleteMany({ where: args.where }),
  }),
);

export const deleteManyConferenceMutation = defineMutation((t) => ({
  deleteManyConference: t.field(deleteManyConferenceMutationObject(t)),
}));
