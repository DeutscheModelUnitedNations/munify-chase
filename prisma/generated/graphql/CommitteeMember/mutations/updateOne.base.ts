import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const updateOneCommitteeMemberMutationArgs = builder.args((t) => ({
  where: t.field({
    type: Inputs.CommitteeMemberWhereUniqueInput,
    required: true,
  }),
  data: t.field({ type: Inputs.CommitteeMemberUpdateInput, required: true }),
}));

export const updateOneCommitteeMemberMutationObject = defineMutationFunction(
  (t) =>
    defineMutationPrismaObject({
      type: "CommitteeMember",
      nullable: true,
      args: updateOneCommitteeMemberMutationArgs,
      resolve: async (query, _root, args, _context, _info) =>
        await db.committeeMember.update({
          where: args.where,
          data: args.data,
          ...query,
        }),
    }),
);

export const updateOneCommitteeMemberMutation = defineMutation((t) => ({
  updateOneCommitteeMember: t.prismaField(
    updateOneCommitteeMemberMutationObject(t),
  ),
}));
