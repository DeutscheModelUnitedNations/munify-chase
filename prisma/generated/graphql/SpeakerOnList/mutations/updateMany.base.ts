import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManySpeakerOnListMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.SpeakerOnListWhereInput, required: false }),
      data: t.field({ type: Inputs.SpeakerOnListUpdateManyMutationInput, required: true }),
    }))

export const updateManySpeakerOnListMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManySpeakerOnListMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.speakerOnList.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManySpeakerOnListMutation = defineMutation((t) => ({
  updateManySpeakerOnList: t.field(updateManySpeakerOnListMutationObject(t)),
}));
