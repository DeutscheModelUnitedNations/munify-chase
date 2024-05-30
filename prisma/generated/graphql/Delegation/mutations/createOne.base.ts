import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneDelegationMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.DelegationCreateInput, required: true }) }))

export const createOneDelegationMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Delegation',
    nullable: false,
    args: createOneDelegationMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.delegation.create({ data: args.data, ...query }),
  }),
);

export const createOneDelegationMutation = defineMutation((t) => ({
  createOneDelegation: t.prismaField(createOneDelegationMutationObject(t)),
}));
