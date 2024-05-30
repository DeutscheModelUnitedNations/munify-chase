import * as Inputs from "../inputs";
import { builder } from "../../../../src/resolvers/builder";
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from "../utils";

export const NationObject = definePrismaObject("Nation", {
  description: "A nation in the system. E.g. Germany",
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(NationIdFieldObject),
    alpha3Code: t.field(NationAlpha3CodeFieldObject),
    variant: t.field(NationVariantFieldObject),
    delegations: t.relation("delegations", NationDelegationsFieldObject(t)),
  }),
});

export const NationIdFieldObject = defineFieldObject("Nation", {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const NationAlpha3CodeFieldObject = defineFieldObject("Nation", {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.alpha3Code,
});

export const NationVariantFieldObject = defineFieldObject("Nation", {
  type: Inputs.NationVariant,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.variant,
});

export const NationDelegationsFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.DelegationWhereInput, required: false }),
  orderBy: t.field({
    type: [Inputs.DelegationOrderByWithRelationInput],
    required: false,
  }),
  cursor: t.field({ type: Inputs.DelegationWhereUniqueInput, required: false }),
  take: t.field({ type: "Int", required: false }),
  skip: t.field({ type: "Int", required: false }),
  distinct: t.field({
    type: [Inputs.DelegationScalarFieldEnum],
    required: false,
  }),
}));

export const NationDelegationsFieldObject = defineRelationFunction(
  "Nation",
  (t) =>
    defineRelationObject("Nation", "delegations", {
      description: undefined,
      nullable: false,
      args: NationDelegationsFieldArgs,
      query: (args) => ({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
    }),
);
