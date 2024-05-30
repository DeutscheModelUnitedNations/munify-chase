import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyNationMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.NationCreateInput], required: true }) }))

export const createManyNationMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['Nation'],
    nullable: false,
    args: createManyNationMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await db.$transaction(args.data.map((data) => db.nation.create({ data }))),
  }),
);

export const createManyNationMutation = defineMutation((t) => ({
  createManyNation: t.prismaField(createManyNationMutationObject(t)),
}));
