<script lang="ts">
  import type { SpeakerslistcategoryEnum } from '$lib/api/rumbleClient/client';
  import type { QueryResponseType } from '$lib/helpers/utilityTypes';
  import type { committeeTeamQuery } from '$lib/queries/committeeTeamQuery.svelte';
  import AddSpeakers from './AddSpeakers.svelte';
  import MoreOptions from './MoreOptions.svelte';
  import NextSpeech from './NextSpeech.svelte';
  import SpeechControls from './SpeechControls.svelte';

  type List =
    | NonNullable<
        QueryResponseType<typeof committeeTeamQuery>['activeAgendaItem']
      >['speakersList'][number]
    | null;

  interface Props {
    type: SpeakerslistcategoryEnum;
    committeeMembers: QueryResponseType<typeof committeeTeamQuery>['members'];
    conferenceMembers: NonNullable<
      NonNullable<
        QueryResponseType<typeof committeeTeamQuery>['conference']
      >['uniqueConferenceMembers']
    >;
    speakersList?: List;
    childList?: List;
    otherList?: List;
  }

  const { committeeMembers, conferenceMembers, type, speakersList, childList, otherList }: Props =
    $props();
</script>

<div class="flex flex-col gap-4">
  <SpeechControls {type} {speakersList} otherList={childList ?? otherList} />

  <div class="flex gap-2">
    <NextSpeech {speakersList} {childList} {type} />
    <MoreOptions {speakersList} />
  </div>

  <AddSpeakers {committeeMembers} {conferenceMembers} {speakersList} />
</div>
