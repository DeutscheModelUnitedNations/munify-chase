<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { PageData } from '../../settings/$houdini';
	import IconInfoBox from '$lib/components/IconInfoBox.svelte';
	import { getCommitteeStatusIcon, getCommitteeStatusText } from '$lib/utils/committeeStatus';
	import UndrawError from '$lib/components/UndrawError.svelte';
	import emptyStreet from '$assets/undraw/empty_street.svg';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import Majorities from '$lib/components/Majorities.svelte';
	import WhiteboardViewer from '$lib/components/whiteboard/WhiteboardViewer.svelte';
	import WhiteboardEditorModal from '$lib/components/whiteboard/WhiteboardEditorModal.svelte';
	import StatusChanger from './StatusChanger.svelte';

	let { data }: { data: PageData } = $props();

	let query = $derived(data?.CommitteeTeamQuery);
	let committee = $derived($query.data?.findFirstCommittee);

	let editWhiteboardModalOpen = $state(false);
</script>

{#if committee}
	<div class="flex h-full w-full flex-col gap-6 p-6 lg:flex-row">
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
			<div class="card bg-base-100 w-full">
				<StatusChanger
					committeeId={committee.id}
					oldUntil={committee.statusUntil}
					oldCustomName={committee.statusHeadline}
				/>
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
