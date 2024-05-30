import * as Inputs from "../../inputs";
import { BatchPayload } from "../../objects";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationObject,
} from "../../utils";

export const updateManyCommitteeMemberMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CommitteeMemberWhereInput, required: false }),
  data: t.field({
    type: Inputs.CommitteeMemberUpdateManyMutationInput,
    required: true,
  }),
}));

export const updateManyCommitteeMemberMutationObject = defineMutationFunction(
  (t) =>
    defineMutationObject({
      type: BatchPayload,
      nullable: false,
      args: updateManyCommitteeMemberMutationArgs,
      resolve: async (_root, args, _context, _info) =>
        await db.committeeMember.updateMany({
          where: args.where || undefined,
          data: args.data,
        }),
    }),
);

export const updateManyCommitteeMemberMutation = defineMutation((t) => ({
  updateManyCommitteeMember: t.field(
    updateManyCommitteeMemberMutationObject(t),
  ),
}));
