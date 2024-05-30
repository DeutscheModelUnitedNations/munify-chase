import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManySpeakerOnListMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.SpeakerOnListWhereInput, required: true }) }))

export const deleteManySpeakerOnListMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManySpeakerOnListMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.speakerOnList.deleteMany({ where: args.where }),
  }),
);

export const deleteManySpeakerOnListMutation = defineMutation((t) => ({
  deleteManySpeakerOnList: t.field(deleteManySpeakerOnListMutationObject(t)),
}));
