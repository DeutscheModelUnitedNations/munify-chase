import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { committeeRoleGuard } from "../auth/guards/committeeRoles";
import { conferenceRoleGuard } from "../auth/guards/conferenceRoles";
import { openApiTag } from "../util/openApiTags";
import { Message } from "../../prisma/generated/schema";
import { $Enums } from "../../prisma/generated/client";

export const messages = new Elysia({
  prefix: "",
})
  .use(conferenceRoleGuard)
  .use(committeeRoleGuard)
  .get(
    "/conference/:conferenceId/messages/researchService",
    ({ params: { conferenceId } }) => {
      return db.message.findMany({
        where: {
          committee: {
            conferenceId,
          },
          forwarded: true,
          NOT: {
            status: {
              has: $Enums.MessageStatus.ARCHIVED,
            },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              emails: true,
            },
          },
        },
        orderBy: {
          timestamp: "asc",
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get all research service messages in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .get(
    "/conference/:conferenceId/committee/:committeeId/messages",
    ({ params: { committeeId } }) => {
      return db.message.findMany({
        where: {
          committeeId,
          forwarded: false,
          NOT: {
            status: {
              has: $Enums.MessageStatus.ARCHIVED,
            },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              emails: true,
            },
          },
        },
        orderBy: {
          timestamp: "asc",
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get all messages for the chair in this committee",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/conference/:conferenceId/committee/:committeeId/messages",
    ({ body, params: { committeeId } }) => {
      return db.message.create({
        data: {
          committee: { connect: { id: committeeId } },
          subject: body.subject,
          message: body.message,
          author: { connect: { id: body.authorId } },
          timestamp: new Date(Date.now()),
          metaEmail: body.metaEmail,
          metaDelegation: body.metaDelegation,
          metaCommittee: body.metaCommittee,
          metaAgendaItem: body.metaAgendaItem,
          category: body.category,
        },
      });
    },
    {
      hasConferenceRole: "any",
      body: t.Pick(Message, [
        "subject",
        "message",
        "authorId",
        "metaEmail",
        "metaDelegation",
        "metaCommittee",
        "metaAgendaItem",
        "category",
      ]),
      detail: {
        description: "Create a new message",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .get(
    "/conference/:conferenceId/messages/count",
    async ({ params: { conferenceId } }) => {
      return await db.message.count({
        where: {
          committee: {
            conferenceId,
          },
          forwarded: true,
          status: {
            has: $Enums.MessageStatus.UNREAD,
          },
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description:
          "Get the number of unread messages to the research service in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .get(
    "/conference/:conferenceId/committee/:committeeId/messages/count",
    ({ params: { committeeId } }) => {
      return db.message.count({
        where: {
          committeeId,
          forwarded: false,
          status: {
            has: $Enums.MessageStatus.UNREAD,
          },
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description:
          "Get the number of unread messages for the chair in this committee",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/message/:messageId/setStatus",
    async ({ body, params: { messageId }, set }) => {
      const message = await db.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        set.status = "Not Found";
        throw new Error("Message not found");
      }

      if (!body?.status) {
        set.status = "Bad Request";
        throw new Error("Status is required");
      }

      const updatedArray: $Enums.MessageStatus[] = message.status;
      updatedArray.push(body.status as $Enums.MessageStatus);

      return await db.message.update({
        where: { id: messageId },
        data: {
          status: updatedArray,
        },
      });
    },
    {
      hasConferenceRole: "any",
      body: t.Object({ status: t.String() }),
      detail: {
        description: "Set a Status for a message from the MessageStatus enum",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/message/:messageId/removeStatus",
    async ({ body, params: { messageId }, set }) => {
      const message = await db.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        set.status = "Not Found";
        throw new Error("Message not found");
      }

      if (!body?.status) {
        set.status = "Bad Request";
        throw new Error("Status is required");
      }

      if (!message.status.includes(body.status as $Enums.MessageStatus)) {
        set.status = "Bad Request";
        throw new Error("Message does not have this status");
      }

      const updatedArray: $Enums.MessageStatus[] = message.status.filter(
        (status) => status !== body.status,
      );

      return await db.message.update({
        where: { id: messageId },
        data: {
          status: updatedArray,
        },
      });
    },
    {
      hasConferenceRole: "any",
      body: t.Object({ status: t.String() }),
      detail: {
        description: "Set a Status for a message from the MessageStatus enum",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/message/:messageId/forwardToResearchService",
    async ({ params: { messageId } }) => {
      return await db.message.update({
        where: { id: messageId },
        data: {
          forwarded: true,
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Forward a message to the research service",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
