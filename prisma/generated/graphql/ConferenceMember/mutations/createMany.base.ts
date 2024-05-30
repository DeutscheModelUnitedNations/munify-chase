import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const createManyConferenceMemberMutationArgs = builder.args((t) => ({
  data: t.field({ type: [Inputs.ConferenceMemberCreateInput], required: true }),
}));

export const createManyConferenceMemberMutationObject = defineMutationFunction(
  (t) =>
    defineMutationPrismaObject({
      type: ["ConferenceMember"],
      nullable: false,
      args: createManyConferenceMemberMutationArgs,
      resolve: async (_query, _root, args, _context, _info) =>
        await db.$transaction(
          args.data.map((data) => db.conferenceMember.create({ data })),
        ),
    }),
);

export const createManyConferenceMemberMutation = defineMutation((t) => ({
  createManyConferenceMember: t.prismaField(
    createManyConferenceMemberMutationObject(t),
  ),
}));
