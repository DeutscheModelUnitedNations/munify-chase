import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const createOneConferenceMutationArgs = builder.args((t) => ({
  data: t.field({ type: Inputs.ConferenceCreateInput, required: true }),
}));

export const createOneConferenceMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: "Conference",
    nullable: false,
    args: createOneConferenceMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.conference.create({ data: args.data, ...query }),
  }),
);

export const createOneConferenceMutation = defineMutation((t) => ({
  createOneConference: t.prismaField(createOneConferenceMutationObject(t)),
}));
