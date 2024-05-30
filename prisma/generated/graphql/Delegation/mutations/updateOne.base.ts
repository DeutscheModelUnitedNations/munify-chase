import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneDelegationMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.DelegationWhereUniqueInput, required: true }),
      data: t.field({ type: Inputs.DelegationUpdateInput, required: true }),
    }))

export const updateOneDelegationMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Delegation',
    nullable: true,
    args: updateOneDelegationMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.delegation.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneDelegationMutation = defineMutation((t) => ({
  updateOneDelegation: t.prismaField(updateOneDelegationMutationObject(t)),
}));
