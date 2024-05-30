import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneSpeakersListMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.SpeakersListCreateInput, required: true }) }))

export const createOneSpeakersListMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SpeakersList',
    nullable: false,
    args: createOneSpeakersListMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.speakersList.create({ data: args.data, ...query }),
  }),
);

export const createOneSpeakersListMutation = defineMutation((t) => ({
  createOneSpeakersList: t.prismaField(createOneSpeakersListMutationObject(t)),
}));
