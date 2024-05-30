import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const updateOneNationMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.NationWhereUniqueInput, required: true }),
  data: t.field({ type: Inputs.NationUpdateInput, required: true }),
}));

export const updateOneNationMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: "Nation",
    nullable: true,
    args: updateOneNationMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.nation.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneNationMutation = defineMutation((t) => ({
  updateOneNation: t.prismaField(updateOneNationMutationObject(t)),
}));
