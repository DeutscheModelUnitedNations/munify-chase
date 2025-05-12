<script lang="ts">
	import DevPlaceholder from '$lib/components/DevPlaceholder.svelte';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import question from '$assets/undraw/question.svg';

	import type { PageData } from './$houdini';
	import { SpeakersListSubscription } from '../speakersListSubscription';
	import UndrawError from '$lib/components/UndrawError.svelte';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import ChairControls from '$lib/components/speakersList/chairControls/ChairControls.svelte';
	import CurrentSpeaker from '$lib/components/speakersList/CurrentSpeaker.svelte';
	import dayjs from 'dayjs';
	import SpeakersQueuePresentation from '$lib/components/speakersList/SpeakersQueue.svelte';

	let { data }: { data: PageData } = $props();

	let committeeQuery = $derived(data?.CommitteeTeamQuery);
	let committee = $derived(
		$SpeakersListSubscription.data?.findFirstCommittee ?? $committeeQuery.data?.findFirstCommittee
	);

	let speakersList = $derived(
		committee?.activeAgendaItem?.speakersList.find((item) => item.type === 'SPEAKERS_LIST')
	);
	let commentList = $derived(
		committee?.activeAgendaItem?.speakersList.find((item) => item.type === 'COMMENT_LIST')
	);

	onMount(() => {
		SpeakersListSubscription.listen({
			committeeId: data.committeeId
		});
	});
</script>

{#if !committee?.activeAgendaItem}
	<UndrawError
		undrawImage={question}
		title={m.noAgendaItemSelected()}
		description={m.noAgendaItemSelectedDescription()}
		buttonText={m.gotoSettings()}
		buttonLink="./setup"
	/>
{:else}
	<div class="flex h-full w-full items-center justify-center">
		<div class="flex h-full w-full max-w-screen-xl flex-col gap-6 p-6 lg:flex-row">
			<BasicCard title={m.speakersList()}>
				<div class="flex flex-col gap-8">
					<CurrentSpeaker {speakersList} />
					<ChairControls
						committeeId={data.committeeId}
						{speakersList}
						members={committee.members}
						type="SPEAKERS_LIST"
						childListId={commentList?.id}
					/>
					<SpeakersQueuePresentation rawSpeakers={speakersList?.speakers} />
				</div>
			</BasicCard>
			<BasicCard title={m.commentList()}>
				<div class="flex flex-col gap-8">
					<CurrentSpeaker speakersList={commentList} />
					<ChairControls
						committeeId={data.committeeId}
						members={committee.members}
						speakersList={commentList}
						type="COMMENT_LIST"
					/>
					<SpeakersQueuePresentation rawSpeakers={commentList?.speakers} />
				</div>
			</BasicCard>
		</div>
	</div>
{/if}
