import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryPrismaObject,
} from "../../utils";

export const findUniqueCommitteeQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CommitteeWhereUniqueInput, required: true }),
}));

export const findUniqueCommitteeQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: "Committee",
    nullable: true,
    args: findUniqueCommitteeQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.committee.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueCommitteeQuery = defineQuery((t) => ({
  findUniqueCommittee: t.prismaField(findUniqueCommitteeQueryObject(t)),
}));
