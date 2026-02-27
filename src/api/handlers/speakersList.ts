import { assertFindFirstExists } from '@m1212e/rumble';
import { and, eq } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { db, schema } from '$api/db/db';
import {
  abilityBuilder,
  countQuery,
  object,
  query,
  pubsub as rumblePubsub,
  schemaBuilder
} from '$api/rumble';

abilityBuilder.speakersList.allow(['read', 'update', 'delete']).when(({ mustBeLoggedIn }) => {
  const user = mustBeLoggedIn();
  return {
    where: {
      agendaItem: {
        committee: {
          conference: {
            users: {
              user: {
                id: user.sub
              }
            }
          }
        }
      }
    }
  };
});

const ref = object({
  table: 'speakersList'
});
export const SpeakersListRef = ref;

const speakersListPubSub = rumblePubsub({ table: 'speakersList' });

query({
  table: 'speakersList'
});
countQuery({
  table: 'speakersList'
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
          type: 'DateTime'
        }),
        stopTimer: t.arg({
          type: 'Boolean',
          defaultValue: false
        }),
        isClosed: t.arg.boolean()
      },
      resolve: async (query, root, args, ctx, info) => {
        if (args.startTimestamp && args.stopTimer) {
          throw new GraphQLError('startTimestamp and stopTimer are mutually exclusive');
        }

        // Pre-check: verify user has update access via relational filter
        await db.query.speakersList
          .findFirst(
            ctx.abilities.speakersList.filter('update').merge({
              where: { id: args.id }
            }).query.single
          )
          .then(assertFindFirstExists);

        await db.transaction(async (tx) => {
          if (args.stopTimer) {
            const speakersList = await tx.query.speakersList
              .findFirst({
                where: {
                  id: args.id
                },
                with: {
                  speakers: {
                    orderBy: {
                      position: 'asc'
                    },
                    limit: 1
                  }
                }
              })
              .then(assertFindFirstExists);

            if (speakersList.startTimestamp) {
              await tx.insert(schema.spokenTimePeriod).values({
                endTimestamp: new Date(),
                startTimestamp: speakersList.startTimestamp!,
                speakersListId: speakersList.id,
                committeeMemberId: speakersList.speakers[0].committeeMemberId,
                conferenceMemberId: speakersList.speakers[0].conferenceMemberId
              });
            }
          }

          await tx
            .update(schema.speakersList)
            .set({
              speakingTime: args.speakingTime ?? undefined,
              timeLeft: args.timeLeft ?? undefined,
              startTimestamp: args.stopTimer ? null : (args.startTimestamp ?? undefined),
              isClosed: args.isClosed ?? undefined
            })
            .where(eq(schema.speakersList.id, args.id));
        });

        speakersListPubSub.updated(args.id);

        return db.query.speakersList
          .findFirst(
            query(
              ctx.abilities.speakersList.filter('read').merge({
                where: { id: args.id }
              }).query.single
            )
          )
          .then(assertFindFirstExists);
      }
    }),
    clearSpeakersList: t.drizzleField({
      type: SpeakersListRef,
      args: {
        id: t.arg.id({ required: true })
      },
      resolve: async (query, root, args, ctx, info) => {
        // Pre-check: verify user has delete access to speakers on this list
        await db.query.speakersList
          .findFirst(
            ctx.abilities.speakersList.filter('delete').merge({
              where: { id: args.id }
            }).query.single
          )
          .then(assertFindFirstExists);

        const deleted = await db
          .delete(schema.speakerOnList)
          .where(eq(schema.speakerOnList.speakersListId, args.id))
          .returning();

        if (deleted.length > 0) {
          rumblePubsub({ table: 'speakerOnList' }).removed();
        }

        speakersListPubSub.updated(args.id);

        return db.query.speakersList
          .findFirst(
            query(
              ctx.abilities.speakersList.filter('read').merge({
                where: { id: args.id }
              }).query.single
            )
          )
          .then(assertFindFirstExists);
      }
    })
  };
});
