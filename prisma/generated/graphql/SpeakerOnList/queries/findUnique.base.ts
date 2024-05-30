import * as Inputs from "../../inputs";
import { db } from "../../../../db";
import { builder } from "../../../../../src/resolvers/builder";
import {
  defineQuery,
  defineQueryFunction,
  defineQueryPrismaObject,
} from "../../utils";

export const findUniqueSpeakerOnListQueryArgs = builder.args((t) => ({
  where: t.field({
    type: Inputs.SpeakerOnListWhereUniqueInput,
    required: true,
  }),
}));

export const findUniqueSpeakerOnListQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: "SpeakerOnList",
    nullable: true,
    args: findUniqueSpeakerOnListQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await db.speakerOnList.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueSpeakerOnListQuery = defineQuery((t) => ({
  findUniqueSpeakerOnList: t.prismaField(findUniqueSpeakerOnListQueryObject(t)),
}));
