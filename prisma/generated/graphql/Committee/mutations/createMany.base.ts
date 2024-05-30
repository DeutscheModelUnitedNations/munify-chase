import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const createManyCommitteeMutationArgs = builder.args((t) => ({
  data: t.field({ type: [Inputs.CommitteeCreateInput], required: true }),
}));

export const createManyCommitteeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ["Committee"],
    nullable: false,
    args: createManyCommitteeMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await db.$transaction(
        args.data.map((data) => db.committee.create({ data })),
      ),
  }),
);

export const createManyCommitteeMutation = defineMutation((t) => ({
  createManyCommittee: t.prismaField(createManyCommitteeMutationObject(t)),
}));
