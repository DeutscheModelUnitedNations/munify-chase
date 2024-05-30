import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyConferenceCreationTokenMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.ConferenceCreationTokenCreateInput], required: true }) }))

export const createManyConferenceCreationTokenMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['ConferenceCreationToken'],
    nullable: false,
    args: createManyConferenceCreationTokenMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await db.$transaction(args.data.map((data) => db.conferenceCreationToken.create({ data }))),
  }),
);

export const createManyConferenceCreationTokenMutation = defineMutation((t) => ({
  createManyConferenceCreationToken: t.prismaField(createManyConferenceCreationTokenMutationObject(t)),
}));
