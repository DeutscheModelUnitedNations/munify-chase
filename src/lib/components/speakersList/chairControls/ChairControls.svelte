<script lang="ts">
  import type { SpeakerslistcategoryEnum } from '$lib/api/rumbleClient/client';
  import type { committeeTeamQuery } from '$lib/queries/committeeTeamQuery.svelte';
  import AddSpeakers from './AddSpeakers.svelte';
  import MoreOptions from './MoreOptions.svelte';
  import NextSpeech from './NextSpeech.svelte';
  import SpeechControls from './SpeechControls.svelte';

  type List =
    | NonNullable<
        Awaited<ReturnType<typeof committeeTeamQuery>>['activeAgendaItem']
      >['speakersList'][number]
    | null;

  interface Props {
    committeeId: string;
    type: SpeakerslistcategoryEnum;
    committeeMembers: Awaited<ReturnType<typeof committeeTeamQuery>>['members'];
    conferenceMembers: NonNullable<
      NonNullable<
        Awaited<ReturnType<typeof committeeTeamQuery>>['conference']
      >['uniqueConferenceMembers']
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
    otherList
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
