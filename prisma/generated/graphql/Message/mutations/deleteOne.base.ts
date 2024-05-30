import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const deleteOneMessageMutationArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.MessageWhereUniqueInput, required: true }),
}));

export const deleteOneMessageMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: "Message",
    nullable: true,
    args: deleteOneMessageMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.message.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneMessageMutation = defineMutation((t) => ({
  deleteOneMessage: t.prismaField(deleteOneMessageMutationObject(t)),
}));
