import { t, Elysia } from "elysia";
import { db } from "../../../prisma/db";
import { committeeRoleGuard } from "../../auth/guards/committeeRoles";
import { conferenceRoleGuard } from "../../auth/guards/conferenceRoles";
import { openApiTag } from "../../util/openApiTags";
import { $Enums } from "../../../prisma/generated/client";

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
              committeeMember: {
                include: {
                  delegation: {
                    include: {
                      nation: {
                        select: {
                          alpha3Code: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
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

      if (!Object.values($Enums.SpeakersListCategory).includes(type)) {
        return new Response("Invalid speakers list type", { status: 400 });
      }

      return await db.speakersList.findFirst({
        where: {
          agendaItemId: agendaItem.id,
          type: type as $Enums.SpeakersListCategory,
        },
        include: {
          speakers: {
            include: {
              committeeMember: {
                select: {
                  id: true,
                  userId: true,
                  delegation: {
                    select: {
                      id: true,
                      nation: {
                        select: {
                          alpha3Code: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          agendaItem: {
            select: {
              id: true,
              committee: {
                select: {
                  allowDelegationsToAddThemselvesToSpeakersList: true,
                },
              },
            },
          },
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get a single speakers list by type",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
