import { t, Elysia } from "elysia";
import { db } from "../../../prisma/db";
import { auth } from "../../plugins/auth";

const isValidRole = (
  input: string
): input is
  | "ADMIN"
  | "CHAIR"
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