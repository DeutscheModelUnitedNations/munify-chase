import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneAgendaItemMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.AgendaItemWhereUniqueInput, required: true }) }))

export const deleteOneAgendaItemMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'AgendaItem',
    nullable: true,
    args: deleteOneAgendaItemMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.agendaItem.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneAgendaItemMutation = defineMutation((t) => ({
  deleteOneAgendaItem: t.prismaField(deleteOneAgendaItemMutationObject(t)),
}));
