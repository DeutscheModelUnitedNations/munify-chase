import { t, Elysia } from "elysia";
import { db } from "../../../prisma/db";
import { committeeRoleGuard } from "../../auth/guards/committeeMember";
import { conferenceRoleGuard } from "../../auth/guards/conferenceRoles";
import { openApiTag } from "../../util/openApiTags";
import { $Enums } from "../../../prisma/generated/client";
import { SpeakersListCategory } from "../../../prisma/generated/schema";

export const speakersListGeneral = new Elysia({
  prefix: "/conference/:conferenceId/committee/:committeeId",
})
  .use(conferenceRoleGuard)
  .use(committeeRoleGuard)
  .get(
    "/speakersList",
    async ({ params: { committeeId }, set }) => {
      const agendaItem = await db.agendaItem.findFirst({
        where: {
          committeeId,
          isActive: true,
        },
      });

      if (!agendaItem) {
        set.status = "Not Found";
        throw new Error("No active agenda item found");
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
            orderBy: {
              position: "asc",
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
    async ({ params: { committeeId, type }, set }) => {
      const agendaItem = await db.agendaItem.findFirst({
        where: {
          committeeId,
          isActive: true,
        },
      });

      if (!agendaItem) {
        set.status = "Not Found";
        throw new Error("No active agenda item found");
      }

      //TODO check if needed at all since strong typings come from params schema now
      if (!Object.values($Enums.SpeakersListCategory).includes(type)) {
        set.status = "Bad Request";
        throw new Error("Invalid speakers list type");
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
            orderBy: {
              position: "asc",
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
      params: t.Object({
        type: SpeakersListCategory,
        committeeId: t.String(),
      }),
      hasConferenceRole: "any",
      detail: {
        description: "Get a single speakers list by type",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
