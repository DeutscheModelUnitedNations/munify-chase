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
	import { graphql } from '$houdini';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	let committeeSub = graphql(`
		subscription CommitteeSubscription($id: ID!) {
			findFirstCommittee(where: { id: $id }) {
				id
				abbreviation
				name
				stateOfDebate
				status
				statusHeadline
				statusUntil
				activeAgendaItem {
					id
					title
				}
				agendaItems {
					id
					title
				}
				whiteboardContent
				customSimpleMajority
				customTwoThirdsMajority
				customPaperSupportThreshold
			}
		}
	`);

	let query = $derived(data?.CommitteeTeamQuery);
	let committee = $derived(
		$committeeSub.data?.findFirstCommittee ?? $query.data?.findFirstCommittee
	);

	onMount(() => {
		committeeSub.listen({ id: data.committeeId });
	});

	let editWhiteboardModalOpen = $state(false);
</script>

{#if committee}
	<div class="flex h-full w-full items-center justify-center">
		<div class="flex h-full w-full max-w-screen-xl flex-col gap-6 p-6 lg:flex-row">
			<div class="top-22 flex h-full flex-col gap-4 lg:sticky lg:w-lg">
				<BasicCard>
					<IconInfoBox text={committee.activeAgendaItem?.title ?? '—'} faIcon="podium" />
					<IconInfoBox text={committee.stateOfDebate ?? '—'} faIcon="diagram-next" />
					<IconInfoBox
						text={committee.statusHeadline.length > 0
							? committee.statusHeadline
							: getCommitteeStatusText(committee.status)}
						faIcon={getCommitteeStatusIcon(committee.status)}
						committeeStatus={committee.status}
						marqueeOnOverflow={false}
						until={new Date(committee.statusUntil)}
					/>
				</BasicCard>
				<Majorities
					totalPresent={20}
					customSimpleMajority={committee.customSimpleMajority}
					customTwoThirdsMajority={committee.customTwoThirdsMajority}
					customPaperSupportThreshold={committee.customPaperSupportThreshold}
				/>
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
				<BasicCard title={m.setStatus()} kbd="⌥ + S">
					<StatusChanger
						committeeId={committee.id}
						oldUntil={committee.statusUntil}
						oldCustomName={committee.statusHeadline}
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
