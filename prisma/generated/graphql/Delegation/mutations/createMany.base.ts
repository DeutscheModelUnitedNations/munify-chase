import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyDelegationMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.DelegationCreateInput], required: true }) }))

export const createManyDelegationMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['Delegation'],
    nullable: false,
    args: createManyDelegationMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await db.$transaction(args.data.map((data) => db.delegation.create({ data }))),
  }),
);

export const createManyDelegationMutation = defineMutation((t) => ({
  createManyDelegation: t.prismaField(createManyDelegationMutationObject(t)),
}));
