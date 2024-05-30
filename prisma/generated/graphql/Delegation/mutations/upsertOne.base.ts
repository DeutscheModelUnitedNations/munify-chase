import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneDelegationMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.DelegationWhereUniqueInput, required: true }),
      create: t.field({ type: Inputs.DelegationCreateInput, required: true }),
      update: t.field({ type: Inputs.DelegationUpdateInput, required: true }),
    }))

export const upsertOneDelegationMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Delegation',
    nullable: false,
    args: upsertOneDelegationMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.delegation.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneDelegationMutation = defineMutation((t) => ({
  upsertOneDelegation: t.prismaField(upsertOneDelegationMutationObject(t)),
}));
