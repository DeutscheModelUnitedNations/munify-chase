import { and, inArray } from "drizzle-orm";
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

abilityBuilder.committeeMember
  .allow(["read", "update"])
  .when(({ mustBeLoggedIn }) => {
    const user = mustBeLoggedIn();
    if (user?.email && isDMUNEmail(user.email)) {
      return "allow";
    }
  });

const ref = object({ table: "committeeMember" });
query({ table: "committeeMember" });
countQuery({
  table: "committeeMember",
});
const pubsub = rumblePubsub({ table: "committeeMember" });

schemaBuilder.mutationFields((t) => {
  return {
    setPresenceForCommitteeMembers: t.drizzleField({
      type: [ref],
      args: {
        ids: t.arg.idList({ required: true }),
        present: t.arg.boolean({ required: true }),
      },
      resolve: async (query, _root, args, ctx) => {
        const res = await db
          .update(schema.committeeMember)
          .set({
            present: args.present,
          })
          .where(
            and(
              inArray(schema.committeeMember.id, args.ids),
              ctx.abilities.committeeMember.filter("update").sql.where,
            ),
          )
          .returning({
            id: schema.committeeMember.id,
          });

        await db.insert(schema.presenceChangedTimestamp).values(
          res.map((committeeMember) => ({
            committeeMemberId: committeeMember.id,
            presentSetTo: args.present,
            timestamp: new Date(),
          })),
        );

        pubsub.updated(args.ids);

        return db.query.committeeMember.findMany(
          query(
            ctx.abilities.committeeMember.filter("read").merge({
              where: {
                id: {
                  in: args.ids,
                },
              },
            }).query.single,
          ),
        );
      },
    }),
  };
});
