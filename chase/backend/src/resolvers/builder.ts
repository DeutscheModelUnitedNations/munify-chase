import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import { db } from "../../prisma/db";
import { appConfiguration } from "../util/config";
import type { PermissionsType } from "../auth/permissions";
import ComplexityPlugin from "@pothos/plugin-complexity";
import TracingPlugin, {
  wrapResolver,
  isRootField,
} from "@pothos/plugin-tracing";
import PrismaUtils from "@pothos/plugin-prisma-utils";
import type { Scalars } from "prisma-generator-pothos-codegen";
import type { Prisma } from "../../prisma/generated/client";
import type PrismaTypes from "../../prisma/generated/graphql/pothos-types";
import type { IntrospectionResult } from "../auth/oidc";
//TODO @pothos/plugin-smart-subscriptions

export const builder = new SchemaBuilder<{
  Scalars: Scalars<
    Prisma.Decimal,
    Prisma.InputJsonValue | null,
    Prisma.InputJsonValue
  >;
  PrismaTypes: PrismaTypes;
  Context: {
    intro: IntrospectionResult;
    permissions: PermissionsType;
  };
}>({
  plugins: [PrismaPlugin, PrismaUtils, ComplexityPlugin, TracingPlugin],
  prisma: {
    client: db,
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
    onUnusedQuery: appConfiguration.production ? null : "warn",
  },
  complexity: {
    defaultComplexity: 1,
    defaultListMultiplier: 10,
    limit: {
      complexity: 1321,
      depth: 10,
      breadth: 50,
    },
  },
  tracing: {
    // Enable tracing for rootFields by default, other fields need to opt in
    default: (config) => isRootField(config),
    // Log resolver execution duration
    wrap: (resolver, _options, config) =>
      wrapResolver(resolver, (_error, duration) => {
        console.info(
          `Executed resolver ${config.parentType}.${config.name} in ${duration}ms`,
        );
      }),
  },
});
