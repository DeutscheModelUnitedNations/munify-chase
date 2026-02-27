import { assertFindFirstExists } from '@m1212e/rumble';
import { and, inArray } from 'drizzle-orm';
import { db, schema } from '$api/db/db';
import {
  abilityBuilder,
  countQuery,
  object,
  query,
  pubsub as rumblePubsub,
  schemaBuilder
} from '$api/rumble';

abilityBuilder.committeeMember.allow(['read', 'update']).when(({ mustBeLoggedIn }) => {
  const user = mustBeLoggedIn();
  return {
    where: {
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
  };
});

const ref = object({ table: 'committeeMember' });
query({ table: 'committeeMember' });
countQuery({
  table: 'committeeMember'
});
const pubsub = rumblePubsub({ table: 'committeeMember' });

schemaBuilder.mutationFields((t) => {
  return {
    setPresenceForCommitteeMembers: t.drizzleField({
      type: [ref],
      args: {
        ids: t.arg.idList({ required: true }),
        present: t.arg.boolean({ required: true })
      },
      resolve: async (query, _root, args, ctx) => {
        // Pre-check: verify user has update access to at least one of the members
        // (all members belong to same committee, so if one is accessible, all are)
        await db.query.committeeMember
          .findFirst(
            ctx.abilities.committeeMember.filter('update').merge({
              where: { id: { in: args.ids } }
            }).query.single
          )
          .then(assertFindFirstExists);

        const res = await db
          .update(schema.committeeMember)
          .set({
            present: args.present
          })
          .where(inArray(schema.committeeMember.id, args.ids))
          .returning({
            id: schema.committeeMember.id
          });

        await db.insert(schema.presenceChangedTimestamp).values(
          res.map((committeeMember) => ({
            committeeMemberId: committeeMember.id,
            presentSetTo: args.present,
            timestamp: new Date()
          }))
        );

        pubsub.updated(args.ids);

        return db.query.committeeMember.findMany(
          query(
            ctx.abilities.committeeMember.filter('read').merge({
              where: {
                id: {
                  in: args.ids
                }
              }
            }).query.single
          )
        );
      }
    })
  };
});
