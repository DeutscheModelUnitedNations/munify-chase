import * as Inputs from '../../inputs';
import { db } from '../../../../db';
import { builder } from '../../../../../src/resolvers/builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueCommitteeMemberQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.CommitteeMemberWhereUniqueInput, required: true }) }))

export const findUniqueCommitteeMemberQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'CommitteeMember',
    nullable: true,
    args: findUniqueCommitteeMemberQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.committeeMember.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueCommitteeMemberQuery = defineQuery((t) => ({
  findUniqueCommitteeMember: t.prismaField(findUniqueCommitteeMemberQueryObject(t)),
}));
