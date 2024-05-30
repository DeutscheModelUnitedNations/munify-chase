import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const createOneConferenceMemberMutationArgs = builder.args((t) => ({
  data: t.field({ type: Inputs.ConferenceMemberCreateInput, required: true }),
}));

export const createOneConferenceMemberMutationObject = defineMutationFunction(
  (t) =>
    defineMutationPrismaObject({
      type: "ConferenceMember",
      nullable: false,
      args: createOneConferenceMemberMutationArgs,
      resolve: async (query, _root, args, _context, _info) =>
        await db.conferenceMember.create({ data: args.data, ...query }),
    }),
);

export const createOneConferenceMemberMutation = defineMutation((t) => ({
  createOneConferenceMember: t.prismaField(
    createOneConferenceMemberMutationObject(t),
  ),
}));
