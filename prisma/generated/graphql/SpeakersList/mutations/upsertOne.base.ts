import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneSpeakersListMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.SpeakersListWhereUniqueInput, required: true }),
      create: t.field({ type: Inputs.SpeakersListCreateInput, required: true }),
      update: t.field({ type: Inputs.SpeakersListUpdateInput, required: true }),
    }))

export const upsertOneSpeakersListMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SpeakersList',
    nullable: false,
    args: upsertOneSpeakersListMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.speakersList.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneSpeakersListMutation = defineMutation((t) => ({
  upsertOneSpeakersList: t.prismaField(upsertOneSpeakersListMutationObject(t)),
}));
