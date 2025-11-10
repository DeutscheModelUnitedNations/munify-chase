import { assertFirstEntryExists } from "@m1212e/rumble";
import { and, count, eq, type InferSelectModel } from "drizzle-orm";
import { db, schema } from "$api/db/db";
import {
  abilityBuilder,
  countQuery,
  enum_,
  object,
  query,
  pubsub as rumblePubsub,
  schemaBuilder,
} from "$api/rumble";
import { isDMUNEmail } from "$api/services/isDMUNEmail";

abilityBuilder.committee
  .allow(["read", "update"])
  .when(({ mustBeLoggedIn }) => {
    const user = mustBeLoggedIn();
    if (user?.email && isDMUNEmail(user.email)) {
      return "allow";
    }
  });

const statusEnum = enum_({
  tsName: "committeeStatus",
});

const pubsub = rumblePubsub({ table: "committee" });

query({
  table: "committee",
});
countQuery({
  table: "committee",
});

const getTotalPresentCount = async (
  parent: InferSelectModel<typeof schema.committee> & {
    members: (InferSelectModel<typeof schema.committeeMember> & {
      representation: InferSelectModel<typeof schema.representation>;
    })[];
  },
) => {
  if (
    typeof parent.members?.at(0)?.present === "boolean" &&
    parent.members?.at(0)?.representation.type
  ) {
    return parent.members.filter(
      (x) => x.present && x.representation.type === "DELEGATION",
    ).length;
  }
  return (
    await db
      .select({ count: count() })
      .from(schema.committeeMember)
      .innerJoin(
        schema.representation,
        eq(schema.committeeMember.representationId, schema.representation.id),
      )
      .where(
        and(
          eq(schema.committeeMember.committeeId, parent.id),
          eq(schema.committeeMember.present, true),
          eq(schema.representation.type, "DELEGATION"),
        ),
      )
      .then(assertFirstEntryExists)
  ).count;
};

const ref = object({
  table: "committee",
  adjust: (t) => ({
    totalPresent: t.field({
      type: "Int",
      //TODO remove as any when rumble fixed it's types
      resolve: (parent, args, context, info) =>
        getTotalPresentCount(parent as any),
    }),
    simpleMajority: t.field({
      type: "Int",
      resolve: async (parent, args, context, info) => {
        if (parent.customSimpleMajority) {
          return parent.customSimpleMajority;
        }
        const total = await getTotalPresentCount(parent as any);
        let majority: number;
        if ((total / 2) % 1 == 0) {
          majority = total / 2 + 1;
        } else {
          majority = Math.ceil(total / 2);
        }
        return majority > total ? total : majority;
      },
    }),
    twoThirdsMajority: t.field({
      type: "Int",
      resolve: async (parent, args, context, info) => {
        if (parent.customTwoThirdsMajority) {
          return parent.customSimpleMajority;
        }
        const total = await getTotalPresentCount(parent as any);
        return Math.ceil((total * 2) / 3);
      },
    }),
    paperSupportThreshold: t.field({
      type: "Int",
      resolve: async (parent, args, context, info) => {
        if (parent.customPaperSupportThreshold) {
          return parent.customPaperSupportThreshold;
        }
        const total = await getTotalPresentCount(parent as any);
        return Math.ceil(total * 0.1);
      },
    }),
  }),
});

schemaBuilder.mutationFields((t) => {
  return {
    updateCommittee: t.drizzleField({
      type: ref,
      args: {
        id: t.arg.id({ required: true }),
        //TODO do we want to allow updates to these defaults?
        // e.g. abbreviation and name probably are pretty static...
        // name: t.arg.string(),
        whiteboardContent: t.arg.string(),
        showWhiteboard: t.arg.boolean(),
        status: t.arg({
          type: statusEnum,
        }),
        statusHeadline: t.arg.string(),
        statusUntil: t.arg({
          type: "DateTime",
        }),
        stateOfDebate: t.arg.string(),
        activeAgendaItemId: t.arg.id(),
        lastResolutionAdoptionDate: t.arg({
          type: "DateTime",
        }),
      },
      resolve: async (query, root, args, ctx, info) => {
        await db
          .update(schema.committee)
          .set({
            whiteboardContent: args.whiteboardContent ?? undefined,
            showWhiteboard: args.showWhiteboard ?? undefined,
            status: args.status ?? undefined,
            statusHeadline: args.statusHeadline ?? undefined,
            statusUntil: args.statusUntil ?? undefined,
            stateOfDebate: args.stateOfDebate ?? undefined,
            activeAgendaItemId: args.activeAgendaItemId ?? undefined,
            lastResolutionAdoptionDate:
              args.lastResolutionAdoptionDate ?? undefined,
          })
          .where(
            and(
              eq(schema.committee.id, args.id),
              ctx.abilities.committee.filter("update").sql.where,
            ),
          );

        if (args.activeAgendaItemId) {
          await db.insert(schema.committeeTopicChangedTimestamp).values({
            committeeId: args.id,
            agendaItemId: args.activeAgendaItemId,
            timestamp: new Date(),
          });
        }

        pubsub.updated(args.id);

        return db.query.committee.findFirst(
          query(
            ctx.abilities.committee.filter("read").merge({
              where: {
                id: args.id,
              },
            }).query.single,
          ),
        );
      },
    }),
  };
});
