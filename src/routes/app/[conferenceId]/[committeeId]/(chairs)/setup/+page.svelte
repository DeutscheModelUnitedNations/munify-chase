<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { PageData } from './$houdini';
	import IconInfoBox from '$lib/components/IconInfoBox.svelte';
	import { getCommitteeStatusIcon, getCommitteeStatusText } from '$lib/utils/committeeStatus';
	import UndrawError from '$lib/components/UndrawError.svelte';
	import emptyStreet from '$assets/undraw/empty_street.svg';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import Majorities from '$lib/components/Majorities.svelte';
	import WhiteboardViewer from '$lib/components/whiteboard/WhiteboardViewer.svelte';
	import WhiteboardEditorModal from '$lib/components/whiteboard/WhiteboardEditorModal.svelte';
	import StatusChanger from '../../../../../../lib/components/committee/StatusChanger.svelte';
	import { onMount } from 'svelte';
	import StateOfDebate from '$lib/components/committee/StateOfDebateChanger.svelte';
	import AgendaItemChanger from '$lib/components/committee/AgendaItemChanger.svelte';
	import PresentationSettings from './PresentationSettings.svelte';
	import { CommitteeSubscription } from '../committeeSubscription';
	import { ScrollArea } from 'bits-ui';
	import StatusWidget from '../StatusWidget.svelte';
	import { graphql } from '$houdini';
	import dayjs from 'dayjs';

	let { data }: { data: PageData } = $props();

	let query = $derived(data?.CommitteeTeamQuery);
	let committee = $derived(
		$CommitteeSubscription.data?.findFirstCommittee ?? $query.data?.findFirstCommittee
	);

	onMount(() => {
		CommitteeSubscription.listen({ id: data.committeeId });
	});

	let editWhiteboardModalOpen = $state(false);

	const AnnounceAdoptionMutation = graphql(`
		mutation AnnounceAdoption($committeeId: ID!, $lastResolutionAdoptionDate: DateTime!) {
			updateCommittee(id: $committeeId, lastResolutionAdoptionDate: $lastResolutionAdoptionDate) {
				id
				lastResolutionAdoptionDate
			}
		}
	`);
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
				<BasicCard title={m.setStatus()} kbd="⌥ S">
					<StatusChanger
						committeeId={committee.id}
						oldStatus={committee.status}
						oldUntil={committee.statusUntil}
						oldCustomName={committee.statusHeadline}
						hasModeratedCaucus={committee.conference?.hasModeratedCaucus}
					/>
				</BasicCard>
				<BasicCard title={m.stateOfDebate()} kbd="⌥ D">
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
					<a href="." class="btn btn-primary btn-lg mb-4 flex items-center gap-3" target="_blank">
						<i class="fas fa-projector"></i>
						{m.openPresentation()}
						<span class="kbd text-base-content">⌥ P</span>
					</a>
					<PresentationSettings committeeId={data.committeeId} />
				</BasicCard>
				<BasicCard title={m.announceAdoption()}>
					<button
						class="btn btn-primary btn-lg mb-4 flex items-center gap-3"
						onclick={() => {
							AnnounceAdoptionMutation.mutate({
								committeeId: committee.id,
								lastResolutionAdoptionDate: dayjs().toDate()
							});
						}}
					>
						<i class="fas fa-party-horn"></i>
						{m.announceAdoption()}
					</button>
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
