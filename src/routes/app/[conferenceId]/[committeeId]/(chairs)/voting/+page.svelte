<script lang="ts">
  import emptyStreet from "$lib/assets/undraw/empty_street.svg";
  import BasicCard from "$lib/components/BasicCard.svelte";
  import Majorities from "$lib/components/Majorities.svelte";
  import UndrawError from "$lib/components/UndrawError.svelte";
  import VotingSetup from "$lib/components/voting/VotingSetup.svelte";
  import { m } from "$lib/paraglide/messages";
  import StatusWidget from "../StatusWidget.svelte";
  import { committeeTeamQuery } from "$lib/queries/committeeTeamQuery.svelte";

  const committee = await committeeTeamQuery();
</script>

{#if committee}
  <div class="flex h-full w-full items-center justify-center">
    <div
      class="flex h-full w-full max-w-screen-xl flex-col gap-6 p-6 lg:flex-row"
    >
      <div class="top-22 lg:w-lg flex h-full flex-col gap-4 lg:sticky">
        <BasicCard>
          <StatusWidget committee={committee} />
        </BasicCard>
        <BasicCard>
          <Majorities
            totalPresent={$committee.totalPresent}
            simpleMajority={$committee.simpleMajority}
            twoThirdsMajority={$committee.twoThirdsMajority}
            paperSupportThreshold={$committee.paperSupportThreshold}
          />
        </BasicCard>
      </div>
      <div class="flex-3 flex h-full w-full flex-col gap-4">
        <BasicCard title={m.voting()}>
          <VotingSetup committee={committee} />
        </BasicCard>
      </div>
    </div>
  </div>
{:else}
  <UndrawError
    undrawImage={emptyStreet}
    title={m.committeeDoesNotExist()}
    buttonText={m.back()}
    buttonLink="/app"
  />
{/if}
