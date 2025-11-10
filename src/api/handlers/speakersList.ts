import { assertFindFirstExists } from "@m1212e/rumble";
import { and, eq } from "drizzle-orm";
import { GraphQLError } from "graphql";
import { db, schema } from "$api/db/db";
import {
  abilityBuilder,
  countQuery,
  object,
  query,
  pubsub as rumblePubsub,
  schemaBuilder,
} from "$api/rumble";
import { isDMUNEmail } from "$api/services/isDMUNEmail";

abilityBuilder.speakersList
  .allow(["read", "update", "delete"])
  .when(({ mustBeLoggedIn }) => {
    const user = mustBeLoggedIn();
    if (user?.email && isDMUNEmail(user.email)) {
      return "allow";
    }
  });

const ref = object({
  table: "speakersList",
});
export const SpeakersListRef = ref;

const speakersListPubSub = rumblePubsub({ table: "speakersList" });

query({
  table: "speakersList",
});
countQuery({
  table: "speakersList",
});

schemaBuilder.mutationFields((t) => {
  return {
    updateSpeakersList: t.drizzleField({
      type: ref,
      args: {
        id: t.arg.id({ required: true }),
        speakingTime: t.arg.int(),
        timeLeft: t.arg.int(),
        startTimestamp: t.arg({
          type: "DateTime",
        }),
        stopTimer: t.arg({
          type: "Boolean",
          defaultValue: false,
        }),
        isClosed: t.arg.boolean(),
      },
      resolve: async (query, root, args, ctx, info) => {
        if (args.startTimestamp && args.stopTimer) {
          throw new GraphQLError(
            "startTimestamp and stopTimer are mutually exclusive",
          );
        }

        await db.transaction(async (tx) => {
          if (args.stopTimer) {
            const speakersList = await tx.query.speakersList
              .findFirst({
                where: {
                  id: args.id,
                },
                with: {
                  speakers: {
                    orderBy: {
                      position: "asc",
                    },
                    limit: 1,
                  },
                },
              })
              .then(assertFindFirstExists);

            if (speakersList.startTimestamp) {
              await tx.insert(schema.spokenTimePeriod).values({
                endTimestamp: new Date(),
                startTimestamp: speakersList.startTimestamp!,
                speakersListId: speakersList.id,
                committeeMemberId: speakersList.speakers[0].committeeMemberId,
                conferenceMemberId: speakersList.speakers[0].conferenceMemberId,
              });
            }
          }

          await tx
            .update(schema.speakersList)
            .set({
              speakingTime: args.speakingTime ?? undefined,
              timeLeft: args.timeLeft ?? undefined,
              startTimestamp: args.stopTimer
                ? null
                : (args.startTimestamp ?? undefined),
              isClosed: args.isClosed ?? undefined,
            })
            .where(
              and(
                eq(schema.speakersList.id, args.id),
                ctx.abilities.speakersList.filter("update").sql.where,
              ),
            );
        });

        speakersListPubSub.updated(args.id);

        return db.query.speakersList
          .findFirst(
            query(
              ctx.abilities.speakersList.filter("read").merge({
                where: { id: args.id },
              }).query.single,
            ),
          )
          .then(assertFindFirstExists);
      },
    }),
    clearSpeakersList: t.drizzleField({
      type: SpeakersListRef,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (query, root, args, ctx, info) => {
        const deleted = await db
          .delete(schema.speakerOnList)
          .where(
            and(
              eq(schema.speakerOnList.speakersListId, args.id),
              ctx.abilities.speakerOnList.filter("delete").sql.where,
            ),
          )
          .returning();

        if (deleted.length > 0) {
          rumblePubsub({ table: "speakerOnList" }).removed();
        }

        speakersListPubSub.updated(args.id);

        return db.query.speakersList
          .findFirst(
            query(
              ctx.abilities.speakersList.filter("read").merge({
                where: { id: args.id },
              }).query.single,
            ),
          )
          .then(assertFindFirstExists);
      },
    }),
  };
});
