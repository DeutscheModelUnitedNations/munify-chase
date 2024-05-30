import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findFirstCommitteeQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CommitteeWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.CommitteeOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.CommitteeWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.CommitteeScalarFieldEnum], required: false }),
}))

export const findFirstCommitteeQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'Committee',
    nullable: true,
    args: findFirstCommitteeQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.committee.findFirst({
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

export const findFirstCommitteeQuery = defineQuery((t) => ({
  findFirstCommittee: t.prismaField(findFirstCommitteeQueryObject(t)),
}));
