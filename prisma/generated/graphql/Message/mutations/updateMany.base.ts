import * as Inputs from "../../inputs";
import { BatchPayload } from "../../objects";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationObject,
} from "../../utils";

export const updateManyMessageMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.MessageWhereInput, required: false }),
  data: t.field({
    type: Inputs.MessageUpdateManyMutationInput,
    required: true,
  }),
}));

export const updateManyMessageMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManyMessageMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.message.updateMany({
        where: args.where || undefined,
        data: args.data,
      }),
  }),
);

export const updateManyMessageMutation = defineMutation((t) => ({
  updateManyMessage: t.field(updateManyMessageMutationObject(t)),
}));
