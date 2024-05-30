import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const deleteOneCommitteeMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CommitteeWhereUniqueInput, required: true }),
}));

export const deleteOneCommitteeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: "Committee",
    nullable: true,
    args: deleteOneCommitteeMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.committee.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneCommitteeMutation = defineMutation((t) => ({
  deleteOneCommittee: t.prismaField(deleteOneCommitteeMutationObject(t)),
}));
