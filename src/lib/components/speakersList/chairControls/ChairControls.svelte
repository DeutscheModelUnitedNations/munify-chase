<script lang="ts">
import type {
  CommitteeTeamQuery$result,
  SpeakersListCategoryEnum$options,
} from "$houdini";
import AddSpeakers from "./AddSpeakers.svelte";
import MoreOptions from "./MoreOptions.svelte";
import NextSpeech from "./NextSpeech.svelte";
import SpeechControls from "./SpeechControls.svelte";

type List =
  | NonNullable<
      CommitteeTeamQuery$result["findFirstCommittee"]["activeAgendaItem"]
    >["speakersList"][number]
  | null;

interface Props {
  committeeId: string;
  type: SpeakersListCategoryEnum$options;
  committeeMembers: CommitteeTeamQuery$result["findFirstCommittee"]["members"];
  conferenceMembers: NonNullable<
    NonNullable<
      CommitteeTeamQuery$result["findFirstCommittee"]["conference"]
    >["uniqueConferenceMembers"]
  >;
  speakersList?: List;
  childList?: List;
  otherList?: List;
}

const {
  committeeId,
  committeeMembers,
  conferenceMembers,
  type,
  speakersList,
  childList,
  otherList,
}: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<SpeechControls {type} {speakersList} otherList={childList ?? otherList} />

	<div class="flex gap-2">
		<NextSpeech {speakersList} {childList} {type} />
		<MoreOptions {type} {speakersList} />
	</div>

	<AddSpeakers {committeeMembers} {conferenceMembers} {speakersList} />
</div>
