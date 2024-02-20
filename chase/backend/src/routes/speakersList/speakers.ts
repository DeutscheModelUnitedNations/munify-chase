import { t, Elysia } from "elysia";
import { db } from "../../../prisma/db";
import { committeeRoleGuard } from "../../auth/guards/committeeRoles";
import { conferenceRoleGuard } from "../../auth/guards/conferenceRoles";
import { openApiTag } from "../../util/openApiTags";

async function calculatePosition(speakersListId: string) {
  const maxPosition = await db.speakerOnList.aggregate({
    _max: {
      position: true,
    },
    where: {
      speakersListId,
    },
  });

  const newPosition = (maxPosition._max.position ?? 0) + 1;

  return newPosition;
}

async function createSpeakerOnList(
  speakersListId: string,
  committeeMemberId: string,
) {
  return await db.speakerOnList.create({
    data: {
      speakersListId,
      committeeMemberId,
      position: await calculatePosition(speakersListId),
    },
  });
}

export const speakersListSpeakers = new Elysia({
  prefix: "/speakersList/:speakersListId",
})
  .use(conferenceRoleGuard)
  .use(committeeRoleGuard)

  .get(
    "",
    async ({ params: { speakersListId } }) => {
      return await db.speakersList.findUnique({
        where: {
          id: speakersListId,
        },
        include: {
          speakers: {
            include: {
              committeeMember: {
                select: {
                  id: true,
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
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get all speakers on the speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/addSpeaker/committeeMember/:committeeMemberId",
    async ({ params: { speakersListId, committeeMemberId } }) => {
      return await createSpeakerOnList(speakersListId, committeeMemberId);
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Add a speaker to the speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/addSpeaker/user/:userId",
    async ({ params: { speakersListId, userId } }) => {
      const committeeMember = await db.committeeMember.findFirst({
        where: {
          userId,
        },
      });

      if (!committeeMember) {
        throw new Response("User not found", { status: 404 });
      }

      return await createSpeakerOnList(speakersListId, committeeMember.id);
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Add a speaker to the speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/addSpeaker/code/:countryCode",
    async ({ params: { speakersListId, countryCode } }) => {
      const committeeMember = await db.committeeMember.findFirst({
        where: {
          delegation: {
            nation: {
              alpha3Code: countryCode,
            },
          },
        },
      });

      if (!committeeMember) {
        throw new Response("Committee member not found", { status: 404 });
      }

      return await createSpeakerOnList(speakersListId, committeeMember.id);
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Add a speaker to the speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .delete(
    "/removeSpeaker/:speakerId",
    async ({ params: { speakerId } }) => {
      return await db.speakerOnList.delete({
        where: {
          id: speakerId,
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Remove a speaker from the speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .delete(
    "/clearList",
    async ({ params: { speakersListId } }) => {
      return await db.speakerOnList.deleteMany({
        where: {
          speakersListId,
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Clear the speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/moveSpeaker/:speakerId/up",
    async ({ params: { speakersListId, speakerId } }) => {
      const speaker = await db.speakerOnList.findUnique({
        where: {
          id: speakerId,
        },
      });

      if (!speaker) {
        throw new Response("Speaker not found", { status: 404 });
      }

      const previousSpeaker = await db.speakerOnList.findFirst({
        where: {
          speakersListId,
          position: {
            lt: speaker.position,
          },
        },
        orderBy: {
          position: "desc",
        },
      });

      if (!previousSpeaker) {
        return speaker;
      }

      return await db.$transaction([
        db.speakerOnList.update({
          where: {
            id: speakerId,
          },
          data: {
            position: previousSpeaker.position,
          },
        }),
        db.speakerOnList.update({
          where: {
            id: previousSpeaker.id,
          },
          data: {
            position: speaker.position,
          },
        }),
      ]);
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Move a speaker up in the list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/moveSpeaker/:speakerId/down",
    async ({ params: { speakersListId, speakerId } }) => {
      const speaker = await db.speakerOnList.findUnique({
        where: {
          id: speakerId,
        },
      });

      if (!speaker) {
        throw new Response("Speaker not found", { status: 404 });
      }

      const nextSpeaker = await db.speakerOnList.findFirst({
        where: {
          speakersListId,
          position: {
            gt: speaker.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });

      if (!nextSpeaker) {
        return speaker;
      }

      return await db.$transaction([
        db.speakerOnList.update({
          where: {
            id: speakerId,
          },
          data: {
            position: nextSpeaker.position,
          },
        }),
        db.speakerOnList.update({
          where: {
            id: nextSpeaker.id,
          },
          data: {
            position: speaker.position,
          },
        }),
      ]);
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Move a speaker down in the list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/nextSpeaker",
    async ({ params: { speakersListId } }) => {
      const currentSpeaker = await db.speakerOnList.findFirst({
        where: {
          speakersListId,
        },
        orderBy: {
          position: "asc",
        },
      });

      if (!currentSpeaker) {
        return new Response("No next speaker found", { status: 404 });
      }

      const speakersList = await db.speakersList.findUnique({
        where: {
          id: speakersListId,
        },
        include: {
          agendaItem: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!speakersList) {
        throw new Response("Speakers list not found", { status: 404 });
      }

      const transaction = [
        db.speakerOnList.delete({
          where: {
            id: currentSpeaker.id,
          },
        }),
        db.speakersList.update({
          where: {
            id: speakersListId,
          },
          data: {
            startTimestamp: null,
            timeLeft: speakersList.speakingTime,
          },
        }),
      ];

      if (speakersList.type === "SPEAKERS_LIST") {
        const correspondingCommentList = await db.speakersList.findFirst({
          where: {
            agendaItemId: speakersList.agendaItem.id,
            type: "COMMENT_LIST",
          },
        });

        if (!correspondingCommentList) {
          throw new Response("Corresponding comment list not found", {
            status: 404,
          });
        }
        return await db.$transaction([
          db.speakerOnList.deleteMany({
            where: {
              speakersListId: correspondingCommentList.id,
            },
          }),
          ...transaction,
        ]);
      }

      return await db.$transaction(transaction);
    },
    {
      hasConferenceRole: "any",
      detail: {
        description:
          "Remove the current speaker from a speakersList, making the next speaker the current speaker. Also resetting the timer and commentList",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
