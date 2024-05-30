import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findFirstMessageQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.MessageWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.MessageOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.MessageWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.MessageScalarFieldEnum], required: false }),
}))

export const findFirstMessageQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'Message',
    nullable: true,
    args: findFirstMessageQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.message.findFirst({
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

export const findFirstMessageQuery = defineQuery((t) => ({
  findFirstMessage: t.prismaField(findFirstMessageQueryObject(t)),
}));
