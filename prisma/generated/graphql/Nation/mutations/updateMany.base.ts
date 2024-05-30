import * as Inputs from "../../inputs";
import { BatchPayload } from "../../objects";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationObject,
} from "../../utils";

export const updateManyNationMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.NationWhereInput, required: false }),
  data: t.field({ type: Inputs.NationUpdateManyMutationInput, required: true }),
}));

export const updateManyNationMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManyNationMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.nation.updateMany({
        where: args.where || undefined,
        data: args.data,
      }),
  }),
);

export const updateManyNationMutation = defineMutation((t) => ({
  updateManyNation: t.field(updateManyNationMutationObject(t)),
}));
