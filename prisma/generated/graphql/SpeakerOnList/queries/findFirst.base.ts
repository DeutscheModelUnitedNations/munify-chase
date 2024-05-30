import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findFirstSpeakerOnListQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SpeakerOnListWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.SpeakerOnListOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.SpeakerOnListWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.SpeakerOnListScalarFieldEnum], required: false }),
}))

export const findFirstSpeakerOnListQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'SpeakerOnList',
    nullable: true,
    args: findFirstSpeakerOnListQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.speakerOnList.findFirst({
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

export const findFirstSpeakerOnListQuery = defineQuery((t) => ({
  findFirstSpeakerOnList: t.prismaField(findFirstSpeakerOnListQueryObject(t)),
}));
