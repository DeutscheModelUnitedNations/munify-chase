import * as Inputs from "../../inputs";
import { BatchPayload } from "../../objects";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationObject,
} from "../../utils";

export const updateManyCommitteeMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CommitteeWhereInput, required: false }),
  data: t.field({
    type: Inputs.CommitteeUpdateManyMutationInput,
    required: true,
  }),
}));

export const updateManyCommitteeMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManyCommitteeMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.committee.updateMany({
        where: args.where || undefined,
        data: args.data,
      }),
  }),
);

export const updateManyCommitteeMutation = defineMutation((t) => ({
  updateManyCommittee: t.field(updateManyCommitteeMutationObject(t)),
}));
