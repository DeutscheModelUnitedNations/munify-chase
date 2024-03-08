import { t, Elysia } from "elysia";
import { db } from "../../../prisma/db";
import { committeeMemberGuard } from "../../auth/guards/committeeMember";
import { conferenceRoleGuard } from "../../auth/guards/conferenceRoles";
import { openApiTag } from "../../util/openApiTags";

function calculateTimeLeft(
  startTimestamp: Date | null | undefined,
  stopTimestamp: Date,
  speakingTime: number | null | undefined,
): number {
  if (startTimestamp && speakingTime) {
    const timeElapsed =
      (stopTimestamp.getTime() - startTimestamp.getTime()) / 1000;
    return Math.floor(speakingTime - timeElapsed);
  }
  return 0;
}

export const speakersListModification = new Elysia({
  prefix: "/speakersList/:speakersListId",
})
  .use(conferenceRoleGuard)
  .use(committeeMemberGuard)
  .post(
    "/setSpeakingTime",
    async ({ params: { speakersListId }, body }) => {
      const speakersList = await db.speakersList.update({
        where: {
          id: speakersListId,
        },
        data: {
          speakingTime: body.speakingTime,
        },
      });

      return speakersList;
    },
    {
      hasConferenceRole: "any",
      body: t.Object({
        speakingTime: t.Number(),
      }),
      detail: {
        description: "Set the time for a speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/close",
    async ({ params: { speakersListId } }) => {
      const speakersList = await db.speakersList.update({
        where: {
          id: speakersListId,
        },
        data: {
          isClosed: true,
        },
      });

      return speakersList;
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Close a speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/open",
    async ({ params: { speakersListId } }) => {
      const speakersList = await db.speakersList.update({
        where: {
          id: speakersListId,
        },
        data: {
          isClosed: false,
        },
      });

      return speakersList;
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Open a speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/startTimer",
    async ({ params: { speakersListId }, set }) => {
      const speakersList = await db.speakersList.findUnique({
        where: {
          id: speakersListId,
        },
        include: {
          agendaItem: {
            select: {
              speakerLists: {
                select: {
                  id: true,
                  type: true,
                },
              },
            },
          },
        },
      });

      if (!speakersList) {
        set.status = "Not Found";
        throw new Error("Speakers List not found");
      }

      return await db.$transaction(async (tx) => {
        if (speakersList.type === "COMMENT_LIST") {
          await tx.speakersList.update({
            where: {
              id: speakersList.agendaItem.speakerLists.find(
                (sl) => sl.type === "SPEAKERS_LIST",
              )?.id,
            },
            data: {
              startTimestamp: null,
              timeLeft: speakersList.speakingTime,
            },
          });
        } else if (speakersList.type === "SPEAKERS_LIST") {
          await tx.speakersList.update({
            where: {
              id: speakersList.agendaItem.speakerLists.find(
                (sl) => sl.type === "COMMENT_LIST",
              )?.id,
            },
            data: {
              startTimestamp: null,
            },
          });
        }

        await tx.speakersList.update({
          where: {
            id: speakersListId,
          },
          data: {
            startTimestamp: new Date(Date.now()),
            timeLeft: speakersList?.timeLeft ?? speakersList?.speakingTime,
          },
        });
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Start the timer for a speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/stopTimer",
    async ({ params: { speakersListId } }) => {
      const speakersList = await db.speakersList.findUnique({
        where: {
          id: speakersListId,
        },
      });

      return await db.speakersList.update({
        where: {
          id: speakersListId,
        },
        data: {
          timeLeft: calculateTimeLeft(
            speakersList?.startTimestamp,
            new Date(Date.now()),
            speakersList?.timeLeft,
          ),
          startTimestamp: null,
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Stop the timer for a speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/resetTimer",
    async ({ params: { speakersListId } }) => {
      const SpeakersList = await db.speakersList.findUnique({
        where: {
          id: speakersListId,
        },
      });

      return await db.speakersList.update({
        where: {
          id: speakersListId,
        },
        data: {
          startTimestamp: SpeakersList?.startTimestamp
            ? new Date(Date.now())
            : null,
          timeLeft: SpeakersList?.speakingTime,
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Reset the timer for a speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/increaseSpeakingTime",
    async ({ params: { speakersListId }, body, set }) => {
      const speakersList = await db.speakersList.findUnique({
        where: {
          id: speakersListId,
        },
      });

      if (!speakersList?.timeLeft) {
        set.status = "Bad Request";
        throw new Error("No time set, increase not possible");
      }

      return await db.speakersList.update({
        where: {
          id: speakersListId,
        },
        data: {
          timeLeft: speakersList?.timeLeft + body.amount,
        },
      });
    },
    {
      hasConferenceRole: "any",
      body: t.Object({
        amount: t.Number(),
      }),
      detail: {
        description: "Increase the speaking time for a speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/decreaseSpeakingTime",
    async ({ params: { speakersListId }, body, set }) => {
      const speakersList = await db.speakersList.findUnique({
        where: {
          id: speakersListId,
        },
      });

      if (!speakersList?.timeLeft) {
        set.status = "Bad Request";
        throw new Error("No time set, decrease not possible");
      }

      return await db.speakersList.update({
        where: {
          id: speakersListId,
        },
        data: {
          timeLeft: speakersList?.timeLeft - body.amount,
        },
      });
    },
    {
      hasConferenceRole: "any",
      body: t.Object({
        amount: t.Number(),
      }),
      detail: {
        description: "Decrease the speaking time for a speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
