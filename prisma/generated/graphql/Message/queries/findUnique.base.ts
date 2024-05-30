import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueMessageQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.MessageWhereUniqueInput, required: true }) }))

export const findUniqueMessageQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'Message',
    nullable: true,
    args: findUniqueMessageQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.message.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueMessageQuery = defineQuery((t) => ({
  findUniqueMessage: t.prismaField(findUniqueMessageQueryObject(t)),
}));
