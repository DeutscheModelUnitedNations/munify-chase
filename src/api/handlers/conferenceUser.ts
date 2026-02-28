import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { eq } from 'drizzle-orm';
import { db, schema } from '$api/db/db';
import {
  abilityBuilder,
  countQuery,
  enum_,
  object,
  pubsub as rumblePubsub,
  query,
  schemaBuilder
} from '$api/rumble';
import { nanoid } from '$lib/helpers/nanoid';

abilityBuilder.conferenceUser.allow('read').when(({ mustBeLoggedIn }) => {
  const user = mustBeLoggedIn();

  return {
    where: {
      user: {
        id: user.sub
      }
    }
  };
});

abilityBuilder.conferenceUser.allow('read').when(({ mustBeLoggedIn }) => {
  const user = mustBeLoggedIn();
  return {
    where: {
      conference: {
        users: {
          user: {
            id: user.sub
          },
          conferenceUserType: {
            in: ['ADMIN', 'TEAM']
          }
        }
      }
    }
  };
});

const ref = object({ table: 'conferenceUser' });
export const ConferenceUserRef = ref;
const pubsub = rumblePubsub({ table: 'conferenceUser' });

query({ table: 'conferenceUser' });
countQuery({
  table: 'conferenceUser'
});

schemaBuilder.mutationFields((t) => {
  return {
    createConferenceUser: t.drizzleField({
      type: ref,
      args: {
        conferenceId: t.arg({ type: 'ID', required: true }),
        userEmail: t.arg({ type: 'String', required: true }),
        conferenceUserType: t.arg({
          type: enum_({ tsName: 'conferenceUserType' }),
          required: true
        })
      },
      resolve: async (query, _root, args, ctx) => {
        // Verify the caller is an admin of the conference (match by email directly)
        await db.query.conferenceUser
          .findFirst({
            where: {
              conferenceId: args.conferenceId,
              userEmail: ctx.mustBeLoggedIn().email!,
              conferenceUserType: 'ADMIN'
            }
          })
          .then(assertFindFirstExists);

        const res = await db
          .insert(schema.conferenceUser)
          .values({
            id: nanoid(),
            conferenceId: args.conferenceId,
            userEmail: args.userEmail.toLowerCase().trim(),
            conferenceUserType: args.conferenceUserType
          })
          .returning()
          .then(assertFirstEntryExists);

        // Already verified admin — fetch with query() selections only
        const created = await db.query.conferenceUser
          .findFirst(query({ where: { id: res.id } }))
          .then(assertFindFirstExists);

        pubsub.created();
        return created;
      }
    }),
    updateConferenceUser: t.drizzleField({
      type: ref,
      args: {
        id: t.arg({ type: 'ID', required: true }),
        conferenceUserType: t.arg({
          type: enum_({ tsName: 'conferenceUserType' }),
          required: true
        })
      },
      resolve: async (query, _root, args, ctx) => {
        // Get the target user to find the conference
        const target = await db.query.conferenceUser
          .findFirst({
            where: { id: args.id }
          })
          .then(assertFindFirstExists);

        // Verify the caller is an admin of the conference (match by email directly)
        await db.query.conferenceUser
          .findFirst({
            where: {
              conferenceId: target.conferenceId,
              userEmail: ctx.mustBeLoggedIn().email!,
              conferenceUserType: 'ADMIN'
            }
          })
          .then(assertFindFirstExists);

        await db
          .update(schema.conferenceUser)
          .set({
            conferenceUserType: args.conferenceUserType
          })
          .where(eq(schema.conferenceUser.id, args.id));

        // Already verified admin — fetch with query() selections only
        const updated = await db.query.conferenceUser
          .findFirst(query({ where: { id: args.id } }))
          .then(assertFindFirstExists);

        pubsub.updated(args.id);
        return updated;
      }
    }),
    deleteConferenceUser: t.drizzleField({
      type: ref,
      args: {
        id: t.arg({ type: 'ID', required: true })
      },
      resolve: async (query, _root, args, ctx) => {
        // Fetch the target with proper query selections before deleting
        const target = await db.query.conferenceUser
          .findFirst(query({ where: { id: args.id } }))
          .then(assertFindFirstExists);

        // Verify the caller is an admin of the conference (match by email directly)
        await db.query.conferenceUser
          .findFirst({
            where: {
              conferenceId: target.conferenceId,
              userEmail: ctx.mustBeLoggedIn().email!,
              conferenceUserType: 'ADMIN'
            }
          })
          .then(assertFindFirstExists);

        await db.delete(schema.conferenceUser).where(eq(schema.conferenceUser.id, args.id));

        pubsub.removed();
        return target;
      }
    })
  };
});
