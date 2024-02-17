import { t, Elysia } from "elysia";
import { db } from "../../../prisma/db";
import { committeeRoleGuard } from "../../auth/guards/committeeRoles";
import { conferenceRoleGuard } from "../../auth/guards/conferenceRoles";
import { openApiTag } from "../../util/openApiTags";

export const speakersListGeneral = new Elysia({
  prefix: "/conference/:conferenceId/committee/:committeeId",
})
  .use(conferenceRoleGuard)
  .use(committeeRoleGuard)
  .get(
    "/speakersList",
    async ({ params: { conferenceId, committeeId } }) => {
      const agendaItem = await db.agendaItem.findFirst({
        where: {
          committeeId,
          isActive: true,
        },
      });

      if (!agendaItem) {
        return new Response("No active agenda item found", { status: 404 });
      }

      const speakersList = await db.speakersList.findMany({
        where: {
          agendaItemId: agendaItem.id,
        },
        include: {
          speakers: {
            include: {
              delegation: {
                include: {
                  nation: true,
                },
              },
            }
          }
        }
      });

      return speakersList;
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get all speakers lists in this committee",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/speakersList/:type",
    async ({ params: { conferenceId, committeeId, type } }) => {
      const agendaItem = await db.agendaItem.findFirst({
        where: {
          committeeId,
          isActive: true,
        },
      });

      if (!agendaItem) {
        return new Response("No active agenda item found", { status: 404 });
      }

      const speakersList = await db.speakersList.findUniqueOrThrow({
        where: {
          agendaItemId: agendaItem.id,
          type,
        },
        include: {
          speakers: {
            include: {
              delegation: {
                include: {
                  nation: true,
                },
              },
            }
          }
        }
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get a single speakers list by type",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/speakersList/:speakersListId/addSpeaker",
    async ({ body, params: { conferenceId, committeeId, speakersListId } }) => {
      if (!body.userId && !body.committeeMemberId) {
        return new Response("userId, delegationId, or committeeMemberId required", { status: 400 });
      }

      if (body.userId && body.committeeMemberId) {
        return new Response("userId and committeeMemberId are mutually exclusive", { status: 400 });
      }

      if (body.userId) {
        const committeeMember = await db.committeeMember.findFirst({
          where: {
            userId: body.userId,
            committeeId,
          },
        });

        if (!committeeMember) {
          return new Response("User is not a committee member", { status: 404 });
        }

        body.committeeMemberId = committeeMember.id;
      }

      return await db.committeeMember.update({
        where: {
          userId: body.userId,
          id: body.committeeMemberId,
        },
        data: {
          speakersLists: {
            connect: {
              id: speakersListId,
            },
          },
        },
      })
    },
    {
      hasConferenceRole: "any",
      body: t.Object({
        userId: t.Optional(t.String()),
        committeeMemberId: t.Optional(t.String()),
      }),
      detail: {
        description: "Add a speaker to a speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
