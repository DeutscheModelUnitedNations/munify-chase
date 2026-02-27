<script lang="ts">
  import CommitteeGrid from '$lib/components/CommitteeGrid.svelte';
  import CurrentTime from '$lib/components/CurrentTime.svelte';
  import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
  import * as m from '$lib/paraglide/messages.js';
  import DownloadPresenceData from './DownloadPresenceData.svelte';
  import { missionControlQuery } from '$lib/queries/missionControlQuery.svelte';

  const conference = await missionControlQuery();

  const menubarItems = [
    {
      faIcon: 'fa-home',
      title: m.home(),
      href: '..'
    }
  ];
</script>

<svelte:head>
  <title>{m.missionControl()} - MUNify CHASE</title>
</svelte:head>

<div class="navbar bg-base-100 shadow-sm">
  <h1 class=" ml-4 flex-1 text-3xl font-bold">{m.missionControl()}</h1>
  <div class="flex-none">
    <CurrentTime />
  </div>
  <div class="flex-none">
    <NavbarBurgerMenu items={menubarItems}>
      {#snippet CustomListItems()}
        <DownloadPresenceData conferenceTitle={conference?.title} conferenceId={conference?.id} />
      {/snippet}
    </NavbarBurgerMenu>
  </div>
</div>

{#if conference}
  <CommitteeGrid {conference} environment="TEAM" />
{/if}
