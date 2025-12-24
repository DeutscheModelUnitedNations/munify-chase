import { client } from "$lib/api/rumbleClient/client";
import { page } from "$app/state";

export const missionControlQuery = () =>
  client.liveQuery.conference({
    __args: {
      id: page.params.conferenceId!,
    },
    id: true,
    title: true,
    committees: {
      id: true,
      name: true,
      abbreviation: true,
      activeAgendaItem: {
        id: true,
        title: true,
      },
      status: true,
      statusHeadline: true,
      statusUntil: true,
      stateOfDebate: true,
      lastResolutionAdoptionDate: true,
    },
  });
