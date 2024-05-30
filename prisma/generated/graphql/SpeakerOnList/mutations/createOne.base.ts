import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneSpeakerOnListMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.SpeakerOnListCreateInput, required: true }) }))

export const createOneSpeakerOnListMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SpeakerOnList',
    nullable: false,
    args: createOneSpeakerOnListMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.speakerOnList.create({ data: args.data, ...query }),
  }),
);

export const createOneSpeakerOnListMutation = defineMutation((t) => ({
  createOneSpeakerOnList: t.prismaField(createOneSpeakerOnListMutationObject(t)),
}));
