import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneCommitteeMemberMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.CommitteeMemberCreateInput, required: true }) }))

export const createOneCommitteeMemberMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'CommitteeMember',
    nullable: false,
    args: createOneCommitteeMemberMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.committeeMember.create({ data: args.data, ...query }),
  }),
);

export const createOneCommitteeMemberMutation = defineMutation((t) => ({
  createOneCommitteeMember: t.prismaField(createOneCommitteeMemberMutationObject(t)),
}));
