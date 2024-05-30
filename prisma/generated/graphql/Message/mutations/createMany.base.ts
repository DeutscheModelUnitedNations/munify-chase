import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyMessageMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.MessageCreateInput], required: true }) }))

export const createManyMessageMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['Message'],
    nullable: false,
    args: createManyMessageMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await db.$transaction(args.data.map((data) => db.message.create({ data }))),
  }),
);

export const createManyMessageMutation = defineMutation((t) => ({
  createManyMessage: t.prismaField(createManyMessageMutationObject(t)),
}));
