import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyConferenceCreationTokenMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.ConferenceCreationTokenWhereInput, required: false }),
      data: t.field({ type: Inputs.ConferenceCreationTokenUpdateManyMutationInput, required: true }),
    }))

export const updateManyConferenceCreationTokenMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManyConferenceCreationTokenMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.conferenceCreationToken.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyConferenceCreationTokenMutation = defineMutation((t) => ({
  updateManyConferenceCreationToken: t.field(updateManyConferenceCreationTokenMutationObject(t)),
}));
