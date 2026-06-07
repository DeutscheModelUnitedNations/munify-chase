<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';
	import Kbd from '$lib/components/Kbd.svelte';
	import UndrawError from '$lib/components/UndrawError.svelte';
	import emptyStreet from '$assets/undraw/empty_street.svg';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import Majorities from '$lib/components/Majorities.svelte';
	import WhiteboardViewer from '$lib/components/whiteboard/WhiteboardViewer.svelte';
	import WhiteboardEditorModal from '$lib/components/whiteboard/WhiteboardEditorModal.svelte';
	import StatusChanger from '../../../../../../lib/components/committee/StatusChanger.svelte';
	import StateOfDebate from '$lib/components/committee/StateOfDebateChanger.svelte';
	import AgendaItemChanger from '$lib/components/committee/AgendaItemChanger.svelte';
	import PresentationSettings from './PresentationSettings.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import StatusWidget from '../StatusWidget.svelte';

	const committee = await client.liveQuery.committee({
		__args: { id: page.params.committeeId! },
		id: true,
		status: true,
		statusHeadline: true,
		statusUntil: true,
		stateOfDebate: true,
		whiteboardContent: true,
		allowDelegationsToAddThemselvesToSpeakersList: true,
		totalPresent: true,
		simpleMajority: true,
		twoThirdsMajority: true,
		activeAgendaItem: { id: true, title: true },
		agendaItems: { id: true, title: true },
		conference: { hasModeratedCaucus: true }
	});

	let editWhiteboardModalOpen = $state(false);

	const selfAddTabs = [
		{ id: true, label: m.on(), faIcon: 'fa-check' },
		{ id: false, label: m.off(), faIcon: 'fa-xmark' }
	];
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
				<BasicCard className="relative group">
					<button
						class="btn mb-4"
						onclick={() => {
							editWhiteboardModalOpen = true;
						}}
					>
						<i class="fas fa-pencil"></i>
						{m.edit()}
					</button>
					<WhiteboardViewer data={committee.whiteboardContent} />
				</BasicCard>
			</div>
			<div class="flex h-full w-full flex-3 flex-col gap-4">
				<BasicCard title={m.setStatus()} kbd="alt+S">
					<StatusChanger
						committeeId={committee.id}
						oldStatus={committee.status}
						oldUntil={committee.statusUntil}
						oldCustomName={committee.statusHeadline}
						hasModeratedCaucus={committee.conference?.hasModeratedCaucus}
					/>
				</BasicCard>
				<BasicCard title={m.stateOfDebate()} kbd="alt+D">
					<StateOfDebate committeeId={committee.id} oldStateOfDebate={committee.stateOfDebate} />
				</BasicCard>
				<BasicCard title={m.agendaItem()}>
					<AgendaItemChanger
						committeeId={committee.id}
						activeAgendaItem={committee.activeAgendaItem}
						agendaItems={committee.agendaItems}
					/>
				</BasicCard>
				<BasicCard title={m.presentationMode()}>
					<a
						href={resolve('/app/[conferenceId]/[committeeId]/(presentation)', {
							conferenceId: page.params.conferenceId!,
							committeeId: page.params.committeeId!
						})}
						class="btn btn-primary btn-lg mb-4 flex items-center gap-3"
						target="_blank"
					>
						<i class="fas fa-projector"></i>
						{m.openPresentation()}
						<Kbd hotkey="alt+P" class="text-base-content" />
					</a>
					<PresentationSettings committeeId={page.params.committeeId!} />
				</BasicCard>
				<BasicCard title={m.allowSelfAddToSpeakersList()}>
					<p class="mb-4 text-sm opacity-70">{m.allowSelfAddToSpeakersListDescription()}</p>
					<Tabs
						activeTab={committee.allowDelegationsToAddThemselvesToSpeakersList}
						tabs={selfAddTabs}
						onTabChange={(tab) => {
							toast.promise(
								client.mutate.updateCommittee({
									__args: { id: committee.id, allowDelegationsToAddThemselvesToSpeakersList: tab },
									id: true
								}),
								promiseToastStrings(m.allowSelfAddToSpeakersList(), 'update')
							);
						}}
					/>
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

{#if editWhiteboardModalOpen}
	<WhiteboardEditorModal
		bind:open={editWhiteboardModalOpen}
		committeeId={committee?.id}
		whiteboardContent={committee?.whiteboardContent}
		close={() => {
			editWhiteboardModalOpen = false;
		}}
	/>
{/if}
