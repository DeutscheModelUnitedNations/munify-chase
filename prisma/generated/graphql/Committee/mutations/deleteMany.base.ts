import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyCommitteeMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.CommitteeWhereInput, required: true }) }))

export const deleteManyCommitteeMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManyCommitteeMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.committee.deleteMany({ where: args.where }),
  }),
);

export const deleteManyCommitteeMutation = defineMutation((t) => ({
  deleteManyCommittee: t.field(deleteManyCommitteeMutationObject(t)),
}));
