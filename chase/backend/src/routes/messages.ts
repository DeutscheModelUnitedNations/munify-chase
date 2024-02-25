import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { committeeRoleGuard } from "../auth/guards/committeeRoles";
import { conferenceRoleGuard } from "../auth/guards/conferenceRoles";
import { openApiTag } from "../util/openApiTags";
import { Message } from "../../prisma/generated/schema";
import { $Enums } from "../../prisma/generated/client";

export const messages = new Elysia({
  prefix: "/conference/:conferenceId",
})
  .use(conferenceRoleGuard)
  .use(committeeRoleGuard)
  .get(
    "/messages/researchService",
    ({ params: { conferenceId } }) => {
      return db.message.findMany({
        where: {
          committee: {
            conferenceId,
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
    "/committee/:committeeId/messages",
    ({ params: { committeeId } }) => {
      return db.message.findMany({
        where: {
          committeeId,
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
    "/committee/:committeeId/messages",
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
      ]),
      detail: {
        description: "Create a new message for the chair in this committee",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .get(
    "/messages/count",
    async ({ params: { conferenceId } }) => {
      return await db.message.count({
        where: {
          committee: {
            conferenceId,
          },
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
    "/committee/:committeeId/messages/count",
    ({ params: { committeeId } }) => {
      return db.message.count({
        where: {
          committeeId,
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
  );
