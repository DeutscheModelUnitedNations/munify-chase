import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const ConferenceScalarFieldEnumSchema = z.enum(['id','name']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// CONFERENCE SCHEMA
/////////////////////////////////////////

export const ConferenceSchema = z.object({
  id: z.number().int(),
  name: z.string(),
})

export type Conference = z.infer<typeof ConferenceSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// CONFERENCE
//------------------------------------------------------

export const ConferenceSelectSchema: z.ZodType<Prisma.ConferenceSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const ConferenceWhereInputSchema: z.ZodType<Prisma.ConferenceWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ConferenceWhereInputSchema),z.lazy(() => ConferenceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ConferenceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ConferenceWhereInputSchema),z.lazy(() => ConferenceWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const ConferenceOrderByWithRelationInputSchema: z.ZodType<Prisma.ConferenceOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConferenceWhereUniqueInputSchema: z.ZodType<Prisma.ConferenceWhereUniqueInput> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional()
}).strict();

export const ConferenceOrderByWithAggregationInputSchema: z.ZodType<Prisma.ConferenceOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ConferenceCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ConferenceAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ConferenceMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ConferenceMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ConferenceSumOrderByAggregateInputSchema).optional()
}).strict();

export const ConferenceScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ConferenceScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ConferenceScalarWhereWithAggregatesInputSchema),z.lazy(() => ConferenceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ConferenceScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ConferenceScalarWhereWithAggregatesInputSchema),z.lazy(() => ConferenceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const ConferenceCreateInputSchema: z.ZodType<Prisma.ConferenceCreateInput> = z.object({
  name: z.string()
}).strict();

export const ConferenceUncheckedCreateInputSchema: z.ZodType<Prisma.ConferenceUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string()
}).strict();

export const ConferenceUpdateInputSchema: z.ZodType<Prisma.ConferenceUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConferenceUncheckedUpdateInputSchema: z.ZodType<Prisma.ConferenceUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConferenceCreateManyInputSchema: z.ZodType<Prisma.ConferenceCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string()
}).strict();

export const ConferenceUpdateManyMutationInputSchema: z.ZodType<Prisma.ConferenceUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConferenceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ConferenceUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.union([ z.number().array(),z.number() ]).optional(),
  notIn: z.union([ z.number().array(),z.number() ]).optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.union([ z.string().array(),z.string() ]).optional(),
  notIn: z.union([ z.string().array(),z.string() ]).optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const ConferenceCountOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConferenceAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConferenceMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConferenceMinOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConferenceSumOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.union([ z.number().array(),z.number() ]).optional(),
  notIn: z.union([ z.number().array(),z.number() ]).optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.union([ z.string().array(),z.string() ]).optional(),
  notIn: z.union([ z.string().array(),z.string() ]).optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.union([ z.number().array(),z.number() ]).optional(),
  notIn: z.union([ z.number().array(),z.number() ]).optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.union([ z.string().array(),z.string() ]).optional(),
  notIn: z.union([ z.string().array(),z.string() ]).optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.union([ z.number().array(),z.number() ]).optional(),
  notIn: z.union([ z.number().array(),z.number() ]).optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.union([ z.number().array(),z.number() ]).optional(),
  notIn: z.union([ z.number().array(),z.number() ]).optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.union([ z.string().array(),z.string() ]).optional(),
  notIn: z.union([ z.string().array(),z.string() ]).optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const ConferenceFindFirstArgsSchema: z.ZodType<Prisma.ConferenceFindFirstArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  where: ConferenceWhereInputSchema.optional(),
  orderBy: z.union([ ConferenceOrderByWithRelationInputSchema.array(),ConferenceOrderByWithRelationInputSchema ]).optional(),
  cursor: ConferenceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ConferenceScalarFieldEnumSchema.array().optional(),
}).strict()

export const ConferenceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ConferenceFindFirstOrThrowArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  where: ConferenceWhereInputSchema.optional(),
  orderBy: z.union([ ConferenceOrderByWithRelationInputSchema.array(),ConferenceOrderByWithRelationInputSchema ]).optional(),
  cursor: ConferenceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ConferenceScalarFieldEnumSchema.array().optional(),
}).strict()

export const ConferenceFindManyArgsSchema: z.ZodType<Prisma.ConferenceFindManyArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  where: ConferenceWhereInputSchema.optional(),
  orderBy: z.union([ ConferenceOrderByWithRelationInputSchema.array(),ConferenceOrderByWithRelationInputSchema ]).optional(),
  cursor: ConferenceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ConferenceScalarFieldEnumSchema.array().optional(),
}).strict()

export const ConferenceAggregateArgsSchema: z.ZodType<Prisma.ConferenceAggregateArgs> = z.object({
  where: ConferenceWhereInputSchema.optional(),
  orderBy: z.union([ ConferenceOrderByWithRelationInputSchema.array(),ConferenceOrderByWithRelationInputSchema ]).optional(),
  cursor: ConferenceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ConferenceGroupByArgsSchema: z.ZodType<Prisma.ConferenceGroupByArgs> = z.object({
  where: ConferenceWhereInputSchema.optional(),
  orderBy: z.union([ ConferenceOrderByWithAggregationInputSchema.array(),ConferenceOrderByWithAggregationInputSchema ]).optional(),
  by: ConferenceScalarFieldEnumSchema.array(),
  having: ConferenceScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ConferenceFindUniqueArgsSchema: z.ZodType<Prisma.ConferenceFindUniqueArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  where: ConferenceWhereUniqueInputSchema,
}).strict()

export const ConferenceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ConferenceFindUniqueOrThrowArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  where: ConferenceWhereUniqueInputSchema,
}).strict()

export const ConferenceCreateArgsSchema: z.ZodType<Prisma.ConferenceCreateArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  data: z.union([ ConferenceCreateInputSchema,ConferenceUncheckedCreateInputSchema ]),
}).strict()

export const ConferenceUpsertArgsSchema: z.ZodType<Prisma.ConferenceUpsertArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  where: ConferenceWhereUniqueInputSchema,
  create: z.union([ ConferenceCreateInputSchema,ConferenceUncheckedCreateInputSchema ]),
  update: z.union([ ConferenceUpdateInputSchema,ConferenceUncheckedUpdateInputSchema ]),
}).strict()

export const ConferenceCreateManyArgsSchema: z.ZodType<Prisma.ConferenceCreateManyArgs> = z.object({
  data: z.union([ ConferenceCreateManyInputSchema,ConferenceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const ConferenceDeleteArgsSchema: z.ZodType<Prisma.ConferenceDeleteArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  where: ConferenceWhereUniqueInputSchema,
}).strict()

export const ConferenceUpdateArgsSchema: z.ZodType<Prisma.ConferenceUpdateArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  data: z.union([ ConferenceUpdateInputSchema,ConferenceUncheckedUpdateInputSchema ]),
  where: ConferenceWhereUniqueInputSchema,
}).strict()

export const ConferenceUpdateManyArgsSchema: z.ZodType<Prisma.ConferenceUpdateManyArgs> = z.object({
  data: z.union([ ConferenceUpdateManyMutationInputSchema,ConferenceUncheckedUpdateManyInputSchema ]),
  where: ConferenceWhereInputSchema.optional(),
}).strict()

export const ConferenceDeleteManyArgsSchema: z.ZodType<Prisma.ConferenceDeleteManyArgs> = z.object({
  where: ConferenceWhereInputSchema.optional(),
}).strict()