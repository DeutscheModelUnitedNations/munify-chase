import { t, Elysia } from "elysia";
import { db } from "../../../prisma/db";
import { auth } from "../../plugins/auth";

//TODO how are auth issuer roles/metadata removed from related users when the entity is deleted?

const isValidCommitteeCategory = (
  input: string
): input is "COMMITTEE" | "CRISIS" | "ICJ" => {
  return ["COMMITTEE", "CRISIS", "ICJ"].includes(input);
};

export default new Elysia()
  .use(auth)
  .get(
    "/conference/:conferenceId/committee/list",
    async ({ params: { conferenceId } }) => {
      return db.committee.findMany({
        where: { conferenceId },
        include: { Delegates: true },
      });
    }
  )
  .post(
    "/conference/:conferenceId/committee",
    async ({ auth, body, params: { conferenceId } }) => {
      // if (!auth.permissions.isConferenceAdmin(conferenceId)) {
      //   return new Response(null, { status: 401 });
      // }

      if (!isValidCommitteeCategory(body.category)) {
        return new Response(null, {
          status: 400,
          statusText: "Invalid Committee Category",
        });
      }

      return db.committee.create({
        data: {
          name: body.name,
          abbreviation: body.abbreviation,
          conferenceId,
          category: body.category,
          isSubcommittee: body.isSubcommittee,
          parentId: body.parentId,
          chairs: {
            create: [],
          },
          committee_advisors: {
            create: [],
          },
        },
      });
    },
    {
      detail: {
        description: "Creates a committee on this conference",
      },
      body: t.Object({
        name: t.String(),
        abbreviation: t.String(),
        category: t.String(),
        isSubcommittee: t.Boolean(),
        parentId: t.Optional(t.String()),
      }),
    }
  )
  .delete(
    "/conference/:conferenceId/committee",
    ({ auth, params: { conferenceId } }) => {
      // if (!auth.permissions.isConferenceAdmin(conferenceId)) {
      //   return new Response(null, { status: 401 });
      // }

      return db.committee.deleteMany({ where: { conferenceId } });
    }
  )
  .delete(
    "/conference/:conferenceId/committee/:committeeId",
    ({ auth, params: { committeeId, conferenceId } }) => {
      // if (!auth.permissions.isConferenceAdmin(conferenceId)) {
      //   return new Response(null, { status: 401 });
      // }

      return db.committee.delete({ where: { conferenceId, id: committeeId } });
    }
  )

  .get(
    "/conference/:conferenceId/agendaItem/list",
    async ({ params: { conferenceId } }) => {
      return db.agendaItem.findMany({
        where: { committee: { conferenceId } },
      });
    }
  )
  .post(
    "/conference/:conferenceId/committee/:committeeId/agendaItem",
    ({ auth, body, params: { committeeId, conferenceId } }) => {
      // if (!auth.permissions.isConferenceAdmin(conferenceId)) {
      //   return new Response(null, { status: 401 });
      // }

      return db.agendaItem.create({
        data: {
          title: body.title,
          description: body.description || null,
          committeeId,
        },
      });
    },
    {
      detail: {
        description: "Creates an agenda item on this committee",
      },
      body: t.Object({
        title: t.String(),
        description: t.Optional(t.String()),
      }),
    }
  )
  .delete(
    "/conference/:conferenceId/committee/:committeeId/agendaItem/:agendaItemId",
    ({ auth, params: { committeeId, conferenceId, agendaItemId } }) => {
      // if (!auth.permissions.isConferenceAdmin(conferenceId)) {
      //   return new Response(null, { status: 401 });
      // }

      return db.agendaItem.delete({ where: { committeeId, id: agendaItemId } });
    }
  );
