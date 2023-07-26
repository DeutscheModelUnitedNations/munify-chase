import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const ConferenceCreateTokenScalarFieldEnumSchema = z.enum(['token']);

export const ConferenceScalarFieldEnumSchema = z.enum(['id','name']);

export const OIDCUserScalarFieldEnumSchema = z.enum(['oidcUserId','name']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);
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
})

export type Conference = z.infer<typeof ConferenceSchema>

/////////////////////////////////////////
// CONFERENCE CREATE TOKEN SCHEMA
/////////////////////////////////////////

/**
 * Consumeable token which grants the creation of a conference
 */
export const ConferenceCreateTokenSchema = z.object({
  token: z.string(),
})

export type ConferenceCreateToken = z.infer<typeof ConferenceCreateTokenSchema>

/////////////////////////////////////////
// OIDC USER SCHEMA
/////////////////////////////////////////

/**
 * A reference to a OIDC user
 */
export const OIDCUserSchema = z.object({
  oidcUserId: z.number().int(),
  name: z.string(),
})

export type OIDCUser = z.infer<typeof OIDCUserSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// CONFERENCE
//------------------------------------------------------

export const ConferenceIncludeSchema: z.ZodType<Prisma.ConferenceInclude> = z.object({
  admins: z.union([z.boolean(),z.lazy(() => OIDCUserFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ConferenceCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ConferenceArgsSchema: z.ZodType<Prisma.ConferenceArgs> = z.object({
  select: z.lazy(() => ConferenceSelectSchema).optional(),
  include: z.lazy(() => ConferenceIncludeSchema).optional(),
}).strict();

export const ConferenceCountOutputTypeArgsSchema: z.ZodType<Prisma.ConferenceCountOutputTypeArgs> = z.object({
  select: z.lazy(() => ConferenceCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ConferenceCountOutputTypeSelectSchema: z.ZodType<Prisma.ConferenceCountOutputTypeSelect> = z.object({
  admins: z.boolean().optional(),
}).strict();

export const ConferenceSelectSchema: z.ZodType<Prisma.ConferenceSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  admins: z.union([z.boolean(),z.lazy(() => OIDCUserFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ConferenceCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CONFERENCE CREATE TOKEN
//------------------------------------------------------

export const ConferenceCreateTokenSelectSchema: z.ZodType<Prisma.ConferenceCreateTokenSelect> = z.object({
  token: z.boolean().optional(),
}).strict()

// OIDC USER
//------------------------------------------------------

export const OIDCUserIncludeSchema: z.ZodType<Prisma.OIDCUserInclude> = z.object({
  conferences: z.union([z.boolean(),z.lazy(() => ConferenceFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OIDCUserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const OIDCUserArgsSchema: z.ZodType<Prisma.OIDCUserArgs> = z.object({
  select: z.lazy(() => OIDCUserSelectSchema).optional(),
  include: z.lazy(() => OIDCUserIncludeSchema).optional(),
}).strict();

export const OIDCUserCountOutputTypeArgsSchema: z.ZodType<Prisma.OIDCUserCountOutputTypeArgs> = z.object({
  select: z.lazy(() => OIDCUserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const OIDCUserCountOutputTypeSelectSchema: z.ZodType<Prisma.OIDCUserCountOutputTypeSelect> = z.object({
  conferences: z.boolean().optional(),
}).strict();

export const OIDCUserSelectSchema: z.ZodType<Prisma.OIDCUserSelect> = z.object({
  oidcUserId: z.boolean().optional(),
  name: z.boolean().optional(),
  conferences: z.union([z.boolean(),z.lazy(() => ConferenceFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OIDCUserCountOutputTypeArgsSchema)]).optional(),
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
  admins: z.lazy(() => OIDCUserListRelationFilterSchema).optional()
}).strict();

export const ConferenceOrderByWithRelationInputSchema: z.ZodType<Prisma.ConferenceOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  admins: z.lazy(() => OIDCUserOrderByRelationAggregateInputSchema).optional()
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

export const ConferenceCreateTokenWhereInputSchema: z.ZodType<Prisma.ConferenceCreateTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ConferenceCreateTokenWhereInputSchema),z.lazy(() => ConferenceCreateTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ConferenceCreateTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ConferenceCreateTokenWhereInputSchema),z.lazy(() => ConferenceCreateTokenWhereInputSchema).array() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const ConferenceCreateTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.ConferenceCreateTokenOrderByWithRelationInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConferenceCreateTokenWhereUniqueInputSchema: z.ZodType<Prisma.ConferenceCreateTokenWhereUniqueInput> = z.object({
  token: z.string().optional()
}).strict();

export const ConferenceCreateTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.ConferenceCreateTokenOrderByWithAggregationInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ConferenceCreateTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ConferenceCreateTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ConferenceCreateTokenMinOrderByAggregateInputSchema).optional()
}).strict();

export const ConferenceCreateTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ConferenceCreateTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ConferenceCreateTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => ConferenceCreateTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ConferenceCreateTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ConferenceCreateTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => ConferenceCreateTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const OIDCUserWhereInputSchema: z.ZodType<Prisma.OIDCUserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OIDCUserWhereInputSchema),z.lazy(() => OIDCUserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OIDCUserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OIDCUserWhereInputSchema),z.lazy(() => OIDCUserWhereInputSchema).array() ]).optional(),
  oidcUserId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  conferences: z.lazy(() => ConferenceListRelationFilterSchema).optional()
}).strict();

export const OIDCUserOrderByWithRelationInputSchema: z.ZodType<Prisma.OIDCUserOrderByWithRelationInput> = z.object({
  oidcUserId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  conferences: z.lazy(() => ConferenceOrderByRelationAggregateInputSchema).optional()
}).strict();

export const OIDCUserWhereUniqueInputSchema: z.ZodType<Prisma.OIDCUserWhereUniqueInput> = z.object({
  oidcUserId: z.number().int().optional()
}).strict();

export const OIDCUserOrderByWithAggregationInputSchema: z.ZodType<Prisma.OIDCUserOrderByWithAggregationInput> = z.object({
  oidcUserId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OIDCUserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OIDCUserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OIDCUserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OIDCUserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OIDCUserSumOrderByAggregateInputSchema).optional()
}).strict();

export const OIDCUserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OIDCUserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OIDCUserScalarWhereWithAggregatesInputSchema),z.lazy(() => OIDCUserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OIDCUserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OIDCUserScalarWhereWithAggregatesInputSchema),z.lazy(() => OIDCUserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  oidcUserId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const ConferenceCreateInputSchema: z.ZodType<Prisma.ConferenceCreateInput> = z.object({
  name: z.string(),
  admins: z.lazy(() => OIDCUserCreateNestedManyWithoutConferencesInputSchema).optional()
}).strict();

export const ConferenceUncheckedCreateInputSchema: z.ZodType<Prisma.ConferenceUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  admins: z.lazy(() => OIDCUserUncheckedCreateNestedManyWithoutConferencesInputSchema).optional()
}).strict();

export const ConferenceUpdateInputSchema: z.ZodType<Prisma.ConferenceUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  admins: z.lazy(() => OIDCUserUpdateManyWithoutConferencesNestedInputSchema).optional()
}).strict();

export const ConferenceUncheckedUpdateInputSchema: z.ZodType<Prisma.ConferenceUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  admins: z.lazy(() => OIDCUserUncheckedUpdateManyWithoutConferencesNestedInputSchema).optional()
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

export const ConferenceCreateTokenCreateInputSchema: z.ZodType<Prisma.ConferenceCreateTokenCreateInput> = z.object({
  token: z.string()
}).strict();

export const ConferenceCreateTokenUncheckedCreateInputSchema: z.ZodType<Prisma.ConferenceCreateTokenUncheckedCreateInput> = z.object({
  token: z.string()
}).strict();

export const ConferenceCreateTokenUpdateInputSchema: z.ZodType<Prisma.ConferenceCreateTokenUpdateInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConferenceCreateTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.ConferenceCreateTokenUncheckedUpdateInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConferenceCreateTokenCreateManyInputSchema: z.ZodType<Prisma.ConferenceCreateTokenCreateManyInput> = z.object({
  token: z.string()
}).strict();

export const ConferenceCreateTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.ConferenceCreateTokenUpdateManyMutationInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConferenceCreateTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ConferenceCreateTokenUncheckedUpdateManyInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OIDCUserCreateInputSchema: z.ZodType<Prisma.OIDCUserCreateInput> = z.object({
  oidcUserId: z.number().int(),
  name: z.string(),
  conferences: z.lazy(() => ConferenceCreateNestedManyWithoutAdminsInputSchema).optional()
}).strict();

export const OIDCUserUncheckedCreateInputSchema: z.ZodType<Prisma.OIDCUserUncheckedCreateInput> = z.object({
  oidcUserId: z.number().int(),
  name: z.string(),
  conferences: z.lazy(() => ConferenceUncheckedCreateNestedManyWithoutAdminsInputSchema).optional()
}).strict();

export const OIDCUserUpdateInputSchema: z.ZodType<Prisma.OIDCUserUpdateInput> = z.object({
  oidcUserId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  conferences: z.lazy(() => ConferenceUpdateManyWithoutAdminsNestedInputSchema).optional()
}).strict();

export const OIDCUserUncheckedUpdateInputSchema: z.ZodType<Prisma.OIDCUserUncheckedUpdateInput> = z.object({
  oidcUserId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  conferences: z.lazy(() => ConferenceUncheckedUpdateManyWithoutAdminsNestedInputSchema).optional()
}).strict();

export const OIDCUserCreateManyInputSchema: z.ZodType<Prisma.OIDCUserCreateManyInput> = z.object({
  oidcUserId: z.number().int(),
  name: z.string()
}).strict();

export const OIDCUserUpdateManyMutationInputSchema: z.ZodType<Prisma.OIDCUserUpdateManyMutationInput> = z.object({
  oidcUserId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OIDCUserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OIDCUserUncheckedUpdateManyInput> = z.object({
  oidcUserId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
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

export const OIDCUserListRelationFilterSchema: z.ZodType<Prisma.OIDCUserListRelationFilter> = z.object({
  every: z.lazy(() => OIDCUserWhereInputSchema).optional(),
  some: z.lazy(() => OIDCUserWhereInputSchema).optional(),
  none: z.lazy(() => OIDCUserWhereInputSchema).optional()
}).strict();

export const OIDCUserOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OIDCUserOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
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

export const ConferenceCreateTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceCreateTokenCountOrderByAggregateInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConferenceCreateTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceCreateTokenMaxOrderByAggregateInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConferenceCreateTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.ConferenceCreateTokenMinOrderByAggregateInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConferenceListRelationFilterSchema: z.ZodType<Prisma.ConferenceListRelationFilter> = z.object({
  every: z.lazy(() => ConferenceWhereInputSchema).optional(),
  some: z.lazy(() => ConferenceWhereInputSchema).optional(),
  none: z.lazy(() => ConferenceWhereInputSchema).optional()
}).strict();

export const ConferenceOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ConferenceOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OIDCUserCountOrderByAggregateInputSchema: z.ZodType<Prisma.OIDCUserCountOrderByAggregateInput> = z.object({
  oidcUserId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OIDCUserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OIDCUserAvgOrderByAggregateInput> = z.object({
  oidcUserId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OIDCUserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OIDCUserMaxOrderByAggregateInput> = z.object({
  oidcUserId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OIDCUserMinOrderByAggregateInputSchema: z.ZodType<Prisma.OIDCUserMinOrderByAggregateInput> = z.object({
  oidcUserId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OIDCUserSumOrderByAggregateInputSchema: z.ZodType<Prisma.OIDCUserSumOrderByAggregateInput> = z.object({
  oidcUserId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OIDCUserCreateNestedManyWithoutConferencesInputSchema: z.ZodType<Prisma.OIDCUserCreateNestedManyWithoutConferencesInput> = z.object({
  create: z.union([ z.lazy(() => OIDCUserCreateWithoutConferencesInputSchema),z.lazy(() => OIDCUserCreateWithoutConferencesInputSchema).array(),z.lazy(() => OIDCUserUncheckedCreateWithoutConferencesInputSchema),z.lazy(() => OIDCUserUncheckedCreateWithoutConferencesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OIDCUserCreateOrConnectWithoutConferencesInputSchema),z.lazy(() => OIDCUserCreateOrConnectWithoutConferencesInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OIDCUserWhereUniqueInputSchema),z.lazy(() => OIDCUserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OIDCUserUncheckedCreateNestedManyWithoutConferencesInputSchema: z.ZodType<Prisma.OIDCUserUncheckedCreateNestedManyWithoutConferencesInput> = z.object({
  create: z.union([ z.lazy(() => OIDCUserCreateWithoutConferencesInputSchema),z.lazy(() => OIDCUserCreateWithoutConferencesInputSchema).array(),z.lazy(() => OIDCUserUncheckedCreateWithoutConferencesInputSchema),z.lazy(() => OIDCUserUncheckedCreateWithoutConferencesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OIDCUserCreateOrConnectWithoutConferencesInputSchema),z.lazy(() => OIDCUserCreateOrConnectWithoutConferencesInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OIDCUserWhereUniqueInputSchema),z.lazy(() => OIDCUserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const OIDCUserUpdateManyWithoutConferencesNestedInputSchema: z.ZodType<Prisma.OIDCUserUpdateManyWithoutConferencesNestedInput> = z.object({
  create: z.union([ z.lazy(() => OIDCUserCreateWithoutConferencesInputSchema),z.lazy(() => OIDCUserCreateWithoutConferencesInputSchema).array(),z.lazy(() => OIDCUserUncheckedCreateWithoutConferencesInputSchema),z.lazy(() => OIDCUserUncheckedCreateWithoutConferencesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OIDCUserCreateOrConnectWithoutConferencesInputSchema),z.lazy(() => OIDCUserCreateOrConnectWithoutConferencesInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OIDCUserUpsertWithWhereUniqueWithoutConferencesInputSchema),z.lazy(() => OIDCUserUpsertWithWhereUniqueWithoutConferencesInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => OIDCUserWhereUniqueInputSchema),z.lazy(() => OIDCUserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OIDCUserWhereUniqueInputSchema),z.lazy(() => OIDCUserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OIDCUserWhereUniqueInputSchema),z.lazy(() => OIDCUserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OIDCUserWhereUniqueInputSchema),z.lazy(() => OIDCUserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OIDCUserUpdateWithWhereUniqueWithoutConferencesInputSchema),z.lazy(() => OIDCUserUpdateWithWhereUniqueWithoutConferencesInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OIDCUserUpdateManyWithWhereWithoutConferencesInputSchema),z.lazy(() => OIDCUserUpdateManyWithWhereWithoutConferencesInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OIDCUserScalarWhereInputSchema),z.lazy(() => OIDCUserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const OIDCUserUncheckedUpdateManyWithoutConferencesNestedInputSchema: z.ZodType<Prisma.OIDCUserUncheckedUpdateManyWithoutConferencesNestedInput> = z.object({
  create: z.union([ z.lazy(() => OIDCUserCreateWithoutConferencesInputSchema),z.lazy(() => OIDCUserCreateWithoutConferencesInputSchema).array(),z.lazy(() => OIDCUserUncheckedCreateWithoutConferencesInputSchema),z.lazy(() => OIDCUserUncheckedCreateWithoutConferencesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OIDCUserCreateOrConnectWithoutConferencesInputSchema),z.lazy(() => OIDCUserCreateOrConnectWithoutConferencesInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OIDCUserUpsertWithWhereUniqueWithoutConferencesInputSchema),z.lazy(() => OIDCUserUpsertWithWhereUniqueWithoutConferencesInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => OIDCUserWhereUniqueInputSchema),z.lazy(() => OIDCUserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OIDCUserWhereUniqueInputSchema),z.lazy(() => OIDCUserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OIDCUserWhereUniqueInputSchema),z.lazy(() => OIDCUserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OIDCUserWhereUniqueInputSchema),z.lazy(() => OIDCUserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OIDCUserUpdateWithWhereUniqueWithoutConferencesInputSchema),z.lazy(() => OIDCUserUpdateWithWhereUniqueWithoutConferencesInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OIDCUserUpdateManyWithWhereWithoutConferencesInputSchema),z.lazy(() => OIDCUserUpdateManyWithWhereWithoutConferencesInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OIDCUserScalarWhereInputSchema),z.lazy(() => OIDCUserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ConferenceCreateNestedManyWithoutAdminsInputSchema: z.ZodType<Prisma.ConferenceCreateNestedManyWithoutAdminsInput> = z.object({
  create: z.union([ z.lazy(() => ConferenceCreateWithoutAdminsInputSchema),z.lazy(() => ConferenceCreateWithoutAdminsInputSchema).array(),z.lazy(() => ConferenceUncheckedCreateWithoutAdminsInputSchema),z.lazy(() => ConferenceUncheckedCreateWithoutAdminsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConferenceCreateOrConnectWithoutAdminsInputSchema),z.lazy(() => ConferenceCreateOrConnectWithoutAdminsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ConferenceWhereUniqueInputSchema),z.lazy(() => ConferenceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ConferenceUncheckedCreateNestedManyWithoutAdminsInputSchema: z.ZodType<Prisma.ConferenceUncheckedCreateNestedManyWithoutAdminsInput> = z.object({
  create: z.union([ z.lazy(() => ConferenceCreateWithoutAdminsInputSchema),z.lazy(() => ConferenceCreateWithoutAdminsInputSchema).array(),z.lazy(() => ConferenceUncheckedCreateWithoutAdminsInputSchema),z.lazy(() => ConferenceUncheckedCreateWithoutAdminsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConferenceCreateOrConnectWithoutAdminsInputSchema),z.lazy(() => ConferenceCreateOrConnectWithoutAdminsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ConferenceWhereUniqueInputSchema),z.lazy(() => ConferenceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ConferenceUpdateManyWithoutAdminsNestedInputSchema: z.ZodType<Prisma.ConferenceUpdateManyWithoutAdminsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ConferenceCreateWithoutAdminsInputSchema),z.lazy(() => ConferenceCreateWithoutAdminsInputSchema).array(),z.lazy(() => ConferenceUncheckedCreateWithoutAdminsInputSchema),z.lazy(() => ConferenceUncheckedCreateWithoutAdminsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConferenceCreateOrConnectWithoutAdminsInputSchema),z.lazy(() => ConferenceCreateOrConnectWithoutAdminsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ConferenceUpsertWithWhereUniqueWithoutAdminsInputSchema),z.lazy(() => ConferenceUpsertWithWhereUniqueWithoutAdminsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ConferenceWhereUniqueInputSchema),z.lazy(() => ConferenceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ConferenceWhereUniqueInputSchema),z.lazy(() => ConferenceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ConferenceWhereUniqueInputSchema),z.lazy(() => ConferenceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ConferenceWhereUniqueInputSchema),z.lazy(() => ConferenceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ConferenceUpdateWithWhereUniqueWithoutAdminsInputSchema),z.lazy(() => ConferenceUpdateWithWhereUniqueWithoutAdminsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ConferenceUpdateManyWithWhereWithoutAdminsInputSchema),z.lazy(() => ConferenceUpdateManyWithWhereWithoutAdminsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ConferenceScalarWhereInputSchema),z.lazy(() => ConferenceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ConferenceUncheckedUpdateManyWithoutAdminsNestedInputSchema: z.ZodType<Prisma.ConferenceUncheckedUpdateManyWithoutAdminsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ConferenceCreateWithoutAdminsInputSchema),z.lazy(() => ConferenceCreateWithoutAdminsInputSchema).array(),z.lazy(() => ConferenceUncheckedCreateWithoutAdminsInputSchema),z.lazy(() => ConferenceUncheckedCreateWithoutAdminsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConferenceCreateOrConnectWithoutAdminsInputSchema),z.lazy(() => ConferenceCreateOrConnectWithoutAdminsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ConferenceUpsertWithWhereUniqueWithoutAdminsInputSchema),z.lazy(() => ConferenceUpsertWithWhereUniqueWithoutAdminsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ConferenceWhereUniqueInputSchema),z.lazy(() => ConferenceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ConferenceWhereUniqueInputSchema),z.lazy(() => ConferenceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ConferenceWhereUniqueInputSchema),z.lazy(() => ConferenceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ConferenceWhereUniqueInputSchema),z.lazy(() => ConferenceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ConferenceUpdateWithWhereUniqueWithoutAdminsInputSchema),z.lazy(() => ConferenceUpdateWithWhereUniqueWithoutAdminsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ConferenceUpdateManyWithWhereWithoutAdminsInputSchema),z.lazy(() => ConferenceUpdateManyWithWhereWithoutAdminsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ConferenceScalarWhereInputSchema),z.lazy(() => ConferenceScalarWhereInputSchema).array() ]).optional(),
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

export const OIDCUserCreateWithoutConferencesInputSchema: z.ZodType<Prisma.OIDCUserCreateWithoutConferencesInput> = z.object({
  oidcUserId: z.number().int(),
  name: z.string()
}).strict();

export const OIDCUserUncheckedCreateWithoutConferencesInputSchema: z.ZodType<Prisma.OIDCUserUncheckedCreateWithoutConferencesInput> = z.object({
  oidcUserId: z.number().int(),
  name: z.string()
}).strict();

export const OIDCUserCreateOrConnectWithoutConferencesInputSchema: z.ZodType<Prisma.OIDCUserCreateOrConnectWithoutConferencesInput> = z.object({
  where: z.lazy(() => OIDCUserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OIDCUserCreateWithoutConferencesInputSchema),z.lazy(() => OIDCUserUncheckedCreateWithoutConferencesInputSchema) ]),
}).strict();

export const OIDCUserUpsertWithWhereUniqueWithoutConferencesInputSchema: z.ZodType<Prisma.OIDCUserUpsertWithWhereUniqueWithoutConferencesInput> = z.object({
  where: z.lazy(() => OIDCUserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OIDCUserUpdateWithoutConferencesInputSchema),z.lazy(() => OIDCUserUncheckedUpdateWithoutConferencesInputSchema) ]),
  create: z.union([ z.lazy(() => OIDCUserCreateWithoutConferencesInputSchema),z.lazy(() => OIDCUserUncheckedCreateWithoutConferencesInputSchema) ]),
}).strict();

export const OIDCUserUpdateWithWhereUniqueWithoutConferencesInputSchema: z.ZodType<Prisma.OIDCUserUpdateWithWhereUniqueWithoutConferencesInput> = z.object({
  where: z.lazy(() => OIDCUserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OIDCUserUpdateWithoutConferencesInputSchema),z.lazy(() => OIDCUserUncheckedUpdateWithoutConferencesInputSchema) ]),
}).strict();

export const OIDCUserUpdateManyWithWhereWithoutConferencesInputSchema: z.ZodType<Prisma.OIDCUserUpdateManyWithWhereWithoutConferencesInput> = z.object({
  where: z.lazy(() => OIDCUserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OIDCUserUpdateManyMutationInputSchema),z.lazy(() => OIDCUserUncheckedUpdateManyWithoutAdminsInputSchema) ]),
}).strict();

export const OIDCUserScalarWhereInputSchema: z.ZodType<Prisma.OIDCUserScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OIDCUserScalarWhereInputSchema),z.lazy(() => OIDCUserScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OIDCUserScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OIDCUserScalarWhereInputSchema),z.lazy(() => OIDCUserScalarWhereInputSchema).array() ]).optional(),
  oidcUserId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const ConferenceCreateWithoutAdminsInputSchema: z.ZodType<Prisma.ConferenceCreateWithoutAdminsInput> = z.object({
  name: z.string()
}).strict();

export const ConferenceUncheckedCreateWithoutAdminsInputSchema: z.ZodType<Prisma.ConferenceUncheckedCreateWithoutAdminsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string()
}).strict();

export const ConferenceCreateOrConnectWithoutAdminsInputSchema: z.ZodType<Prisma.ConferenceCreateOrConnectWithoutAdminsInput> = z.object({
  where: z.lazy(() => ConferenceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ConferenceCreateWithoutAdminsInputSchema),z.lazy(() => ConferenceUncheckedCreateWithoutAdminsInputSchema) ]),
}).strict();

export const ConferenceUpsertWithWhereUniqueWithoutAdminsInputSchema: z.ZodType<Prisma.ConferenceUpsertWithWhereUniqueWithoutAdminsInput> = z.object({
  where: z.lazy(() => ConferenceWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ConferenceUpdateWithoutAdminsInputSchema),z.lazy(() => ConferenceUncheckedUpdateWithoutAdminsInputSchema) ]),
  create: z.union([ z.lazy(() => ConferenceCreateWithoutAdminsInputSchema),z.lazy(() => ConferenceUncheckedCreateWithoutAdminsInputSchema) ]),
}).strict();

export const ConferenceUpdateWithWhereUniqueWithoutAdminsInputSchema: z.ZodType<Prisma.ConferenceUpdateWithWhereUniqueWithoutAdminsInput> = z.object({
  where: z.lazy(() => ConferenceWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ConferenceUpdateWithoutAdminsInputSchema),z.lazy(() => ConferenceUncheckedUpdateWithoutAdminsInputSchema) ]),
}).strict();

export const ConferenceUpdateManyWithWhereWithoutAdminsInputSchema: z.ZodType<Prisma.ConferenceUpdateManyWithWhereWithoutAdminsInput> = z.object({
  where: z.lazy(() => ConferenceScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ConferenceUpdateManyMutationInputSchema),z.lazy(() => ConferenceUncheckedUpdateManyWithoutConferencesInputSchema) ]),
}).strict();

export const ConferenceScalarWhereInputSchema: z.ZodType<Prisma.ConferenceScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ConferenceScalarWhereInputSchema),z.lazy(() => ConferenceScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ConferenceScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ConferenceScalarWhereInputSchema),z.lazy(() => ConferenceScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const OIDCUserUpdateWithoutConferencesInputSchema: z.ZodType<Prisma.OIDCUserUpdateWithoutConferencesInput> = z.object({
  oidcUserId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OIDCUserUncheckedUpdateWithoutConferencesInputSchema: z.ZodType<Prisma.OIDCUserUncheckedUpdateWithoutConferencesInput> = z.object({
  oidcUserId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OIDCUserUncheckedUpdateManyWithoutAdminsInputSchema: z.ZodType<Prisma.OIDCUserUncheckedUpdateManyWithoutAdminsInput> = z.object({
  oidcUserId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConferenceUpdateWithoutAdminsInputSchema: z.ZodType<Prisma.ConferenceUpdateWithoutAdminsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConferenceUncheckedUpdateWithoutAdminsInputSchema: z.ZodType<Prisma.ConferenceUncheckedUpdateWithoutAdminsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConferenceUncheckedUpdateManyWithoutConferencesInputSchema: z.ZodType<Prisma.ConferenceUncheckedUpdateManyWithoutConferencesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const ConferenceFindFirstArgsSchema: z.ZodType<Prisma.ConferenceFindFirstArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  include: ConferenceIncludeSchema.optional(),
  where: ConferenceWhereInputSchema.optional(),
  orderBy: z.union([ ConferenceOrderByWithRelationInputSchema.array(),ConferenceOrderByWithRelationInputSchema ]).optional(),
  cursor: ConferenceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ConferenceScalarFieldEnumSchema.array().optional(),
}).strict()

export const ConferenceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ConferenceFindFirstOrThrowArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  include: ConferenceIncludeSchema.optional(),
  where: ConferenceWhereInputSchema.optional(),
  orderBy: z.union([ ConferenceOrderByWithRelationInputSchema.array(),ConferenceOrderByWithRelationInputSchema ]).optional(),
  cursor: ConferenceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ConferenceScalarFieldEnumSchema.array().optional(),
}).strict()

export const ConferenceFindManyArgsSchema: z.ZodType<Prisma.ConferenceFindManyArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  include: ConferenceIncludeSchema.optional(),
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
  include: ConferenceIncludeSchema.optional(),
  where: ConferenceWhereUniqueInputSchema,
}).strict()

export const ConferenceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ConferenceFindUniqueOrThrowArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  include: ConferenceIncludeSchema.optional(),
  where: ConferenceWhereUniqueInputSchema,
}).strict()

export const ConferenceCreateTokenFindFirstArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenFindFirstArgs> = z.object({
  select: ConferenceCreateTokenSelectSchema.optional(),
  where: ConferenceCreateTokenWhereInputSchema.optional(),
  orderBy: z.union([ ConferenceCreateTokenOrderByWithRelationInputSchema.array(),ConferenceCreateTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: ConferenceCreateTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ConferenceCreateTokenScalarFieldEnumSchema.array().optional(),
}).strict()

export const ConferenceCreateTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenFindFirstOrThrowArgs> = z.object({
  select: ConferenceCreateTokenSelectSchema.optional(),
  where: ConferenceCreateTokenWhereInputSchema.optional(),
  orderBy: z.union([ ConferenceCreateTokenOrderByWithRelationInputSchema.array(),ConferenceCreateTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: ConferenceCreateTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ConferenceCreateTokenScalarFieldEnumSchema.array().optional(),
}).strict()

export const ConferenceCreateTokenFindManyArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenFindManyArgs> = z.object({
  select: ConferenceCreateTokenSelectSchema.optional(),
  where: ConferenceCreateTokenWhereInputSchema.optional(),
  orderBy: z.union([ ConferenceCreateTokenOrderByWithRelationInputSchema.array(),ConferenceCreateTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: ConferenceCreateTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ConferenceCreateTokenScalarFieldEnumSchema.array().optional(),
}).strict()

export const ConferenceCreateTokenAggregateArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenAggregateArgs> = z.object({
  where: ConferenceCreateTokenWhereInputSchema.optional(),
  orderBy: z.union([ ConferenceCreateTokenOrderByWithRelationInputSchema.array(),ConferenceCreateTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: ConferenceCreateTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ConferenceCreateTokenGroupByArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenGroupByArgs> = z.object({
  where: ConferenceCreateTokenWhereInputSchema.optional(),
  orderBy: z.union([ ConferenceCreateTokenOrderByWithAggregationInputSchema.array(),ConferenceCreateTokenOrderByWithAggregationInputSchema ]).optional(),
  by: ConferenceCreateTokenScalarFieldEnumSchema.array(),
  having: ConferenceCreateTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ConferenceCreateTokenFindUniqueArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenFindUniqueArgs> = z.object({
  select: ConferenceCreateTokenSelectSchema.optional(),
  where: ConferenceCreateTokenWhereUniqueInputSchema,
}).strict()

export const ConferenceCreateTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenFindUniqueOrThrowArgs> = z.object({
  select: ConferenceCreateTokenSelectSchema.optional(),
  where: ConferenceCreateTokenWhereUniqueInputSchema,
}).strict()

export const OIDCUserFindFirstArgsSchema: z.ZodType<Prisma.OIDCUserFindFirstArgs> = z.object({
  select: OIDCUserSelectSchema.optional(),
  include: OIDCUserIncludeSchema.optional(),
  where: OIDCUserWhereInputSchema.optional(),
  orderBy: z.union([ OIDCUserOrderByWithRelationInputSchema.array(),OIDCUserOrderByWithRelationInputSchema ]).optional(),
  cursor: OIDCUserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: OIDCUserScalarFieldEnumSchema.array().optional(),
}).strict()

export const OIDCUserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OIDCUserFindFirstOrThrowArgs> = z.object({
  select: OIDCUserSelectSchema.optional(),
  include: OIDCUserIncludeSchema.optional(),
  where: OIDCUserWhereInputSchema.optional(),
  orderBy: z.union([ OIDCUserOrderByWithRelationInputSchema.array(),OIDCUserOrderByWithRelationInputSchema ]).optional(),
  cursor: OIDCUserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: OIDCUserScalarFieldEnumSchema.array().optional(),
}).strict()

export const OIDCUserFindManyArgsSchema: z.ZodType<Prisma.OIDCUserFindManyArgs> = z.object({
  select: OIDCUserSelectSchema.optional(),
  include: OIDCUserIncludeSchema.optional(),
  where: OIDCUserWhereInputSchema.optional(),
  orderBy: z.union([ OIDCUserOrderByWithRelationInputSchema.array(),OIDCUserOrderByWithRelationInputSchema ]).optional(),
  cursor: OIDCUserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: OIDCUserScalarFieldEnumSchema.array().optional(),
}).strict()

export const OIDCUserAggregateArgsSchema: z.ZodType<Prisma.OIDCUserAggregateArgs> = z.object({
  where: OIDCUserWhereInputSchema.optional(),
  orderBy: z.union([ OIDCUserOrderByWithRelationInputSchema.array(),OIDCUserOrderByWithRelationInputSchema ]).optional(),
  cursor: OIDCUserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const OIDCUserGroupByArgsSchema: z.ZodType<Prisma.OIDCUserGroupByArgs> = z.object({
  where: OIDCUserWhereInputSchema.optional(),
  orderBy: z.union([ OIDCUserOrderByWithAggregationInputSchema.array(),OIDCUserOrderByWithAggregationInputSchema ]).optional(),
  by: OIDCUserScalarFieldEnumSchema.array(),
  having: OIDCUserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const OIDCUserFindUniqueArgsSchema: z.ZodType<Prisma.OIDCUserFindUniqueArgs> = z.object({
  select: OIDCUserSelectSchema.optional(),
  include: OIDCUserIncludeSchema.optional(),
  where: OIDCUserWhereUniqueInputSchema,
}).strict()

export const OIDCUserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OIDCUserFindUniqueOrThrowArgs> = z.object({
  select: OIDCUserSelectSchema.optional(),
  include: OIDCUserIncludeSchema.optional(),
  where: OIDCUserWhereUniqueInputSchema,
}).strict()

export const ConferenceCreateArgsSchema: z.ZodType<Prisma.ConferenceCreateArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  include: ConferenceIncludeSchema.optional(),
  data: z.union([ ConferenceCreateInputSchema,ConferenceUncheckedCreateInputSchema ]),
}).strict()

export const ConferenceUpsertArgsSchema: z.ZodType<Prisma.ConferenceUpsertArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  include: ConferenceIncludeSchema.optional(),
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
  include: ConferenceIncludeSchema.optional(),
  where: ConferenceWhereUniqueInputSchema,
}).strict()

export const ConferenceUpdateArgsSchema: z.ZodType<Prisma.ConferenceUpdateArgs> = z.object({
  select: ConferenceSelectSchema.optional(),
  include: ConferenceIncludeSchema.optional(),
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

export const ConferenceCreateTokenCreateArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenCreateArgs> = z.object({
  select: ConferenceCreateTokenSelectSchema.optional(),
  data: z.union([ ConferenceCreateTokenCreateInputSchema,ConferenceCreateTokenUncheckedCreateInputSchema ]),
}).strict()

export const ConferenceCreateTokenUpsertArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenUpsertArgs> = z.object({
  select: ConferenceCreateTokenSelectSchema.optional(),
  where: ConferenceCreateTokenWhereUniqueInputSchema,
  create: z.union([ ConferenceCreateTokenCreateInputSchema,ConferenceCreateTokenUncheckedCreateInputSchema ]),
  update: z.union([ ConferenceCreateTokenUpdateInputSchema,ConferenceCreateTokenUncheckedUpdateInputSchema ]),
}).strict()

export const ConferenceCreateTokenCreateManyArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenCreateManyArgs> = z.object({
  data: z.union([ ConferenceCreateTokenCreateManyInputSchema,ConferenceCreateTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const ConferenceCreateTokenDeleteArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenDeleteArgs> = z.object({
  select: ConferenceCreateTokenSelectSchema.optional(),
  where: ConferenceCreateTokenWhereUniqueInputSchema,
}).strict()

export const ConferenceCreateTokenUpdateArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenUpdateArgs> = z.object({
  select: ConferenceCreateTokenSelectSchema.optional(),
  data: z.union([ ConferenceCreateTokenUpdateInputSchema,ConferenceCreateTokenUncheckedUpdateInputSchema ]),
  where: ConferenceCreateTokenWhereUniqueInputSchema,
}).strict()

export const ConferenceCreateTokenUpdateManyArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenUpdateManyArgs> = z.object({
  data: z.union([ ConferenceCreateTokenUpdateManyMutationInputSchema,ConferenceCreateTokenUncheckedUpdateManyInputSchema ]),
  where: ConferenceCreateTokenWhereInputSchema.optional(),
}).strict()

export const ConferenceCreateTokenDeleteManyArgsSchema: z.ZodType<Prisma.ConferenceCreateTokenDeleteManyArgs> = z.object({
  where: ConferenceCreateTokenWhereInputSchema.optional(),
}).strict()

export const OIDCUserCreateArgsSchema: z.ZodType<Prisma.OIDCUserCreateArgs> = z.object({
  select: OIDCUserSelectSchema.optional(),
  include: OIDCUserIncludeSchema.optional(),
  data: z.union([ OIDCUserCreateInputSchema,OIDCUserUncheckedCreateInputSchema ]),
}).strict()

export const OIDCUserUpsertArgsSchema: z.ZodType<Prisma.OIDCUserUpsertArgs> = z.object({
  select: OIDCUserSelectSchema.optional(),
  include: OIDCUserIncludeSchema.optional(),
  where: OIDCUserWhereUniqueInputSchema,
  create: z.union([ OIDCUserCreateInputSchema,OIDCUserUncheckedCreateInputSchema ]),
  update: z.union([ OIDCUserUpdateInputSchema,OIDCUserUncheckedUpdateInputSchema ]),
}).strict()

export const OIDCUserCreateManyArgsSchema: z.ZodType<Prisma.OIDCUserCreateManyArgs> = z.object({
  data: z.union([ OIDCUserCreateManyInputSchema,OIDCUserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const OIDCUserDeleteArgsSchema: z.ZodType<Prisma.OIDCUserDeleteArgs> = z.object({
  select: OIDCUserSelectSchema.optional(),
  include: OIDCUserIncludeSchema.optional(),
  where: OIDCUserWhereUniqueInputSchema,
}).strict()

export const OIDCUserUpdateArgsSchema: z.ZodType<Prisma.OIDCUserUpdateArgs> = z.object({
  select: OIDCUserSelectSchema.optional(),
  include: OIDCUserIncludeSchema.optional(),
  data: z.union([ OIDCUserUpdateInputSchema,OIDCUserUncheckedUpdateInputSchema ]),
  where: OIDCUserWhereUniqueInputSchema,
}).strict()

export const OIDCUserUpdateManyArgsSchema: z.ZodType<Prisma.OIDCUserUpdateManyArgs> = z.object({
  data: z.union([ OIDCUserUpdateManyMutationInputSchema,OIDCUserUncheckedUpdateManyInputSchema ]),
  where: OIDCUserWhereInputSchema.optional(),
}).strict()

export const OIDCUserDeleteManyArgsSchema: z.ZodType<Prisma.OIDCUserDeleteManyArgs> = z.object({
  where: OIDCUserWhereInputSchema.optional(),
}).strict()