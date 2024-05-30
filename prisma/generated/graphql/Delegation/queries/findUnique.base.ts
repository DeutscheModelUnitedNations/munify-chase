import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueDelegationQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.DelegationWhereUniqueInput, required: true }) }))

export const findUniqueDelegationQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'Delegation',
    nullable: true,
    args: findUniqueDelegationQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.delegation.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueDelegationQuery = defineQuery((t) => ({
  findUniqueDelegation: t.prismaField(findUniqueDelegationQueryObject(t)),
}));
