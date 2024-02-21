import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { committeeRoleGuard } from "../auth/guards/committeeRoles";
import { conferenceRoleGuard } from "../auth/guards/conferenceRoles";
import { openApiTag } from "../util/openApiTags";
import {
  ChairMessage,
  ResearchServiceMessage,
} from "../../prisma/generated/schema";

export const messages = new Elysia({
  prefix: "/conference/:conferenceId",
})
  .use(conferenceRoleGuard)
  .use(committeeRoleGuard)
  .get(
    "/messages/researchService",
    ({ params: { conferenceId } }) => {
      return db.researchServiceMessage.findMany({
        where: {
          conferenceId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
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

  .post(
    "/messages/researchServices",
    ({ body, params: { conferenceId } }) => {
      return db.researchServiceMessage.create({
        data: {
          conference: { connect: { id: conferenceId } },
          category: body.category,
          subject: body.subject,
          message: body.message,
          author: { connect: { id: body.authorId } },
          timestamp: new Date(Date.now()),
          metaEmail: body.metaEmail,
          metaDelegation: body.metaDelegation,
          metaCommittee: body.metaCommittee,
          metaAgendaItem: body.metaAgendaItem,
        },
      });
    },
    {
      hasConferenceRole: "any",
      body: t.Pick(ResearchServiceMessage, [
        "category",
        "subject",
        "message",
        "authorId",
        "metaEmail",
        "metaDelegation",
        "metaCommittee",
        "metaAgendaItem",
      ]),
      detail: {
        description: "Create a new research service message in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .get(
    "/committee/:committeeId/messages",
    ({ params: { committeeId } }) => {
      return db.chairMessage.findMany({
        where: {
          committeeId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
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
      return db.chairMessage.create({
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
      body: t.Pick(ChairMessage, [
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
  );
