import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const upsertOneCommitteeMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CommitteeWhereUniqueInput, required: true }),
  create: t.field({ type: Inputs.CommitteeCreateInput, required: true }),
  update: t.field({ type: Inputs.CommitteeUpdateInput, required: true }),
}));

export const upsertOneCommitteeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: "Committee",
    nullable: false,
    args: upsertOneCommitteeMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.committee.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneCommitteeMutation = defineMutation((t) => ({
  upsertOneCommittee: t.prismaField(upsertOneCommitteeMutationObject(t)),
}));
