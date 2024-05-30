import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneDelegationMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.DelegationWhereUniqueInput, required: true }) }))

export const deleteOneDelegationMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Delegation',
    nullable: true,
    args: deleteOneDelegationMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.delegation.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneDelegationMutation = defineMutation((t) => ({
  deleteOneDelegation: t.prismaField(deleteOneDelegationMutationObject(t)),
}));
