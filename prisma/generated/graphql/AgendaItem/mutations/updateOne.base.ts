import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneAgendaItemMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.AgendaItemWhereUniqueInput, required: true }),
      data: t.field({ type: Inputs.AgendaItemUpdateInput, required: true }),
    }))

export const updateOneAgendaItemMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'AgendaItem',
    nullable: true,
    args: updateOneAgendaItemMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.agendaItem.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneAgendaItemMutation = defineMutation((t) => ({
  updateOneAgendaItem: t.prismaField(updateOneAgendaItemMutationObject(t)),
}));
