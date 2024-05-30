import * as Inputs from "../../inputs";
import { BatchPayload } from "../../objects";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationObject,
} from "../../utils";

export const deleteManyDelegationMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.DelegationWhereInput, required: true }),
}));

export const deleteManyDelegationMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManyDelegationMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.delegation.deleteMany({ where: args.where }),
  }),
);

export const deleteManyDelegationMutation = defineMutation((t) => ({
  deleteManyDelegation: t.field(deleteManyDelegationMutationObject(t)),
}));
