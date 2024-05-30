import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManySpeakersListMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.SpeakersListWhereInput, required: true }) }))

export const deleteManySpeakersListMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManySpeakersListMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.speakersList.deleteMany({ where: args.where }),
  }),
);

export const deleteManySpeakersListMutation = defineMutation((t) => ({
  deleteManySpeakersList: t.field(deleteManySpeakersListMutationObject(t)),
}));
