import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyConferenceMemberMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.ConferenceMemberWhereInput, required: true }) }))

export const deleteManyConferenceMemberMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManyConferenceMemberMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.conferenceMember.deleteMany({ where: args.where }),
  }),
);

export const deleteManyConferenceMemberMutation = defineMutation((t) => ({
  deleteManyConferenceMember: t.field(deleteManyConferenceMemberMutationObject(t)),
}));
