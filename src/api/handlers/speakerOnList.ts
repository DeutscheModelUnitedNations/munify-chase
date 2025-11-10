import { assertFindFirstExists, assertFirstEntryExists } from "@m1212e/rumble";
import { and, count, eq, gte, sql } from "drizzle-orm";
import { GraphQLError } from "graphql";
import { db, schema } from "$api/db/db";
import {
  abilityBuilder,
  countQuery,
  object,
  query,
  pubsub as rumblePubsub,
  schemaBuilder,
  whereArg,
} from "$api/rumble";
import { isDMUNEmail } from "$api/services/isDMUNEmail";
import { SpeakersListRef } from "./speakersList";

abilityBuilder.speakerOnList
  .allow(["read", "update", "delete"])
  .when(({ mustBeLoggedIn }) => {
    const user = mustBeLoggedIn();
    if (user?.email && isDMUNEmail(user.email)) {
      return "allow";
    }
  });

const ref = object({ table: "speakerOnList" });
query({ table: "speakerOnList" });
countQuery({
  table: "speakerOnList",
});
const pubsub = rumblePubsub({ table: "speakerOnList" });

export const SpeakerOnListRef = ref;
export const SpeakerOnWhereArgs = whereArg({ table: "speakerOnList" });

// TODO: These could use some validation for the position values. E.g. only allow positons
// which are in bounds and so on

schemaBuilder.mutationFields((t) => {
  return {
    updateSpeakerOnList: t.drizzleField({
      type: ref,
      args: {
        id: t.arg.id({ required: true }),
        overwriteName: t.arg.string(),
      },
      resolve: async (query, _root, args, ctx, _info) => {
        const updated = await db
          .update(schema.speakerOnList)
          .set({
            overwriteName: args.overwriteName ? args.overwriteName : null,
          })
          .where(
            and(
              eq(schema.speakerOnList.id, args.id),
              ctx.abilities.speakerOnList.filter("update").sql.where,
            ),
          )
          .returning()
          .then(assertFirstEntryExists);

        pubsub.updated(args.id);

        return db.query.speakerOnList
          .findFirst(
            query(
              ctx.abilities.speakerOnList.filter("read").merge({
                where: { id: updated.id },
              }).query.single,
            ),
          )
          .then(assertFindFirstExists);
      },
    }),
    addSpeakerOnList: t.drizzleField({
      type: ref,
      args: {
        //TOOD do we need the userId here?
        //TOOD do we need the reference by nation here?
        committeeMemberId: t.arg.id(),
        conferenceMemberId: t.arg.id(),
        speakersListId: t.arg.id({ required: true }),
        position: t.arg.int(),
      },
      resolve: async (query, root, args, ctx, info) => {
        if (args.committeeMemberId && args.conferenceMemberId) {
          throw new GraphQLError(
            "Cannot set both committeeMemberId and conferenceMemberId",
          );
        }

        if (!args.committeeMemberId && !args.conferenceMemberId) {
          throw new GraphQLError(
            "Must set either committeeMemberId or conferenceMemberId",
          );
        }

        const createdId = await db.transaction(async (tx) => {
          let position = args.position;
          if (!position) {
            // in case the caller did not provide a position, just append as last entry
            position = (
              await tx
                .select({ count: count() })
                .from(schema.speakerOnList)
                .where(
                  eq(schema.speakerOnList.speakersListId, args.speakersListId),
                )
                .then(assertFirstEntryExists)
            ).count; // since the position is 0 based, we can just use the count as new position
          } else {
            // if they did provide a position, we want to shift all the entries up which are
            // equal or higher in position
            await tx
              .update(schema.speakerOnList)
              .set({
                position: sql`${schema.speakerOnList.position} + 1`,
              })
              .where(
                and(
                  eq(schema.speakerOnList.speakersListId, args.speakersListId),
                  gte(schema.speakerOnList.position, position),
                  ctx.abilities.speakerOnList.filter("update").sql.where,
                ),
              );
          }

          // we do query this for checking the required permissions
          const speakersList = await tx.query.speakersList
            .findFirst(
              ctx.abilities.speakersList.filter("update").merge({
                where: { id: args.speakersListId },
              }).query.single,
            )
            .then(assertFindFirstExists);

          const created = await tx
            .insert(schema.speakerOnList)
            .values({
              committeeMemberId: args.committeeMemberId,
              conferenceMemberId: args.conferenceMemberId,
              speakersListId: speakersList.id,
              position,
            })
            .returning({ id: schema.speakerOnList.id })
            .then(assertFirstEntryExists);

          return created.id;
        });
        pubsub.created();

        return db.query.speakerOnList
          .findFirst(
            query(
              ctx.abilities.speakerOnList.filter("read").merge({
                where: { id: createdId },
              }).query.single,
            ),
          )
          .then(assertFindFirstExists);
      },
    }),
    removeSpeakerOnList: t.drizzleField({
      type: SpeakersListRef,
      args: {
        //TOOD do we need the userId here?
        //TOOD do we need the reference by nation here?
        speakerOnListId: t.arg.id({ required: true }),
      },
      resolve: async (query, root, args, ctx, info) => {
        const removed = await db.transaction(async (tx) => {
          const deleted = await tx
            .delete(schema.speakerOnList)
            .where(
              and(
                eq(schema.speakerOnList.id, args.speakerOnListId),
                ctx.abilities.speakerOnList.filter("delete").sql.where,
              ),
            )
            .returning()
            .then(assertFirstEntryExists);

          const aboutToBeShiftedDown = await tx.query.speakerOnList.findMany({
            where: {
              speakersListId: deleted.speakersListId,
              position: {
                gt: deleted.position,
              },
            },
            orderBy: { position: "asc" },
          });

          for (const speaker of aboutToBeShiftedDown) {
            await tx
              .update(schema.speakerOnList)
              .set({
                position: sql`${schema.speakerOnList.position} - 1`,
              })
              .where(eq(schema.speakerOnList.id, speaker.id));
          }

          return deleted;
        });
        pubsub.removed();

        return db.query.speakersList
          .findFirst(
            query(
              ctx.abilities.speakersList.filter("read").merge({
                where: { id: removed.speakersListId },
              }).query.single,
            ),
          )
          .then(assertFindFirstExists);
      },
    }),
    moveSpeakerToPosition: t.drizzleField({
      type: ref,
      args: {
        id: t.arg.id({ required: true }),
        position: t.arg.int({ required: true }),
      },
      resolve: async (query, root, args, ctx, info) => {
        if (args.position < 0) {
          throw new GraphQLError("Position must be a non-negative integer");
        }
        const updatedEntityIds = await db.transaction(async (tx) => {
          const aboutToMoveSpeakerOnList = await tx.query.speakerOnList
            .findFirst(
              ctx.abilities.speakerOnList.filter("update").merge({
                where: { id: args.id },
              }).query.single,
            )
            .then(assertFindFirstExists);
          if (args.position === aboutToMoveSpeakerOnList.position) {
            throw new GraphQLError("Cannot move to the same position");
          }

          await tx
            .update(schema.speakerOnList)
            .set({
              position: -1,
            })
            .where(eq(schema.speakerOnList.id, aboutToMoveSpeakerOnList.id));

          const updatedEntityIds = [aboutToMoveSpeakerOnList.id];

          if (args.position > aboutToMoveSpeakerOnList.position) {
            const toUpdate = await tx.query.speakerOnList.findMany({
              where: {
                AND: [
                  {
                    position: {
                      gt: aboutToMoveSpeakerOnList.position,
                      lte: args.position,
                    },
                  },
                  {
                    speakersListId: aboutToMoveSpeakerOnList.speakersListId,
                  },
                ],
              },
              orderBy: {
                position: "asc",
              },
            });

            for (const entry of toUpdate) {
              await tx
                .update(schema.speakerOnList)
                .set({
                  position: sql`${schema.speakerOnList.position} - 1`,
                })
                .where(eq(schema.speakerOnList.id, entry.id));

              updatedEntityIds.push(entry.id);
            }
          } else if (args.position < aboutToMoveSpeakerOnList.position) {
            const toUpdate = await tx.query.speakerOnList.findMany({
              where: {
                AND: [
                  {
                    position: {
                      lt: aboutToMoveSpeakerOnList.position,
                      gte: args.position,
                    },
                  },
                  {
                    speakersListId: aboutToMoveSpeakerOnList.speakersListId,
                  },
                ],
              },
              orderBy: {
                position: "desc",
              },
            });

            for (const entry of toUpdate) {
              await tx
                .update(schema.speakerOnList)
                .set({
                  position: sql`${schema.speakerOnList.position} + 1`,
                })
                .where(eq(schema.speakerOnList.id, entry.id));

              updatedEntityIds.push(entry.id);
            }
          }

          await tx
            .update(schema.speakerOnList)
            .set({
              position: args.position,
            })
            .where(eq(schema.speakerOnList.id, aboutToMoveSpeakerOnList.id));

          return updatedEntityIds;
        });
        pubsub.updated(updatedEntityIds);

        return db.query.speakerOnList
          .findFirst(
            query(
              ctx.abilities.speakerOnList.filter("read").merge({
                where: { id: args.id },
              }).query.single,
            ),
          )
          .then(assertFindFirstExists);
      },
    }),
  };
});
