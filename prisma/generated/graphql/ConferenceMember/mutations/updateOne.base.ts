import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneConferenceMemberMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.ConferenceMemberWhereUniqueInput, required: true }),
      data: t.field({ type: Inputs.ConferenceMemberUpdateInput, required: true }),
    }))

export const updateOneConferenceMemberMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'ConferenceMember',
    nullable: true,
    args: updateOneConferenceMemberMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.conferenceMember.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneConferenceMemberMutation = defineMutation((t) => ({
  updateOneConferenceMember: t.prismaField(updateOneConferenceMemberMutationObject(t)),
}));
