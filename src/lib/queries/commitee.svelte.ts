import { page } from "$app/state";
import { client } from "$lib/api/rumbleClient/client";

export const committeeQuery = () =>
  client.liveQuery.committee({
    __args: {
      id: page.params.conferenceId!,
    },
    id: true,
    abbreviation: true,
    name: true,
    stateOfDebate: true,
    status: true,
    statusHeadline: true,
    statusUntil: true,
    totalPresent: true,
    simpleMajority: true,
    twoThirdsMajority: true,
    paperSupportThreshold: true,
    whiteboardContent: true,
    lastResolutionAdoptionDate: true,
    conference: {
      id: true,
      uniqueConferenceMembers: {
        id: true,
        representation: {
          id: true,
          type: true,
          name: true,
          regionalGroup: true,
          alpha2Code: true,
          alpha3Code: true,
          faIcon: true,
        },
      }
    },
    members: {
      id: true,
      present: true,
      representation: {
        id: true,
        type: true,
        name: true,
        regionalGroup: true,
        alpha2Code: true,
        alpha3Code: true,
        faIcon: true,
      },
    },
    activeAgendaItem: {
      id: true,
      title: true,
      speakersList: {
        id: true,
        type: true,
        isClosed: true,
        speakingTime: true,
        startTimestamp: true,
        timeLeft: true,
        speakers: {
          id: true,
          position: true,
          overwriteName: true,
          committeeMember: {
            id: true,
            representation: {
              id: true,
              type: true,
              name: true,
              regionalGroup: true,
              alpha2Code: true,
              alpha3Code: true,
              faIcon: true,
            },
            present: true,
          },
          conferenceMember: {
            id: true,
            representation: {
              id: true,
              type: true,
              name: true,
              regionalGroup: true,
              alpha2Code: true,
              alpha3Code: true,
              faIcon: true,
            },
          },
          agendaItems: {
            id: true,
            title: true,
          },
          members: {
            id: true,
            present: true,
            representation: {
              id: true,
              type: true,
              name: true,
              regionalGroup: true,
              alpha2Code: true,
              alpha3Code: true,
              faIcon: true,
            },
          },
          conference: {
            hasModeratedCaucus: true,
            uniqueConferenceMembers: {
              id: true,
              representation: {
                id: true,
                type: true,
                name: true,
                alpha2Code: true,
                alpha3Code: true,
                faIcon: true,
              },
            },
          },
        },
      },
    },
  });
