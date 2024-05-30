import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countNationQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.NationWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.NationOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.NationWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.NationScalarFieldEnum], required: false }),
}))

export const countNationQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: countNationQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.nation.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countNationQuery = defineQuery((t) => ({
  countNation: t.field(countNationQueryObject(t)),
}));
