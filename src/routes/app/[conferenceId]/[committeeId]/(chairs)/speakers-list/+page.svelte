<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';
	import question from '$assets/undraw/question.svg';

	import UndrawError from '$lib/components/UndrawError.svelte';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import ChairControls from '$lib/components/speakersList/chairControls/ChairControls.svelte';
	import CurrentSpeaker from '$lib/components/speakersList/CurrentSpeaker.svelte';
	import SpeakersQueuePresentation from '$lib/components/speakersList/ChairSpeakersQueue.svelte';
	import StatusWidget from '../StatusWidget.svelte';
	import Majorities from '$lib/components/Majorities.svelte';

	const committee = await client.liveQuery.committee({
		__args: { id: page.params.committeeId! },
		id: true,
		totalPresent: true,
		simpleMajority: true,
		twoThirdsMajority: true,
		paperSupportThreshold: true,
		status: true,
		statusHeadline: true,
		statusUntil: true,
		stateOfDebate: true,
		activeAgendaItem: {
			id: true,
			title: true,
			speakersList: {
				id: true,
				type: true,
				isClosed: true,
				speakingTime: true,
				startTimestamp: true,
				timeLeft: true,
				speakers: {
					id: true,
					position: true,
					overwriteName: true,
					committeeMember: {
						id: true,
						representation: {
							id: true,
							name: true,
							alpha2Code: true,
							alpha3Code: true,
							faIcon: true,
							type: true
						}
					},
					conferenceMember: {
						id: true,
						representation: {
							id: true,
							name: true,
							alpha2Code: true,
							alpha3Code: true,
							faIcon: true,
							type: true
						}
					}
				}
			}
		},
		members: {
			id: true,
			representation: {
				id: true,
				name: true,
				alpha2Code: true,
				alpha3Code: true,
				faIcon: true,
				type: true
			}
		},
		conference: {
			id: true,
			uniqueConferenceMembers: {
				id: true,
				representation: {
					id: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					faIcon: true,
					type: true
				}
			}
		}
	});

	let speakersList = $derived(
		committee?.activeAgendaItem?.speakersList.find((item) => item.type === 'SPEAKERS_LIST')
	);
	let commentList = $derived(
		committee?.activeAgendaItem?.speakersList.find((item) => item.type === 'COMMENT_LIST')
	);
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
