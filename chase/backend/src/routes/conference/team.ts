import { t, Elysia } from "elysia";
import { db } from "../../../prisma/db";
import { auth } from "../../plugins/auth";
import committee from "./committee";

const isValidRole = (
  input: string
): input is
  | "ADMIN"
  | "CHAIR"
  | "COMMITTEE_ADVISOR"
  | "DELEGATE"
  | "OBSERVER"
  | "NON_STATE_ACTOR"
  | "SECRETARIAT"
  | "PRESS_CORPS"
  | "PARTICIPANT_CARE"
  | "TEAM"
  | "GUEST" => {
  return [
    "ADMIN",
    "CHAIR",
    "COMMITTEE_ADVISOR",
    "DELEGATE",
    "OBSERVER",
    "NON_STATE_ACTOR",
    "SECRETARIAT",
    "PRESS_CORPS",
    "PARTICIPANT_CARE",
    "TEAM",
    "GUEST",
  ].includes(input);
};

export default new Elysia()
  .use(auth)
  .get(
    "/conference/:conferenceId/team/list",
    async ({ params: { conferenceId } }) => {
      return db.team.findMany({ where: { conferenceId } });
    }
  )
  .get(
    "/conference/:conferenceId/team/chairs/list",
    async ({ params: { conferenceId } }) => {
      return db.team.findMany({
        where: { conferenceId, role: "CHAIR" },
      });
    }
  )
  .post(
    "/conference/:conferenceId/team",
    async ({ auth, body, params: { conferenceId } }) => {
      if (!auth.permissions.isConferenceAdmin(conferenceId)) {
        return new Response(null, { status: 401 });
      }

      if (!isValidRole(body.role)) {
        return new Response(null, {
          status: 400,
          statusText: "Invalid Committee Category",
        });
      }

      return db.team.create({
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          role: body.role,
          conferenceId,
        },
      });
    },
    {
      detail: {
        description: "Creates a teammember in this conference",
      },
      body: t.Object({
        firstName: t.String(),
        lastName: t.String(),
        email: t.String(),
        role: t.String(),
      }),
    }
  )
  .post(
    "/conference/:conferenceId/team/connectCommittee/chairs",
    async ({ auth, body, params: { conferenceId } }) => {
      if (!auth.permissions.isConferenceAdmin(conferenceId)) {
        return new Response(null, { status: 401 });
      }

      const currentChairs = await db.committee.findUnique({
        where: { id: body.committeeId },
        select: { chairs: { select: { id: true } } },
      });

      const chairsToConnect = body.chairs.filter(
        (id) => !currentChairs?.chairs.map((c) => c.id).includes(id)
      );
      const chairsToDisconnect = body.chairs.filter((id) =>
        currentChairs?.chairs.map((c) => c.id).includes(id)
      );

      return db.committee.update({
        where: { id: body.committeeId },
        data: {
          chairs: {
            connect: chairsToConnect.map((id) => ({ id })),
            disconnect: chairsToDisconnect.map((id) => ({ id })),
          },
        },
      });
    },
    {
      body: t.Object({
        committeeId: t.String(),
        chairs: t.Array(t.String()),
      }),
    }
  )
  .post(
    "/conference/:conferenceId/team/connectCommittee/advisors",
    async ({ auth, body, params: { conferenceId } }) => {
      if (!auth.permissions.isConferenceAdmin(conferenceId)) {
        return new Response(null, { status: 401 });
      }

      const currentAdvisors = await db.committee.findUnique({
        where: { id: body.committeeId },
        select: { committee_advisors: { select: { id: true } } },
      });

      const advisorsToConnect = body.chairs.filter(
        (id) => !currentAdvisors?.committee_advisors.map((c) => c.id).includes(id)
      );
      const advisorsToDisconnect = body.chairs.filter((id) =>
        currentAdvisors?.committee_advisors.map((c) => c.id).includes(id)
      );

      return db.committee.update({
        where: { id: body.committeeId },
        data: {
          chairs: {
            connect: advisorsToConnect.map((id) => ({ id })),
            disconnect: advisorsToDisconnect.map((id) => ({ id })),
          },
        },
      });
    },
    {
      body: t.Object({
        committeeId: t.String(),
        chairs: t.Array(t.String()),
      }),
    }
  )

  .delete(
    "/conference/:conferenceId/team",
    ({ auth, params: { conferenceId } }) => {
      if (!auth.permissions.isConferenceAdmin(conferenceId)) {
        return new Response(null, { status: 401 });
      }

      return db.team.deleteMany({ where: { conferenceId } });
    }
  )

  .delete(
    "/conference/:conferenceId/team/:memberId",
    ({ auth, params: { memberId, conferenceId } }) => {
      if (!auth.permissions.isConferenceAdmin(conferenceId)) {
        return new Response(null, { status: 401 });
      }

      return db.team.delete({ where: { id: memberId } });
    }
  );
