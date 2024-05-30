import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryPrismaObject,
} from "../../utils";

export const findUniqueConferenceMemberQueryArgs = builder.args((t) => ({
  where: t.field({
    type: Inputs.ConferenceMemberWhereUniqueInput,
    required: true,
  }),
}));

export const findUniqueConferenceMemberQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: "ConferenceMember",
    nullable: true,
    args: findUniqueConferenceMemberQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.conferenceMember.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueConferenceMemberQuery = defineQuery((t) => ({
  findUniqueConferenceMember: t.prismaField(
    findUniqueConferenceMemberQueryObject(t),
  ),
}));
