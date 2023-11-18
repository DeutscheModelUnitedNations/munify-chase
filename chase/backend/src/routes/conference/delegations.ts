import { t, Elysia } from "elysia";
import { db } from "../../../prisma/db";
import { auth } from "../../plugins/auth";

export default new Elysia()
  .use(auth)
  .get(
    "/conference/:conferenceId/delegations/list",
    async ({ params: { conferenceId } }) => {
      return db.delegation.findMany({
        where: { conferenceId },
        include: { Delegates: true },
      });
    }
  )
  .post(
    "/conference/:conferenceId/delegations/create",
    async ({ auth, body, params: { conferenceId } }) => {
      //   if (!auth.permissions.isConferenceAdmin(conferenceId)) {
      //     return new Response(null, { status: 401 });
      //   }

      return db.delegation.create({
        data: {
          alpha3Code: body.alpha3Code.toLowerCase(),
          conferenceId,
          Delegates: {
            create: [],
          },
        },
      });
    },
    {
      detail: {
        description: "Creates a delegation on this conference",
      },
      body: t.Object({
        alpha3Code: t.String(),
      }),
    }
  )
  .delete(
    "/conference/:conferenceId/delegations/:delegationId",
    async ({ auth, params: { conferenceId, delegationId } }) => {
      // if (!auth.permissions.isConferenceAdmin(conferenceId)) {
      //   return new Response(null, { status: 401 });
      // }

      // TODO also delete the Delegates, not only the Delegation
      return db.$transaction([
        db.delegate.deleteMany({
          where: { delegationId },
        }),
        db.delegation.delete({
          where: { id: delegationId },
        }),
      ]);
    },
    {
      detail: {
        description: "Deletes a delegation on this conference",
      },
    }
  )
  .post(
    "/conference/:conferenceId/delegations/:delegationId/connectCommittee",
    async ({ auth, body, params: { conferenceId, delegationId } }) => {
      // if (!auth.permissions.isConferenceAdmin(conferenceId)) {
      //   return new Response(null, { status: 401 });
      // }

      // Check if delegationId exists
      const delegation = await db.delegation.findUnique({
        where: { id: delegationId },
      });

      if (!delegation) {
        return new Response(`Delegation with id ${delegationId} not found`, {
          status: 404,
        });
      }

      // Check if committees are already connected
      const connection = await db.delegate.findFirst({
        where: { committeeId: body.committeeId, delegationId: delegationId },
      });

      // Check if committees are already connected
      if (connection) {
        return new Response(
        connection.id,
          { status: 208 }
        );
      }

      return db.delegate.create({
        data: {
          committeeId: body.committeeId,
          delegationId,
        },
      });
    },
    {
      detail: {
        description: "Connects a committee to a delegation",
      },
      body: t.Object({
        committeeId: t.String(),
      }),
    }
  )
  .post(
    "/conference/:conferenceId/delegations/:delegationId/disconnectCommittee",
    async ({ auth, body, params: { conferenceId, delegationId } }) => {
      // if (!auth.permissions.isConferenceAdmin(conferenceId)) {
      //   return new Response(null, { status: 401 });
      // }

      return db.delegate.delete({
        where: {
          id: body.id,
        },
      });
    },
    {
      detail: {
        description: "Disconnects a committee from a delegation",
      },
      body: t.Object({
        id: t.String(),
      }),
    }
  );
