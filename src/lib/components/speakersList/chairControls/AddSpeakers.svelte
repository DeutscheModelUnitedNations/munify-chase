<script lang="ts">
	import { representation } from '$api/db/schema';
	import { browser } from '$app/environment';
	import { graphql, type CommitteeTeamQuery$result } from '$houdini';
	import Combobox from '$lib/components/Combobox.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { m } from '$lib/paraglide/messages';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { promiseToastStrings } from '$lib/utils/toast';
	import { Tooltip } from 'bits-ui';
	import Fuse, { type IFuseOptions } from 'fuse.js';
	import hotkeys from 'hotkeys-js';
	import toast from 'svelte-french-toast';

	interface Props {
		speakersList?:
			| NonNullable<
					CommitteeTeamQuery$result['findFirstCommittee']['activeAgendaItem']
			  >['speakersList'][number]
			| null;
		members: CommitteeTeamQuery$result['findFirstCommittee']['members'];
	}

	let { speakersList, members }: Props = $props();

	type Member = NonNullable<typeof members>[number];

	let value = $state('');
	let focused = $state(false);

	const getName = (member: Member) =>
		member.representation?.name
			? member.representation.name
			: getTranslatedCountryNameFromAlpha3Code(member.representation?.alpha3Code);

	const fuseOptions: IFuseOptions<any> = {
		keys: ['label'],
		// threshold: 0.3, // Adjust the threshold for fuzzy matching
		ignoreFieldNorm: true,
		ignoreDiacritics: true,
		shouldSort: true
	};

	let fuse = $state(new Fuse(members ?? [], fuseOptions));

	const filter = (members: Member[], value: string) => {
		const excludeMembersAlreadyOnList = (member: Member) => {
			if (!speakersList?.id) return true;
			return !speakersList.speakers.some((speaker) => speaker.committeeMember?.id === member.id);
		};

		if (value.length !== 0) {
			fuse.setCollection(
				members.filter(excludeMembersAlreadyOnList).map((x) => ({ ...x, label: getName(x) })) ?? []
			);
			const search = fuse.search(value);
			return search.map((result) => result.item);
		} else {
			return members
				.filter(excludeMembersAlreadyOnList)
				.sort((a, b) => getName(a).localeCompare(getName(b)));
		}
	};

	const AddSpeakerToListMutation = graphql(`
		mutation AddSpeakerToList($committeeMemberId: ID!, $speakersListId: ID!) {
			addSpeakerOnList(committeeMemberId: $committeeMemberId, speakersListId: $speakersListId) {
				id
				speakersList {
					id
				}
			}
		}
	`);

	const addSpeakerToList = async () => {
		if (!speakersList?.id) return;
		if (!value) return;
		const committeeMember = members.find((x) => getName(x) === value);

		if (!committeeMember) {
			return;
		}

		await toast.promise(
			AddSpeakerToListMutation.mutate({
				committeeMemberId: committeeMember.id,
				speakersListId: speakersList.id
			}),
			promiseToastStrings(getName(committeeMember), 'add')
		);

		value = '';
	};

	$effect(() => {
		if (!focused) {
			hotkeys('alt+a, alt+shift+a', (event, handler) => {
				event.preventDefault();
				console.log('hotkey', handler.key);
				switch (handler.key) {
					case 'alt+a':
						if (speakersList?.type === 'SPEAKERS_LIST') {
							focused = true;
						}
						break;
					case 'alt+shift+a':
						if (speakersList?.type === 'COMMENT_LIST') {
							focused = true;
						}
						break;
				}
			});
		}
	});
</script>

<Combobox
	bind:value
	bind:focused
	options={members ?? []}
	filter={(member, value) => filter(member, value)}
	placeholder="Search for a country"
	getStringValue={(member) => getName(member)}
	kbd={speakersList?.type === 'COMMENT_LIST' ? '⌥ ⇧ A' : '⌥ A'}
	submit={() => addSpeakerToList()}
>
	{#snippet ListItem(option)}
		<Flag
			size="xs"
			alpha2Code={option.representation?.alpha2Code}
			nsa={!option.representation?.alpha2Code}
			icon={option.representation?.faIcon}
		/>
		<span class="ml-2 flex-1">
			{getName(option)}
		</span>
		{#if !option.present}
			<i class="fa-duotone fa-user-xmark mr-4"></i>
		{/if}
	{/snippet}

	{#snippet AdditionalButtons()}
		<button
			class="btn btn-lg btn-square join-item"
			aria-label="add-speaker"
			onclick={addSpeakerToList}
		>
			<i class="fas fa-plus"></i>
		</button>
	{/snippet}
</Combobox>
