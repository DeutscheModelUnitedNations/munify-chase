import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { committeeRoleGuard } from "../auth/guards/committeeRoles";
import { conferenceRoleGuard } from "../auth/guards/conferenceRoles";
import { openApiTag } from "../util/openApiTags";
import { Committee } from "../../prisma/generated/schema";

const CommitteeWithoutRelations = t.Omit(Committee, [
  "conference",
  "members",
  "parent",
  "subCommittees",
  "agendaItems",
  "parentId",
]);

const CommitteeData = t.Omit(CommitteeWithoutRelations, ["id", "conferenceId"]);

export const committee = new Elysia({
  prefix: "/conference/:conferenceId",
})
  .use(conferenceRoleGuard)
  .use(committeeRoleGuard)
  .get(
    "/committee",
    ({ params: { conferenceId } }) => {
      return db.committee.findMany({
        where: {
          conferenceId,
        },
      });
    },
    {
      hasConferenceRole: "any",
      response: t.Array(CommitteeWithoutRelations),
      detail: {
        description: "Get all committees in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/committee",
    ({ body, params: { conferenceId } }) => {
      return db.committee.create({
        data: {
          abbreviation: body.abbreviation,
          category: body.category,
          conferenceId,
          name: body.name,
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description: "Create a new committee in this conference",
        tags: [openApiTag(import.meta.path)],
      },
      body: CommitteeData,
      response: CommitteeWithoutRelations,
    },
  )
  .get(
    "/committee/:committeeId",
    ({ params: { conferenceId, committeeId } }) => {
      return db.committee.findUniqueOrThrow({
        where: { conferenceId, id: committeeId },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get a single committee by id",
        tags: [openApiTag(import.meta.path)],
      },
      response: CommitteeWithoutRelations,
    },
  )
  .delete(
    "/committee/:committeeId",
    ({ params: { conferenceId, committeeId } }) =>
      db.committee.delete({ where: { id: committeeId, conferenceId } }),
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description: "Delete a committee by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .patch(
    "/committee/:committeeId",
    ({ params: { conferenceId, committeeId }, body }) => {
      return db.committee.update({
        where: { id: committeeId, conferenceId },
        data: {
          name: body.name,
          abbreviation: body.abbreviation,
          category: body.category,
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      body: CommitteeData,
      detail: {
        description: "Update a committee by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
