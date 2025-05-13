<script lang="ts">
	import {
		graphql,
		type CommitteeTeamQuery$result,
		type SpeakersListCategoryEnum$options
	} from '$houdini';
	import Popover from '$lib/components/Popover.svelte';
	import { Popover as BitsPopover } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';
	import hotkeys from 'hotkeys-js';
	import { onMount } from 'svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';
	import { alertDialog } from '$lib/components/Alert/alert';

	interface Props {
		speakersList?:
			| NonNullable<
					CommitteeTeamQuery$result['findFirstCommittee']['activeAgendaItem']
			  >['speakersList'][number]
			| null;
		type: SpeakersListCategoryEnum$options;
	}

	let { speakersList, type }: Props = $props();

	const closeListTabs = [
		{
			id: false,
			faIcon: 'lock-open'
		},
		{
			id: true,
			faIcon: 'lock'
		}
	];

	const OpenOrCloseListMutation = graphql(`
		mutation OpenOrCloseList($speakersListId: ID!, $isClosed: Boolean!) {
			updateSpeakersList(id: $speakersListId, isClosed: $isClosed) {
				id
				isClosed
			}
		}
	`);

	const openOrCloseList = async (isClosed: boolean) => {
		if (!speakersList?.id) return;
		await toast.promise(
			OpenOrCloseListMutation.mutate({
				speakersListId: speakersList.id,
				isClosed
			}),
			promiseToastStrings(
				speakersList.type === 'COMMENT_LIST' ? m.commentList() : m.speakersList(),
				'update'
			)
		);
	};

	const ClearListMutation = graphql(`
		mutation ClearList($speakersListId: ID!) {
			clearSpeakersList(id: $speakersListId) {
				id
				speakers {
					id
				}
			}
		}
	`);

	const clearList = async () => {
		if (!speakersList?.id) return;
		if (
			await alertDialog({
				title: m.clearList(),
				description: m.clearListDescription(),
				confirmText: m.yes(),
				cancelText: m.abort(),
				confirmColor: 'error'
			})
		) {
			await toast.promise(
				ClearListMutation.mutate({
					speakersListId: speakersList.id
				}),
				promiseToastStrings(
					speakersList.type === 'COMMENT_LIST' ? m.commentList() : m.speakersList(),
					'delete'
				)
			);
		}
	};
</script>

<Popover>
	{#snippet Trigger()}
		<button class="btn btn-lg" aria-label="More options">
			<i class="fas fa-caret-down"></i>
		</button>
	{/snippet}
	{#snippet Content()}
		<div class="flex flex-col gap-2">
			<Tabs
				tabs={closeListTabs}
				activeTab={!!speakersList?.isClosed}
				onTabChange={(newStatus) => openOrCloseList(newStatus)}
			/>
			<button class="btn">
				<i class="fas fa-pencil"></i>
				{m.changeSpeakersName()}
			</button>
			<button class="btn">
				<i class="fas fa-timer"></i>
				{m.changeSpeakersTime()}
			</button>
			<button class="btn btn-error" onclick={clearList}>
				<i class="fas fa-trash"></i>
				{m.clearList()}
			</button>
		</div>
	{/snippet}
</Popover>
