import * as Inputs from "../../inputs";
import { BatchPayload } from "../../objects";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationObject,
} from "../../utils";

export const deleteManyNationMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.NationWhereInput, required: true }),
}));

export const deleteManyNationMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManyNationMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.nation.deleteMany({ where: args.where }),
  }),
);

export const deleteManyNationMutation = defineMutation((t) => ({
  deleteManyNation: t.field(deleteManyNationMutationObject(t)),
}));
