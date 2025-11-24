<script lang="ts">
import { authenticatedUserPromise } from "$lib/api/auth.svelte";
import {
  type ConferenceusertypeEnum,
  client,
} from "$lib/api/rumbleClient/client";
import Footer from "$lib/components/Footer.svelte";
import { m } from "$lib/paraglide/messages";

const authenticatedUser = await authenticatedUserPromise();
const conferenceData = await client.query.conferenceUsers({
  __args: {
    where: {
      user: {
        id: authenticatedUser?.sub,
      },
    },
  },
  id: true,
  conferenceUserType: true,
  conference: {
    id: true,
    title: true,
  },
});

const getType = (type: ConferenceusertypeEnum) => {
  switch (type) {
    case "ADMIN":
      return m.admin();
    case "TEAM":
      return m.teamMember();
    case "SPECTATOR":
      return m.spectator();
    case "DELEGATE":
      return m.delegate();
    case "NON_STATE_ACTOR":
      return m.nonStateActor();
  }
};

const getUrl = (type: ConferenceusertypeEnum, id: string) => {
  if (["ADMIN", "TEAM"].includes(type)) {
    return `/app/${id}/mission-control`;
  } else {
    return `/app/${id}`;
  }
};
</script>

<svelte:head>
  <title>{m.launcher()} - MUNify CHASE</title>
</svelte:head>

<div class="navbar bg-base-100 relative shadow-sm">
  <div class="flex-none">
    <a class="btn btn-ghost" href="/logout">
      <i class="fa-duotone fa-arrow-left mr-2"></i>
      {m.logout()}
    </a>
  </div>
  <div class="flex-1"></div>
  <div class="flex-none">
    <a class="btn btn-ghost" href="./app/import">
      {m.createConference()}
      <i class="fa-duotone fa-plus mr-2"></i>
    </a>
  </div>
</div>

<div class="bg-base-200 h-full w-full">
  <div class="flex h-full flex-col items-center gap-10 p-10">
    <div class="flex flex-col items-center">
      <i class="fa-duotone fa-podium mb-4 text-7xl"></i>
      <h3 class="text-center text-2xl">MUNify</h3>
      <h3 class="text-center text-5xl font-bold">CHASE</h3>
      <p class="mt-4 text-center text-lg">
        {m.launcherWelcome({ name: authenticatedUser!.given_name! })}
      </p>
    </div>
    <div class="card bg-base-100 w-full max-w-2xl shadow-sm">
      <div class="card-body">
        <h2 class="text-center text-4xl font-bold">Launcher</h2>
        <p class="text-center text-lg">
          {m.launcherDescription()}
        </p>
        <div class="mt-6 flex flex-col items-center gap-2">
          {#if $conferenceData?.length === 0}
            <div class="alert alert-warning shadow-sm">
              <i class="fas fa-exclamation-triangle"></i>
              {m.launcherNoConferences()}
            </div>
          {:else}
            {#each $conferenceData as c}
              {@const conf = c.conference}
              <a
                href={getUrl(c.conferenceUserType, c.conference.id)}
                class="btn btn-lg shadow-xs w-full max-w-xs"
              >
                <i class="fa-duotone fa-rocket-launch mr-2"></i>
                <div>
                  {conf.title}
                  <span class="ml-2 text-xs font-normal"
                    >{getType(c.conferenceUserType)}</span
                  >
                </div>
              </a>
            {/each}
          {/if}
        </div>
      </div>
    </div>
  </div>

  <Footer />
</div>
