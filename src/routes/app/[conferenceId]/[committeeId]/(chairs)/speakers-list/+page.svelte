<script lang="ts">
import { onMount } from "svelte";
import question from "$lib/assets/undraw/question.svg";
import BasicCard from "$lib/components/BasicCard.svelte";
import DevPlaceholder from "$lib/components/DevPlaceholder.svelte";
import Majorities from "$lib/components/Majorities.svelte";
import SpeakersQueuePresentation from "$lib/components/speakersList/ChairSpeakersQueue.svelte";
import CurrentSpeaker from "$lib/components/speakersList/CurrentSpeaker.svelte";
import ChairControls from "$lib/components/speakersList/chairControls/ChairControls.svelte";
import UndrawError from "$lib/components/UndrawError.svelte";
import { m } from "$lib/paraglide/messages";
import { CommitteeSubscription } from "../committeeSubscription";
import StatusWidget from "../StatusWidget.svelte";
import type { PageData } from "./$houdini";

const { data }: { data: PageData } = $props();

const committeeQuery = $derived(data?.CommitteeTeamQuery);
const committee = $derived(
  $CommitteeSubscription.data?.findFirstCommittee ??
    $committeeQuery.data?.findFirstCommittee,
);

const speakersList = $derived(
  committee?.activeAgendaItem?.speakersList.find(
    (item) => item.type === "SPEAKERS_LIST",
  ),
);
const commentList = $derived(
  committee?.activeAgendaItem?.speakersList.find(
    (item) => item.type === "COMMENT_LIST",
  ),
);

onMount(() => {
  CommitteeSubscription.listen({
    id: data.committeeId,
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
	<div
		class="flex w-full flex-col items-center justify-center gap-6 p-6 lg:flex-row lg:items-start"
	>
		<div class="top-22 hidden h-full flex-col gap-4 2xl:sticky 2xl:flex">
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
		</div>
		<BasicCard title={m.speakersList()} className="min-h-[calc(100vh-8rem)] max-w-xl w-full">
			<div class="flex flex-col gap-8">
				<CurrentSpeaker {speakersList} />
				<ChairControls
					committeeId={data.committeeId}
					{speakersList}
					committeeMembers={committee.members}
					conferenceMembers={committee.conference?.uniqueConferenceMembers ?? []}
					type="SPEAKERS_LIST"
					childList={commentList}
				/>
				<SpeakersQueuePresentation
					rawSpeakers={speakersList?.speakers}
					closed={speakersList?.isClosed}
				/>
			</div>
		</BasicCard>
		<BasicCard title={m.commentList()} className="min-h-[calc(100vh-8rem)] max-w-xl  w-full">
			<div class="flex flex-col gap-8">
				<CurrentSpeaker speakersList={commentList} />
				<ChairControls
					committeeId={data.committeeId}
					committeeMembers={committee.members}
					conferenceMembers={committee.conference?.uniqueConferenceMembers ?? []}
					speakersList={commentList}
					otherList={speakersList}
					type="COMMENT_LIST"
				/>
				<SpeakersQueuePresentation
					rawSpeakers={commentList?.speakers}
					closed={commentList?.isClosed}
				/>
			</div>
		</BasicCard>
	</div>
{/if}
