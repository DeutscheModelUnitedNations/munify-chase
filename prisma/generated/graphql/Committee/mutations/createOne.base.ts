import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneCommitteeMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.CommitteeCreateInput, required: true }) }))

export const createOneCommitteeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Committee',
    nullable: false,
    args: createOneCommitteeMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.committee.create({ data: args.data, ...query }),
  }),
);

export const createOneCommitteeMutation = defineMutation((t) => ({
  createOneCommittee: t.prismaField(createOneCommitteeMutationObject(t)),
}));
