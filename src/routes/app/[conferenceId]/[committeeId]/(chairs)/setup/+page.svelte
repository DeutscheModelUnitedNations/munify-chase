<script lang="ts">
	import ChairNavbar from '../ChairNavbar.svelte';

	import { page } from '$app/state';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import DevPlaceholder from '$lib/components/DevPlaceholder.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
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

	let { data }: { data: PageData } = $props();

	let query = $derived(data?.CommitteeTeamQuery);
	let committee = $derived($query.data?.findFirstCommittee);

	let editWhiteboardModalOpen = $state(true);
</script>

{#if committee}
	<div class="flex h-full w-full gap-6 p-6">
		<div class="sticky top-22 hidden h-full w-full flex-3 flex-col gap-4 md:flex lg:flex-2">
			<BasicCard>
				<IconInfoBox text={committee.activeAgendaItem?.title ?? '—'} faIcon="podium" />
				<IconInfoBox text={committee.stateOfDebate ?? '—'} faIcon="diagram-next" />
				<IconInfoBox
					text={getCommitteeStatusText(committee.status)}
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
				<WhiteboardViewer data={committee.whiteboardContent} />
				<button
					class="btn btn-primary invisible absolute top-2 right-2 left-2 rounded opacity-0 transition duration-300 group-hover:visible group-hover:opacity-100"
					onclick={() => {
						editWhiteboardModalOpen = true;
					}}
				>
					<i class="fas fa-pencil"></i>
					{m.edit()}
				</button>
			</BasicCard>
		</div>
		<div class="flex h-full w-full flex-3 flex-col gap-4">
			<div class="card bg-base-100 w-full">
				<div class="card-body"></div>
				<DevPlaceholder
					data={{
						...data,
						...committee
					}}
				/>
				<DevPlaceholder
					data={{
						...data,
						...committee
					}}
				/>
				<DevPlaceholder
					data={{
						...data,
						...committee
					}}
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

<WhiteboardEditorModal
	bind:open={editWhiteboardModalOpen}
	committeeId={committee?.id}
	whiteboardContent={committee?.whiteboardContent}
	close={() => {
		editWhiteboardModalOpen = false;
	}}
/>
