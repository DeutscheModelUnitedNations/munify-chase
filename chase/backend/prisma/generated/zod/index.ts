import { z } from "zod";
import type { Prisma } from "@prisma/client";

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum([
  "ReadUncommitted",
  "ReadCommitted",
  "RepeatableRead",
  "Serializable",
]);

export const ConferenceScalarFieldEnumSchema = z.enum(["id", "name"]);

export const ConferenceCreateTokenScalarFieldEnumSchema = z.enum(["token"]);

export const CommitteeScalarFieldEnumSchema = z.enum([
  "id",
  "name",
  "abbreviation",
  "category",
  "isSubcommittee",
  "parentCommitteeId",
  "conferenceId",
]);

export const SortOrderSchema = z.enum(["asc", "desc"]);

export const QueryModeSchema = z.enum(["default", "insensitive"]);

export const NullsOrderSchema = z.enum(["first", "last"]);
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
// COMMITTEE SCHEMA
/////////////////////////////////////////

export const CommitteeSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  abbreviation: z.string(),
  category: z.string(),
  isSubcommittee: z.boolean(),
  parentCommitteeId: z.number().int().nullable(),
  conferenceId: z.number().int(),
});

export type Committee = z.infer<typeof CommitteeSchema>;

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// CONFERENCE
//------------------------------------------------------

export const ConferenceIncludeSchema: z.ZodType<Prisma.ConferenceInclude> = z
  .object({
    committees: z
      .union([z.boolean(), z.lazy(() => CommitteeFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => ConferenceCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

export const ConferenceArgsSchema: z.ZodType<Prisma.ConferenceDefaultArgs> = z
  .object({
    select: z.lazy(() => ConferenceSelectSchema).optional(),
    include: z.lazy(() => ConferenceIncludeSchema).optional(),
  })
  .strict();

export const ConferenceCountOutputTypeArgsSchema: z.ZodType<Prisma.ConferenceCountOutputTypeDefaultArgs> =
  z
    .object({
      select: z.lazy(() => ConferenceCountOutputTypeSelectSchema).nullish(),
    })
    .strict();

export const ConferenceCountOutputTypeSelectSchema: z.ZodType<Prisma.ConferenceCountOutputTypeSelect> =
  z
    .object({
      committees: z.boolean().optional(),
    })
    .strict();

export const ConferenceSelectSchema: z.ZodType<Prisma.ConferenceSelect> = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    committees: z
      .union([z.boolean(), z.lazy(() => CommitteeFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => ConferenceCountOutputTypeArgsSchema)])
      .optional(),
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

// COMMITTEE
//------------------------------------------------------

export const CommitteeIncludeSchema: z.ZodType<Prisma.CommitteeInclude> = z
  .object({
    parentCommittee: z
      .union([z.boolean(), z.lazy(() => CommitteeArgsSchema)])
      .optional(),
    conference: z
      .union([z.boolean(), z.lazy(() => ConferenceArgsSchema)])
      .optional(),
    subCommittees: z
      .union([z.boolean(), z.lazy(() => CommitteeFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => CommitteeCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

export const CommitteeArgsSchema: z.ZodType<Prisma.CommitteeDefaultArgs> = z
  .object({
    select: z.lazy(() => CommitteeSelectSchema).optional(),
    include: z.lazy(() => CommitteeIncludeSchema).optional(),
  })
  .strict();

export const CommitteeCountOutputTypeArgsSchema: z.ZodType<Prisma.CommitteeCountOutputTypeDefaultArgs> =
  z
    .object({
      select: z.lazy(() => CommitteeCountOutputTypeSelectSchema).nullish(),
    })
    .strict();

export const CommitteeCountOutputTypeSelectSchema: z.ZodType<Prisma.CommitteeCountOutputTypeSelect> =
  z
    .object({
      subCommittees: z.boolean().optional(),
    })
    .strict();

export const CommitteeSelectSchema: z.ZodType<Prisma.CommitteeSelect> = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    abbreviation: z.boolean().optional(),
    category: z.boolean().optional(),
    isSubcommittee: z.boolean().optional(),
    parentCommitteeId: z.boolean().optional(),
    conferenceId: z.boolean().optional(),
    parentCommittee: z
      .union([z.boolean(), z.lazy(() => CommitteeArgsSchema)])
      .optional(),
    conference: z
      .union([z.boolean(), z.lazy(() => ConferenceArgsSchema)])
      .optional(),
    subCommittees: z
      .union([z.boolean(), z.lazy(() => CommitteeFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => CommitteeCountOutputTypeArgsSchema)])
      .optional(),
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
      committees: z.lazy(() => CommitteeListRelationFilterSchema).optional(),
    })
    .strict();

export const ConferenceOrderByWithRelationInputSchema: z.ZodType<Prisma.ConferenceOrderByWithRelationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      committees: z
        .lazy(() => CommitteeOrderByRelationAggregateInputSchema)
        .optional(),
    })
    .strict();

export const ConferenceWhereUniqueInputSchema: z.ZodType<Prisma.ConferenceWhereUniqueInput> =
  z
    .union([
      z.object({
        id: z.number().int(),
        name: z.string(),
      }),
      z.object({
        id: z.number().int(),
      }),
      z.object({
        name: z.string(),
      }),
    ])
    .and(
      z
        .object({
          id: z.number().int().optional(),
          name: z.string().optional(),
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
          committees: z
            .lazy(() => CommitteeListRelationFilterSchema)
            .optional(),
        })
        .strict(),
    );

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
      token: z.string(),
    })
    .and(
      z
        .object({
          token: z.string().optional(),
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
        })
        .strict(),
    );

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

export const CommitteeWhereInputSchema: z.ZodType<Prisma.CommitteeWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => CommitteeWhereInputSchema),
          z.lazy(() => CommitteeWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => CommitteeWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => CommitteeWhereInputSchema),
          z.lazy(() => CommitteeWhereInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
      name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
      abbreviation: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      category: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      isSubcommittee: z
        .union([z.lazy(() => BoolFilterSchema), z.boolean()])
        .optional(),
      parentCommitteeId: z
        .union([z.lazy(() => IntNullableFilterSchema), z.number()])
        .optional()
        .nullable(),
      conferenceId: z
        .union([z.lazy(() => IntFilterSchema), z.number()])
        .optional(),
      parentCommittee: z
        .union([
          z.lazy(() => CommitteeNullableRelationFilterSchema),
          z.lazy(() => CommitteeWhereInputSchema),
        ])
        .optional()
        .nullable(),
      conference: z
        .union([
          z.lazy(() => ConferenceRelationFilterSchema),
          z.lazy(() => ConferenceWhereInputSchema),
        ])
        .optional(),
      subCommittees: z.lazy(() => CommitteeListRelationFilterSchema).optional(),
    })
    .strict();

export const CommitteeOrderByWithRelationInputSchema: z.ZodType<Prisma.CommitteeOrderByWithRelationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      abbreviation: z.lazy(() => SortOrderSchema).optional(),
      category: z.lazy(() => SortOrderSchema).optional(),
      isSubcommittee: z.lazy(() => SortOrderSchema).optional(),
      parentCommitteeId: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      conferenceId: z.lazy(() => SortOrderSchema).optional(),
      parentCommittee: z
        .lazy(() => CommitteeOrderByWithRelationInputSchema)
        .optional(),
      conference: z
        .lazy(() => ConferenceOrderByWithRelationInputSchema)
        .optional(),
      subCommittees: z
        .lazy(() => CommitteeOrderByRelationAggregateInputSchema)
        .optional(),
    })
    .strict();

export const CommitteeWhereUniqueInputSchema: z.ZodType<Prisma.CommitteeWhereUniqueInput> =
  z
    .union([
      z.object({
        id: z.number().int(),
        name_conferenceId: z.lazy(
          () => CommitteeNameConferenceIdCompoundUniqueInputSchema,
        ),
      }),
      z.object({
        id: z.number().int(),
      }),
      z.object({
        name_conferenceId: z.lazy(
          () => CommitteeNameConferenceIdCompoundUniqueInputSchema,
        ),
      }),
    ])
    .and(
      z
        .object({
          id: z.number().int().optional(),
          name_conferenceId: z
            .lazy(() => CommitteeNameConferenceIdCompoundUniqueInputSchema)
            .optional(),
          AND: z
            .union([
              z.lazy(() => CommitteeWhereInputSchema),
              z.lazy(() => CommitteeWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => CommitteeWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => CommitteeWhereInputSchema),
              z.lazy(() => CommitteeWhereInputSchema).array(),
            ])
            .optional(),
          name: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          abbreviation: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          category: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          isSubcommittee: z
            .union([z.lazy(() => BoolFilterSchema), z.boolean()])
            .optional(),
          parentCommitteeId: z
            .union([z.lazy(() => IntNullableFilterSchema), z.number().int()])
            .optional()
            .nullable(),
          conferenceId: z
            .union([z.lazy(() => IntFilterSchema), z.number().int()])
            .optional(),
          parentCommittee: z
            .union([
              z.lazy(() => CommitteeNullableRelationFilterSchema),
              z.lazy(() => CommitteeWhereInputSchema),
            ])
            .optional()
            .nullable(),
          conference: z
            .union([
              z.lazy(() => ConferenceRelationFilterSchema),
              z.lazy(() => ConferenceWhereInputSchema),
            ])
            .optional(),
          subCommittees: z
            .lazy(() => CommitteeListRelationFilterSchema)
            .optional(),
        })
        .strict(),
    );

export const CommitteeOrderByWithAggregationInputSchema: z.ZodType<Prisma.CommitteeOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      abbreviation: z.lazy(() => SortOrderSchema).optional(),
      category: z.lazy(() => SortOrderSchema).optional(),
      isSubcommittee: z.lazy(() => SortOrderSchema).optional(),
      parentCommitteeId: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputSchema),
        ])
        .optional(),
      conferenceId: z.lazy(() => SortOrderSchema).optional(),
      _count: z
        .lazy(() => CommitteeCountOrderByAggregateInputSchema)
        .optional(),
      _avg: z.lazy(() => CommitteeAvgOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => CommitteeMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => CommitteeMinOrderByAggregateInputSchema).optional(),
      _sum: z.lazy(() => CommitteeSumOrderByAggregateInputSchema).optional(),
    })
    .strict();

export const CommitteeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CommitteeScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => CommitteeScalarWhereWithAggregatesInputSchema),
          z.lazy(() => CommitteeScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => CommitteeScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => CommitteeScalarWhereWithAggregatesInputSchema),
          z.lazy(() => CommitteeScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      name: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      abbreviation: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      category: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      isSubcommittee: z
        .union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()])
        .optional(),
      parentCommitteeId: z
        .union([
          z.lazy(() => IntNullableWithAggregatesFilterSchema),
          z.number(),
        ])
        .optional()
        .nullable(),
      conferenceId: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
    })
    .strict();

export const ConferenceCreateInputSchema: z.ZodType<Prisma.ConferenceCreateInput> =
  z
    .object({
      name: z.string(),
      committees: z
        .lazy(() => CommitteeCreateNestedManyWithoutConferenceInputSchema)
        .optional(),
    })
    .strict();

export const ConferenceUncheckedCreateInputSchema: z.ZodType<Prisma.ConferenceUncheckedCreateInput> =
  z
    .object({
      id: z.number().int().optional(),
      name: z.string(),
      committees: z
        .lazy(
          () => CommitteeUncheckedCreateNestedManyWithoutConferenceInputSchema,
        )
        .optional(),
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
      committees: z
        .lazy(() => CommitteeUpdateManyWithoutConferenceNestedInputSchema)
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
      committees: z
        .lazy(
          () => CommitteeUncheckedUpdateManyWithoutConferenceNestedInputSchema,
        )
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

export const CommitteeCreateInputSchema: z.ZodType<Prisma.CommitteeCreateInput> =
  z
    .object({
      name: z.string(),
      abbreviation: z.string(),
      category: z.string(),
      isSubcommittee: z.boolean(),
      parentCommittee: z
        .lazy(() => CommitteeCreateNestedOneWithoutSubCommitteesInputSchema)
        .optional(),
      conference: z.lazy(
        () => ConferenceCreateNestedOneWithoutCommitteesInputSchema,
      ),
      subCommittees: z
        .lazy(() => CommitteeCreateNestedManyWithoutParentCommitteeInputSchema)
        .optional(),
    })
    .strict();

export const CommitteeUncheckedCreateInputSchema: z.ZodType<Prisma.CommitteeUncheckedCreateInput> =
  z
    .object({
      id: z.number().int().optional(),
      name: z.string(),
      abbreviation: z.string(),
      category: z.string(),
      isSubcommittee: z.boolean(),
      parentCommitteeId: z.number().int().optional().nullable(),
      conferenceId: z.number().int(),
      subCommittees: z
        .lazy(
          () =>
            CommitteeUncheckedCreateNestedManyWithoutParentCommitteeInputSchema,
        )
        .optional(),
    })
    .strict();

export const CommitteeUpdateInputSchema: z.ZodType<Prisma.CommitteeUpdateInput> =
  z
    .object({
      name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      abbreviation: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      category: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSubcommittee: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      parentCommittee: z
        .lazy(() => CommitteeUpdateOneWithoutSubCommitteesNestedInputSchema)
        .optional(),
      conference: z
        .lazy(
          () => ConferenceUpdateOneRequiredWithoutCommitteesNestedInputSchema,
        )
        .optional(),
      subCommittees: z
        .lazy(() => CommitteeUpdateManyWithoutParentCommitteeNestedInputSchema)
        .optional(),
    })
    .strict();

export const CommitteeUncheckedUpdateInputSchema: z.ZodType<Prisma.CommitteeUncheckedUpdateInput> =
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
      abbreviation: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      category: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSubcommittee: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      parentCommitteeId: z
        .union([
          z.number().int(),
          z.lazy(() => NullableIntFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      conferenceId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      subCommittees: z
        .lazy(
          () =>
            CommitteeUncheckedUpdateManyWithoutParentCommitteeNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const CommitteeCreateManyInputSchema: z.ZodType<Prisma.CommitteeCreateManyInput> =
  z
    .object({
      id: z.number().int().optional(),
      name: z.string(),
      abbreviation: z.string(),
      category: z.string(),
      isSubcommittee: z.boolean(),
      parentCommitteeId: z.number().int().optional().nullable(),
      conferenceId: z.number().int(),
    })
    .strict();

export const CommitteeUpdateManyMutationInputSchema: z.ZodType<Prisma.CommitteeUpdateManyMutationInput> =
  z
    .object({
      name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      abbreviation: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      category: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSubcommittee: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const CommitteeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CommitteeUncheckedUpdateManyInput> =
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
      abbreviation: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      category: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSubcommittee: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      parentCommitteeId: z
        .union([
          z.number().int(),
          z.lazy(() => NullableIntFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      conferenceId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z
  .object({
    equals: z.number().optional(),
    in: z.number().array().optional(),
    notIn: z.number().array().optional(),
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
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
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

export const CommitteeListRelationFilterSchema: z.ZodType<Prisma.CommitteeListRelationFilter> =
  z
    .object({
      every: z.lazy(() => CommitteeWhereInputSchema).optional(),
      some: z.lazy(() => CommitteeWhereInputSchema).optional(),
      none: z.lazy(() => CommitteeWhereInputSchema).optional(),
    })
    .strict();

export const CommitteeOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CommitteeOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
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
      in: z.number().array().optional(),
      notIn: z.number().array().optional(),
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
      in: z.string().array().optional(),
      notIn: z.string().array().optional(),
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

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z
  .object({
    equals: z.boolean().optional(),
    not: z
      .union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)])
      .optional(),
  })
  .strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z
  .object({
    equals: z.number().optional().nullable(),
    in: z.number().array().optional().nullable(),
    notIn: z.number().array().optional().nullable(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z
      .union([z.number(), z.lazy(() => NestedIntNullableFilterSchema)])
      .optional()
      .nullable(),
  })
  .strict();

export const CommitteeNullableRelationFilterSchema: z.ZodType<Prisma.CommitteeNullableRelationFilter> =
  z
    .object({
      is: z
        .lazy(() => CommitteeWhereInputSchema)
        .optional()
        .nullable(),
      isNot: z
        .lazy(() => CommitteeWhereInputSchema)
        .optional()
        .nullable(),
    })
    .strict();

export const ConferenceRelationFilterSchema: z.ZodType<Prisma.ConferenceRelationFilter> =
  z
    .object({
      is: z.lazy(() => ConferenceWhereInputSchema).optional(),
      isNot: z.lazy(() => ConferenceWhereInputSchema).optional(),
    })
    .strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z
  .object({
    sort: z.lazy(() => SortOrderSchema),
    nulls: z.lazy(() => NullsOrderSchema).optional(),
  })
  .strict();

export const CommitteeNameConferenceIdCompoundUniqueInputSchema: z.ZodType<Prisma.CommitteeNameConferenceIdCompoundUniqueInput> =
  z
    .object({
      name: z.string(),
      conferenceId: z.number(),
    })
    .strict();

export const CommitteeCountOrderByAggregateInputSchema: z.ZodType<Prisma.CommitteeCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      abbreviation: z.lazy(() => SortOrderSchema).optional(),
      category: z.lazy(() => SortOrderSchema).optional(),
      isSubcommittee: z.lazy(() => SortOrderSchema).optional(),
      parentCommitteeId: z.lazy(() => SortOrderSchema).optional(),
      conferenceId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const CommitteeAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CommitteeAvgOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      parentCommitteeId: z.lazy(() => SortOrderSchema).optional(),
      conferenceId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const CommitteeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CommitteeMaxOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      abbreviation: z.lazy(() => SortOrderSchema).optional(),
      category: z.lazy(() => SortOrderSchema).optional(),
      isSubcommittee: z.lazy(() => SortOrderSchema).optional(),
      parentCommitteeId: z.lazy(() => SortOrderSchema).optional(),
      conferenceId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const CommitteeMinOrderByAggregateInputSchema: z.ZodType<Prisma.CommitteeMinOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      abbreviation: z.lazy(() => SortOrderSchema).optional(),
      category: z.lazy(() => SortOrderSchema).optional(),
      isSubcommittee: z.lazy(() => SortOrderSchema).optional(),
      parentCommitteeId: z.lazy(() => SortOrderSchema).optional(),
      conferenceId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const CommitteeSumOrderByAggregateInputSchema: z.ZodType<Prisma.CommitteeSumOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      parentCommitteeId: z.lazy(() => SortOrderSchema).optional(),
      conferenceId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> =
  z
    .object({
      equals: z.boolean().optional(),
      not: z
        .union([
          z.boolean(),
          z.lazy(() => NestedBoolWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedBoolFilterSchema).optional(),
      _max: z.lazy(() => NestedBoolFilterSchema).optional(),
    })
    .strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.number().optional().nullable(),
      in: z.number().array().optional().nullable(),
      notIn: z.number().array().optional().nullable(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([
          z.number(),
          z.lazy(() => NestedIntNullableWithAggregatesFilterSchema),
        ])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
      _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
    })
    .strict();

export const CommitteeCreateNestedManyWithoutConferenceInputSchema: z.ZodType<Prisma.CommitteeCreateNestedManyWithoutConferenceInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CommitteeCreateWithoutConferenceInputSchema),
          z.lazy(() => CommitteeCreateWithoutConferenceInputSchema).array(),
          z.lazy(() => CommitteeUncheckedCreateWithoutConferenceInputSchema),
          z
            .lazy(() => CommitteeUncheckedCreateWithoutConferenceInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => CommitteeCreateOrConnectWithoutConferenceInputSchema),
          z
            .lazy(() => CommitteeCreateOrConnectWithoutConferenceInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => CommitteeCreateManyConferenceInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const CommitteeUncheckedCreateNestedManyWithoutConferenceInputSchema: z.ZodType<Prisma.CommitteeUncheckedCreateNestedManyWithoutConferenceInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CommitteeCreateWithoutConferenceInputSchema),
          z.lazy(() => CommitteeCreateWithoutConferenceInputSchema).array(),
          z.lazy(() => CommitteeUncheckedCreateWithoutConferenceInputSchema),
          z
            .lazy(() => CommitteeUncheckedCreateWithoutConferenceInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => CommitteeCreateOrConnectWithoutConferenceInputSchema),
          z
            .lazy(() => CommitteeCreateOrConnectWithoutConferenceInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => CommitteeCreateManyConferenceInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> =
  z
    .object({
      set: z.string().optional(),
    })
    .strict();

export const CommitteeUpdateManyWithoutConferenceNestedInputSchema: z.ZodType<Prisma.CommitteeUpdateManyWithoutConferenceNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CommitteeCreateWithoutConferenceInputSchema),
          z.lazy(() => CommitteeCreateWithoutConferenceInputSchema).array(),
          z.lazy(() => CommitteeUncheckedCreateWithoutConferenceInputSchema),
          z
            .lazy(() => CommitteeUncheckedCreateWithoutConferenceInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => CommitteeCreateOrConnectWithoutConferenceInputSchema),
          z
            .lazy(() => CommitteeCreateOrConnectWithoutConferenceInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () => CommitteeUpsertWithWhereUniqueWithoutConferenceInputSchema,
          ),
          z
            .lazy(
              () => CommitteeUpsertWithWhereUniqueWithoutConferenceInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => CommitteeCreateManyConferenceInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => CommitteeUpdateWithWhereUniqueWithoutConferenceInputSchema,
          ),
          z
            .lazy(
              () => CommitteeUpdateWithWhereUniqueWithoutConferenceInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () => CommitteeUpdateManyWithWhereWithoutConferenceInputSchema,
          ),
          z
            .lazy(
              () => CommitteeUpdateManyWithWhereWithoutConferenceInputSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => CommitteeScalarWhereInputSchema),
          z.lazy(() => CommitteeScalarWhereInputSchema).array(),
        ])
        .optional(),
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

export const CommitteeUncheckedUpdateManyWithoutConferenceNestedInputSchema: z.ZodType<Prisma.CommitteeUncheckedUpdateManyWithoutConferenceNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CommitteeCreateWithoutConferenceInputSchema),
          z.lazy(() => CommitteeCreateWithoutConferenceInputSchema).array(),
          z.lazy(() => CommitteeUncheckedCreateWithoutConferenceInputSchema),
          z
            .lazy(() => CommitteeUncheckedCreateWithoutConferenceInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => CommitteeCreateOrConnectWithoutConferenceInputSchema),
          z
            .lazy(() => CommitteeCreateOrConnectWithoutConferenceInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () => CommitteeUpsertWithWhereUniqueWithoutConferenceInputSchema,
          ),
          z
            .lazy(
              () => CommitteeUpsertWithWhereUniqueWithoutConferenceInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => CommitteeCreateManyConferenceInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => CommitteeUpdateWithWhereUniqueWithoutConferenceInputSchema,
          ),
          z
            .lazy(
              () => CommitteeUpdateWithWhereUniqueWithoutConferenceInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () => CommitteeUpdateManyWithWhereWithoutConferenceInputSchema,
          ),
          z
            .lazy(
              () => CommitteeUpdateManyWithWhereWithoutConferenceInputSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => CommitteeScalarWhereInputSchema),
          z.lazy(() => CommitteeScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const CommitteeCreateNestedOneWithoutSubCommitteesInputSchema: z.ZodType<Prisma.CommitteeCreateNestedOneWithoutSubCommitteesInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CommitteeCreateWithoutSubCommitteesInputSchema),
          z.lazy(() => CommitteeUncheckedCreateWithoutSubCommitteesInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => CommitteeCreateOrConnectWithoutSubCommitteesInputSchema)
        .optional(),
      connect: z.lazy(() => CommitteeWhereUniqueInputSchema).optional(),
    })
    .strict();

export const ConferenceCreateNestedOneWithoutCommitteesInputSchema: z.ZodType<Prisma.ConferenceCreateNestedOneWithoutCommitteesInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ConferenceCreateWithoutCommitteesInputSchema),
          z.lazy(() => ConferenceUncheckedCreateWithoutCommitteesInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => ConferenceCreateOrConnectWithoutCommitteesInputSchema)
        .optional(),
      connect: z.lazy(() => ConferenceWhereUniqueInputSchema).optional(),
    })
    .strict();

export const CommitteeCreateNestedManyWithoutParentCommitteeInputSchema: z.ZodType<Prisma.CommitteeCreateNestedManyWithoutParentCommitteeInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CommitteeCreateWithoutParentCommitteeInputSchema),
          z
            .lazy(() => CommitteeCreateWithoutParentCommitteeInputSchema)
            .array(),
          z.lazy(
            () => CommitteeUncheckedCreateWithoutParentCommitteeInputSchema,
          ),
          z
            .lazy(
              () => CommitteeUncheckedCreateWithoutParentCommitteeInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => CommitteeCreateOrConnectWithoutParentCommitteeInputSchema,
          ),
          z
            .lazy(
              () => CommitteeCreateOrConnectWithoutParentCommitteeInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => CommitteeCreateManyParentCommitteeInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const CommitteeUncheckedCreateNestedManyWithoutParentCommitteeInputSchema: z.ZodType<Prisma.CommitteeUncheckedCreateNestedManyWithoutParentCommitteeInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CommitteeCreateWithoutParentCommitteeInputSchema),
          z
            .lazy(() => CommitteeCreateWithoutParentCommitteeInputSchema)
            .array(),
          z.lazy(
            () => CommitteeUncheckedCreateWithoutParentCommitteeInputSchema,
          ),
          z
            .lazy(
              () => CommitteeUncheckedCreateWithoutParentCommitteeInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => CommitteeCreateOrConnectWithoutParentCommitteeInputSchema,
          ),
          z
            .lazy(
              () => CommitteeCreateOrConnectWithoutParentCommitteeInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => CommitteeCreateManyParentCommitteeInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> =
  z
    .object({
      set: z.boolean().optional(),
    })
    .strict();

export const CommitteeUpdateOneWithoutSubCommitteesNestedInputSchema: z.ZodType<Prisma.CommitteeUpdateOneWithoutSubCommitteesNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CommitteeCreateWithoutSubCommitteesInputSchema),
          z.lazy(() => CommitteeUncheckedCreateWithoutSubCommitteesInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => CommitteeCreateOrConnectWithoutSubCommitteesInputSchema)
        .optional(),
      upsert: z
        .lazy(() => CommitteeUpsertWithoutSubCommitteesInputSchema)
        .optional(),
      disconnect: z
        .union([z.boolean(), z.lazy(() => CommitteeWhereInputSchema)])
        .optional(),
      delete: z
        .union([z.boolean(), z.lazy(() => CommitteeWhereInputSchema)])
        .optional(),
      connect: z.lazy(() => CommitteeWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(
            () => CommitteeUpdateToOneWithWhereWithoutSubCommitteesInputSchema,
          ),
          z.lazy(() => CommitteeUpdateWithoutSubCommitteesInputSchema),
          z.lazy(() => CommitteeUncheckedUpdateWithoutSubCommitteesInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ConferenceUpdateOneRequiredWithoutCommitteesNestedInputSchema: z.ZodType<Prisma.ConferenceUpdateOneRequiredWithoutCommitteesNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ConferenceCreateWithoutCommitteesInputSchema),
          z.lazy(() => ConferenceUncheckedCreateWithoutCommitteesInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => ConferenceCreateOrConnectWithoutCommitteesInputSchema)
        .optional(),
      upsert: z
        .lazy(() => ConferenceUpsertWithoutCommitteesInputSchema)
        .optional(),
      connect: z.lazy(() => ConferenceWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(
            () => ConferenceUpdateToOneWithWhereWithoutCommitteesInputSchema,
          ),
          z.lazy(() => ConferenceUpdateWithoutCommitteesInputSchema),
          z.lazy(() => ConferenceUncheckedUpdateWithoutCommitteesInputSchema),
        ])
        .optional(),
    })
    .strict();

export const CommitteeUpdateManyWithoutParentCommitteeNestedInputSchema: z.ZodType<Prisma.CommitteeUpdateManyWithoutParentCommitteeNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CommitteeCreateWithoutParentCommitteeInputSchema),
          z
            .lazy(() => CommitteeCreateWithoutParentCommitteeInputSchema)
            .array(),
          z.lazy(
            () => CommitteeUncheckedCreateWithoutParentCommitteeInputSchema,
          ),
          z
            .lazy(
              () => CommitteeUncheckedCreateWithoutParentCommitteeInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => CommitteeCreateOrConnectWithoutParentCommitteeInputSchema,
          ),
          z
            .lazy(
              () => CommitteeCreateOrConnectWithoutParentCommitteeInputSchema,
            )
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () =>
              CommitteeUpsertWithWhereUniqueWithoutParentCommitteeInputSchema,
          ),
          z
            .lazy(
              () =>
                CommitteeUpsertWithWhereUniqueWithoutParentCommitteeInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => CommitteeCreateManyParentCommitteeInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () =>
              CommitteeUpdateWithWhereUniqueWithoutParentCommitteeInputSchema,
          ),
          z
            .lazy(
              () =>
                CommitteeUpdateWithWhereUniqueWithoutParentCommitteeInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () => CommitteeUpdateManyWithWhereWithoutParentCommitteeInputSchema,
          ),
          z
            .lazy(
              () =>
                CommitteeUpdateManyWithWhereWithoutParentCommitteeInputSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => CommitteeScalarWhereInputSchema),
          z.lazy(() => CommitteeScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> =
  z
    .object({
      set: z.number().optional().nullable(),
      increment: z.number().optional(),
      decrement: z.number().optional(),
      multiply: z.number().optional(),
      divide: z.number().optional(),
    })
    .strict();

export const CommitteeUncheckedUpdateManyWithoutParentCommitteeNestedInputSchema: z.ZodType<Prisma.CommitteeUncheckedUpdateManyWithoutParentCommitteeNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CommitteeCreateWithoutParentCommitteeInputSchema),
          z
            .lazy(() => CommitteeCreateWithoutParentCommitteeInputSchema)
            .array(),
          z.lazy(
            () => CommitteeUncheckedCreateWithoutParentCommitteeInputSchema,
          ),
          z
            .lazy(
              () => CommitteeUncheckedCreateWithoutParentCommitteeInputSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => CommitteeCreateOrConnectWithoutParentCommitteeInputSchema,
          ),
          z
            .lazy(
              () => CommitteeCreateOrConnectWithoutParentCommitteeInputSchema,
            )
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () =>
              CommitteeUpsertWithWhereUniqueWithoutParentCommitteeInputSchema,
          ),
          z
            .lazy(
              () =>
                CommitteeUpsertWithWhereUniqueWithoutParentCommitteeInputSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => CommitteeCreateManyParentCommitteeInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => CommitteeWhereUniqueInputSchema),
          z.lazy(() => CommitteeWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () =>
              CommitteeUpdateWithWhereUniqueWithoutParentCommitteeInputSchema,
          ),
          z
            .lazy(
              () =>
                CommitteeUpdateWithWhereUniqueWithoutParentCommitteeInputSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () => CommitteeUpdateManyWithWhereWithoutParentCommitteeInputSchema,
          ),
          z
            .lazy(
              () =>
                CommitteeUpdateManyWithWhereWithoutParentCommitteeInputSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => CommitteeScalarWhereInputSchema),
          z.lazy(() => CommitteeScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z
  .object({
    equals: z.number().optional(),
    in: z.number().array().optional(),
    notIn: z.number().array().optional(),
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
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
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
      in: z.number().array().optional(),
      notIn: z.number().array().optional(),
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
    in: z.number().array().optional(),
    notIn: z.number().array().optional(),
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
      in: z.string().array().optional(),
      notIn: z.string().array().optional(),
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

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z
  .object({
    equals: z.boolean().optional(),
    not: z
      .union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)])
      .optional(),
  })
  .strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> =
  z
    .object({
      equals: z.number().optional().nullable(),
      in: z.number().array().optional().nullable(),
      notIn: z.number().array().optional().nullable(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([z.number(), z.lazy(() => NestedIntNullableFilterSchema)])
        .optional()
        .nullable(),
    })
    .strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> =
  z
    .object({
      equals: z.boolean().optional(),
      not: z
        .union([
          z.boolean(),
          z.lazy(() => NestedBoolWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedBoolFilterSchema).optional(),
      _max: z.lazy(() => NestedBoolFilterSchema).optional(),
    })
    .strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> =
  z
    .object({
      equals: z.number().optional().nullable(),
      in: z.number().array().optional().nullable(),
      notIn: z.number().array().optional().nullable(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([
          z.number(),
          z.lazy(() => NestedIntNullableWithAggregatesFilterSchema),
        ])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
      _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
      _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
    })
    .strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> =
  z
    .object({
      equals: z.number().optional().nullable(),
      in: z.number().array().optional().nullable(),
      notIn: z.number().array().optional().nullable(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([z.number(), z.lazy(() => NestedFloatNullableFilterSchema)])
        .optional()
        .nullable(),
    })
    .strict();

export const CommitteeCreateWithoutConferenceInputSchema: z.ZodType<Prisma.CommitteeCreateWithoutConferenceInput> =
  z
    .object({
      name: z.string(),
      abbreviation: z.string(),
      category: z.string(),
      isSubcommittee: z.boolean(),
      parentCommittee: z
        .lazy(() => CommitteeCreateNestedOneWithoutSubCommitteesInputSchema)
        .optional(),
      subCommittees: z
        .lazy(() => CommitteeCreateNestedManyWithoutParentCommitteeInputSchema)
        .optional(),
    })
    .strict();

export const CommitteeUncheckedCreateWithoutConferenceInputSchema: z.ZodType<Prisma.CommitteeUncheckedCreateWithoutConferenceInput> =
  z
    .object({
      id: z.number().int().optional(),
      name: z.string(),
      abbreviation: z.string(),
      category: z.string(),
      isSubcommittee: z.boolean(),
      parentCommitteeId: z.number().int().optional().nullable(),
      subCommittees: z
        .lazy(
          () =>
            CommitteeUncheckedCreateNestedManyWithoutParentCommitteeInputSchema,
        )
        .optional(),
    })
    .strict();

export const CommitteeCreateOrConnectWithoutConferenceInputSchema: z.ZodType<Prisma.CommitteeCreateOrConnectWithoutConferenceInput> =
  z
    .object({
      where: z.lazy(() => CommitteeWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => CommitteeCreateWithoutConferenceInputSchema),
        z.lazy(() => CommitteeUncheckedCreateWithoutConferenceInputSchema),
      ]),
    })
    .strict();

export const CommitteeCreateManyConferenceInputEnvelopeSchema: z.ZodType<Prisma.CommitteeCreateManyConferenceInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => CommitteeCreateManyConferenceInputSchema),
        z.lazy(() => CommitteeCreateManyConferenceInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const CommitteeUpsertWithWhereUniqueWithoutConferenceInputSchema: z.ZodType<Prisma.CommitteeUpsertWithWhereUniqueWithoutConferenceInput> =
  z
    .object({
      where: z.lazy(() => CommitteeWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => CommitteeUpdateWithoutConferenceInputSchema),
        z.lazy(() => CommitteeUncheckedUpdateWithoutConferenceInputSchema),
      ]),
      create: z.union([
        z.lazy(() => CommitteeCreateWithoutConferenceInputSchema),
        z.lazy(() => CommitteeUncheckedCreateWithoutConferenceInputSchema),
      ]),
    })
    .strict();

export const CommitteeUpdateWithWhereUniqueWithoutConferenceInputSchema: z.ZodType<Prisma.CommitteeUpdateWithWhereUniqueWithoutConferenceInput> =
  z
    .object({
      where: z.lazy(() => CommitteeWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => CommitteeUpdateWithoutConferenceInputSchema),
        z.lazy(() => CommitteeUncheckedUpdateWithoutConferenceInputSchema),
      ]),
    })
    .strict();

export const CommitteeUpdateManyWithWhereWithoutConferenceInputSchema: z.ZodType<Prisma.CommitteeUpdateManyWithWhereWithoutConferenceInput> =
  z
    .object({
      where: z.lazy(() => CommitteeScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => CommitteeUpdateManyMutationInputSchema),
        z.lazy(() => CommitteeUncheckedUpdateManyWithoutConferenceInputSchema),
      ]),
    })
    .strict();

export const CommitteeScalarWhereInputSchema: z.ZodType<Prisma.CommitteeScalarWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => CommitteeScalarWhereInputSchema),
          z.lazy(() => CommitteeScalarWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => CommitteeScalarWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => CommitteeScalarWhereInputSchema),
          z.lazy(() => CommitteeScalarWhereInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
      name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
      abbreviation: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      category: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      isSubcommittee: z
        .union([z.lazy(() => BoolFilterSchema), z.boolean()])
        .optional(),
      parentCommitteeId: z
        .union([z.lazy(() => IntNullableFilterSchema), z.number()])
        .optional()
        .nullable(),
      conferenceId: z
        .union([z.lazy(() => IntFilterSchema), z.number()])
        .optional(),
    })
    .strict();

export const CommitteeCreateWithoutSubCommitteesInputSchema: z.ZodType<Prisma.CommitteeCreateWithoutSubCommitteesInput> =
  z
    .object({
      name: z.string(),
      abbreviation: z.string(),
      category: z.string(),
      isSubcommittee: z.boolean(),
      parentCommittee: z
        .lazy(() => CommitteeCreateNestedOneWithoutSubCommitteesInputSchema)
        .optional(),
      conference: z.lazy(
        () => ConferenceCreateNestedOneWithoutCommitteesInputSchema,
      ),
    })
    .strict();

export const CommitteeUncheckedCreateWithoutSubCommitteesInputSchema: z.ZodType<Prisma.CommitteeUncheckedCreateWithoutSubCommitteesInput> =
  z
    .object({
      id: z.number().int().optional(),
      name: z.string(),
      abbreviation: z.string(),
      category: z.string(),
      isSubcommittee: z.boolean(),
      parentCommitteeId: z.number().int().optional().nullable(),
      conferenceId: z.number().int(),
    })
    .strict();

export const CommitteeCreateOrConnectWithoutSubCommitteesInputSchema: z.ZodType<Prisma.CommitteeCreateOrConnectWithoutSubCommitteesInput> =
  z
    .object({
      where: z.lazy(() => CommitteeWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => CommitteeCreateWithoutSubCommitteesInputSchema),
        z.lazy(() => CommitteeUncheckedCreateWithoutSubCommitteesInputSchema),
      ]),
    })
    .strict();

export const ConferenceCreateWithoutCommitteesInputSchema: z.ZodType<Prisma.ConferenceCreateWithoutCommitteesInput> =
  z
    .object({
      name: z.string(),
    })
    .strict();

export const ConferenceUncheckedCreateWithoutCommitteesInputSchema: z.ZodType<Prisma.ConferenceUncheckedCreateWithoutCommitteesInput> =
  z
    .object({
      id: z.number().int().optional(),
      name: z.string(),
    })
    .strict();

export const ConferenceCreateOrConnectWithoutCommitteesInputSchema: z.ZodType<Prisma.ConferenceCreateOrConnectWithoutCommitteesInput> =
  z
    .object({
      where: z.lazy(() => ConferenceWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => ConferenceCreateWithoutCommitteesInputSchema),
        z.lazy(() => ConferenceUncheckedCreateWithoutCommitteesInputSchema),
      ]),
    })
    .strict();

export const CommitteeCreateWithoutParentCommitteeInputSchema: z.ZodType<Prisma.CommitteeCreateWithoutParentCommitteeInput> =
  z
    .object({
      name: z.string(),
      abbreviation: z.string(),
      category: z.string(),
      isSubcommittee: z.boolean(),
      conference: z.lazy(
        () => ConferenceCreateNestedOneWithoutCommitteesInputSchema,
      ),
      subCommittees: z
        .lazy(() => CommitteeCreateNestedManyWithoutParentCommitteeInputSchema)
        .optional(),
    })
    .strict();

export const CommitteeUncheckedCreateWithoutParentCommitteeInputSchema: z.ZodType<Prisma.CommitteeUncheckedCreateWithoutParentCommitteeInput> =
  z
    .object({
      id: z.number().int().optional(),
      name: z.string(),
      abbreviation: z.string(),
      category: z.string(),
      isSubcommittee: z.boolean(),
      conferenceId: z.number().int(),
      subCommittees: z
        .lazy(
          () =>
            CommitteeUncheckedCreateNestedManyWithoutParentCommitteeInputSchema,
        )
        .optional(),
    })
    .strict();

export const CommitteeCreateOrConnectWithoutParentCommitteeInputSchema: z.ZodType<Prisma.CommitteeCreateOrConnectWithoutParentCommitteeInput> =
  z
    .object({
      where: z.lazy(() => CommitteeWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => CommitteeCreateWithoutParentCommitteeInputSchema),
        z.lazy(() => CommitteeUncheckedCreateWithoutParentCommitteeInputSchema),
      ]),
    })
    .strict();

export const CommitteeCreateManyParentCommitteeInputEnvelopeSchema: z.ZodType<Prisma.CommitteeCreateManyParentCommitteeInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => CommitteeCreateManyParentCommitteeInputSchema),
        z.lazy(() => CommitteeCreateManyParentCommitteeInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const CommitteeUpsertWithoutSubCommitteesInputSchema: z.ZodType<Prisma.CommitteeUpsertWithoutSubCommitteesInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => CommitteeUpdateWithoutSubCommitteesInputSchema),
        z.lazy(() => CommitteeUncheckedUpdateWithoutSubCommitteesInputSchema),
      ]),
      create: z.union([
        z.lazy(() => CommitteeCreateWithoutSubCommitteesInputSchema),
        z.lazy(() => CommitteeUncheckedCreateWithoutSubCommitteesInputSchema),
      ]),
      where: z.lazy(() => CommitteeWhereInputSchema).optional(),
    })
    .strict();

export const CommitteeUpdateToOneWithWhereWithoutSubCommitteesInputSchema: z.ZodType<Prisma.CommitteeUpdateToOneWithWhereWithoutSubCommitteesInput> =
  z
    .object({
      where: z.lazy(() => CommitteeWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => CommitteeUpdateWithoutSubCommitteesInputSchema),
        z.lazy(() => CommitteeUncheckedUpdateWithoutSubCommitteesInputSchema),
      ]),
    })
    .strict();

export const CommitteeUpdateWithoutSubCommitteesInputSchema: z.ZodType<Prisma.CommitteeUpdateWithoutSubCommitteesInput> =
  z
    .object({
      name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      abbreviation: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      category: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSubcommittee: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      parentCommittee: z
        .lazy(() => CommitteeUpdateOneWithoutSubCommitteesNestedInputSchema)
        .optional(),
      conference: z
        .lazy(
          () => ConferenceUpdateOneRequiredWithoutCommitteesNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const CommitteeUncheckedUpdateWithoutSubCommitteesInputSchema: z.ZodType<Prisma.CommitteeUncheckedUpdateWithoutSubCommitteesInput> =
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
      abbreviation: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      category: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSubcommittee: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      parentCommitteeId: z
        .union([
          z.number().int(),
          z.lazy(() => NullableIntFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      conferenceId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const ConferenceUpsertWithoutCommitteesInputSchema: z.ZodType<Prisma.ConferenceUpsertWithoutCommitteesInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => ConferenceUpdateWithoutCommitteesInputSchema),
        z.lazy(() => ConferenceUncheckedUpdateWithoutCommitteesInputSchema),
      ]),
      create: z.union([
        z.lazy(() => ConferenceCreateWithoutCommitteesInputSchema),
        z.lazy(() => ConferenceUncheckedCreateWithoutCommitteesInputSchema),
      ]),
      where: z.lazy(() => ConferenceWhereInputSchema).optional(),
    })
    .strict();

export const ConferenceUpdateToOneWithWhereWithoutCommitteesInputSchema: z.ZodType<Prisma.ConferenceUpdateToOneWithWhereWithoutCommitteesInput> =
  z
    .object({
      where: z.lazy(() => ConferenceWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => ConferenceUpdateWithoutCommitteesInputSchema),
        z.lazy(() => ConferenceUncheckedUpdateWithoutCommitteesInputSchema),
      ]),
    })
    .strict();

export const ConferenceUpdateWithoutCommitteesInputSchema: z.ZodType<Prisma.ConferenceUpdateWithoutCommitteesInput> =
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

export const ConferenceUncheckedUpdateWithoutCommitteesInputSchema: z.ZodType<Prisma.ConferenceUncheckedUpdateWithoutCommitteesInput> =
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

export const CommitteeUpsertWithWhereUniqueWithoutParentCommitteeInputSchema: z.ZodType<Prisma.CommitteeUpsertWithWhereUniqueWithoutParentCommitteeInput> =
  z
    .object({
      where: z.lazy(() => CommitteeWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => CommitteeUpdateWithoutParentCommitteeInputSchema),
        z.lazy(() => CommitteeUncheckedUpdateWithoutParentCommitteeInputSchema),
      ]),
      create: z.union([
        z.lazy(() => CommitteeCreateWithoutParentCommitteeInputSchema),
        z.lazy(() => CommitteeUncheckedCreateWithoutParentCommitteeInputSchema),
      ]),
    })
    .strict();

export const CommitteeUpdateWithWhereUniqueWithoutParentCommitteeInputSchema: z.ZodType<Prisma.CommitteeUpdateWithWhereUniqueWithoutParentCommitteeInput> =
  z
    .object({
      where: z.lazy(() => CommitteeWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => CommitteeUpdateWithoutParentCommitteeInputSchema),
        z.lazy(() => CommitteeUncheckedUpdateWithoutParentCommitteeInputSchema),
      ]),
    })
    .strict();

export const CommitteeUpdateManyWithWhereWithoutParentCommitteeInputSchema: z.ZodType<Prisma.CommitteeUpdateManyWithWhereWithoutParentCommitteeInput> =
  z
    .object({
      where: z.lazy(() => CommitteeScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => CommitteeUpdateManyMutationInputSchema),
        z.lazy(
          () => CommitteeUncheckedUpdateManyWithoutParentCommitteeInputSchema,
        ),
      ]),
    })
    .strict();

export const CommitteeCreateManyConferenceInputSchema: z.ZodType<Prisma.CommitteeCreateManyConferenceInput> =
  z
    .object({
      id: z.number().int().optional(),
      name: z.string(),
      abbreviation: z.string(),
      category: z.string(),
      isSubcommittee: z.boolean(),
      parentCommitteeId: z.number().int().optional().nullable(),
    })
    .strict();

export const CommitteeUpdateWithoutConferenceInputSchema: z.ZodType<Prisma.CommitteeUpdateWithoutConferenceInput> =
  z
    .object({
      name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      abbreviation: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      category: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSubcommittee: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      parentCommittee: z
        .lazy(() => CommitteeUpdateOneWithoutSubCommitteesNestedInputSchema)
        .optional(),
      subCommittees: z
        .lazy(() => CommitteeUpdateManyWithoutParentCommitteeNestedInputSchema)
        .optional(),
    })
    .strict();

export const CommitteeUncheckedUpdateWithoutConferenceInputSchema: z.ZodType<Prisma.CommitteeUncheckedUpdateWithoutConferenceInput> =
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
      abbreviation: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      category: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSubcommittee: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      parentCommitteeId: z
        .union([
          z.number().int(),
          z.lazy(() => NullableIntFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
      subCommittees: z
        .lazy(
          () =>
            CommitteeUncheckedUpdateManyWithoutParentCommitteeNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const CommitteeUncheckedUpdateManyWithoutConferenceInputSchema: z.ZodType<Prisma.CommitteeUncheckedUpdateManyWithoutConferenceInput> =
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
      abbreviation: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      category: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSubcommittee: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      parentCommitteeId: z
        .union([
          z.number().int(),
          z.lazy(() => NullableIntFieldUpdateOperationsInputSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();

export const CommitteeCreateManyParentCommitteeInputSchema: z.ZodType<Prisma.CommitteeCreateManyParentCommitteeInput> =
  z
    .object({
      id: z.number().int().optional(),
      name: z.string(),
      abbreviation: z.string(),
      category: z.string(),
      isSubcommittee: z.boolean(),
      conferenceId: z.number().int(),
    })
    .strict();

export const CommitteeUpdateWithoutParentCommitteeInputSchema: z.ZodType<Prisma.CommitteeUpdateWithoutParentCommitteeInput> =
  z
    .object({
      name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      abbreviation: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      category: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSubcommittee: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      conference: z
        .lazy(
          () => ConferenceUpdateOneRequiredWithoutCommitteesNestedInputSchema,
        )
        .optional(),
      subCommittees: z
        .lazy(() => CommitteeUpdateManyWithoutParentCommitteeNestedInputSchema)
        .optional(),
    })
    .strict();

export const CommitteeUncheckedUpdateWithoutParentCommitteeInputSchema: z.ZodType<Prisma.CommitteeUncheckedUpdateWithoutParentCommitteeInput> =
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
      abbreviation: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      category: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSubcommittee: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      conferenceId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      subCommittees: z
        .lazy(
          () =>
            CommitteeUncheckedUpdateManyWithoutParentCommitteeNestedInputSchema,
        )
        .optional(),
    })
    .strict();

export const CommitteeUncheckedUpdateManyWithoutParentCommitteeInputSchema: z.ZodType<Prisma.CommitteeUncheckedUpdateManyWithoutParentCommitteeInput> =
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
      abbreviation: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      category: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      isSubcommittee: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      conferenceId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const ConferenceFindFirstArgsSchema: z.ZodType<Prisma.ConferenceFindFirstArgs> =
  z
    .object({
      select: ConferenceSelectSchema.optional(),
      include: ConferenceIncludeSchema.optional(),
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
      distinct: z
        .union([
          ConferenceScalarFieldEnumSchema,
          ConferenceScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const ConferenceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ConferenceFindFirstOrThrowArgs> =
  z
    .object({
      select: ConferenceSelectSchema.optional(),
      include: ConferenceIncludeSchema.optional(),
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
      distinct: z
        .union([
          ConferenceScalarFieldEnumSchema,
          ConferenceScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const ConferenceFindManyArgsSchema: z.ZodType<Prisma.ConferenceFindManyArgs> =
  z
    .object({
      select: ConferenceSelectSchema.optional(),
      include: ConferenceIncludeSchema.optional(),
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
      distinct: z
        .union([
          ConferenceScalarFieldEnumSchema,
          ConferenceScalarFieldEnumSchema.array(),
        ])
        .optional(),
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
      include: ConferenceIncludeSchema.optional(),
      where: ConferenceWhereUniqueInputSchema,
    })
    .strict();

export const ConferenceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ConferenceFindUniqueOrThrowArgs> =
  z
    .object({
      select: ConferenceSelectSchema.optional(),
      include: ConferenceIncludeSchema.optional(),
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
      distinct: z
        .union([
          ConferenceCreateTokenScalarFieldEnumSchema,
          ConferenceCreateTokenScalarFieldEnumSchema.array(),
        ])
        .optional(),
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
      distinct: z
        .union([
          ConferenceCreateTokenScalarFieldEnumSchema,
          ConferenceCreateTokenScalarFieldEnumSchema.array(),
        ])
        .optional(),
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
      distinct: z
        .union([
          ConferenceCreateTokenScalarFieldEnumSchema,
          ConferenceCreateTokenScalarFieldEnumSchema.array(),
        ])
        .optional(),
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

export const CommitteeFindFirstArgsSchema: z.ZodType<Prisma.CommitteeFindFirstArgs> =
  z
    .object({
      select: CommitteeSelectSchema.optional(),
      include: CommitteeIncludeSchema.optional(),
      where: CommitteeWhereInputSchema.optional(),
      orderBy: z
        .union([
          CommitteeOrderByWithRelationInputSchema.array(),
          CommitteeOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: CommitteeWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          CommitteeScalarFieldEnumSchema,
          CommitteeScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const CommitteeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CommitteeFindFirstOrThrowArgs> =
  z
    .object({
      select: CommitteeSelectSchema.optional(),
      include: CommitteeIncludeSchema.optional(),
      where: CommitteeWhereInputSchema.optional(),
      orderBy: z
        .union([
          CommitteeOrderByWithRelationInputSchema.array(),
          CommitteeOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: CommitteeWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          CommitteeScalarFieldEnumSchema,
          CommitteeScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const CommitteeFindManyArgsSchema: z.ZodType<Prisma.CommitteeFindManyArgs> =
  z
    .object({
      select: CommitteeSelectSchema.optional(),
      include: CommitteeIncludeSchema.optional(),
      where: CommitteeWhereInputSchema.optional(),
      orderBy: z
        .union([
          CommitteeOrderByWithRelationInputSchema.array(),
          CommitteeOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: CommitteeWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          CommitteeScalarFieldEnumSchema,
          CommitteeScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const CommitteeAggregateArgsSchema: z.ZodType<Prisma.CommitteeAggregateArgs> =
  z
    .object({
      where: CommitteeWhereInputSchema.optional(),
      orderBy: z
        .union([
          CommitteeOrderByWithRelationInputSchema.array(),
          CommitteeOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: CommitteeWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const CommitteeGroupByArgsSchema: z.ZodType<Prisma.CommitteeGroupByArgs> =
  z
    .object({
      where: CommitteeWhereInputSchema.optional(),
      orderBy: z
        .union([
          CommitteeOrderByWithAggregationInputSchema.array(),
          CommitteeOrderByWithAggregationInputSchema,
        ])
        .optional(),
      by: CommitteeScalarFieldEnumSchema.array(),
      having: CommitteeScalarWhereWithAggregatesInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const CommitteeFindUniqueArgsSchema: z.ZodType<Prisma.CommitteeFindUniqueArgs> =
  z
    .object({
      select: CommitteeSelectSchema.optional(),
      include: CommitteeIncludeSchema.optional(),
      where: CommitteeWhereUniqueInputSchema,
    })
    .strict();

export const CommitteeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CommitteeFindUniqueOrThrowArgs> =
  z
    .object({
      select: CommitteeSelectSchema.optional(),
      include: CommitteeIncludeSchema.optional(),
      where: CommitteeWhereUniqueInputSchema,
    })
    .strict();

export const ConferenceCreateArgsSchema: z.ZodType<Prisma.ConferenceCreateArgs> =
  z
    .object({
      select: ConferenceSelectSchema.optional(),
      include: ConferenceIncludeSchema.optional(),
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
      include: ConferenceIncludeSchema.optional(),
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
      include: ConferenceIncludeSchema.optional(),
      where: ConferenceWhereUniqueInputSchema,
    })
    .strict();

export const ConferenceUpdateArgsSchema: z.ZodType<Prisma.ConferenceUpdateArgs> =
  z
    .object({
      select: ConferenceSelectSchema.optional(),
      include: ConferenceIncludeSchema.optional(),
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

export const CommitteeCreateArgsSchema: z.ZodType<Prisma.CommitteeCreateArgs> =
  z
    .object({
      select: CommitteeSelectSchema.optional(),
      include: CommitteeIncludeSchema.optional(),
      data: z.union([
        CommitteeCreateInputSchema,
        CommitteeUncheckedCreateInputSchema,
      ]),
    })
    .strict();

export const CommitteeUpsertArgsSchema: z.ZodType<Prisma.CommitteeUpsertArgs> =
  z
    .object({
      select: CommitteeSelectSchema.optional(),
      include: CommitteeIncludeSchema.optional(),
      where: CommitteeWhereUniqueInputSchema,
      create: z.union([
        CommitteeCreateInputSchema,
        CommitteeUncheckedCreateInputSchema,
      ]),
      update: z.union([
        CommitteeUpdateInputSchema,
        CommitteeUncheckedUpdateInputSchema,
      ]),
    })
    .strict();

export const CommitteeCreateManyArgsSchema: z.ZodType<Prisma.CommitteeCreateManyArgs> =
  z
    .object({
      data: z.union([
        CommitteeCreateManyInputSchema,
        CommitteeCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const CommitteeDeleteArgsSchema: z.ZodType<Prisma.CommitteeDeleteArgs> =
  z
    .object({
      select: CommitteeSelectSchema.optional(),
      include: CommitteeIncludeSchema.optional(),
      where: CommitteeWhereUniqueInputSchema,
    })
    .strict();

export const CommitteeUpdateArgsSchema: z.ZodType<Prisma.CommitteeUpdateArgs> =
  z
    .object({
      select: CommitteeSelectSchema.optional(),
      include: CommitteeIncludeSchema.optional(),
      data: z.union([
        CommitteeUpdateInputSchema,
        CommitteeUncheckedUpdateInputSchema,
      ]),
      where: CommitteeWhereUniqueInputSchema,
    })
    .strict();

export const CommitteeUpdateManyArgsSchema: z.ZodType<Prisma.CommitteeUpdateManyArgs> =
  z
    .object({
      data: z.union([
        CommitteeUpdateManyMutationInputSchema,
        CommitteeUncheckedUpdateManyInputSchema,
      ]),
      where: CommitteeWhereInputSchema.optional(),
    })
    .strict();

export const CommitteeDeleteManyArgsSchema: z.ZodType<Prisma.CommitteeDeleteManyArgs> =
  z
    .object({
      where: CommitteeWhereInputSchema.optional(),
    })
    .strict();
