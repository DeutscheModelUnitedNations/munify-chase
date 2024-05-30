import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueNationQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.NationWhereUniqueInput, required: true }) }))

export const findUniqueNationQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'Nation',
    nullable: true,
    args: findUniqueNationQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.nation.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueNationQuery = defineQuery((t) => ({
  findUniqueNation: t.prismaField(findUniqueNationQueryObject(t)),
}));
