import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyCommitteeMemberMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.CommitteeMemberWhereInput, required: true }) }))

export const deleteManyCommitteeMemberMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManyCommitteeMemberMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.committeeMember.deleteMany({ where: args.where }),
  }),
);

export const deleteManyCommitteeMemberMutation = defineMutation((t) => ({
  deleteManyCommitteeMember: t.field(deleteManyCommitteeMemberMutationObject(t)),
}));
