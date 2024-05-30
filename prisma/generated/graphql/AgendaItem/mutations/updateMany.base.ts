import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyAgendaItemMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.AgendaItemWhereInput, required: false }),
      data: t.field({ type: Inputs.AgendaItemUpdateManyMutationInput, required: true }),
    }))

export const updateManyAgendaItemMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManyAgendaItemMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await db.agendaItem.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyAgendaItemMutation = defineMutation((t) => ({
  updateManyAgendaItem: t.field(updateManyAgendaItemMutationObject(t)),
}));
