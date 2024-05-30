import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyConferenceMemberMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.ConferenceMemberWhereInput, required: false }),
      data: t.field({ type: Inputs.ConferenceMemberUpdateManyMutationInput, required: true }),
    }))

export const updateManyConferenceMemberMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManyConferenceMemberMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.conferenceMember.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyConferenceMemberMutation = defineMutation((t) => ({
  updateManyConferenceMember: t.field(updateManyConferenceMemberMutationObject(t)),
}));
