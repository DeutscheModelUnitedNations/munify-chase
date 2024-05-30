import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueSpeakersListQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.SpeakersListWhereUniqueInput, required: true }) }))

export const findUniqueSpeakersListQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'SpeakersList',
    nullable: true,
    args: findUniqueSpeakersListQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.speakersList.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueSpeakersListQuery = defineQuery((t) => ({
  findUniqueSpeakersList: t.prismaField(findUniqueSpeakersListQueryObject(t)),
}));
