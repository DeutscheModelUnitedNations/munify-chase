import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findManyDelegationQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.DelegationWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.DelegationOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.DelegationWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.DelegationScalarFieldEnum], required: false }),
}))

export const findManyDelegationQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ['Delegation'],
    nullable: false,
    args: findManyDelegationQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.delegation.findMany({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
        ...query,
      }),
  }),
);

export const findManyDelegationQuery = defineQuery((t) => ({
  findManyDelegation: t.prismaField(findManyDelegationQueryObject(t)),
}));
