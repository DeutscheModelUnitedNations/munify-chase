import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const deleteOneCommitteeMemberMutationArgs = builder.args((t) => ({
  where: t.field({
    type: Inputs.CommitteeMemberWhereUniqueInput,
    required: true,
  }),
}));

export const deleteOneCommitteeMemberMutationObject = defineMutationFunction(
  (t) =>
    defineMutationPrismaObject({
      type: "CommitteeMember",
      nullable: true,
      args: deleteOneCommitteeMemberMutationArgs,
      resolve: async (query, _root, args, _context, _info) =>
        await db.committeeMember.delete({ where: args.where, ...query }),
    }),
);

export const deleteOneCommitteeMemberMutation = defineMutation((t) => ({
  deleteOneCommitteeMember: t.prismaField(
    deleteOneCommitteeMemberMutationObject(t),
  ),
}));
