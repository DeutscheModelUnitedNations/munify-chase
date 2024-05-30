import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const updateOneCommitteeMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CommitteeWhereUniqueInput, required: true }),
  data: t.field({ type: Inputs.CommitteeUpdateInput, required: true }),
}));

export const updateOneCommitteeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: "Committee",
    nullable: true,
    args: updateOneCommitteeMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.committee.update({
        where: args.where,
        data: args.data,
        ...query,
      }),
  }),
);

export const updateOneCommitteeMutation = defineMutation((t) => ({
  updateOneCommittee: t.prismaField(updateOneCommitteeMutationObject(t)),
}));
