import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countSpeakersListQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SpeakersListWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.SpeakersListOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.SpeakersListWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.SpeakersListScalarFieldEnum], required: false }),
}))

export const countSpeakersListQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: countSpeakersListQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.speakersList.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countSpeakersListQuery = defineQuery((t) => ({
  countSpeakersList: t.field(countSpeakersListQueryObject(t)),
}));
