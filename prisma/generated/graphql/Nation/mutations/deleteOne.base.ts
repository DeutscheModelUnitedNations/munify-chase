import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneNationMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.NationWhereUniqueInput, required: true }) }))

export const deleteOneNationMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Nation',
    nullable: true,
    args: deleteOneNationMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.nation.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneNationMutation = defineMutation((t) => ({
  deleteOneNation: t.prismaField(deleteOneNationMutationObject(t)),
}));
