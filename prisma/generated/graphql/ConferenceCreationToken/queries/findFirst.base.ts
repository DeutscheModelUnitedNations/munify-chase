import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findFirstConferenceCreationTokenQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.ConferenceCreationTokenWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.ConferenceCreationTokenOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.ConferenceCreationTokenWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.ConferenceCreationTokenScalarFieldEnum], required: false }),
}))

export const findFirstConferenceCreationTokenQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'ConferenceCreationToken',
    nullable: true,
    args: findFirstConferenceCreationTokenQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.conferenceCreationToken.findFirst({
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

export const findFirstConferenceCreationTokenQuery = defineQuery((t) => ({
  findFirstConferenceCreationToken: t.prismaField(findFirstConferenceCreationTokenQueryObject(t)),
}));
