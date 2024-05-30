import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneConferenceMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.ConferenceWhereUniqueInput, required: true }),
      data: t.field({ type: Inputs.ConferenceUpdateInput, required: true }),
    }))

export const updateOneConferenceMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Conference',
    nullable: true,
    args: updateOneConferenceMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.conference.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneConferenceMutation = defineMutation((t) => ({
  updateOneConference: t.prismaField(updateOneConferenceMutationObject(t)),
}));
