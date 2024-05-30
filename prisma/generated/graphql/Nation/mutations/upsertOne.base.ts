import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneNationMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.NationWhereUniqueInput, required: true }),
      create: t.field({ type: Inputs.NationCreateInput, required: true }),
      update: t.field({ type: Inputs.NationUpdateInput, required: true }),
    }))

export const upsertOneNationMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Nation',
    nullable: false,
    args: upsertOneNationMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.nation.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneNationMutation = defineMutation((t) => ({
  upsertOneNation: t.prismaField(upsertOneNationMutationObject(t)),
}));
