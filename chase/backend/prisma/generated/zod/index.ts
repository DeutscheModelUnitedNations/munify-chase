import { z } from "zod";
import type { Prisma } from "@prisma/client";

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const ConferenceCreateTokenScalarFieldEnumSchema = z.enum(["token"]);

export const ConferenceScalarFieldEnumSchema = z.enum(["id", "name"]);

export const QueryModeSchema = z.enum(["default", "insensitive"]);

export const SortOrderSchema = z.enum(["asc", "desc"]);

export const TransactionIsolationLevelSchema = z.enum([
  "ReadUncommitted",
  "ReadCommitted",
  "RepeatableRead",
  "Serializable",
]);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// CONFERENCE SCHEMA
/////////////////////////////////////////

/**
 * A conference entity
 */
export const ConferenceSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

export type Conference = z.infer<typeof ConferenceSchema>;

/////////////////////////////////////////
// CONFERENCE CREATE TOKEN SCHEMA
/////////////////////////////////////////

/**
 * Consumeable token which grants the creation of a conference
 */
export const ConferenceCreateTokenSchema = z.object({
  token: z.string(),
});

export type ConferenceCreateToken = z.infer<typeof ConferenceCreateTokenSchema>;

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// CONFERENCE
//------------------------------------------------------

export const ConferenceSelectSchema: z.ZodType<Prisma.ConferenceSelect> = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
  })
  .strict();

// CONFERENCE CREATE TOKEN
//------------------------------------------------------

export const ConferenceCreateTokenSelectSchema: z.ZodType<Prisma.ConferenceCreateTokenSelect> =
  z
    .object({
      token: z.boolean().optional(),
    })
    .strict();

/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const ConferenceWhereInputSchema: z.ZodType<Prisma.ConferenceWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => ConferenceWhereInputSchema),
          z.lazy(() => ConferenceWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => ConferenceWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => ConferenceWhereInputSchema),
          z.lazy(() => ConferenceWhereInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
      name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    })
    .strict();

export const ConferenceOrderByWithRelationInputSchema: z.ZodType<Prisma.ConferenceOrderByWithRelationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ConferenceWhereUniqueInputSchema: z.ZodType<Prisma.ConferenceWhereUniqueInput> =
  z
    .object({
      id: z.number().int().optional(),
      name: z.string().optional(),
    })
    .strict();

export const ConferenceOrderByWithAggregationInputSchema: z.ZodType<Prisma.ConferenceOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      _count: z
        .lazy(() => ConferenceCountOrderByAggregateInputSchema)
        .optional(),
      _avg: z.lazy(() => ConferenceAvgOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => ConferenceMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => ConferenceMinOrderByAggregateInputSchema).optional(),
      _sum: z.lazy(() => ConferenceSumOrderByAggregateInputSchema).optional(),
    })
    .strict();

export const ConferenceScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ConferenceScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => ConferenceScalarWhereWithAggregatesInputSchema),
          z.lazy(() => ConferenceScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => ConferenceScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => ConferenceScalarWhereWithAggregatesInputSchema),
          z.lazy(() => ConferenceScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      name: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
    })
    .strict();

export const ConferenceCreateTokenWhereInputSchema: z.ZodType<Prisma.ConferenceCreateTokenWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => ConferenceCreateTokenWhereInputSchema),
          z.lazy(() => ConferenceCreateTokenWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => ConferenceCreateTokenWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => ConferenceCreateTokenWhereInputSchema),
          z.lazy(() => ConferenceCreateTokenWhereInputSchema).array(),
        ])
        .optional(),
      token: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    })
    .strict();

export const ConferenceCreateTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.ConferenceCreateTokenOrderByWithRelationInput> =
  z
    .object({
      token: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ConferenceCreateTokenWhereUniqueInputSchema: z.ZodType<Prisma.ConferenceCreateTokenWhereUniqueInput> =
  z
    .object({
      token: z.string().optional(),
    })
    .strict();

export const ConferenceCreateTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.ConferenceCreateTokenOrderByWithAggregationInput> =
  z
    .object({
      token: z.lazy(() => SortOrderSchema).optional(),
      _count: z
        .lazy(() => ConferenceCreateTokenCountOrderByAggregateInputSchema)
        .optional(),
      _max: z
        .lazy(() => ConferenceCreateTokenMaxOrderByAggregateInputSchema)
        .optional(),
      _min: z
        .lazy(() => ConferenceCreateTokenMinOrderByAggregateInputSchema)
        .optional(),
    })
    .strict();

export const ConferenceCreateTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ConferenceCreateTokenScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(
            () => ConferenceCreateTokenScalarWhereWithAggregatesInputSchema,
          ),
          z
            .lazy(
              () => ConferenceCreateTokenScalarWhereWithAggregatesInputSchema,
            )
            .array(),
        ])
        .optional(),
      OR: z
        .lazy(() => ConferenceCreateTokenScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(
            () => ConferenceCreateTokenScalarWhereWithAggregatesInputSchema,
          ),
          z
            .lazy(
              () => ConferenceCreateTokenScalarWhereWithAggregatesInputSchema,
            )
            .array(),
        ])
        .optional(),
      token: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
    })
    .strict();

export const ConferenceCreateInputSchema: z.ZodType<Prisma.ConferenceCreateInput> =
  z
    .object({
      name: z.string(),
    })
    .strict();

export const ConferenceUncheckedCreateInputSchema: z.ZodType<Prisma.ConferenceUncheckedCreateInput> =
  z
    .object({
      id: z.number().int().optional(),
      name: z.string(),
    })
    .strict();

export const ConferenceUpdateInputSchema: z.ZodType<Prisma.ConferenceUpdateInput> =
  z
    .object({
      name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ConferenceUncheckedUpdateInputSchema: z.ZodType<Prisma.ConferenceUncheckedUpdateInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ConferenceCreateManyInputSchema: z.ZodType<Prisma.ConferenceCreateManyInput> =
  z
    .object({
      id: z.number().int().optional(),
      name: z.string(),
    })
    .strict();

export const ConferenceUpdateManyMutationInputSchema: z.ZodType<Prisma.ConferenceUpdateManyMutationInput> =
  z
    .object({
      name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ConferenceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ConferenceUncheckedUpdateManyInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ConferenceCreateTokenCreateInputSchema: z.ZodType<Prisma.ConferenceCreateTokenCreateInput> =
  z
    .object({
      token: z.string(),
    })
    .strict();

export const ConferenceCreateTokenUncheckedCreateInputSchema: z.ZodType<Prisma.ConferenceCreateTokenUncheckedCreateInput> =
  z
    .object({
      token: z.string(),
    })
    .strict();

export const ConferenceCreateTokenUpdateInputSchema: z.ZodType<Prisma.ConferenceCreateTokenUpdateInput> =
  z
    .object({
      token: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ConferenceCreateTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.ConferenceCreateTokenUncheckedUpdateInput> =
  z
    .object({
      token: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ConferenceCreateTokenCreateManyInputSchema: z.ZodType<Prisma.ConferenceCreateTokenCreateManyInput> =
  z
    .object({
      token: z.string(),
    })
    .strict();

export const ConferenceCreateTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.ConferenceCreateTokenUpdateManyMutationInput> =
  z
    .object({
      token: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ConferenceCreateTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ConferenceCreateTokenUncheckedUpdateManyInput> =
  z
    .object({
      token: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z
  .object({
    equals: z.number().optional(),
    in: z.union([z.number().array(), z.number()]).optional(),
    notIn: z.union([z.number().array(), z.number()]).optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
  })
  .strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z
  .object({
    equals: z.string().optional(),
    in: z.union([z.string().array(), z.string()]).optional(),
    notIn: z.union([z.string().array(), z.string()]).optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    mode: z.lazy(() => QueryModeSchema).optional(),
    not: z
      .union([z.string(), z.lazy(() => NestedStringFilterSchema)])
      .optional(),
  })
  .strict();

export const ConferenceCountOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ConferenceAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceAvgOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ConferenceMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceMaxOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ConferenceMinOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceMinOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ConferenceSumOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceSumOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> =
  z
    .object({
      equals: z.number().optional(),
      in: z.union([z.number().array(), z.number()]).optional(),
      notIn: z.union([z.number().array(), z.number()]).optional(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([z.number(), z.lazy(() => NestedIntWithAggregatesFilterSchema)])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
      _sum: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedIntFilterSchema).optional(),
      _max: z.lazy(() => NestedIntFilterSchema).optional(),
    })
    .strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> =
  z
    .object({
      equals: z.string().optional(),
      in: z.union([z.string().array(), z.string()]).optional(),
      notIn: z.union([z.string().array(), z.string()]).optional(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      mode: z.lazy(() => QueryModeSchema).optional(),
      not: z
        .union([
          z.string(),
          z.lazy(() => NestedStringWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedStringFilterSchema).optional(),
      _max: z.lazy(() => NestedStringFilterSchema).optional(),
    })
    .strict();

export const ConferenceCreateTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceCreateTokenCountOrderByAggregateInput> =
  z
    .object({
      token: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ConferenceCreateTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceCreateTokenMaxOrderByAggregateInput> =
  z
    .object({
      token: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ConferenceCreateTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceCreateTokenMinOrderByAggregateInput> =
  z
    .object({
      token: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> =
  z
    .object({
      set: z.string().optional(),
    })
    .strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> =
  z
    .object({
      set: z.number().optional(),
      increment: z.number().optional(),
      decrement: z.number().optional(),
      multiply: z.number().optional(),
      divide: z.number().optional(),
    })
    .strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z
  .object({
    equals: z.number().optional(),
    in: z.union([z.number().array(), z.number()]).optional(),
    notIn: z.union([z.number().array(), z.number()]).optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
  })
  .strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z
  .object({
    equals: z.string().optional(),
    in: z.union([z.string().array(), z.string()]).optional(),
    notIn: z.union([z.string().array(), z.string()]).optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    not: z
      .union([z.string(), z.lazy(() => NestedStringFilterSchema)])
      .optional(),
  })
  .strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> =
  z
    .object({
      equals: z.number().optional(),
      in: z.union([z.number().array(), z.number()]).optional(),
      notIn: z.union([z.number().array(), z.number()]).optional(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([z.number(), z.lazy(() => NestedIntWithAggregatesFilterSchema)])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
      _sum: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedIntFilterSchema).optional(),
      _max: z.lazy(() => NestedIntFilterSchema).optional(),
    })
    .strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z
  .object({
    equals: z.number().optional(),
    in: z.union([z.number().array(), z.number()]).optional(),
    notIn: z.union([z.number().array(), z.number()]).optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z
      .union([z.number(), z.lazy(() => NestedFloatFilterSchema)])
      .optional(),
  })
  .strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> =
  z
    .object({
      equals: z.string().optional(),
      in: z.union([z.string().array(), z.string()]).optional(),
      notIn: z.union([z.string().array(), z.string()]).optional(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      not: z
        .union([
          z.string(),
          z.lazy(() => NestedStringWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedStringFilterSchema).optional(),
      _max: z.lazy(() => NestedStringFilterSchema).optional(),
    })
    .strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const ConferenceFindFirstArgsSchema: z.ZodType<Prisma.ConferenceFindFirstArgs> =
  z
    .object({
      select: ConferenceSelectSchema.optional(),
      where: ConferenceWhereInputSchema.optional(),
      orderBy: z
        .union([
          ConferenceOrderByWithRelationInputSchema.array(),
          ConferenceOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ConferenceWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: ConferenceScalarFieldEnumSchema.array().optional(),
    })
    .strict();

export const ConferenceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ConferenceFindFirstOrThrowArgs> =
  z
    .object({
      select: ConferenceSelectSchema.optional(),
      where: ConferenceWhereInputSchema.optional(),
      orderBy: z
        .union([
          ConferenceOrderByWithRelationInputSchema.array(),
          ConferenceOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ConferenceWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: ConferenceScalarFieldEnumSchema.array().optional(),
    })
    .strict();

export const ConferenceFindManyArgsSchema: z.ZodType<Prisma.ConferenceFindManyArgs> =
  z
    .object({
      select: ConferenceSelectSchema.optional(),
      where: ConferenceWhereInputSchema.optional(),
      orderBy: z
        .union([
          ConferenceOrderByWithRelationInputSchema.array(),
          ConferenceOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ConferenceWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: ConferenceScalarFieldEnumSchema.array().optional(),
    })
    .strict();

export const ConferenceAggregateArgsSchema: z.ZodType<Prisma.ConferenceAggregateArgs> =
  z
    .object({
      where: ConferenceWhereInputSchema.optional(),
      orderBy: z
        .union([
          ConferenceOrderByWithRelationInputSchema.array(),
          ConferenceOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ConferenceWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const ConferenceGroupByArgsSchema: z.ZodType<Prisma.ConferenceGroupByArgs> =
  z
    .object({
      where: ConferenceWhereInputSchema.optional(),
      orderBy: z
        .union([
          ConferenceOrderByWithAggregationInputSchema.array(),
          ConferenceOrderByWithAggregationInputSchema,
        ])
        .optional(),
      by: ConferenceScalarFieldEnumSchema.array(),
      having: ConferenceScalarWhereWithAggregatesInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const ConferenceFindUniqueArgsSchema: z.ZodType<Prisma.ConferenceFindUniqueArgs> =
  z
    .object({
      select: ConferenceSelectSchema.optional(),
      where: ConferenceWhereUniqueInputSchema,
    })
    .strict();

export const ConferenceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ConferenceFindUniqueOrThrowArgs> =
  z
    .object({
      select: ConferenceSelectSchema.optional(),
      where: ConferenceWhereUniqueInputSchema,
    })
    .strict();

export const ConferenceCreateTokenFindFirstArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenFindFirstArgs> =
  z
    .object({
      select: ConferenceCreateTokenSelectSchema.optional(),
      where: ConferenceCreateTokenWhereInputSchema.optional(),
      orderBy: z
        .union([
          ConferenceCreateTokenOrderByWithRelationInputSchema.array(),
          ConferenceCreateTokenOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ConferenceCreateTokenWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: ConferenceCreateTokenScalarFieldEnumSchema.array().optional(),
    })
    .strict();

export const ConferenceCreateTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenFindFirstOrThrowArgs> =
  z
    .object({
      select: ConferenceCreateTokenSelectSchema.optional(),
      where: ConferenceCreateTokenWhereInputSchema.optional(),
      orderBy: z
        .union([
          ConferenceCreateTokenOrderByWithRelationInputSchema.array(),
          ConferenceCreateTokenOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ConferenceCreateTokenWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: ConferenceCreateTokenScalarFieldEnumSchema.array().optional(),
    })
    .strict();

export const ConferenceCreateTokenFindManyArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenFindManyArgs> =
  z
    .object({
      select: ConferenceCreateTokenSelectSchema.optional(),
      where: ConferenceCreateTokenWhereInputSchema.optional(),
      orderBy: z
        .union([
          ConferenceCreateTokenOrderByWithRelationInputSchema.array(),
          ConferenceCreateTokenOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ConferenceCreateTokenWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: ConferenceCreateTokenScalarFieldEnumSchema.array().optional(),
    })
    .strict();

export const ConferenceCreateTokenAggregateArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenAggregateArgs> =
  z
    .object({
      where: ConferenceCreateTokenWhereInputSchema.optional(),
      orderBy: z
        .union([
          ConferenceCreateTokenOrderByWithRelationInputSchema.array(),
          ConferenceCreateTokenOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: ConferenceCreateTokenWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const ConferenceCreateTokenGroupByArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenGroupByArgs> =
  z
    .object({
      where: ConferenceCreateTokenWhereInputSchema.optional(),
      orderBy: z
        .union([
          ConferenceCreateTokenOrderByWithAggregationInputSchema.array(),
          ConferenceCreateTokenOrderByWithAggregationInputSchema,
        ])
        .optional(),
      by: ConferenceCreateTokenScalarFieldEnumSchema.array(),
      having:
        ConferenceCreateTokenScalarWhereWithAggregatesInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const ConferenceCreateTokenFindUniqueArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenFindUniqueArgs> =
  z
    .object({
      select: ConferenceCreateTokenSelectSchema.optional(),
      where: ConferenceCreateTokenWhereUniqueInputSchema,
    })
    .strict();

export const ConferenceCreateTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenFindUniqueOrThrowArgs> =
  z
    .object({
      select: ConferenceCreateTokenSelectSchema.optional(),
      where: ConferenceCreateTokenWhereUniqueInputSchema,
    })
    .strict();

export const ConferenceCreateArgsSchema: z.ZodType<Prisma.ConferenceCreateArgs> =
  z
    .object({
      select: ConferenceSelectSchema.optional(),
      data: z.union([
        ConferenceCreateInputSchema,
        ConferenceUncheckedCreateInputSchema,
      ]),
    })
    .strict();

export const ConferenceUpsertArgsSchema: z.ZodType<Prisma.ConferenceUpsertArgs> =
  z
    .object({
      select: ConferenceSelectSchema.optional(),
      where: ConferenceWhereUniqueInputSchema,
      create: z.union([
        ConferenceCreateInputSchema,
        ConferenceUncheckedCreateInputSchema,
      ]),
      update: z.union([
        ConferenceUpdateInputSchema,
        ConferenceUncheckedUpdateInputSchema,
      ]),
    })
    .strict();

export const ConferenceCreateManyArgsSchema: z.ZodType<Prisma.ConferenceCreateManyArgs> =
  z
    .object({
      data: z.union([
        ConferenceCreateManyInputSchema,
        ConferenceCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const ConferenceDeleteArgsSchema: z.ZodType<Prisma.ConferenceDeleteArgs> =
  z
    .object({
      select: ConferenceSelectSchema.optional(),
      where: ConferenceWhereUniqueInputSchema,
    })
    .strict();

export const ConferenceUpdateArgsSchema: z.ZodType<Prisma.ConferenceUpdateArgs> =
  z
    .object({
      select: ConferenceSelectSchema.optional(),
      data: z.union([
        ConferenceUpdateInputSchema,
        ConferenceUncheckedUpdateInputSchema,
      ]),
      where: ConferenceWhereUniqueInputSchema,
    })
    .strict();

export const ConferenceUpdateManyArgsSchema: z.ZodType<Prisma.ConferenceUpdateManyArgs> =
  z
    .object({
      data: z.union([
        ConferenceUpdateManyMutationInputSchema,
        ConferenceUncheckedUpdateManyInputSchema,
      ]),
      where: ConferenceWhereInputSchema.optional(),
    })
    .strict();

export const ConferenceDeleteManyArgsSchema: z.ZodType<Prisma.ConferenceDeleteManyArgs> =
  z
    .object({
      where: ConferenceWhereInputSchema.optional(),
    })
    .strict();

export const ConferenceCreateTokenCreateArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenCreateArgs> =
  z
    .object({
      select: ConferenceCreateTokenSelectSchema.optional(),
      data: z.union([
        ConferenceCreateTokenCreateInputSchema,
        ConferenceCreateTokenUncheckedCreateInputSchema,
      ]),
    })
    .strict();

export const ConferenceCreateTokenUpsertArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenUpsertArgs> =
  z
    .object({
      select: ConferenceCreateTokenSelectSchema.optional(),
      where: ConferenceCreateTokenWhereUniqueInputSchema,
      create: z.union([
        ConferenceCreateTokenCreateInputSchema,
        ConferenceCreateTokenUncheckedCreateInputSchema,
      ]),
      update: z.union([
        ConferenceCreateTokenUpdateInputSchema,
        ConferenceCreateTokenUncheckedUpdateInputSchema,
      ]),
    })
    .strict();

export const ConferenceCreateTokenCreateManyArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenCreateManyArgs> =
  z
    .object({
      data: z.union([
        ConferenceCreateTokenCreateManyInputSchema,
        ConferenceCreateTokenCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const ConferenceCreateTokenDeleteArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenDeleteArgs> =
  z
    .object({
      select: ConferenceCreateTokenSelectSchema.optional(),
      where: ConferenceCreateTokenWhereUniqueInputSchema,
    })
    .strict();

export const ConferenceCreateTokenUpdateArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenUpdateArgs> =
  z
    .object({
      select: ConferenceCreateTokenSelectSchema.optional(),
      data: z.union([
        ConferenceCreateTokenUpdateInputSchema,
        ConferenceCreateTokenUncheckedUpdateInputSchema,
      ]),
      where: ConferenceCreateTokenWhereUniqueInputSchema,
    })
    .strict();

export const ConferenceCreateTokenUpdateManyArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenUpdateManyArgs> =
  z
    .object({
      data: z.union([
        ConferenceCreateTokenUpdateManyMutationInputSchema,
        ConferenceCreateTokenUncheckedUpdateManyInputSchema,
      ]),
      where: ConferenceCreateTokenWhereInputSchema.optional(),
    })
    .strict();

export const ConferenceCreateTokenDeleteManyArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenDeleteManyArgs> =
  z
    .object({
      where: ConferenceCreateTokenWhereInputSchema.optional(),
    })
    .strict();
