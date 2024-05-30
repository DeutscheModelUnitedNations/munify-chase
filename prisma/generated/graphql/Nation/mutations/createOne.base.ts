import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const createOneNationMutationArgs = builder.args((t) => ({
  data: t.field({ type: Inputs.NationCreateInput, required: true }),
}));

export const createOneNationMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: "Nation",
    nullable: false,
    args: createOneNationMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.nation.create({ data: args.data, ...query }),
  }),
);

export const createOneNationMutation = defineMutation((t) => ({
  createOneNation: t.prismaField(createOneNationMutationObject(t)),
}));
