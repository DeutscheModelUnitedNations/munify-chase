import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countConferenceQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.ConferenceWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.ConferenceOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.ConferenceWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.ConferenceScalarFieldEnum], required: false }),
}))

export const countConferenceQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: countConferenceQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.conference.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countConferenceQuery = defineQuery((t) => ({
  countConference: t.field(countConferenceQueryObject(t)),
}));
