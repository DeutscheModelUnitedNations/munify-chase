import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const createManyConferenceMutationArgs = builder.args((t) => ({
  data: t.field({ type: [Inputs.ConferenceCreateInput], required: true }),
}));

export const createManyConferenceMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ["Conference"],
    nullable: false,
    args: createManyConferenceMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await db.$transaction(
        args.data.map((data) => db.conference.create({ data })),
      ),
  }),
);

export const createManyConferenceMutation = defineMutation((t) => ({
  createManyConference: t.prismaField(createManyConferenceMutationObject(t)),
}));
