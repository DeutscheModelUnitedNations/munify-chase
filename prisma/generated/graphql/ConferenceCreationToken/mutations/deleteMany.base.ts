import * as Inputs from "../../inputs";
import { BatchPayload } from "../../objects";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineMutation,
  defineMutationFunction,
  defineMutationObject,
} from "../../utils";

export const deleteManyConferenceCreationTokenMutationArgs = builder.args(
  (t) => ({
    where: t.field({
      type: Inputs.ConferenceCreationTokenWhereInput,
      required: true,
    }),
  }),
);

export const deleteManyConferenceCreationTokenMutationObject =
  defineMutationFunction((t) =>
    defineMutationObject({
      type: BatchPayload,
      nullable: true,
      args: deleteManyConferenceCreationTokenMutationArgs,
      resolve: async (_root, args, _context, _info) =>
        await db.conferenceCreationToken.deleteMany({ where: args.where }),
    }),
  );

export const deleteManyConferenceCreationTokenMutation = defineMutation(
  (t) => ({
    deleteManyConferenceCreationToken: t.field(
      deleteManyConferenceCreationTokenMutationObject(t),
    ),
  }),
);
