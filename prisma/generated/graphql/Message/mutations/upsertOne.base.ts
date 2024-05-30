import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneMessageMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.MessageWhereUniqueInput, required: true }),
      create: t.field({ type: Inputs.MessageCreateInput, required: true }),
      update: t.field({ type: Inputs.MessageUpdateInput, required: true }),
    }))

export const upsertOneMessageMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Message',
    nullable: false,
    args: upsertOneMessageMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.message.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneMessageMutation = defineMutation((t) => ({
  upsertOneMessage: t.prismaField(upsertOneMessageMutationObject(t)),
}));
