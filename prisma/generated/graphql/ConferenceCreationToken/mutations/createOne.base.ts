import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const createOneConferenceCreationTokenMutationArgs = builder.args(
  (t) => ({
    data: t.field({
      type: Inputs.ConferenceCreationTokenCreateInput,
      required: true,
    }),
  }),
);

export const createOneConferenceCreationTokenMutationObject =
  defineMutationFunction((t) =>
    defineMutationPrismaObject({
      type: "ConferenceCreationToken",
      nullable: false,
      args: createOneConferenceCreationTokenMutationArgs,
      resolve: async (query, _root, args, _context, _info) =>
        await db.conferenceCreationToken.create({ data: args.data, ...query }),
    }),
  );

export const createOneConferenceCreationTokenMutation = defineMutation((t) => ({
  createOneConferenceCreationToken: t.prismaField(
    createOneConferenceCreationTokenMutationObject(t),
  ),
}));
