import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManySpeakerOnListMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.SpeakerOnListCreateInput], required: true }) }))

export const createManySpeakerOnListMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['SpeakerOnList'],
    nullable: false,
    args: createManySpeakerOnListMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await db.$transaction(args.data.map((data) => db.speakerOnList.create({ data }))),
  }),
);

export const createManySpeakerOnListMutation = defineMutation((t) => ({
  createManySpeakerOnList: t.prismaField(createManySpeakerOnListMutationObject(t)),
}));
