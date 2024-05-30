import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneSpeakersListMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.SpeakersListWhereUniqueInput, required: true }) }))

export const deleteOneSpeakersListMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SpeakersList',
    nullable: true,
    args: deleteOneSpeakersListMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.speakersList.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneSpeakersListMutation = defineMutation((t) => ({
  deleteOneSpeakersList: t.prismaField(deleteOneSpeakersListMutationObject(t)),
}));
