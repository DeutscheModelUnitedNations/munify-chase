import { Elysia } from "elysia";
import { db } from "../../../prisma/db";
import { committeeRoleGuard } from "../../auth/guards/committeeMember";
import { conferenceRoleGuard } from "../../auth/guards/conferenceRoles";
import { openApiTag } from "../../util/openApiTags";
import { $Enums } from "../../../prisma/generated/client";

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
        description:
          "Add a speaker to the speakers list by chairs via committeeMemberId",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/addSpeaker/user/:userId",
    async ({ params: { speakersListId, userId }, set }) => {
      const speakersList = await db.speakersList.findUnique({
        where: {
          id: speakersListId,
        },
        include: {
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
          speakers: {
            select: {
              committeeMember: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      const committeeMember = await db.committeeMember.findFirst({
        where: {
          userId,
        },
      });

      if (!committeeMember) {
        set.status = "Not Found";
        throw new Error("User not found");
      }

      if (!speakersList) {
        set.status = "Not Found";
        throw new Error("Speakers list not found");
      }

      if (
        !speakersList.agendaItem.committee
          .allowDelegationsToAddThemselvesToSpeakersList
      ) {
        set.status = "Forbidden";
        throw new Error(
          "Speakers list does not allow speakers to add themselves",
        );
      }

      if (speakersList.isClosed) {
        set.status = "Forbidden";
        throw new Error("Speakers list is closed");
      }

      if (committeeMember.presence !== $Enums.Presence.PRESENT) {
        set.status = "Forbidden";
        throw new Error("CommitteeMember is not present in this committee");
      }

      if (
        speakersList.speakers.some(
          (speaker) => speaker.committeeMember.id === committeeMember.id,
        )
      ) {
        set.status = "Conflict";
        throw new Error("Speaker is already on the list");
      }

      return await createSpeakerOnList(
        speakersListId,
        committeeMember.id,
      ).catch((e) => {
        if (e.code === "P2002") {
          set.status = "Conflict";
          throw new Error("Speaker is already on the list");
        }
        set.status = "Internal Server Error";
        throw new Error("Error adding speaker");
      });
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
    async ({ params: { speakersListId, countryCode }, set }) => {
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
        set.status = "Not Found";
        throw new Error("Committee member not found");
      }

      return await createSpeakerOnList(speakersListId, committeeMember.id);
    },
    {
      hasConferenceRole: "any",
      detail: {
        description:
          "Add a speaker to the speakers list for chairs via countryCode",
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
    "/removeSpeaker/user/:userId",
    async ({ params: { speakersListId, userId }, set }) => {
      const committeeMember = await db.committeeMember.findFirst({
        where: {
          userId,
        },
      });

      if (!committeeMember) {
        set.status = "Not Found";
        throw new Error("Committee member not found");
      }

      return await db.speakerOnList.deleteMany({
        where: {
          speakersListId,
          committeeMemberId: committeeMember.id,
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
    async ({ params: { speakersListId, speakerId }, set }) => {
      const speaker = await db.speakerOnList.findUnique({
        where: {
          id: speakerId,
        },
      });

      if (!speaker) {
        set.status = "Not Found";
        throw new Error("Speaker not found");
      }

      const previousSpeaker = await db.speakerOnList.findFirst({
        where: {
          speakersListId,
          position: speaker.position - 1,
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
            position: -1,
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
        db.speakerOnList.update({
          where: {
            id: speakerId,
          },
          data: {
            position: previousSpeaker.position,
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
    async ({ params: { speakersListId, speakerId }, set }) => {
      const speaker = await db.speakerOnList.findUnique({
        where: {
          id: speakerId,
        },
      });

      if (!speaker) {
        set.status = "Not Found";
        throw new Error("Speaker not found");
      }

      const nextSpeaker = await db.speakerOnList.findFirst({
        where: {
          speakersListId,
          position: speaker.position + 1,
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
            position: -1,
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
        db.speakerOnList.update({
          where: {
            id: speakerId,
          },
          data: {
            position: nextSpeaker.position,
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
    "/moveSpeaker/:speakerId/toTheTop",
    async ({ params: { speakersListId, speakerId }, set }) => {
      const speaker = await db.speakerOnList.findUnique({
        where: {
          id: speakerId,
        },
      });

      if (!speaker) {
        set.status = "Not Found";
        throw new Error("Speaker not found");
      }

      const speakerOriginalPosition = speaker.position;

      // Make sure the speaker is not already the first
      const minPosition = await db.speakerOnList.aggregate({
        _min: {
          position: true,
        },
        where: {
          speakersListId,
        },
      });

      if (minPosition._min.position === speaker.position) {
        set.status = "Locked";
        throw new Error("Speaker is already at the top of the list");
      }

      const allSpeakers = await db.speakerOnList.findMany({
        where: {
          speakersListId,
          position: {
            gte: minPosition._min.position ?? 1,
            lt: speakerOriginalPosition,
          },
        },
        orderBy: {
          position: "desc",
        },
      });

      return await db.$transaction(async (tx) => {
        await tx.speakerOnList.update({
          where: {
            id: speakerId,
          },
          data: {
            position: -1,
          },
        });

        for (const s of allSpeakers) {
          await tx.speakerOnList.update({
            where: {
              id: s.id,
            },
            data: {
              position: s.position + 1,
            },
          });
        }
        await tx.speakerOnList.update({
          where: {
            id: speakerId,
          },
          data: {
            position: minPosition._min.position ?? 1,
          },
        });
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Move a speaker to the top of the list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/nextSpeaker",
    async ({ params: { speakersListId }, set }) => {
      const currentSpeaker = await db.speakerOnList.findFirst({
        where: {
          speakersListId,
        },
        orderBy: {
          position: "asc",
        },
      });

      if (!currentSpeaker) {
        set.status = "Not Found";
        throw new Error("No next speaker found");
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
        set.status = "Not Found";
        throw new Error("Speakers list not found");
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
          set.status = "Not Found";
          throw new Error("Corresponding comment list not found");
        }
        return await db.$transaction([
          db.speakerOnList.deleteMany({
            where: {
              speakersListId: correspondingCommentList.id,
            },
          }),
          db.speakersList.update({
            where: {
              id: correspondingCommentList.id,
            },
            data: {
              startTimestamp: null,
              timeLeft: correspondingCommentList.speakingTime,
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
