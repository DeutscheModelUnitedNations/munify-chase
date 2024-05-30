import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const deleteOneConferenceMemberMutationArgs = builder.args((t) => ({
  where: t.field({
    type: Inputs.ConferenceMemberWhereUniqueInput,
    required: true,
  }),
}));

export const deleteOneConferenceMemberMutationObject = defineMutationFunction(
  (t) =>
    defineMutationPrismaObject({
      type: "ConferenceMember",
      nullable: true,
      args: deleteOneConferenceMemberMutationArgs,
      resolve: async (query, _root, args, _context, _info) =>
        await db.conferenceMember.delete({ where: args.where, ...query }),
    }),
);

export const deleteOneConferenceMemberMutation = defineMutation((t) => ({
  deleteOneConferenceMember: t.prismaField(
    deleteOneConferenceMemberMutationObject(t),
  ),
}));
