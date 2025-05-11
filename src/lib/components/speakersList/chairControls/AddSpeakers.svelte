<script lang="ts">
	import { representation } from '$api/db/schema';
	import { graphql, type CommitteeTeamQuery$result } from '$houdini';
	import Combobox from '$lib/components/Combobox.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { m } from '$lib/paraglide/messages';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { promiseToastStrings } from '$lib/utils/toast';
	import Fuse, { type IFuseOptions } from 'fuse.js';
	import toast from 'svelte-french-toast';

	interface Props {
		speakersList?:
			| NonNullable<
					CommitteeTeamQuery$result['findFirstCommittee']['activeAgendaItem']
			  >['speakersList'][number]
			| null;
		members: CommitteeTeamQuery$result['findFirstCommittee']['members'];
	}

	type Member = NonNullable<typeof members>[number];

	let { speakersList, members }: Props = $props();

	let value = $state('');

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
		if (value.length !== 0) {
			fuse.setCollection(members.map((x) => ({ ...x, label: getName(x) })) ?? []);
			const search = fuse.search(value);
			return search.map((result) => result.item);
		} else {
			return members.sort((a, b) => getName(a).localeCompare(getName(b)));
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
		const committeeMember = members.find((x) => getName(x) === value);

		if (!committeeMember) {
			toast.error('Member not found');
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
</script>

<Combobox
	bind:value
	options={members ?? []}
	filter={(member, value) => filter(member, value)}
	placeholder="Search for a country"
	getStringValue={(member) => getName(member)}
>
	{#snippet ListItem(option)}
		<Flag
			size="xs"
			alpha2Code={option.representation?.alpha2Code}
			nsa={!option.representation?.alpha2Code}
			icon={option.representation?.faIcon}
		/>
		<span class="ml-2">
			{getName(option)}
		</span>
	{/snippet}

	{#snippet AdditionalButtons()}
		<button class="btn btn-lg join-item" aria-label="add-speaker" onclick={addSpeakerToList}>
			<i class="fas fa-plus"></i>
		</button>
	{/snippet}
</Combobox>
