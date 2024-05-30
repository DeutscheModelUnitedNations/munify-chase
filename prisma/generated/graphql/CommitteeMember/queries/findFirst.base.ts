import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findFirstCommitteeMemberQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CommitteeMemberWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.CommitteeMemberOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.CommitteeMemberWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.CommitteeMemberScalarFieldEnum], required: false }),
}))

export const findFirstCommitteeMemberQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'CommitteeMember',
    nullable: true,
    args: findFirstCommitteeMemberQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.committeeMember.findFirst({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
        ...query,
      }),
  }),
);

export const findFirstCommitteeMemberQuery = defineQuery((t) => ({
  findFirstCommitteeMember: t.prismaField(findFirstCommitteeMemberQueryObject(t)),
}));
