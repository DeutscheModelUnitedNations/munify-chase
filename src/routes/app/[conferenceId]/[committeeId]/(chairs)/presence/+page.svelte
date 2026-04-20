<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import Majorities from '$lib/components/Majorities.svelte';
	import UndrawError from '$lib/components/UndrawError.svelte';
	import emptyStreet from '$assets/undraw/empty_street.svg';
	import PresenceActions from './PresenceActions.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';
	import {
		getTranslatedCountryNameFromAlpha3Code,
		sortTranslatedCountries
	} from '$lib/utils/nationTranslationHelper.svelte';
	import ChairRollCall from '$lib/components/rollCall/ChairRollCall.svelte';
	import StatusWidget from '../StatusWidget.svelte';
	import {
		isDelegationMember,
		isNSAMember,
		isUNMember
	} from '$lib/helpers/distinguishConferenceMembers';
	import { translateRegionalGroupEnum } from '$lib/utils/enumTranslationHelper';

	const committee = await client.liveQuery.committee({
		__args: { id: page.params.committeeId! },
		id: true,
		totalPresent: true,
		simpleMajority: true,
		twoThirdsMajority: true,
		paperSupportThreshold: true,
		status: true,
		statusHeadline: true,
		statusUntil: true,
		stateOfDebate: true,
		activeAgendaItem: { id: true, title: true },
		members: {
			id: true,
			present: true,
			representation: {
				id: true,
				name: true,
				alpha2Code: true,
				alpha3Code: true,
				regionalGroup: true,
				type: true,
				faIcon: true
			}
		},
		conference: {
			id: true,
			uniqueConferenceMembers: {
				id: true,
				representation: {
					id: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					type: true,
					faIcon: true
				}
			}
		}
	});

	let countries = $derived(
		committee?.members
			.filter(isDelegationMember)
			.sort((a: any, b: any) => sortTranslatedCountries(a.representation!, b.representation!)) ?? []
	);

	let nsas = $derived(
		committee?.conference?.uniqueConferenceMembers
			?.filter(isNSAMember)
			.sort((a: any, b: any) => a.representation!.name!.localeCompare(b.representation!.name!)) ??
			[]
	);

	let un = $derived(
		committee?.conference?.uniqueConferenceMembers
			?.filter(isUNMember)
			?.sort((a: any, b: any) => a.representation!.name!.localeCompare(b.representation!.name!)) ??
			[]
	);

	let rollCallActive = $state(false);

	const presenceTabs = [
		{
			id: false,
			name: m.absent(),
			faIcon: 'fa-xmark'
		},
		{
			id: true,
			name: m.present(),
			faIcon: 'fa-check'
		}
	];

	const setPresence = (tab: boolean, id: string) => {
		toast.promise(
			client.mutate.setPresenceForCommitteeMembers({
				__args: { ids: [id], present: tab },
				id: true,
				present: true
			}),
			promiseToastStrings(m.presence(), 'update')
		);
	};
</script>

{#if committee}
	<div class="flex h-full w-full items-center justify-center">
		<div class="flex h-full w-full max-w-screen-xl flex-col gap-6 p-6 lg:flex-row">
			<div class="top-22 flex h-full flex-col gap-4 lg:sticky lg:w-lg">
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
					<PresenceActions memberIds={committee.members.map((x: any) => x.id)} />
				</BasicCard>
			</div>
			<div class="flex h-full w-full flex-3 flex-col gap-4">
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
									data-tip={translateRegionalGroupEnum(group)}
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

<ChairRollCall
	bind:active={rollCallActive}
	members={countries}
	committeeId={page.params.committeeId!}
/>
