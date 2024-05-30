import * as Inputs from "../../inputs";
import { BatchPayload } from "../../objects";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationObject,
} from "../../utils";

export const deleteManyMessageMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.MessageWhereInput, required: true }),
}));

export const deleteManyMessageMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManyMessageMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.message.deleteMany({ where: args.where }),
  }),
);

export const deleteManyMessageMutation = defineMutation((t) => ({
  deleteManyMessage: t.field(deleteManyMessageMutationObject(t)),
}));
