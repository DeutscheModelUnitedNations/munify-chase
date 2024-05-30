import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyCommitteeMemberMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.CommitteeMemberCreateInput], required: true }) }))

export const createManyCommitteeMemberMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['CommitteeMember'],
    nullable: false,
    args: createManyCommitteeMemberMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await db.$transaction(args.data.map((data) => db.committeeMember.create({ data }))),
  }),
);

export const createManyCommitteeMemberMutation = defineMutation((t) => ({
  createManyCommitteeMember: t.prismaField(createManyCommitteeMemberMutationObject(t)),
}));
