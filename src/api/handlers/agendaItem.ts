import { assertFindFirstExists, assertFirstEntryExists } from "@m1212e/rumble";
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
import { nanoid } from "$lib/helpers/nanoid";

abilityBuilder.agendaItem.allow(["read"]).when(({ mustBeLoggedIn }) => {
  const user = mustBeLoggedIn();
  if (user?.email && isDMUNEmail(user.email)) {
    return "allow";
  }
});

const pubsub = rumblePubsub({ table: "agendaItem" });

query({
  table: "agendaItem",
});
countQuery({
  table: "agendaItem",
});

const ref = object({
  table: "agendaItem",
  adjust: (t) => ({
    isActive: t.field({
      type: "Boolean",
      resolve: async (parent, _args, _context) => {
        const res = await db.query.committee
          .findFirst({
            where: { activeAgendaItemId: parent.id },
          })
          .then((r) => {
            return !!r;
          });
        return res;
      },
    }),
  }),
});

schemaBuilder.mutationFields((t) => {
  return {
    createAgendaItem: t.drizzleField({
      type: ref,
      args: {
        title: t.arg({ type: "String", required: true }),
        committeeId: t.arg({ type: "ID", required: true }),
      },
      resolve: async (query, _root, args, ctx) => {
        if (!ctx.hasRole("admin")) {
          // TODO: rumble should support something like this
          await db.query.conferenceUser
            .findFirst({
              where: {
                conference: {
                  committees: {
                    id: args.committeeId,
                  },
                },
                user: {
                  id: ctx.mustBeLoggedIn().sub,
                },
                conferenceUserType: {
                  in: ["ADMIN", "TEAM"],
                },
              },
            })
            .then(assertFindFirstExists);
        }

        return await db.transaction(async (tx) => {
          const res = await tx
            .insert(schema.agendaItem)
            .values({
              title: args.title,
              committeeId: args.committeeId,
              id: nanoid(),
            })
            .returning()
            .then(assertFirstEntryExists);

          pubsub.updated(res.id);

          await tx.insert(schema.speakersList).values({
            agendaItemId: res.id,
            id: nanoid(),
            type: "SPEAKERS_LIST",
            speakingTime: 180,
          });

          await tx.insert(schema.speakersList).values({
            agendaItemId: res.id,
            id: nanoid(),
            type: "COMMENT_LIST",
            speakingTime: 30,
          });

          return await tx.query.agendaItem
            .findFirst(
              query(
                ctx.abilities.agendaItem.filter("read").merge({
                  where: { id: res.id },
                }).query.single,
              ),
            )
            .then(assertFindFirstExists);
        });
      },
    }),
  };
});
