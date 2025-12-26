<script lang="ts">
  import { cubicIn, cubicOut } from "svelte/easing";
  import { fly } from "svelte/transition";
  import Flag from "$lib/components/Flag.svelte";
  import { m } from "$lib/paraglide/messages";
  import type { RegionalgroupEnum } from "$lib/api/rumbleClient/client";
  import type { committeePresentationQuery } from "$lib/queries/committeePresentation.svelte";

  interface Props {
    open: boolean;
    committeeMembers: Awaited<
      ReturnType<typeof committeePresentationQuery>
    >["members"];
  }

  const { open, committeeMembers }: Props = $props();

  let activeGroup: RegionalgroupEnum = $state("AFRICA");

  const nextGroup = (group: RegionalgroupEnum) => {
    switch (group) {
      case "AFRICA":
        return "ASIA_PACIFIC";
      case "ASIA_PACIFIC":
        return "EASTERN_EUROPE";
      case "EASTERN_EUROPE":
        return "LATIN_AMERICA_CARIBBEAN";
      case "LATIN_AMERICA_CARIBBEAN":
        return "WESTERN_EUROPE_OTHERS";
      default:
        return "AFRICA";
    }
  };

  const getGroupMembers = (group: RegionalgroupEnum) =>
    committeeMembers.filter(
      (member) => member.representation?.regionalGroup === group,
    );

  $effect(() => {
    if (activeGroup) {
      setTimeout(
        () => {
          activeGroup = nextGroup(activeGroup);
        },
        Math.max(getGroupMembers(activeGroup).length * 500, 5000),
      );
      console.log(Math.max(getGroupMembers(activeGroup).length * 500, 5000));
    }
  });
</script>

{#snippet Modal(group: RegionalgroupEnum)}
  <div
    class="modal-box bg-base-200 max-h-9/12 max-w-9/12 w-full"
    in:fly={{ x: 100, duration: 1000, delay: 700, easing: cubicOut }}
    out:fly={{ x: -100, duration: 1000, easing: cubicIn }}
  >
    <h2 class="mb-8 w-full text-center text-4xl font-bold">
      {m.regionalGroups({ group })}
    </h2>
    <div class="flex h-full w-full flex-wrap items-center justify-center gap-4">
      {#each getGroupMembers(group) as member}
        <div class="w-22 flex flex-col items-center justify-start gap-1">
          <Flag representation={member.representation} size="full" />
          <div class="text-center font-mono font-bold">
            {member.representation?.alpha2Code?.toUpperCase()}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/snippet}

{#if open}
  <div class="modal modal-open">
    {#if activeGroup === "AFRICA"}
      {@render Modal("AFRICA")}
    {:else if activeGroup === "ASIA_PACIFIC"}
      {@render Modal("ASIA_PACIFIC")}
    {:else if activeGroup === "EASTERN_EUROPE"}
      {@render Modal("EASTERN_EUROPE")}
    {:else if activeGroup === "LATIN_AMERICA_CARIBBEAN"}
      {@render Modal("LATIN_AMERICA_CARIBBEAN")}
    {:else if activeGroup === "WESTERN_EUROPE_OTHERS"}
      {@render Modal("WESTERN_EUROPE_OTHERS")}
    {/if}
  </div>
{/if}
