import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const upsertOneCommitteeMemberMutationArgs = builder.args((t) => ({
  where: t.field({
    type: Inputs.CommitteeMemberWhereUniqueInput,
    required: true,
  }),
  create: t.field({ type: Inputs.CommitteeMemberCreateInput, required: true }),
  update: t.field({ type: Inputs.CommitteeMemberUpdateInput, required: true }),
}));

export const upsertOneCommitteeMemberMutationObject = defineMutationFunction(
  (t) =>
    defineMutationPrismaObject({
      type: "CommitteeMember",
      nullable: false,
      args: upsertOneCommitteeMemberMutationArgs,
      resolve: async (query, _root, args, _context, _info) =>
        await db.committeeMember.upsert({
          where: args.where,
          create: args.create,
          update: args.update,
          ...query,
        }),
    }),
);

export const upsertOneCommitteeMemberMutation = defineMutation((t) => ({
  upsertOneCommitteeMember: t.prismaField(
    upsertOneCommitteeMemberMutationObject(t),
  ),
}));
