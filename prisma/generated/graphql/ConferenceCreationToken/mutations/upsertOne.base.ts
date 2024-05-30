import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const upsertOneConferenceCreationTokenMutationArgs = builder.args(
  (t) => ({
    where: t.field({
      type: Inputs.ConferenceCreationTokenWhereUniqueInput,
      required: true,
    }),
    create: t.field({
      type: Inputs.ConferenceCreationTokenCreateInput,
      required: true,
    }),
    update: t.field({
      type: Inputs.ConferenceCreationTokenUpdateInput,
      required: true,
    }),
  }),
);

export const upsertOneConferenceCreationTokenMutationObject =
  defineMutationFunction((t) =>
    defineMutationPrismaObject({
      type: "ConferenceCreationToken",
      nullable: false,
      args: upsertOneConferenceCreationTokenMutationArgs,
      resolve: async (query, _root, args, _context, _info) =>
        await db.conferenceCreationToken.upsert({
          where: args.where,
          create: args.create,
          update: args.update,
          ...query,
        }),
    }),
  );

export const upsertOneConferenceCreationTokenMutation = defineMutation((t) => ({
  upsertOneConferenceCreationToken: t.prismaField(
    upsertOneConferenceCreationTokenMutationObject(t),
  ),
}));
