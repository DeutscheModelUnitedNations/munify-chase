import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const updateOneConferenceCreationTokenMutationArgs = builder.args(
  (t) => ({
    where: t.field({
      type: Inputs.ConferenceCreationTokenWhereUniqueInput,
      required: true,
    }),
    data: t.field({
      type: Inputs.ConferenceCreationTokenUpdateInput,
      required: true,
    }),
  }),
);

export const updateOneConferenceCreationTokenMutationObject =
  defineMutationFunction((t) =>
    defineMutationPrismaObject({
      type: "ConferenceCreationToken",
      nullable: true,
      args: updateOneConferenceCreationTokenMutationArgs,
      resolve: async (query, _root, args, _context, _info) =>
        await db.conferenceCreationToken.update({
          where: args.where,
          data: args.data,
          ...query,
        }),
    }),
  );

export const updateOneConferenceCreationTokenMutation = defineMutation((t) => ({
  updateOneConferenceCreationToken: t.prismaField(
    updateOneConferenceCreationTokenMutationObject(t),
  ),
}));
