import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationPrismaObject,
} from "../../utils";

export const deleteOneConferenceCreationTokenMutationArgs = builder.args(
  (t) => ({
    where: t.field({
      type: Inputs.ConferenceCreationTokenWhereUniqueInput,
      required: true,
    }),
  }),
);

export const deleteOneConferenceCreationTokenMutationObject =
  defineMutationFunction((t) =>
    defineMutationPrismaObject({
      type: "ConferenceCreationToken",
      nullable: true,
      args: deleteOneConferenceCreationTokenMutationArgs,
      resolve: async (query, _root, args, _context, _info) =>
        await db.conferenceCreationToken.delete({
          where: args.where,
          ...query,
        }),
    }),
  );

export const deleteOneConferenceCreationTokenMutation = defineMutation((t) => ({
  deleteOneConferenceCreationToken: t.prismaField(
    deleteOneConferenceCreationTokenMutationObject(t),
  ),
}));
