<script lang="ts">
import { assertDirective } from "graphql";
import { onMount } from "svelte";
import toast from "svelte-french-toast";
import { regionalGroup, representation } from "$api/db/schema";
import emptyStreet from "$lib/assets/undraw/empty_street.svg";
import BasicCard from "$lib/components/BasicCard.svelte";
import Flag from "$lib/components/Flag.svelte";
import Majorities from "$lib/components/Majorities.svelte";
import ChairRollCall from "$lib/components/rollCall/ChairRollCall.svelte";
import Tabs from "$lib/components/Tabs.svelte";
import UndrawError from "$lib/components/UndrawError.svelte";
import {
  isDelegationMember,
  isNSAMember,
  isUNMember,
} from "$lib/helpers/distinguishConferenceMembers";
import { m } from "$lib/paraglide/messages";
import {
  getTranslatedCountryNameFromAlpha3Code,
  sortTranslatedCountries,
} from "$lib/utils/nationTranslationHelper.svelte";
import { promiseToastStrings } from "$lib/utils/toast";
import { CommitteeSubscription } from "../committeeSubscription";
import StatusWidget from "../StatusWidget.svelte";
import type { PageData } from "./$houdini";
import PresenceActions from "./PresenceActions.svelte";
import { SetPresenceMutation } from "./presenceMutations";

const { data }: { data: PageData } = $props();

const query = $derived(data?.CommitteeTeamQuery);
const committee = $derived(
  $CommitteeSubscription.data?.findFirstCommittee ??
    $query.data?.findFirstCommittee,
);

const countries = $derived(
  committee?.members
    .filter(isDelegationMember)
    .sort((a, b) =>
      sortTranslatedCountries(a.representation!, b.representation!),
    ) ?? [],
);

const nsas = $derived(
  committee?.conference?.uniqueConferenceMembers
    ?.filter(isNSAMember)
    .sort((a, b) =>
      a.representation!.name!.localeCompare(b.representation!.name!),
    ) ?? [],
);

const un = $derived(
  committee?.conference?.uniqueConferenceMembers
    ?.filter(isUNMember)
    ?.sort((a, b) =>
      a.representation!.name!.localeCompare(b.representation!.name!),
    ) ?? [],
);

const rollCallActive = $state(false);

onMount(() => {
  CommitteeSubscription.listen({ id: data.committeeId });
});

const presenceTabs = [
  {
    id: false,
    name: m.absent(),
    faIcon: "fa-xmark",
  },
  {
    id: true,
    name: m.present(),
    faIcon: "fa-check",
  },
];

const setPresence = (tab: boolean, id: string) => {
  toast.promise(
    SetPresenceMutation.mutate({
      memberIds: [id],
      present: tab,
    }),
    promiseToastStrings(m.presence(), "update"),
  );
};
</script>

{#if committee}
	<div class="flex h-full w-full items-center justify-center">
		<div class="flex h-full w-full max-w-screen-xl flex-col gap-6 p-6 lg:flex-row">
			<div class="top-22 lg:w-lg flex h-full flex-col gap-4 lg:sticky">
				<BasicCard>
					<StatusWidget {committee} />
				</BasicCard>
				<BasicCard>
					<Majorities
						totalPresent={committee.totalPresent}
						simpleMajority={committee.simpleMajority}
						twoThirdsMajority={committee.twoThirdsMajority}
						paperSupportThreshold={committee.paperSupportThreshold}
					/>
				</BasicCard>
				<BasicCard>
					<button class="btn btn-primary btn-xl" onclick={() => (rollCallActive = true)}>
						<i class="fas fa-user-magnifying-glass mr-2"></i>
						{m.rollCall()}
					</button>
				</BasicCard>
				<BasicCard>
					<PresenceActions memberIds={committee.members.map((x) => x.id)} />
				</BasicCard>
			</div>
			<div class="flex-3 flex h-full w-full flex-col gap-4">
				<BasicCard title={m.delegations()}>
					{#each countries as member}
						{@const rep = member.representation}
						<div
							class="hover:bg-base-200 card flex w-full flex-row items-center gap-4 p-2 transition-all duration-300"
						>
							<Flag representation={rep} size="sm" />
							<h3 class="flex-1 text-lg">
								{#if rep && (rep.name || rep.alpha3Code)}
									{rep.name ?? getTranslatedCountryNameFromAlpha3Code(rep.alpha3Code!)}
								{:else}
									{m.unknown()}
								{/if}
							</h3>
							{#if member.representation?.regionalGroup}
								{@const group = member.representation.regionalGroup}
								<div
									class="tooltip tooltip-left text-xl"
									data-tip={m.regionalGroups({ group: member.representation?.regionalGroup ?? '' })}
								>
									{#if group === 'AFRICA'}
										<i class="fas fa-earth-africa text-blue-500"></i>
									{:else if group === 'ASIA_PACIFIC'}
										<i class="fas fa-earth-asia text-green-500"></i>
									{:else if group === 'EASTERN_EUROPE'}
										<i class="fas fa-earth-europe text-red-500"></i>
									{:else if group === 'LATIN_AMERICA_CARIBBEAN'}
										<i class="fas fa-earth-americas text-pink-500"></i>
									{:else if group === 'WESTERN_EUROPE_OTHERS'}
										<i class="fas fa-earth-europe text-yellow-500"></i>
									{/if}
								</div>
							{/if}
							<Tabs
								activeTab={member.present}
								tabs={presenceTabs}
								onTabChange={(tab) => {
									setPresence(tab, member.id);
								}}
							/>
						</div>
					{/each}
				</BasicCard>
				<BasicCard title={m.nonStateActors()}>
					{#each nsas as member}
						{@const rep = member.representation}
						<div
							class="hover:bg-base-200 card flex w-full flex-row items-center gap-4 p-2 transition-all duration-300"
						>
							<Flag representation={rep} size="sm" />
							<h3 class="flex-1 text-lg">
								{#if rep && rep.name}
									{rep.name}
								{:else}
									{m.unknown()}
								{/if}
							</h3>
						</div>
					{/each}
				</BasicCard>
				<BasicCard title={m.unActors()}>
					{#each un as member}
						{@const rep = member.representation}
						<div
							class="hover:bg-base-200 card flex w-full flex-row items-center gap-4 p-2 transition-all duration-300"
						>
							<Flag representation={member.representation} size="sm" />
							<h3 class="flex-1 text-lg">
								{#if rep && rep.name}
									{rep.name}
								{:else}
									{m.unknown()}
								{/if}
							</h3>
						</div>
					{/each}
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

<ChairRollCall bind:active={rollCallActive} members={countries} committeeId={data.committeeId} />
