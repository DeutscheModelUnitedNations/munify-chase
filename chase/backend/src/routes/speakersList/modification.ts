import { t, Elysia } from "elysia";
import { db } from "../../../prisma/db";
import { committeeRoleGuard } from "../../auth/guards/committeeRoles";
import { conferenceRoleGuard } from "../../auth/guards/conferenceRoles";
import { openApiTag } from "../../util/openApiTags";

function calculateTimeLeft(
  startTimestamp: Date | null | undefined,
  stopTimestamp: Date,
  speakingTime: number | null | undefined
): number {
  if (startTimestamp && speakingTime) {
    const timeElapsed = (stopTimestamp.getTime() - startTimestamp.getTime()) / 1000;
    return Math.floor(speakingTime - timeElapsed);
  }
  return 0;
}

export const speakersListModification = new Elysia({
  prefix: "/speakersList/:speakersListId",
})
  .use(conferenceRoleGuard)
  .use(committeeRoleGuard)
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
    async ({ params: { speakersListId }, body }) => {
      const speakersList = await db.speakersList.findUnique({
        where: {
          id: speakersListId,
        }
      });

      return await db.speakersList.update({
        where: {
          id: speakersListId,
        },
        data: {
          startTimestamp: new Date(body.startTimestamp),
          timeLeft: speakersList?.timeLeft ?? speakersList?.speakingTime,
        },
      });
    },
    {
      hasConferenceRole: "any",
      body: t.Object({
        startTimestamp: t.String(),
      }),
      detail: {
        description: "Start the timer for a speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/stopTimer",
    async ({ params: { speakersListId }, body }) => {
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
          timeLeft: calculateTimeLeft(speakersList?.startTimestamp, new Date(body.stopTimestamp), speakersList?.speakingTime),
        },
      });
    },
    {
      hasConferenceRole: "any",
      body: t.Object({
        stopTimestamp: t.String(),
      }),
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
          startTimestamp: null,
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
    async ({ params: { speakersListId }, body }) => {
      const speakersList = await db.speakersList.findUnique({
        where: {
          id: speakersListId,
        },
      });

      if (!speakersList?.timeLeft) {
        return new Response("No time set, increase not possible", { status: 400 });
      }

      return await db.speakersList.update({
        where: {
          id: speakersListId,
        },
        data: {
          timeLeft: speakersList?.timeLeft + body.increase,
        },
      });
    },
    {
      hasConferenceRole: "any",
      body: t.Object({
        increase: t.Number(),
      }),
      detail: {
        description: "Increase the speaking time for a speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/decreaseSpeakingTime",
    async ({ params: { speakersListId }, body }) => {
      const speakersList = await db.speakersList.findUnique({
        where: {
          id: speakersListId,
        },
      });

      if (!speakersList?.timeLeft) {
        return new Response("No time set, decrease not possible", { status: 400 });
      }

      return await db.speakersList.update({
        where: {
          id: speakersListId,
        },
        data: {
          timeLeft: speakersList?.timeLeft - body.decrease,
        },
      });
    },
    {
      hasConferenceRole: "any",
      body: t.Object({
        decrease: t.Number(),
      }),
      detail: {
        description: "Decrease the speaking time for a speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
