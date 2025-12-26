import { page } from '$app/state';
import { client } from '$lib/api/rumbleClient/client';

export const committeeOverviewQuery = () =>
  client.liveQuery.conference({
    __args: {
      id: page.params.conferenceId!
    },
    id: true,
    committees: {
      id: true,
      name: true,
      abbreviation: true,
      lastResolutionAdoptionDate: true,
      activeAgendaItem: {
        id: true,
        title: true
      },
      status: true,
      statusHeadline: true,
      statusUntil: true
    }
  });
