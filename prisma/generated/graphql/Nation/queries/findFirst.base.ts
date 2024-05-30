import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findFirstNationQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.NationWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.NationOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.NationWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.NationScalarFieldEnum], required: false }),
}))

export const findFirstNationQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'Nation',
    nullable: true,
    args: findFirstNationQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.nation.findFirst({
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

export const findFirstNationQuery = defineQuery((t) => ({
  findFirstNation: t.prismaField(findFirstNationQueryObject(t)),
}));
