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
	import dayjs from 'dayjs';
	import StatusWidget from '../StatusWidget.svelte';
	import { isDelegationMember, isUNMember } from '$lib/helpers/distinguishConferenceMembers';
	import { translateRegionalGroupEnum } from '$lib/utils/enumTranslationHelper';
	import NsaAttendanceCard from './NsaAttendanceCard.svelte';

	const committee = await client.liveQuery.committee({
		__args: { id: page.params.committeeId! },
		id: true,
		totalPresent: true,
		simpleMajority: true,
		twoThirdsMajority: true,
		status: true,
		statusHeadline: true,
		statusUntil: true,
		stateOfDebate: true,
		activeAgendaItem: { id: true, title: true },
		// Active-roll-call status now lives on the committee as a single FK; pull
		// it alongside the rest so a single liveQuery powers the Start/Resume
		// button and the modal's `externalActiveSessionId` prop.
		activeRollCallSession: {
			id: true,
			currentMemberIndex: true
		},
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
			.sort((a, b) => sortTranslatedCountries(a.representation, b.representation)) ?? []
	);

	let un = $derived(
		committee?.conference?.uniqueConferenceMembers
			?.filter(isUNMember)
			?.sort((a, b) => (a.representation.name ?? '').localeCompare(b.representation.name ?? '')) ??
			[]
	);

	let activeSession = $derived(committee?.activeRollCallSession ?? null);

	const pastSessions = await client.liveQuery.rollCallSessions({
		__args: {
			where: { committeeId: page.params.committeeId!, completedAt: { isNull: false } },
			orderBy: { createdAt: 'desc' }
		},
		id: true,
		currentMemberIndex: true,
		createdAt: true,
		completedAt: true,
		startedBy: {
			name: true,
			userEmail: true
		},
		presenceEvents: {
			id: true,
			present: true
		}
	});

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
					/>
				</BasicCard>
				<BasicCard>
					<div class="flex flex-col gap-2">
						{#if activeSession}
							<div class="alert alert-info p-2 text-sm">
								<i class="fas fa-circle-info"></i>
								<span>
									{m.rollCallActiveAt({
										index: activeSession.currentMemberIndex + 1,
										total: countries.length
									})}
								</span>
							</div>
							<button class="btn btn-warning btn-xl" onclick={() => (rollCallActive = true)}>
								<i class="fas fa-rotate-right mr-2"></i>
								{m.resumeRollCall()}
							</button>
						{:else}
							<button class="btn btn-primary btn-xl" onclick={() => (rollCallActive = true)}>
								<i class="fas fa-user-magnifying-glass mr-2"></i>
								{m.rollCall()}
							</button>
						{/if}

						{#if pastSessions && pastSessions.length > 0}
							<details class="group">
								<summary
									class="text-base-content/60 hover:text-base-content flex cursor-pointer select-none list-none items-center gap-1 text-sm transition-colors"
								>
									<i class="fas fa-chevron-right text-xs transition-transform group-open:rotate-90"
									></i>
									{m.pastRollCalls({ count: pastSessions.length })}
								</summary>
								<div class="mt-2 flex flex-col gap-1">
									{#each pastSessions as session (session.id)}
										{@const presentCount = session.presenceEvents.filter((e) => e.present).length}
										{@const totalCount = session.presenceEvents.length}
										<div class="bg-base-200 rounded-lg p-2 text-sm">
											<div class="flex items-center justify-between gap-2">
												<span class="font-medium">
													{dayjs(session.createdAt).format('DD.MM. HH:mm')}
												</span>
												<span class="text-base-content/60 text-xs">
													<span class="text-success font-medium">{presentCount}</span>
													<span class="text-base-content/40">/{totalCount}</span>
												</span>
											</div>
											<div
												class="text-base-content/50 mt-0.5 flex items-center justify-between gap-2 text-xs"
											>
												<span>
													<i class="fas fa-flag-checkered mr-1"></i>
													{dayjs(session.completedAt).format('HH:mm')}
												</span>
												{#if session.startedBy}
													<span class="truncate">
														<i class="fas fa-user mr-1"></i>
														{session.startedBy.name ?? session.startedBy.userEmail}
													</span>
												{/if}
											</div>
										</div>
									{/each}
								</div>
							</details>
						{/if}
					</div>
				</BasicCard>
				<BasicCard>
					<PresenceActions memberIds={committee.members.map((x) => x.id)} />
				</BasicCard>
			</div>
			<div class="flex h-full w-full flex-3 flex-col gap-4">
				<NsaAttendanceCard conferenceId={committee.conference!.id} committeeId={committee.id} />
				<BasicCard title={m.delegations()}>
					{#each countries as member (member.id)}
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
				<BasicCard title={m.unActors()}>
					{#each un as member (member.id)}
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
	externalActiveSessionId={activeSession?.id ?? null}
/>
