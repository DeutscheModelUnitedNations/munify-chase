import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const upsertOneConferenceMemberMutationArgs = builder.args((t) => ({
  where: t.field({
    type: Inputs.ConferenceMemberWhereUniqueInput,
    required: true,
  }),
  create: t.field({ type: Inputs.ConferenceMemberCreateInput, required: true }),
  update: t.field({ type: Inputs.ConferenceMemberUpdateInput, required: true }),
}));

export const upsertOneConferenceMemberMutationObject = defineMutationFunction(
  (t) =>
    defineMutationPrismaObject({
      type: "ConferenceMember",
      nullable: false,
      args: upsertOneConferenceMemberMutationArgs,
      resolve: async (query, _root, args, _context, _info) =>
        await db.conferenceMember.upsert({
          where: args.where,
          create: args.create,
          update: args.update,
          ...query,
        }),
    }),
);

export const upsertOneConferenceMemberMutation = defineMutation((t) => ({
  upsertOneConferenceMember: t.prismaField(
    upsertOneConferenceMemberMutationObject(t),
  ),
}));
