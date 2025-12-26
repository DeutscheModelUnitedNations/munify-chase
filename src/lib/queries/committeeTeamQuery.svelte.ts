import { client } from '$lib/api/rumbleClient/client';
import { page } from '$app/state';

export const committeeTeamQuery = () =>
  client.liveQuery.committee({
    __args: {
      id: page.params.conferenceId!
    },
    id: true,
    abbreviation: true,
    name: true,
    status: true,
    stateOfDebate: true,
    statusHeadline: true,
    statusUntil: true,
    totalPresent: true,
    simpleMajority: true,
    twoThirdsMajority: true,
    paperSupportThreshold: true,
    whiteboardContent: true,
    lastResolutionAdoptionDate: true,
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
            present: true,
            representation: {
              id: true,
              type: true,
              name: true,
              regionalGroup: true,
              alpha2Code: true,
              alpha3Code: true,
              faIcon: true
            }
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
              faIcon: true
            }
          }
        }
      }
    },
    agendaItems: {
      id: true,
      title: true
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
        faIcon: true
      }
    },
    conference: {
      uniqueConferenceMembers: {
        id: true,
        representation: {
          id: true,
          type: true,
          name: true,
          alpha2Code: true,
          alpha3Code: true,
          faIcon: true
        }
      }
    }
  });
